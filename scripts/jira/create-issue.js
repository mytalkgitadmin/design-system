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

function waitForBranch(branchPattern, maxAttempts = 30, interval = 2000) {
  console.log(`\n⏳ GitHub Actions가 브랜치를 생성할 때까지 대기 중...`);

  return new Promise((resolve, reject) => {
    let attempts = 0;

    const checkBranch = setInterval(() => {
      attempts++;

      try {
        // 원격 브랜치 목록 업데이트
        executeCommand("git fetch origin", { stdio: "pipe" });

        // 브랜치 검색 (패턴 매칭)
        const branches = executeCommand("git branch -r");
        const branchMatch = branches.match(
          new RegExp(`origin/(\\S*${branchPattern}\\S*)`)
        );

        if (branchMatch) {
          clearInterval(checkBranch);
          const fullBranchName = branchMatch[1].replace("origin/", "");
          console.log(`\n✅ 브랜치를 찾았습니다: ${fullBranchName}`);
          resolve(fullBranchName);
        } else if (attempts >= maxAttempts) {
          clearInterval(checkBranch);
          reject(new Error("브랜치 생성 대기 시간 초과"));
        } else {
          process.stdout.write(".");
        }
      } catch (error) {
        // 계속 시도
        process.stdout.write(".");
      }
    }, interval);
  });
}

async function askYesNo(question) {
  return new Promise((resolve) => {
    const rl2 = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl2.question(question, (answer) => {
      rl2.close();
      resolve(answer.toLowerCase() === "y");
    });
  });
}

async function main() {
  console.log("\n🚀 GitHub 이슈 생성 & 브랜치 자동 전환 도구\n");

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
    // 2. 현재 변경사항 확인
    console.log("\n📦 현재 작업 상태 확인 중...");
    const status = executeCommand("git status --porcelain");

    let hasStashed = false;
    if (status.trim()) {
      console.log("⚠️  커밋되지 않은 변경사항이 있습니다.");
      const stashAnswer = await askYesNo(
        "변경사항을 stash하시겠습니까? (y/n): "
      );

      if (stashAnswer) {
        executeCommand('git stash save "Auto-stash before branch switch"');
        console.log("✅ 변경사항을 stash했습니다.");
        hasStashed = true;
      } else {
        console.log("⚠️  변경사항을 유지한 채로 진행합니다.");
      }
    }

    // 3. GitHub 이슈 생성
    console.log("\n📝 GitHub 이슈를 생성하는 중...");

    const escapedBody = body.replace(/"/g, '\\"').replace(/\n/g, "\\n");
    const command = `gh issue create --title "${answers.title}" --body "${escapedBody}" --label "feat"`;
    const issueUrl = executeCommand(command).trim();

    console.log("✅ 이슈가 성공적으로 생성되었습니다!");
    console.log(`🔗 ${issueUrl}`);

    // 4. GitHub Actions가 브랜치 생성할 때까지 대기
    console.log("\n⏳ GitHub Actions가 작업을 처리하는 중...");
    console.log("   - Jira 티켓 생성");
    console.log("   - 브랜치 생성");
    console.log("   - 이슈 업데이트");

    try {
      const branchName = await waitForBranch(answers.branch, 30, 2000);

      // 5. 브랜치로 체크아웃
      console.log(`\n🌿 브랜치로 전환 중: ${branchName}`);
      executeCommand(`git checkout -b ${branchName} origin/${branchName}`);

      console.log(`✅ 성공적으로 ${branchName} 브랜치로 전환되었습니다!`);

      // 6. stash된 변경사항 복원
      if (hasStashed) {
        const stashList = executeCommand("git stash list");
        if (stashList.includes("Auto-stash before branch switch")) {
          const applyAnswer = await askYesNo(
            "\nstash한 변경사항을 복원하시겠습니까? (y/n): "
          );

          if (applyAnswer) {
            executeCommand("git stash pop");
            console.log("✅ stash한 변경사항을 복원했습니다.");
          }
        }
      }

      // 7. 완료 메시지
      console.log("\n🎉 모든 작업이 완료되었습니다!\n");
      console.log("📌 다음 단계:");
      console.log("   1. 코드 작업 진행");
      console.log("   2. git add & commit");
      console.log("   3. git push origin " + branchName);
      console.log("   4. Pull Request 생성\n");
    } catch (error) {
      console.log("\n⚠️  브랜치 자동 전환에 실패했습니다.");
      console.log("💡 수동으로 브랜치를 확인하려면:");
      console.log("   git fetch origin");
      console.log("   git branch -r | grep " + answers.branch);
      console.log("   git checkout -b <branch-name> origin/<branch-name>");
    }
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
