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
  const configPath = path.join(__dirname, "jira-create-config.json");
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
    console.log("⏳ 워크플로우 완료를 기다리는 중...\n");

    // 4. 최근 워크플로우 실행 ID 가져오기
    // 잠시 대기 (워크플로우가 목록에 나타날 때까지)
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const runId = executeCommand(
      "gh run list --workflow=create-jira-only.yml --limit=1 --json databaseId -q '.[0].databaseId'"
    );

    if (!runId) {
      throw new Error("워크플로우 실행 ID를 찾을 수 없습니다.");
    }

    // 5. 워크플로우 완료 대기
    console.log("🔄 워크플로우 실행 중...");
    try {
      executeCommand(`gh run watch ${runId} --exit-status`);
    } catch (error) {
      console.error("\n❌ 워크플로우 실행 실패");
      const repoInfo = executeCommand(
        "gh repo view --json nameWithOwner -q .nameWithOwner"
      );
      console.log(
        `\n🔗 워크플로우 로그: https://github.com/${repoInfo}/actions/runs/${runId}`
      );
      process.exit(1);
    }

    // 6. Artifact에서 Jira 티켓 번호 다운로드
    console.log("\n✅ 워크플로우 완료!");
    console.log("📋 Jira 티켓 정보를 가져오는 중...\n");

    try {
      // 임시 디렉토리 생성
      const tempDir = path.join(__dirname, ".temp-jira-artifact");
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      // Artifact 다운로드 (최대 3번 재시도)
      let downloadSuccess = false;
      for (let i = 0; i < 3; i++) {
        try {
          // 잠시 대기 (artifact가 준비될 때까지)
          if (i > 0) {
            console.log(`재시도 중... (${i + 1}/3)`);
            await new Promise((resolve) => setTimeout(resolve, 2000));
          }

          executeCommand(
            `cd "${tempDir}" && gh run download ${runId} -n jira-ticket-info 2>&1`
          );
          downloadSuccess = true;
          break;
        } catch (e) {
          if (i === 2) throw e;
        }
      }

      if (downloadSuccess) {
        // 파일에서 Jira 정보 읽기
        const ticketFilePath = path.join(tempDir, "jira-ticket.txt");
        const ticketInfo = fs.readFileSync(ticketFilePath, "utf-8").split("\n");

        const jiraKey = ticketInfo[0]?.trim();
        const jiraUrl = ticketInfo[1]?.trim();
        const parentTicket = ticketInfo[2]?.trim();

        // 임시 파일 삭제
        fs.unlinkSync(ticketFilePath);
        fs.rmdirSync(tempDir);

        if (jiraKey) {
          const repoInfo = executeCommand(
            "gh repo view --json nameWithOwner -q .nameWithOwner"
          );

          console.log("🎉 Jira 이슈가 성공적으로 생성되었습니다!\n");
          console.log(`📍 Jira 티켓: ${jiraKey}`);
          if (jiraUrl) {
            console.log(`🔗 URL: ${jiraUrl}`);
          }
          if (parentTicket) {
            console.log(`📎 상위 티켓: ${parentTicket}`);
          }
          console.log(
            `\n🔗 워크플로우: https://github.com/${repoInfo}/actions/runs/${runId}\n`
          );
        } else {
          throw new Error("Jira 티켓 번호를 파일에서 찾을 수 없습니다.");
        }
      }
    } catch (error) {
      // Artifact 다운로드 실패 시 폴백
      const repoInfo = executeCommand(
        "gh repo view --json nameWithOwner -q .nameWithOwner"
      );
      console.log("🎉 Jira 이슈가 생성되었습니다!\n");
      console.log("📋 워크플로우에서 생성된 티켓 번호를 확인해주세요:");
      console.log(`🔗 https://github.com/${repoInfo}/actions/runs/${runId}\n`);
      console.log(`⚠️  자동 추출 실패: ${error.message}`);
    }
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
