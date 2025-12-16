#!/bin/bash

# Jira Transition ID 조회 헬퍼 스크립트
# 저장된 workflow 설정에서 transition ID를 가져옵니다.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_FILE="$SCRIPT_DIR/jira-workflow-config.json"

ACTION=$1  # start, end, inProgress, review, blocked

if [ -z "$ACTION" ]; then
  echo "사용법: $0 <action>" >&2
  echo "Actions: start, end, inProgress, review, blocked" >&2
  exit 1
fi

if [ ! -f "$CONFIG_FILE" ]; then
  echo "ERROR: Workflow 설정 파일을 찾을 수 없습니다." >&2
  echo "다음 명령어를 먼저 실행하세요: npm run jira:setup-workflow" >&2
  exit 1
fi

# Transition ID 가져오기
TRANSITION_ID=$(jq -r ".mappings.${ACTION}" "$CONFIG_FILE")

if [ "$TRANSITION_ID" = "null" ] || [ -z "$TRANSITION_ID" ]; then
  echo "ERROR: '${ACTION}' 액션에 대한 transition이 설정되지 않았습니다." >&2
  exit 1
fi

echo "$TRANSITION_ID"

