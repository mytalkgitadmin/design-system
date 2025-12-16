#!/bin/bash
set -e

echo "🚀 GitHub 이슈 생성 & 브랜치 자동 전환 도구"
echo ""

# 설정 파일 로드
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_FILE="$SCRIPT_DIR/issue-config.json"

DEFAULT_PARENT_TICKET="PRJ-00"
if [[ -f "$CONFIG_FILE" ]]; then
  DEFAULT_PARENT_TICKET=$(cat "$CONFIG_FILE" | grep -o '"defaultParentTicket"[[:space:]]*:[[:space:]]*"[^"]*"' | cut -d'"' -f4)
fi

# 1. 입력 받기
read -p "📋 이슈 제목: " title
read -p "🎟️  상위 작업 티켓 번호 (기본값: $DEFAULT_PARENT_TICKET, Enter로 스킵): " parent_key
parent_key=${parent_key:-$DEFAULT_PARENT_TICKET}
echo "✅ 상위 티켓: $parent_key"
echo ""

read -p "🌳 브랜치명 (영어로): " branch
read -p "📝 상세 내용: " description
read -p "✅ Task 1: " task1
read -p "✅ Task 2: " task2

# 2. 현재 변경사항 확인
if [[ -n $(git status -s) ]]; then
  echo ""
  echo "⚠️  커밋되지 않은 변경사항이 있습니다."
  read -p "변경사항을 stash하시겠습니까? (y/n): " stash_answer
  
  if [[ "$stash_answer" == "y" ]]; then
    git stash save "Auto-stash before branch switch"
    echo "✅ 변경사항을 stash했습니다."
    STASHED=true
  fi
fi

# 3. 이슈 본문 생성
body="### 🎟️ 상위 작업 (Ticket Number)
$parent_key

### 🌳 브랜치명 (Branch)
$branch

### 📝 상세 내용(Description)
$description

### ✅ 체크리스트(Tasks)
- [ ] $task1
- [ ] $task2"

# 4. GitHub 이슈 생성
echo ""
echo "📝 GitHub 이슈를 생성하는 중..."
issue_url=$(gh issue create --title "$title" --body "$body")

echo "✅ 이슈가 성공적으로 생성되었습니다!"
echo "🔗 $issue_url"

# 5. 브랜치 생성 대기
echo ""
echo "⏳ GitHub Actions가 브랜치를 생성할 때까지 대기 중..."
echo "   (최대 60초)"

for i in {1..30}; do
  sleep 2
  git fetch origin 2>/dev/null || true
  
  # 브랜치 이름 패턴으로 검색
  branch_name=$(git branch -r | grep -o "origin/[^ ]*$branch[^ ]*" | head -1 | sed 's/origin\///')
  
  if [[ -n "$branch_name" ]]; then
    echo ""
    echo "✅ 브랜치를 찾았습니다: $branch_name"
    
    # 6. 브랜치로 체크아웃
    echo ""
    echo "🌿 브랜치로 전환 중..."
    git checkout -b "$branch_name" "origin/$branch_name"
    
    echo "✅ 성공적으로 $branch_name 브랜치로 전환되었습니다!"
    
    # 7. stash 복원 확인
    if [[ "$STASHED" == "true" ]]; then
      if git stash list | grep -q "Auto-stash before branch switch"; then
        echo ""
        read -p "stash한 변경사항을 복원하시겠습니까? (y/n): " apply_answer
        
        if [[ "$apply_answer" == "y" ]]; then
          git stash pop
          echo "✅ stash한 변경사항을 복원했습니다."
        fi
      fi
    fi
    
    # 8. 완료 메시지
    echo ""
    echo "🎉 모든 작업이 완료되었습니다!"
    echo ""
    echo "📌 다음 단계:"
    echo "   1. 코드 작업 진행"
    echo "   2. git add & commit"
    echo "   3. git push origin $branch_name"
    echo "   4. Pull Request 생성"
    echo ""
    
    exit 0
  fi
  
  printf "."
done

echo ""
echo "⚠️  브랜치 자동 전환에 실패했습니다."
echo "💡 수동으로 브랜치를 확인하려면:"
echo "   git fetch origin"
echo "   git branch -r | grep $branch"
echo "   git checkout -b <branch-name> origin/<branch-name>"

