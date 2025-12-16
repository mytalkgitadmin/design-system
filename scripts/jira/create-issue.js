#!/usr/bin/env node

const { execSync } = require("child_process");
const readline = require("readline");
const fs = require("fs");
const path = require("path");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// 설정 파일 로드
function loadConfig() {
  const configPath = path.join(__dirname, "issue-config.json");
  try {
    const configData = fs.readFileSync(configPath, "utf-8");
    return JSON.parse(configData);
  } catch (error) {
    console.log("⚠️  설정 파일을 찾을 수 없습니다. 기본값을 사용합니다.");
    return { defaultParentTicket: "PRJ-00" };
  }
}

const config = loadConfig();

const questions = [
  { key: "title", prompt: "📋 이슈 제목을 입력하세요: " },
  {
    key: "parentKey",
    prompt: `🎟️  상위 작업 티켓 번호 (기본값: ${config.defaultParentTicket}, Enter로 스킵): `,
    default: config.defaultParentTicket,
  },
  { key: "branch", prompt: "🌳 브랜치명 (영어로): " },
  { key: "description", prompt: "📝 상세 내용: " },
  { key: "tasks", prompt: "✅ 체크리스트 (쉼표로 구분): " },
];

async function ask(question, defaultValue = "") {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim() || defaultValue);
    });
  });
}

function executeCommand(command, options = {}) {
  try {
    return execSync(command, { encoding: "utf-8", ...options });
  } catch (error) {
    console.error(`❌ 명령 실행 실패: ${command}`);
    throw error;
  }
}

async function main() {
  console.log("\n🚀 GitHub 이슈 생성 & Jira 연동 도구\n");

  // 1. 사용자 입력 받기
  const answers = {};

  for (const q of questions) {
    answers[q.key] = await ask(q.prompt, q.default);
  }

  console.log(`\n✅ 상위 티켓: ${answers.parentKey}`);

  rl.close();

  // 체크리스트 포맷팅
  const tasksList = answers.tasks
    .split(",")
    .map((task) => `- [ ] ${task.trim()}`)
    .join("\n");

  // 이슈 본문 생성
  const body = `### 🎟️ 상위 작업 (Ticket Number)
${answers.parentKey}

### 🌳 브랜치명 (Branch)
${answers.branch}

### 📝 상세 내용(Description)
${answers.description}

### ✅ 체크리스트(Tasks)
${tasksList}`;

  try {
    // 2. GitHub 이슈 생성
    console.log("\n📝 GitHub 이슈를 생성하는 중...");

    // body를 파일로 저장해서 사용 (특수문자 escape 문제 해결)
    const tempBodyFile = path.join(__dirname, ".temp-issue-body.md");
    fs.writeFileSync(tempBodyFile, body);
    
    const command = `gh issue create --title "${answers.title}" --body-file "${tempBodyFile}"`;
    const issueUrl = executeCommand(command).trim();
    
    // 임시 파일 삭제
    fs.unlinkSync(tempBodyFile);

    console.log("✅ 이슈가 성공적으로 생성되었습니다!");
    console.log(`🔗 ${issueUrl}`);

    // 3. GitHub Actions 안내
    console.log("\n⏳ GitHub Actions가 다음 작업을 자동으로 처리합니다:");
    console.log("   - Jira 티켓 생성");
    console.log("   - develop 브랜치 기반 새 브랜치 생성");
    console.log("   - 이슈에 Jira 링크 및 브랜치 정보 추가");

    // 4. 완료 메시지
    console.log("\n🎉 이슈 생성 완료!\n");
    console.log("📌 다음 단계:");
    console.log("   1. GitHub 이슈에서 Jira 티켓 번호 확인 (약 30초 소요)");
    console.log("   2. git fetch origin");
    console.log("   3. git checkout -b <JIRA-XXX-branch-name> origin/<JIRA-XXX-branch-name>");
    console.log("   4. npm run issue:start (작업 시작 기록)");
    console.log("   5. 코드 작업 시작!\n");

  } catch (error) {
    console.error("\n❌ 오류 발생:", error.message);
    console.log("\n💡 확인사항:");
    console.log("   - GitHub CLI 설치: brew install gh");
    console.log("   - GitHub 로그인: gh auth login");
    console.log("   - Git 저장소 상태 확인");
    process.exit(1);
  }
}

main();
