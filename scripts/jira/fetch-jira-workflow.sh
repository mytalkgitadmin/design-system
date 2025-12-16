#!/bin/bash

# Jira Workflow 조회 및 저장 스크립트
# 프로젝트의 Jira 워크플로우를 조회하여 transition 정보를 저장합니다.

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_FILE="$SCRIPT_DIR/jira-workflow-config.json"

echo "🔍 Jira Workflow 조회 중..."
echo ""

# GitHub CLI로 Secrets 가져오기
get_secret() {
  local secret_name=$1
  gh secret get "$secret_name" 2>/dev/null || echo ""
}

# Jira 설정 가져오기
JIRA_BASE_URL=$(get_secret "JIRA_BASE_URL")
JIRA_USER_EMAIL=$(get_secret "JIRA_USER_EMAIL")
JIRA_API_TOKEN=$(get_secret "JIRA_API_TOKEN")
JIRA_PROJECT=$(get_secret "JIRA_PROJECT")

if [ -z "$JIRA_BASE_URL" ] || [ -z "$JIRA_USER_EMAIL" ] || [ -z "$JIRA_API_TOKEN" ]; then
  echo "❌ GitHub Secrets를 찾을 수 없습니다."
  echo ""
  echo "다음을 확인하세요:"
  echo "  1. GitHub CLI 설치 및 인증: gh auth login"
  echo "  2. Repository Secrets 설정 확인"
  exit 1
fi

echo "✅ Jira 연결 정보 확인 완료"
echo "   Base URL: $JIRA_BASE_URL"
echo "   Project: ${JIRA_PROJECT:-N/A}"
echo ""

# 샘플 이슈 번호 입력받기
echo "📋 Workflow를 조회할 Jira 티켓 번호를 입력하세요 (예: FMTW-1):"
read -r SAMPLE_ISSUE

if [ -z "$SAMPLE_ISSUE" ]; then
  echo "❌ 티켓 번호를 입력해주세요."
  exit 1
fi

echo ""
echo "🔄 ${SAMPLE_ISSUE}의 transition 조회 중..."

# Jira API 호출
RESPONSE=$(curl -s -X GET \
  -H "Content-Type: application/json" \
  -u "$JIRA_USER_EMAIL:$JIRA_API_TOKEN" \
  "$JIRA_BASE_URL/rest/api/2/issue/$SAMPLE_ISSUE/transitions")

# 에러 체크
if echo "$RESPONSE" | jq -e '.errorMessages' > /dev/null 2>&1; then
  echo "❌ Jira API 에러:"
  echo "$RESPONSE" | jq -r '.errorMessages[]'
  exit 1
fi

echo ""
echo "📋 사용 가능한 Transition 목록:"
echo ""
echo "$RESPONSE" | jq -r '.transitions[] | "  ID: \(.id | tostring | .[0:4]) | \(.name) → \(.to.name)"'
echo ""

# JSON 설정 파일 생성
echo "💾 Workflow 설정 저장 중..."

cat > "$CONFIG_FILE" << EOF
{
  "lastUpdated": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "sampleIssue": "$SAMPLE_ISSUE",
  "jiraBaseUrl": "$JIRA_BASE_URL",
  "transitions": $(echo "$RESPONSE" | jq '.transitions | map({
    id: .id,
    name: .name,
    toStatus: .to.name,
    toStatusId: .to.id
  })'),
  "mappings": {
    "start": null,
    "end": null,
    "inProgress": null,
    "review": null,
    "blocked": null
  }
}
EOF

echo "✅ Workflow 정보가 저장되었습니다: $CONFIG_FILE"
echo ""

# 매핑 설정 도우미
echo "🎯 이제 상태 매핑을 설정합니다..."
echo ""

# 각 액션에 대한 transition 찾기 및 매핑
echo "현재 상태 → 목표 상태로 가는 transition을 선택하세요:"
echo ""

# Start (진행 중으로 변경)
echo "1️⃣  작업 시작 시 사용할 transition (예: To Do → In Progress):"
echo "$RESPONSE" | jq -r '.transitions[] | "  [\(.id)] \(.name) → \(.to.name)"'
echo ""
read -p "Transition ID 입력: " START_ID

# In Progress
IN_PROGRESS_ID=$START_ID

# Review
echo ""
echo "2️⃣  리뷰 시작 시 사용할 transition (예: In Progress → In Review):"
echo "$RESPONSE" | jq -r '.transitions[] | "  [\(.id)] \(.name) → \(.to.name)"'
echo ""
read -p "Transition ID 입력 (없으면 Enter): " REVIEW_ID

# Blocked
echo ""
echo "3️⃣  블로킹 시 사용할 transition (예: In Progress → Blocked):"
echo "$RESPONSE" | jq -r '.transitions[] | "  [\(.id)] \(.name) → \(.to.name)"'
echo ""
read -p "Transition ID 입력 (없으면 Enter): " BLOCKED_ID

# Done
echo ""
echo "4️⃣  작업 완료 시 사용할 transition (예: In Progress → Done):"
echo "$RESPONSE" | jq -r '.transitions[] | "  [\(.id)] \(.name) → \(.to.name)"'
echo ""
read -p "Transition ID 입력: " END_ID

# 설정 파일 업데이트
jq --arg start "$START_ID" \
   --arg end "$END_ID" \
   --arg inProgress "$IN_PROGRESS_ID" \
   --arg review "$REVIEW_ID" \
   --arg blocked "$BLOCKED_ID" \
   '.mappings.start = $start |
    .mappings.end = $end |
    .mappings.inProgress = $inProgress |
    .mappings.review = ($review | if . == "" then null else . end) |
    .mappings.blocked = ($blocked | if . == "" then null else . end)' \
   "$CONFIG_FILE" > "$CONFIG_FILE.tmp" && mv "$CONFIG_FILE.tmp" "$CONFIG_FILE"

echo ""
echo "✅ 매핑 설정 완료!"
echo ""
echo "📄 저장된 설정:"
jq '.' "$CONFIG_FILE"
echo ""
echo "🎉 완료! 이제 워크플로우가 이 설정을 사용합니다."
echo ""
echo "💡 설정을 변경하려면 다시 이 스크립트를 실행하세요:"
echo "   npm run jira:setup-workflow"

