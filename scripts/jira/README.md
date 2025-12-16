# 🚀 이슈 생성 자동화 도구

GitHub 이슈 생성부터 Jira 연동, 브랜치 생성, 로컬 체크아웃까지 한 번에 처리하는 자동화 스크립트입니다.

## 📋 기능

- ✅ GitHub 이슈 자동 생성
- ✅ Jira 티켓 자동 생성 (GitHub Actions 연동)
- ✅ 브랜치 자동 생성 및 체크아웃
- ✅ Git Stash 자동 관리
- ✅ 상위 에픽 티켓 기본값 설정

## 🛠️ 사용 방법

### Node.js 버전 (권장)

```bash
npm run issue
```

### Bash 버전

```bash
npm run issue:sh
```

## ⚙️ 설정

`scripts/issue-config.json` 파일에서 기본 설정을 관리합니다:

```json
{
  "defaultParentTicket": "PRJ-00",
  "projectName": "design-system"
}
```

### 설정 변경 방법

1. `scripts/issue-config.json` 파일 열기
2. `defaultParentTicket` 값을 프로젝트의 상위 에픽 티켓 번호로 변경
3. 저장 후 스크립트 실행 시 자동으로 적용

**예시:**

```json
{
  "defaultParentTicket": "FMTW-123",
  "projectName": "design-system"
}
```

## 📝 실행 흐름

1. **이슈 정보 입력**

   - 제목, 상위 티켓 (Enter로 기본값 사용 가능), 브랜치명, 설명, 체크리스트

2. **Git 상태 확인**

   - 커밋되지 않은 변경사항이 있으면 stash 여부 선택

3. **GitHub 이슈 생성**

   - `gh` CLI를 사용하여 자동 생성

4. **GitHub Actions 대기**

   - Jira 티켓 자동 생성
   - 브랜치 자동 생성
   - 이슈 정보 업데이트
   - 최대 60초 대기 (2초 간격)

5. **브랜치 자동 체크아웃**

   - 생성된 브랜치로 자동 전환

6. **Stash 복원** (선택)

   - 저장한 변경사항 복원 여부 선택

7. **작업 시작!**
   - 바로 코드 작업 가능

## 🔧 사전 요구사항

### 필수 설치

```bash
# GitHub CLI 설치
brew install gh

# GitHub 로그인
gh auth login
```

### GitHub Actions 설정

프로젝트에 다음 워크플로우가 설정되어 있어야 합니다:

- 이슈 생성 시 Jira 티켓 자동 생성
- Jira 티켓 번호로 브랜치 자동 생성

## 💡 사용 예시

```bash
$ npm run issue

🚀 GitHub 이슈 생성 & 브랜치 자동 전환 도구

📋 이슈 제목을 입력하세요: 로그인 페이지 UI 개선
🎟️  상위 작업 티켓 번호 (기본값: PRJ-00, Enter로 스킵):
✅ 상위 티켓: PRJ-00

🌳 브랜치명 (영어로): login-ui-improvement
📝 상세 내용: 로그인 페이지의 레이아웃과 스타일 개선
✅ 체크리스트 (쉼표로 구분): 레이아웃 수정, 스타일 적용, 반응형 대응

📦 현재 작업 상태 확인 중...
📝 GitHub 이슈를 생성하는 중...
✅ 이슈가 성공적으로 생성되었습니다!
🔗 https://github.com/user/repo/issues/123

⏳ GitHub Actions가 작업을 처리하는 중...
   - Jira 티켓 생성
   - 브랜치 생성
   - 이슈 업데이트

⏳ GitHub Actions가 브랜치를 생성할 때까지 대기 중...
.....
✅ 브랜치를 찾았습니다: feature/PRJ-001-login-ui-improvement

🌿 브랜치로 전환 중: feature/PRJ-001-login-ui-improvement
✅ 성공적으로 feature/PRJ-001-login-ui-improvement 브랜치로 전환되었습니다!

🎉 모든 작업이 완료되었습니다!

📌 다음 단계:
   1. 코드 작업 진행
   2. git add & commit
   3. git push origin feature/PRJ-001-login-ui-improvement
   4. Pull Request 생성
```

## 🚨 문제 해결

### 브랜치를 찾을 수 없는 경우

```bash
# 수동으로 원격 브랜치 확인
git fetch origin
git branch -r | grep <브랜치명>

# 브랜치로 체크아웃
git checkout -b <브랜치명> origin/<브랜치명>
```

### GitHub CLI 인증 오류

```bash
# 재인증
gh auth logout
gh auth login
```

## 📂 파일 구조

```
scripts/
├── create-issue.js        # Node.js 버전 스크립트
├── create-issue.sh        # Bash 버전 스크립트
├── issue-config.json      # 설정 파일
└── README.md              # 이 문서
```
