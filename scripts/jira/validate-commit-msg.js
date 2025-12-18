#!/usr/bin/env node

const fs = require("fs");

// 커밋 메시지 파일 경로
const commitMsgFile = process.argv[2];

if (!commitMsgFile) {
  console.error("❌ 커밋 메시지 파일 경로가 필요합니다.");
  process.exit(1);
}

const commitMsg = fs.readFileSync(commitMsgFile, "utf-8");

// Merge 커밋이나 Revert 커밋은 스킵
if (/^(Merge|Revert)/i.test(commitMsg)) {
  process.exit(0);
}

console.log("\n🔍 커밋 메시지 검증 중...\n");

// Jira 이슈 키 체크
const jiraKeyPattern = /\b([A-Z]+-\d+)\b/g;
const jiraKeys = commitMsg.match(jiraKeyPattern);

if (jiraKeys) {
  const uniqueKeys = [...new Set(jiraKeys)];
  console.log(`✅ Jira 이슈 키 발견: ${uniqueKeys.join(", ")}`);

  // 스마트 커밋 명령어 체크
  const smartCommands = [];
  if (/#comment/i.test(commitMsg)) smartCommands.push("comment");
  if (/#time/i.test(commitMsg)) smartCommands.push("time");
  if (/#close/i.test(commitMsg)) smartCommands.push("close");
  if (/#resolve/i.test(commitMsg)) smartCommands.push("resolve");
  if (/#start/i.test(commitMsg)) smartCommands.push("start");
  if (/#transition/i.test(commitMsg)) smartCommands.push("transition");

  if (smartCommands.length > 0) {
    console.log(`🎯 스마트 커밋 명령어 감지: ${smartCommands.join(", ")}`);
  }

  console.log("\n💡 이 커밋은 push 시 Jira에 자동으로 반영됩니다.");
  console.log(`   - 커밋 링크가 Jira 이슈에 추가됩니다`);
  if (smartCommands.length > 0) {
    console.log(`   - 명령어가 자동으로 실행됩니다`);
  }
  console.log();
} else {
  console.log("⚠️  Jira 이슈 키가 없습니다 (선택사항)\n");
  console.log("💡 Jira Smart Commit 사용법:");
  console.log("   git commit -m \"AUDS-123 #comment 작업 내용\"");
  console.log("   git commit -m \"AUDS-456 #time 2h #comment API 연동 완료\"");
  console.log("   git commit -m \"AUDS-789 #close #comment 테스트 완료\"\n");
  console.log("📚 자세한 사용법: npm run commit:help\n");
}

// 커밋을 항상 허용 (경고만 표시)
process.exit(0);

