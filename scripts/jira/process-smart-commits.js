#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const https = require("https");

// 환경변수
const JIRA_BASE_URL = process.env.JIRA_BASE_URL;
const JIRA_USER_EMAIL = process.env.JIRA_USER_EMAIL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;
const GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY;

if (!JIRA_BASE_URL || !JIRA_USER_EMAIL || !JIRA_API_TOKEN) {
  console.error("❌ Jira 환경변수가 설정되지 않았습니다.");
  process.exit(1);
}

// 정규식 패턴
const JIRA_KEY_PATTERN = /\b([A-Z]+-\d+)\b/g;
const COMMAND_PATTERNS = {
  comment: /#comment\s+(.+?)(?=\s*#|\s*$)/gis,
  time: /#time\s+([\dwdhm\s]+?)(?=\s*#|\s*$)/gi,
  close: /#close\b/gi,
  resolve: /#resolve\b/gi,
  start: /#start\b/gi,
  transition: /#transition\s+['"]?([^'"#\n]+)['"]?(?=\s*#|\s*$)/gi,
};

// Jira API 요청
function jiraRequest(method, endpoint, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint, JIRA_BASE_URL);
    const auth = Buffer.from(
      `${JIRA_USER_EMAIL}:${JIRA_API_TOKEN}`
    ).toString("base64");

    const options = {
      method,
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    const req = https.request(url, options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(body ? JSON.parse(body) : {});
        } else {
          reject(
            new Error(`HTTP ${res.statusCode}: ${body}`)
          );
        }
      });
    });

    req.on("error", reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

// 시간 파싱 (1h 30m → 초 단위)
function parseTimeSpent(timeStr) {
  let totalSeconds = 0;
  const weeks = timeStr.match(/(\d+)w/i);
  const days = timeStr.match(/(\d+)d/i);
  const hours = timeStr.match(/(\d+)h/i);
  const minutes = timeStr.match(/(\d+)m/i);

  if (weeks) totalSeconds += parseInt(weeks[1]) * 5 * 8 * 3600;
  if (days) totalSeconds += parseInt(days[1]) * 8 * 3600;
  if (hours) totalSeconds += parseInt(hours[1]) * 3600;
  if (minutes) totalSeconds += parseInt(minutes[1]) * 60;

  return totalSeconds;
}

// Workflow config 로드
function loadWorkflowConfig() {
  const configPath = path.join(__dirname, "jira-workflow-config.json");
  try {
    const configData = fs.readFileSync(configPath, "utf-8");
    return JSON.parse(configData);
  } catch (error) {
    return { mappings: {} };
  }
}

// Jira 코멘트 추가
async function addComment(issueKey, comment) {
  try {
    await jiraRequest("POST", `/rest/api/2/issue/${issueKey}/comment`, {
      body: comment,
    });
    return true;
  } catch (error) {
    console.error(`    ❌ 코멘트 추가 실패: ${error.message}`);
    return false;
  }
}

// Jira 작업 시간 기록
async function addWorklog(issueKey, timeSpentSeconds, comment) {
  try {
    await jiraRequest("POST", `/rest/api/2/issue/${issueKey}/worklog`, {
      timeSpentSeconds,
      comment,
    });
    return true;
  } catch (error) {
    console.error(`    ❌ 작업 시간 기록 실패: ${error.message}`);
    return false;
  }
}

// Jira 이슈 상태 전환
async function transitionIssue(issueKey, action) {
  const config = loadWorkflowConfig();
  const transitionId = config.mappings[action];

  if (!transitionId) {
    console.error(
      `    ⚠️  '${action}' 액션의 transition ID가 설정되지 않았습니다.`
    );
    return false;
  }

  try {
    await jiraRequest("POST", `/rest/api/2/issue/${issueKey}/transitions`, {
      transition: { id: transitionId },
    });
    return true;
  } catch (error) {
    console.error(`    ❌ 상태 전환 실패: ${error.message}`);
    return false;
  }
}

// 메인 처리 함수
async function processCommits() {
  console.log("\n🎯 Jira Smart Commit 처리 시작\n");
  console.log(`Repository: ${GITHUB_REPOSITORY}`);
  console.log(`Jira: ${JIRA_BASE_URL}\n`);

  const commitsFile = "commits.txt";
  if (!fs.existsSync(commitsFile)) {
    console.log("⚠️  처리할 커밋이 없습니다.");
    return;
  }

  const commits = fs
    .readFileSync(commitsFile, "utf-8")
    .split("\n")
    .filter((line) => line.trim());

  if (commits.length === 0) {
    console.log("⚠️  처리할 커밋이 없습니다.");
    return;
  }

  console.log(`📝 총 ${commits.length}개의 커밋 처리 중...\n`);

  let processedCount = 0;

  for (const commitLine of commits) {
    if (!commitLine) continue;

    const parts = commitLine.split("|");
    const hash = parts[0];
    const subject = parts[1] || "";
    const body = parts[2] || "";
    const fullMessage = `${subject}\n${body}`;

    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📝 Commit: ${hash.substring(0, 7)}`);
    console.log(`   ${subject}`);

    // Jira 이슈 키 추출
    const jiraKeys = [...new Set(fullMessage.match(JIRA_KEY_PATTERN) || [])];

    if (jiraKeys.length === 0) {
      console.log(`   ⏭️  Jira 이슈 키 없음\n`);
      continue;
    }

    processedCount++;

    for (const issueKey of jiraKeys) {
      console.log(`\n   🎟️  ${issueKey} 처리 중...`);

      const commitUrl = `https://github.com/${GITHUB_REPOSITORY}/commit/${hash}`;
      let hasCommand = false;

      // #comment 처리
      COMMAND_PATTERNS.comment.lastIndex = 0;
      const commentMatches = [...fullMessage.matchAll(COMMAND_PATTERNS.comment)];
      for (const match of commentMatches) {
        const commentText = match[1].trim();
        const fullComment = `${commentText}\n\n💻 Commit: ${commitUrl}`;
        if (await addComment(issueKey, fullComment)) {
          console.log(`      ✅ 코멘트 추가: "${commentText.substring(0, 50)}..."`);
          hasCommand = true;
        }
      }

      // #time 처리
      COMMAND_PATTERNS.time.lastIndex = 0;
      const timeMatches = [...fullMessage.matchAll(COMMAND_PATTERNS.time)];
      for (const match of timeMatches) {
        const timeStr = match[1].trim();
        const seconds = parseTimeSpent(timeStr);
        if (seconds > 0) {
          if (await addWorklog(issueKey, seconds, `Commit: ${commitUrl}`)) {
            console.log(`      ✅ 작업 시간 기록: ${timeStr}`);
            hasCommand = true;
          }
        }
      }

      // #start 처리
      COMMAND_PATTERNS.start.lastIndex = 0;
      if (COMMAND_PATTERNS.start.test(fullMessage)) {
        if (await transitionIssue(issueKey, "start")) {
          console.log(`      ✅ 작업 시작으로 전환`);
          hasCommand = true;
        }
      }

      // #resolve 처리
      COMMAND_PATTERNS.resolve.lastIndex = 0;
      if (COMMAND_PATTERNS.resolve.test(fullMessage)) {
        if (await transitionIssue(issueKey, "end")) {
          console.log(`      ✅ 해결 상태로 전환`);
          hasCommand = true;
        }
      }

      // #close 처리
      COMMAND_PATTERNS.close.lastIndex = 0;
      if (COMMAND_PATTERNS.close.test(fullMessage)) {
        if (await transitionIssue(issueKey, "end")) {
          console.log(`      ✅ 이슈 닫기`);
          hasCommand = true;
        }
      }

      // 명령어가 없으면 기본 커밋 링크만 추가
      if (!hasCommand) {
        const defaultComment = `💻 Commit: ${commitUrl}\n\n${subject}`;
        if (await addComment(issueKey, defaultComment)) {
          console.log(`      ✅ 커밋 링크 추가`);
        }
      }
    }

    console.log();
  }

  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
  console.log(`🎉 완료! ${processedCount}개의 커밋이 처리되었습니다.\n`);
}

// 실행
processCommits().catch((error) => {
  console.error("\n❌ 오류 발생:", error.message);
  process.exit(1);
});

