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

function loadWorkTime() {
  const workTimeFile = path.join(__dirname, ".work-time.json");
  if (!fs.existsSync(workTimeFile)) {
    return null;
  }
  const data = fs.readFileSync(workTimeFile, "utf-8");
  return JSON.parse(data);
}

function deleteWorkTime() {
  const workTimeFile = path.join(__dirname, ".work-time.json");
  if (fs.existsSync(workTimeFile)) {
    fs.unlinkSync(workTimeFile);
  }
}

function calculateDuration(startTime, endTime) {
  const diff = endTime - startTime;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return { hours, minutes, totalMinutes: Math.floor(diff / (1000 * 60)) };
}

async function main() {
  console.log("\n⏱️  작업 종료 - Jira Work Log\n");

  try {
    // 1. 현재 브랜치에서 Jira 티켓 추출
    const currentBranch = getCurrentBranch();
    console.log(`📍 현재 브랜치: ${currentBranch}`);

    const jiraTicket = extractJiraTicket(currentBranch);
    console.log(`🎟️  Jira 티켓: ${jiraTicket}`);

    // 2. 작업 시작 시간 불러오기
    const workData = loadWorkTime();
    if (!workData || workData.ticket !== jiraTicket) {
      throw new Error(
        "작업 시작 기록을 찾을 수 없습니다.\n먼저 'npm run start'를 실행하세요."
      );
    }

    const startTime = new Date(workData.startTime);
    const endTime = new Date();
    const duration = calculateDuration(startTime, endTime);

    console.log(`⏰ 시작 시간: ${startTime.toLocaleString("ko-KR")}`);
    console.log(`⏰ 종료 시간: ${endTime.toLocaleString("ko-KR")}`);
    console.log(`⏱️  작업 시간: ${duration.hours}시간 ${duration.minutes}분`);

    // 3. Jira 이슈 정보 가져오기
    console.log("\n📥 Jira 이슈 정보 조회 중...");
    const issue = await callJiraAPI(`/rest/api/2/issue/${jiraTicket}`);

    if (!issue) {
      throw new Error("이슈를 찾을 수 없습니다.");
    }

    console.log(`✅ 이슈: ${issue.fields.summary}`);
    console.log(`📊 현재 상태: ${issue.fields.status.name}`);

    // 4. Work Log 추가 (작업 시간 기록)
    console.log("\n📝 Work Log 추가 중...");
    const timeSpentSeconds = duration.totalMinutes * 60;
    await callJiraAPI(`/rest/api/2/issue/${jiraTicket}/worklog`, "POST", {
      comment: `작업 완료 ✅\n시작: ${startTime.toLocaleString(
        "ko-KR"
      )}\n종료: ${endTime.toLocaleString("ko-KR")}\n소요 시간: ${
        duration.hours
      }시간 ${duration.minutes}분`,
      started: startTime.toISOString().replace("Z", "+0000"),
      timeSpentSeconds: timeSpentSeconds,
    });
    console.log("✅ Work Log 추가 완료");

    // 5. Jira 상태를 "해결됨"으로 변경
    console.log("\n🔄 상태를 '해결됨'으로 변경 중...");

    const transitions = await callJiraAPI(
      `/rest/api/2/issue/${jiraTicket}/transitions`
    );

    console.log("\n🔍 사용 가능한 상태 전환:");
    transitions.transitions.forEach((t) => {
      console.log(`   - ${t.name} → ${t.to.name}`);
    });

    // "해결됨" transition 찾기 (여러 이름 지원)
    const doneTransition = transitions.transitions.find(
      (t) =>
        t.name === "Done" ||
        t.name === "완료" ||
        t.name === "해결됨" ||
        t.name === "종료" ||
        t.to.name === "Done" ||
        t.to.name === "완료" ||
        t.to.name === "해결됨" ||
        t.to.name === "종료"
    );

    if (doneTransition) {
      await callJiraAPI(`/rest/api/2/issue/${jiraTicket}/transitions`, "POST", {
        transition: { id: doneTransition.id },
      });
      console.log(`✅ 상태 변경 완료: ${doneTransition.to.name}`);
    } else {
      console.log(
        "⚠️  '해결됨/완료' 상태를 찾을 수 없습니다. Work Log만 추가되었습니다."
      );
      console.log(
        "💡 위 목록에서 원하는 상태를 선택하여 Jira에서 수동으로 변경하세요."
      );
    }

    // 6. 작업 시간 파일 삭제
    deleteWorkTime();

    // 7. 완료 메시지
    console.log("\n🎉 작업 완료가 기록되었습니다!\n");
    console.log("📊 요약:");
    console.log(`   작업 시간: ${duration.hours}시간 ${duration.minutes}분`);
    console.log(`   티켓: ${jiraTicket}`);
    console.log("\n📌 다음 단계:");
    console.log("   1. git add & commit");
    console.log("   2. git push");
    console.log("   3. Pull Request 생성 (추후 자동화 예정)\n");
    const config = getJiraConfig();
    console.log(`🔗 Jira: ${config.baseUrl}/browse/${jiraTicket}\n`);
  } catch (error) {
    console.error("\n❌ 오류 발생:", error.message);
    console.log("\n💡 확인사항:");
    console.log("   - npm run issue:start를 먼저 실행했는지");
    console.log("   - 브랜치명이 JIRA-123-branch-name 형식인지");
    console.log("   - .env 파일에 Jira 인증 정보가 있는지");
    process.exit(1);
  }
}

main();
