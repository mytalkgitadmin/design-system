#!/usr/bin/env node

const { execSync } = require("child_process");

function executeCommand(command) {
  try {
    return execSync(command, { encoding: "utf-8" }).trim();
  } catch (error) {
    throw new Error(`명령 실행 실패: ${command}`);
  }
}

function getCurrentBranch() {
  try {
    return executeCommand("git branch --show-current");
  } catch (error) {
    throw new Error("현재 브랜치를 가져올 수 없습니다.");
  }
}

function extractJiraTicket(branchName) {
  const match = branchName.match(/^([A-Z]+-\d+)/);
  if (!match) {
    throw new Error(
      `브랜치명에서 Jira 티켓을 찾을 수 없습니다: ${branchName}\n형식: JIRA-123-branch-name`
    );
  }
  return match[1];
}

async function getIssueNumber(jiraTicket) {
  try {
    const issues = executeCommand(
      `gh issue list --json number,title --limit 100`
    );
    const issueList = JSON.parse(issues);

    // Jira 티켓 번호가 제목에 포함된 Issue 찾기
    const matchedIssue = issueList.find((issue) =>
      issue.title.includes(jiraTicket)
    );

    if (!matchedIssue) {
      throw new Error(
        `Jira 티켓 ${jiraTicket}에 해당하는 GitHub Issue를 찾을 수 없습니다.`
      );
    }

    return matchedIssue.number;
  } catch (error) {
    throw new Error(`GitHub Issue 조회 실패: ${error.message}`);
  }
}

async function main() {
  console.log("\n⏱️  작업 종료 - GitHub Actions 트리거\n");

  try {
    // 1. GitHub CLI 확인
    try {
      executeCommand("gh --version");
    } catch (error) {
      throw new Error(
        "GitHub CLI가 설치되어 있지 않습니다.\n설치: brew install gh\n인증: gh auth login"
      );
    }

    // 2. 현재 브랜치에서 Jira 티켓 추출
    const currentBranch = getCurrentBranch();
    console.log(`📍 현재 브랜치: ${currentBranch}`);

    const jiraTicket = extractJiraTicket(currentBranch);
    console.log(`🎟️  Jira 티켓: ${jiraTicket}`);

    // 3. GitHub Issue 번호 가져오기
    console.log("\n🔍 GitHub Issue 조회 중...");
    const issueNumber = await getIssueNumber(jiraTicket);
    console.log(`✅ GitHub Issue #${issueNumber} 발견`);

    // 4. GitHub Issue에 work:end 라벨 추가
    console.log("\n🏷️  'work:end' 라벨 추가 중...");
    executeCommand(`gh issue edit ${issueNumber} --add-label "work:end"`);

    console.log("✅ 라벨이 추가되었습니다!");
    console.log("🚀 GitHub Actions가 자동으로 실행됩니다...\n");

    // 5. Repository 정보 가져오기
    const repoInfo = executeCommand(
      "gh repo view --json nameWithOwner -q .nameWithOwner"
    );

    console.log("📊 진행 상황:");
    console.log(
      `   - GitHub Issue: https://github.com/${repoInfo}/issues/${issueNumber}`
    );
    console.log(`   - Actions: https://github.com/${repoInfo}/actions`);

    console.log("\n🎉 작업 종료가 요청되었습니다!");
    console.log("💡 GitHub Actions에서 자동으로:");
    console.log("   - 작업 시간 계산");
    console.log("   - Work Log 기록");
    console.log("   - Jira 상태를 'Done'으로 변경\n");
    console.log("📌 다음 단계:");
    console.log("   1. git add & commit");
    console.log("   2. git push");
    console.log("   3. Pull Request 생성\n");
  } catch (error) {
    console.error("\n❌ 오류 발생:", error.message);
    console.log("\n💡 확인사항:");
    console.log("   - 브랜치명이 JIRA-123-branch-name 형식인지");
    console.log("   - GitHub CLI가 설치 및 인증되어 있는지 (gh auth status)");
    console.log("   - GitHub Issue가 생성되어 있는지");
    console.log("   - 'work:start' 라벨이 먼저 추가되었는지");
    process.exit(1);
  }
}

main();
