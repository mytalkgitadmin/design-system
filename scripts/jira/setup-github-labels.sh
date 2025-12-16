#!/bin/bash

# GitHub 라벨 자동 생성 스크립트
# GitHub Actions와 Jira 자동화에 필요한 라벨들을 생성합니다.

echo "🏷️  GitHub 라벨 설정 중..."
echo ""

# GitHub CLI 확인
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI(gh)가 설치되어 있지 않습니다."
    echo ""
    echo "설치 방법:"
    echo "  macOS:   brew install gh"
    echo "  Windows: winget install --id GitHub.cli"
    echo "  Linux:   sudo apt install gh"
    exit 1
fi

# GitHub 인증 확인
if ! gh auth status &> /dev/null; then
    echo "❌ GitHub에 로그인되어 있지 않습니다."
    echo ""
    echo "다음 명령으로 로그인하세요:"
    echo "  gh auth login"
    exit 1
fi

echo "✅ GitHub CLI 준비 완료"
echo ""

# 라벨 생성 함수
create_label() {
    local name=$1
    local color=$2
    local description=$3
    
    # 라벨이 이미 있는지 확인
    if gh label list --json name --jq ".[] | select(.name==\"$name\")" | grep -q "$name"; then
        echo "⏭️  '$name' 라벨은 이미 존재합니다."
    else
        if gh label create "$name" --color "$color" --description "$description" 2>/dev/null; then
            echo "✅ '$name' 라벨 생성 완료"
        else
            echo "⚠️  '$name' 라벨 생성 실패"
        fi
    fi
}

echo "📝 작업 관리 라벨 생성 중..."
create_label "work:start" "10B981" "🚀 작업 시작 - Jira Work Log 시작"
create_label "work:end" "EF4444" "✅ 작업 종료 - Jira Work Log 종료"
echo ""

echo "📊 상태 관리 라벨 생성 중..."
create_label "in progress" "F59E0B" "🟡 진행 중 - Jira: In Progress"
create_label "review" "3B82F6" "🔵 리뷰 중 - Jira: In Review"
create_label "blocked" "6B7280" "🚫 블로킹됨 - Jira: Blocked"
echo ""

echo "🎉 라벨 설정 완료!"
echo ""
echo "📌 다음 단계:"
echo "  1. GitHub Issue 생성"
echo "  2. 'work:start' 라벨 추가로 작업 시작"
echo "  3. 'review' 라벨 추가로 리뷰 요청"
echo "  4. 'work:end' 라벨 추가로 작업 완료"
echo ""
echo "🔗 라벨 확인: https://github.com/$(gh repo view --json nameWithOwner --jq .nameWithOwner)/labels"

