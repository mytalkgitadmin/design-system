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
    return { parentBranch: "pre_dev" };
  }
}

const config = loadConfig();

function executeCommand(command, options = {}) {
  try {
    return execSync(command, { encoding: "utf-8", ...options });
  } catch (error) {
    console.error(`❌ 명령 실행 실패: ${command}`);
    throw error;
  }
}

async function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

function getCurrentBranch() {
  try {
    return executeCommand("git branch --show-current").trim();
  } catch (error) {
    throw new Error("현재 브랜치를 확인할 수 없습니다.");
  }
}

function getIssueInfo(issueNumber) {
  try {
    const issueData = executeCommand(
      `gh issue view ${issueNumber} --json title,body,number`
    );
    return JSON.parse(issueData);
  } catch (error) {
    console.error(`⚠️  Issue #${issueNumber} 정보를 가져올 수 없습니다.`);
    return null;
  }
}

function extractJiraTicket(issueData) {
  // 제목에서 [JIRA-123] 형식으로 추출
  const titleMatch = issueData.title.match(/\[([A-Z]+-[0-9]+)\]/);
  if (titleMatch) return titleMatch[1];

  // 본문에서 추출
  const bodyMatch = issueData.body.match(/([A-Z]+-[0-9]+)/);
  if (bodyMatch) return bodyMatch[1];

  return null;
}

async function main() {
  console.log("\n🚀 Pull Request 생성 도구\n");

  try {
    // 1. 현재 브랜치 확인
    const currentBranch = getCurrentBranch();
    console.log(`📍 현재 브랜치: ${currentBranch}`);
    console.log("");

    // 2. Target 브랜치 입력
    const targetBranch = await ask(
      `🎯 Target 브랜치 (기본값: ${config.parentBranch || "pre_dev"}): `
    );
    const finalTargetBranch =
      targetBranch || config.parentBranch || "pre_dev";

    console.log("");

    // 3. 닫을 Issue 번호들 입력
    console.log("📝 닫을 Issue 번호를 입력하세요 (쉼표로 구분):");
    console.log("   예시: 1,2,3 또는 1, 2, 3");
    const issueInput = await ask("   Issue 번호들: ");

    if (!issueInput) {
      console.log("⚠️  Issue 번호가 입력되지 않았습니다.");
      rl.close();
      process.exit(1);
    }

    const issueNumbers = issueInput
      .split(",")
      .map((n) => n.trim())
      .filter((n) => n);

    console.log("");
    console.log(`✅ ${issueNumbers.length}개의 Issue를 처리합니다.`);
    console.log("");

    // 4. Issue 정보 수집
    console.log("🔍 Issue 정보 수집 중...");
    const issues = [];
    const jiraTickets = new Set();

    for (const num of issueNumbers) {
      const issueData = getIssueInfo(num);
      if (issueData) {
        issues.push(issueData);
        const jiraTicket = extractJiraTicket(issueData);
        if (jiraTicket) {
          jiraTickets.add(jiraTicket);
        }
        console.log(`   ✓ #${num}: ${issueData.title}`);
      }
    }

    if (issues.length === 0) {
      console.log("❌ 유효한 Issue를 찾을 수 없습니다.");
      rl.close();
      process.exit(1);
    }

    console.log("");

    // 5. PR 제목 입력
    const defaultTitle =
      issues.length === 1
        ? issues[0].title
        : `Merge ${issues.length} issues into ${finalTargetBranch}`;

    const prTitle = await ask(
      `📋 PR 제목 (Enter: "${defaultTitle}"): `
    );
    const finalPrTitle = prTitle || defaultTitle;

    console.log("");

    // 6. PR 본문 입력 (선택)
    console.log("📝 PR 본문 추가 설명 (선택, Enter로 스킵):");
    const additionalDescription = await ask("   설명: ");

    rl.close();

    console.log("");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📋 PR 정보 확인");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`  제목: ${finalPrTitle}`);
    console.log(`  Source: ${currentBranch}`);
    console.log(`  Target: ${finalTargetBranch}`);
    console.log(`  닫을 Issues: ${issueNumbers.join(", ")}`);
    console.log(
      `  연관 Jira: ${jiraTickets.size > 0 ? Array.from(jiraTickets).join(", ") : "없음"}`
    );
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("");

    // 7. PR 본문 생성
    let prBody = "## 📋 작업 내용\n\n";

    if (additionalDescription) {
      prBody += `${additionalDescription}\n\n`;
    }

    // Issue 목록
    prBody += "### 🔗 관련 Issues\n\n";
    for (const issue of issues) {
      prBody += `- closes #${issue.number} - ${issue.title}\n`;
    }
    prBody += "\n";

    // Jira 티켓 목록
    if (jiraTickets.size > 0) {
      prBody += "### 🎫 관련 Jira 티켓\n\n";
      for (const ticket of jiraTickets) {
        // JIRA_BASE_URL은 환경변수나 설정에서 가져와야 하지만, 여기서는 간단히 처리
        prBody += `- [${ticket}](https://mytalk.atlassian.net/browse/${ticket})\n`;
      }
      prBody += "\n";
    }

    // Issue 상세 정보
    prBody += "### 📝 Issue 상세\n\n";
    for (const issue of issues) {
      prBody += `<details>\n`;
      prBody += `<summary>#${issue.number}: ${issue.title}</summary>\n\n`;
      prBody += `${issue.body}\n`;
      prBody += `</details>\n\n`;
    }

    prBody += "---\n";
    prBody += `이 PR은 \`npm run pr\` 명령어로 생성되었습니다.\n`;

    // 임시 파일에 본문 저장
    const tempBodyFile = path.join(__dirname, ".temp-pr-body.md");
    fs.writeFileSync(tempBodyFile, prBody);

    // 8. PR 생성
    console.log("🔀 Pull Request 생성 중...");
    try {
      const prUrl = executeCommand(
        `gh pr create --base "${finalTargetBranch}" --head "${currentBranch}" --title "${finalPrTitle}" --body-file "${tempBodyFile}"`
      ).trim();

      // 임시 파일 삭제
      fs.unlinkSync(tempBodyFile);

      console.log("✅ Pull Request가 생성되었습니다!");
      console.log(`🔗 ${prUrl}`);
      console.log("");

      // 9. Issue 닫기
      console.log("🔒 Issues 닫는 중...");
      for (const num of issueNumbers) {
        try {
          executeCommand(
            `gh issue close ${num} --comment "✅ PR이 생성되어 자동으로 닫혔습니다.\\n\\n🔀 Pull Request: ${prUrl}"`
          );
          console.log(`   ✓ Issue #${num} 닫힘`);
        } catch (error) {
          console.error(`   ✗ Issue #${num} 닫기 실패`);
        }
      }

      console.log("");
      console.log("🎉 완료!");
      console.log("");
      console.log("📌 다음 단계:");
      console.log("   1. PR 확인 및 리뷰 요청");
      console.log("   2. 코드 리뷰 진행");
      console.log("   3. 머지 후 배포");
      console.log("");
    } catch (error) {
      // 임시 파일 삭제
      if (fs.existsSync(tempBodyFile)) {
        fs.unlinkSync(tempBodyFile);
      }
      throw error;
    }
  } catch (error) {
    console.error("\n❌ 오류 발생:", error.message);
    console.log("\n💡 확인사항:");
    console.log("   - GitHub CLI 설치: brew install gh");
    console.log("   - GitHub 로그인: gh auth login");
    console.log("   - Git 저장소 상태 확인");
    console.log("   - 현재 브랜치 확인");
    process.exit(1);
  }
}

main();

