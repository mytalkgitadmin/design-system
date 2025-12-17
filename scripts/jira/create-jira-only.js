#!/usr/bin/env node

const { execSync } = require("child_process");
const readline = require("readline");
const fs = require("fs");
const path = require("path");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function executeCommand(command) {
  try {
    return execSync(command, { encoding: "utf-8" }).trim();
  } catch (error) {
    throw new Error(`명령 실행 실패: ${command}`);
  }
}

async function ask(question, defaultValue = "") {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim() || defaultValue);
    });
  });
}

async function loadIssueConfig() {
  const configPath = path.join(__dirname, "issue-config.json");
  try {
    const configData = fs.readFileSync(configPath, "utf-8");
    return JSON.parse(configData);
  } catch (error) {
    return { defaultParentTicket: "" };
  }
}

async function main() {
  console.log("\n🚀 Jira 이슈 생성 도구 (CLI)\n");
  console.log("💡 GitHub Actions를 통해 Jira 티켓을 생성합니다.\n");

  try {
    // 1. GitHub CLI 확인
    try {
      executeCommand("gh --version");
    } catch (error) {
      throw new Error(
        "GitHub CLI가 설치되어 있지 않습니다.\n설치: brew install gh\n인증: gh auth login"
      );
    }

    const issueConfig = await loadIssueConfig();

    // 2. 사용자 입력 받기
    const title = await ask("📋 이슈 제목: ");
    if (!title) {
      console.error("❌ 제목은 필수입니다.");
      rl.close();
      process.exit(1);
    }

    const description = await ask("📝 상세 내용: ");
    const issueType = await ask(
      "🏷️  이슈 타입 (Task/Story/Bug) [Task]: ",
      "Task"
    );

    const parentPrompt = issueConfig.defaultParentTicket
      ? `🎟️  상위 티켓 번호 (기본값: ${issueConfig.defaultParentTicket}, Enter로 스킵): `
      : "🎟️  상위 티켓 번호 (선택사항, Enter로 스킵): ";

    const parentKey = await ask(
      parentPrompt,
      issueConfig.defaultParentTicket || ""
    );

    rl.close();

    // 3. GitHub Actions 워크플로우 트리거
    console.log("\n🚀 GitHub Actions 워크플로우 트리거 중...");

    let workflowCommand = `gh workflow run create-jira-only.yml -f title="${title}" -f issue_type="${issueType}"`;

    if (description) {
      // 큰따옴표를 이스케이프 처리
      const escapedDescription = description.replace(/"/g, '\\"');
      workflowCommand += ` -f description="${escapedDescription}"`;
    }

    if (parentKey) {
      workflowCommand += ` -f parent_key="${parentKey}"`;
    }

    executeCommand(workflowCommand);

    console.log("✅ GitHub Actions 워크플로우가 시작되었습니다!");

    // 4. Repository 정보 가져오기
    const repoInfo = executeCommand(
      "gh repo view --json nameWithOwner -q .nameWithOwner"
    );

    console.log("\n🎉 Jira 이슈 생성 요청이 완료되었습니다!");
    console.log("\n📊 진행 상황:");
    console.log(`   - Actions: https://github.com/${repoInfo}/actions`);
    console.log(`   - Workflow: create-jira-only.yml`);

    console.log("\n💡 GitHub Actions에서 자동으로:");
    console.log("   - GitHub Secrets를 사용하여 Jira에 연결");
    console.log("   - Jira 티켓 생성");
    if (parentKey) {
      console.log(`   - 상위 티켓 (${parentKey})에 연결`);
    }
    console.log("   - 티켓 상태를 'init'으로 설정");

    console.log("\n📌 다음 단계:");
    console.log("   1. GitHub Actions에서 워크플로우 완료 확인 (약 30초 소요)");
    console.log("   2. Actions Summary에서 생성된 Jira 티켓 번호 확인");
    console.log("   3. Jira에서 이슈 확인");
    console.log("   4. 필요시 작업 시작: npm run issue:start\n");
  } catch (error) {
    console.error("\n❌ 오류 발생:", error.message);
    console.log("\n💡 확인사항:");
    console.log("   - GitHub CLI가 설치 및 인증되어 있는지 (gh auth status)");
    console.log("   - GitHub Secrets가 올바르게 설정되어 있는지");
    console.log("   - create-jira-only.yml 워크플로우가 존재하는지");
    process.exit(1);
  }
}

main();
