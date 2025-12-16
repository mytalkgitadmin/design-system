#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

function executeCommand(command) {
  try {
    return execSync(command, { encoding: "utf-8" }).trim();
  } catch (error) {
    throw new Error(`명령 실행 실패: ${command}`);
  }
}

function getJiraConfig() {
  const baseUrl = process.env.JIRA_BASE_URL;
  const email = process.env.JIRA_USER_EMAIL;
  const token = process.env.JIRA_API_TOKEN;

  if (!baseUrl || !email || !token) {
    throw new Error(
      "Jira 인증 정보가 없습니다.\n\n" +
        "프로젝트 루트에 .env 파일을 생성하세요:\n\n" +
        "JIRA_BASE_URL=https://your-domain.atlassian.net\n" +
        "JIRA_USER_EMAIL=your-email@company.com\n" +
        "JIRA_API_TOKEN=your-api-token\n\n" +
        "또는 .env.example 파일을 복사하여 사용하세요."
    );
  }

  return { baseUrl, email, token };
}

function getCurrentBranch() {
  try {
    return executeCommand("git branch --show-current");
  } catch (error) {
    throw new Error("현재 브랜치를 가져올 수 없습니다.");
  }
}

function extractJiraTicket(branchName) {
  // FMTW-1234-feature-name 형식에서 FMTW-1234 추출
  const match = branchName.match(/^([A-Z]+-\d+)/);
  if (!match) {
    throw new Error(
      `브랜치명에서 Jira 티켓을 찾을 수 없습니다: ${branchName}\n형식: JIRA-123-branch-name`
    );
  }
  return match[1];
}

async function callJiraAPI(endpoint, method = "GET", data = null) {
  const config = getJiraConfig();
  const { baseUrl, email, token } = config;

  const url = `${baseUrl}${endpoint}`;
  const auth = Buffer.from(`${email}:${token}`).toString("base64");

  let curlCmd = `curl -s -X ${method} "${url}" \
    -H "Authorization: Basic ${auth}" \
    -H "Content-Type: application/json"`;

  if (data) {
    const jsonData = JSON.stringify(data).replace(/"/g, '\\"');
    curlCmd += ` -d "${jsonData}"`;
  }

  try {
    const result = executeCommand(curlCmd);
    return result ? JSON.parse(result) : null;
  } catch (error) {
    throw new Error(`Jira API 호출 실패: ${error.message}`);
  }
}

function saveWorkTime(ticket, startTime) {
  const workTimeFile = path.join(__dirname, ".work-time.json");
  const data = { ticket, startTime: startTime.toISOString() };
  fs.writeFileSync(workTimeFile, JSON.stringify(data, null, 2));
}

async function main() {
  console.log("\n⏱️  작업 시작 - Jira Work Log\n");

  try {
    // 1. 현재 브랜치에서 Jira 티켓 추출
    const currentBranch = getCurrentBranch();
    console.log(`📍 현재 브랜치: ${currentBranch}`);

    const jiraTicket = extractJiraTicket(currentBranch);
    console.log(`🎟️  Jira 티켓: ${jiraTicket}`);

    // 2. 시작 시간 기록
    const startTime = new Date();
    saveWorkTime(jiraTicket, startTime);
    console.log(`⏰ 시작 시간: ${startTime.toLocaleString("ko-KR")}`);

    // 3. Jira 이슈 정보 가져오기
    console.log("\n📥 Jira 이슈 정보 조회 중...");
    const issue = await callJiraAPI(`/rest/api/2/issue/${jiraTicket}`);

    if (!issue) {
      throw new Error("이슈를 찾을 수 없습니다.");
    }

    console.log(`✅ 이슈: ${issue.fields.summary}`);
    console.log(`📊 현재 상태: ${issue.fields.status.name}`);

    // Start date 필드 확인 (디버깅용)
    console.log("\n🔍 이슈 필드 확인 중...");
    if (issue.fields.customfield_10015) {
      console.log(`   Start date: ${issue.fields.customfield_10015}`);
    }

    // 4. 업무 담당자를 본인으로 설정
    console.log("\n👤 업무 담당자 설정 중...");
    const config = getJiraConfig();

    try {
      // 현재 사용자의 accountId 가져오기
      const myself = await callJiraAPI("/rest/api/3/myself");

      // 담당자 설정
      await callJiraAPI(`/rest/api/2/issue/${jiraTicket}/assignee`, "PUT", {
        accountId: myself.accountId,
      });
      console.log(`✅ 담당자 설정 완료: ${myself.displayName}`);
    } catch (error) {
      console.log("⚠️  담당자 설정 실패:", error.message);
    }

    // 5. Start date 설정 (시작 날짜 필드)
    console.log("\n📅 Start date 설정 중...");

    try {
      // Start date를 현재 날짜로 설정 (YYYY-MM-DD 형식)
      const startDateStr = startTime.toISOString().split("T")[0];

      await callJiraAPI(`/rest/api/2/issue/${jiraTicket}`, "PUT", {
        fields: {
          customfield_10015: startDateStr, // Start date 필드
        },
      });
      console.log(`✅ Start date 설정 완료: ${startDateStr}`);
    } catch (error) {
      console.log("⚠️  Start date 설정 실패:", error.message);
    }

    // 6. Jira 상태를 "진행 중"으로 변경 (이미 진행중이 아닐 경우만)
    const currentStatus = issue.fields.status.name;

    if (currentStatus !== "진행 중" && currentStatus !== "In Progress") {
      console.log("\n🔄 상태를 '진행 중'으로 변경 중...");

      // 사용 가능한 transition 목록 가져오기
      const transitions = await callJiraAPI(
        `/rest/api/2/issue/${jiraTicket}/transitions`
      );

      console.log("\n🔍 사용 가능한 상태 전환:");
      transitions.transitions.forEach((t) => {
        console.log(`   - ${t.name} → ${t.to.name}`);
      });

      // "진행 중"으로 가는 transition 찾기 (목적지 상태가 "진행 중"인 것)
      const inProgressTransition = transitions.transitions.find(
        (t) => t.to.name === "진행 중" || t.to.name === "In Progress"
      );

      if (inProgressTransition) {
        await callJiraAPI(
          `/rest/api/2/issue/${jiraTicket}/transitions`,
          "POST",
          {
            transition: { id: inProgressTransition.id },
          }
        );
        console.log(
          `✅ 상태 변경 완료: ${currentStatus} → ${inProgressTransition.to.name}`
        );
      } else {
        console.log("⚠️  '진행 중' 상태로 전환할 수 없습니다.");
        console.log(
          "💡 위 목록에서 원하는 상태를 선택하여 수동으로 변경하세요."
        );
      }
    } else {
      console.log("\n✅ 이미 '진행 중' 상태입니다.");
    }

    // 6. Work Log 추가 (시작 시간 기록)
    console.log("\n📝 Work Log 추가 중...");

    try {
      // 1초만 기록 (시작 시간만 표시하기 위함)
      await callJiraAPI(`/rest/api/2/issue/${jiraTicket}/worklog`, "POST", {
        comment: `작업 시작 🚀\n시작 시간: ${startTime.toLocaleString(
          "ko-KR"
        )}`,
        started: startTime.toISOString().replace("Z", "+0000"),
        timeSpentSeconds: 1,
      });
      console.log("✅ Work Log 추가 완료 (시작 시간 기록됨)");
    } catch (error) {
      console.log("⚠️  Work Log 추가 실패:", error.message);
    }

    // 8. 완료 메시지
    console.log("\n🎉 작업 시작이 기록되었습니다!\n");
    console.log("📌 다음 단계:");
    console.log("   1. 작업 진행");
    console.log("   2. 작업 완료 후: npm run issue:end\n");
    console.log(`🔗 Jira: ${config.baseUrl}/browse/${jiraTicket}\n`);
  } catch (error) {
    console.error("\n❌ 오류 발생:", error.message);
    console.log("\n💡 확인사항:");
    console.log("   - 브랜치명이 JIRA-123-branch-name 형식인지");
    console.log("   - .env 파일에 Jira 인증 정보가 있는지");
    console.log("   - Jira 티켓이 존재하는지");
    process.exit(1);
  }
}

main();
