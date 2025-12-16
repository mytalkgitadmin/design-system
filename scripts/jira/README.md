# 🚀 Jira & GitHub 통합 자동화

GitHub 이슈 생성부터 Jira 연동, 브랜치 생성까지 자동화하는 도구입니다.

---

## ⚙️ 초기 설정

### 1. GitHub CLI 설정 (개발자 개별)

```bash
# GitHub CLI 설치 및 로그인
brew install gh
gh auth login
```

### 2. .env 파일 설정 (관리자, 1회만)

프로젝트 루트에 `.env` 파일을 생성합니다:

```bash
# .env.example을 복사
cp .env.example .env
```

`.env` 파일 내용을 실제 Jira 정보로 채웁니다:

```bash
JIRA_BASE_URL=https://your-domain.atlassian.net
JIRA_USER_EMAIL=your-email@company.com
JIRA_API_TOKEN=your-jira-api-token
JIRA_PROJECT=FMTW
```

**Jira API 토큰 생성**:
1. https://id.atlassian.com/manage-profile/security/api-tokens 접속
2. "Create API token" 클릭
3. 토큰 이름 입력 (예: `team-jira-integration`)
4. 생성된 토큰 복사
5. `.env` 파일의 `JIRA_API_TOKEN`에 입력

### 3. .env 파일 커밋 및 공유

**⚠️ Private Repository 확인 필수!**

```bash
git add .env
git commit -m "chore: Add .env file for Jira integration"
git push origin main
```

> 이제 모든 팀원이 별도 설정 없이 바로 사용 가능합니다!

---

## 🛠️ 사용 방법

### 이슈 생성

```bash
npm run issue
```

입력 정보:

- 이슈 제목
- 상위 티켓 번호 (Enter로 기본값 사용)
- 브랜치명 (영어)
- 상세 내용
- 체크리스트

### 자동 처리

1. GitHub 이슈 생성
2. Jira 티켓 생성 (예: `FMTW-123`)
3. 브랜치 생성 (`FMTW-123-branch-name`)
4. Jira에 브랜치 링크 추가
5. GitHub 이슈 제목 업데이트 (`[FMTW-123] 제목`)

> 💡 생성된 브랜치는 GitHub Actions가 자동으로 생성하며, 로컬에서 체크아웃:
> ```bash
> git fetch origin
> git checkout -b FMTW-123-branch-name origin/FMTW-123-branch-name
> ```

---

## 🔄 워크플로우

```
개발자 로컬
    ↓
npm run issue (이슈 정보 입력)
    ↓
GitHub 이슈 생성
    ↓
GitHub Actions 자동 실행
    ├─ .env 파일에서 Jira 인증 정보 로드
    ├─ Jira 티켓 생성
    ├─ 브랜치 생성 (develop 기준)
    └─ 이슈/티켓 연결
    ↓
로컬에서 브랜치 체크아웃
    ↓
작업 시작! 🎉
```

---

## 🚨 문제 해결

### Jira API 인증 실패 (401)

**원인**: `.env` 파일 없음 또는 API 토큰 만료

**해결**:
```bash
# 1. .env 파일 확인
cat .env

# 2. 새 API 토큰 생성 (필요시)
# https://id.atlassian.com/manage-profile/security/api-tokens

# 3. .env 파일 업데이트
vi .env  # JIRA_API_TOKEN 값 업데이트
git add .env
git commit -m "chore: Update Jira API token"
git push origin main
```

### 브랜치를 찾을 수 없음

**원인**: GitHub Actions 실행 실패 또는 완료 대기 중

**해결**:
```bash
# GitHub Actions 로그 확인
https://github.com/<your-repo>/actions

# 수동 브랜치 확인
git fetch origin
git branch -r | grep <브랜치명>
git checkout -b <브랜치명> origin/<브랜치명>
```

### GitHub CLI 인증 오류

```bash
brew install gh
gh auth login
gh auth status
```

---

## 📝 설정 파일

### `issue-config.json`

```json
{
  "defaultParentTicket": "FMTW-1660",
  "projectName": "design-system",
  "jiraProject": "FMTW"
}
```

필요시 `defaultParentTicket` 값을 변경하여 기본 상위 티켓을 설정할 수 있습니다.

---

## 📂 파일 구조

```
scripts/jira/
├── create-issue.js       # 이슈 생성 스크립트 (Node.js)
├── create-issue.sh       # 이슈 생성 스크립트 (Bash)
├── issue-config.json     # 설정 파일
└── README.md             # 이 문서
```

---

## 💡 새 팀원 온보딩

```bash
# 1. 저장소 클론 (자동으로 .env 포함)
git clone <repository-url>
cd design-system
npm install

# 2. GitHub CLI 설정
brew install gh
gh auth login

# 3. .env 파일 확인 (이미 레포지토리에 포함됨)
cat .env  # Jira 설정 확인

# 4. 테스트
npm run issue
```

**끝! 이게 전부입니다.** ✨

> 💡 `.env` 파일이 레포지토리에 포함되어 있어 별도 설정 필요 없음!

---

## 📞 지원

문제 발생 시:

1. 위 문제 해결 섹션 확인
2. 팀 슬랙 채널에 문의
3. GitHub Issues 생성
