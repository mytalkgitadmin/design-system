# 🚀 Jira & GitHub 통합 자동화

GitHub 이슈와 Jira를 **완전 자동으로 동기화**하는 시스템입니다.

## 📋 작업 순서 (Quick Start)

```bash
# 0. 최초 1회: 초기 설정 (관리자)
# - GitHub Secrets 설정 (JIRA_BASE_URL, JIRA_USER_EMAIL, JIRA_API_TOKEN, JIRA_PROJECT)
# - GitHub Actions에서 "Setup GitHub Labels" 실행
# - GitHub Actions에서 "Get Jira Transitions" 실행 (Issue Key 입력)
# - jira-workflow-config.json 생성 (Transition ID 수동 입력)

# 1. 이슈 생성
npm run issue
  → GitHub Issue + Jira 티켓 + 브랜치 자동 생성

# 2. 브랜치 체크아웃
git fetch origin
git checkout -b FMTW-123-branch-name origin/FMTW-123-branch-name

# 3. 작업 시작
npm run issue:start
  → GitHub Actions 트리거 → Jira 상태 "진행 중" + Work Log 시작

# 4. 코드 작업
# ... 개발 진행 ...

# 5. 작업 완료
npm run issue:end
  → GitHub Actions 트리거 → Jira Work Log 기록 + 상태 "완료/해결됨"

# 완료! 🎉
```

## 🎯 주요 기능

- ✅ **GitHub Issue 생성 → Jira 티켓 자동 생성 + 브랜치 자동 생성**
- ✅ **GitHub Issue 상태 변경 → Jira 상태 자동 동기화**
- ✅ **작업 시작/종료 → Jira Work Log 자동 기록**
- ✅ **GitHub Secrets로 중앙 관리** (로컬에서도 사용 가능)

---

## ⚙️ 초기 설정

### 1. GitHub Secrets 설정 (관리자, 최초 1회) ⭐

**가장 먼저** GitHub Actions가 자동으로 Jira 연동하려면 Secrets 설정이 필요합니다:

**Settings** → **Secrets and variables** → **Actions**

| Secret Name       | 설명             | 예시                                |
| ----------------- | ---------------- | ----------------------------------- |
| `JIRA_BASE_URL`   | Jira URL         | `https://your-domain.atlassian.net` |
| `JIRA_USER_EMAIL` | Jira 이메일      | `your-email@company.com`            |
| `JIRA_API_TOKEN`  | Jira API 토큰    | `your-jira-api-token`               |
| `JIRA_PROJECT`    | Jira 프로젝트 키 | `FMTW`                              |

> 💡 **Secrets는 관리자가 한 번만 설정하면, 모든 팀원과 GitHub Actions가 사용합니다**

### 2. GitHub CLI 설정 (개발자 개별)

```bash
# GitHub CLI 설치 및 로그인
brew install gh
gh auth login
```

### 3. GitHub 라벨 설정 (최초 1회)

GitHub Actions 페이지에서 **"Setup GitHub Labels"** 워크플로우를 수동 실행하거나:

```bash
# 자동화에 필요한 라벨 생성
gh workflow run setup-github-labels.yml
```

생성되는 라벨:

- `work:start` - 작업 시작 (Jira Work Log 시작)
- `work:end` - 작업 종료 (Jira Work Log 종료)
- `in progress` - 진행 중 (Jira 상태 동기화)
- `review` - 리뷰 중 (Jira 상태 동기화)
- `blocked` - 블로킹됨 (Jira 상태 동기화)

### 4. Jira Workflow 설정 (최초 1회) ⭐⭐⭐

**가장 중요한 단계입니다!** Jira의 상태 변경을 위한 Transition ID를 설정해야 합니다.

#### 🎯 방법: 수동으로 `jira-workflow-config.json` 파일 생성

`scripts/jira/jira-workflow-config.json` 파일을 다음 형식으로 생성하세요:

```json
{
  "mappings": {
    "init": "1",
    "start": "4",
    "end": "5"
  }
}
```

**Transition ID 찾는 방법:**

##### 🎯 방법 1: GitHub Actions 워크플로우 (추천! ⭐)

1. **GitHub Actions 탭**으로 이동
2. **"Get Jira Transitions"** 워크플로우 선택
3. **"Run workflow"** 클릭
4. Issue Key 입력 (예: `AUDS-123`)
5. **Summary 탭**에서 결과 확인!

출력 예시:

| ID   | Transition Name | Target Status |
| :--- | :-------------- | :------------ |
| `4`  | Start Progress  | **진행 중**   |
| `5`  | Resolve Issue   | **완료**      |
| `11` | In Progress     | **진행 중**   |
| `31` | Done            | **완료**      |

##### 🎯 방법 2: 브라우저 개발자 도구

1. Jira에서 아무 Issue 열기
2. **F12** (개발자 도구) → **Network 탭**
3. 상태 변경 버튼 클릭 (예: "진행 중")
4. Network 탭에서 **`transitions`** 요청 찾기
5. **Response**에서 `id` 값 확인

**필수 ID:**

- `init`: (선택) Issue 생성 시 초기 상태 Transition ID
- `start`: "해야 할 일" → "진행 중" 으로 가는 Transition ID
- `end`: "진행 중" → "완료" 또는 "해결됨"으로 가는 Transition ID

> 💡 **팁:** 각 Jira 프로젝트마다 Workflow가 다르므로, 프로젝트별로 직접 확인해야 합니다!

### 5. .env 파일 설정 (선택사항 - 로컬 개발용)

**🆕 이제 `.env` 파일이 필수가 아닙니다!**

로컬 스크립트(`npm run issue:start`, `npm run issue:end`)는 다음 순서로 인증 정보를 찾습니다:

1. `.env` 파일 (있으면)
2. **GitHub Secrets** (GitHub CLI를 통해 자동으로 가져옴)
3. 환경변수

따라서 GitHub CLI만 설정하면 `.env` 파일 없이도 작동합니다!

하지만 원한다면 개인 `.env` 파일을 만들 수도 있습니다:

```bash
# .env.example을 복사
cp .env.example .env
```

`.env` 파일 내용:

```bash
JIRA_BASE_URL=https://your-domain.atlassian.net
JIRA_USER_EMAIL=your-email@company.com
JIRA_API_TOKEN=your-jira-api-token
JIRA_PROJECT=FMTW
```

> 💡 **보안**: `.env` 파일은 `.gitignore`에 포함되어 git에 커밋되지 않습니다!

---

## 🛠️ 사용 방법

### 🆕 방법 1: GitHub Issue 라벨 사용 (추천)

이제 **GitHub Issue의 라벨만으로** Jira를 자동으로 관리할 수 있습니다!

#### 1단계: 이슈 생성

```bash
npm run issue
```

입력 정보:

- 이슈 제목
- 상위 티켓 번호 (Enter로 기본값 사용)
- 브랜치명 (영어)
- 상세 내용
- 체크리스트

**자동 처리**:

1. ✅ GitHub 이슈 생성
2. ✅ Jira 티켓 생성 (예: `FMTW-123`)
3. ✅ 브랜치 생성 (`FMTW-123-branch-name`)
4. ✅ Jira와 GitHub 양방향 링크

#### 2단계: 브랜치 체크아웃

```bash
git fetch origin
git checkout -b FMTW-123-branch-name origin/FMTW-123-branch-name
```

#### 3단계: 작업 시작

**GitHub Issue에 `work:start` 라벨 추가** → Jira에서 자동으로:

- ✅ 상태를 "진행 중"으로 변경
- ✅ Work Log 시작 기록
- ✅ 담당자를 본인으로 설정
- ✅ Start date 설정

#### 4단계: 작업 진행

상태에 따라 라벨 추가:

- `in progress` → Jira 상태: "진행 중"
- `review` → Jira 상태: "리뷰 중"
- `blocked` → Jira 상태: "블로킹됨"

#### 5단계: 작업 완료

**GitHub Issue에 `work:end` 라벨 추가** → Jira에서 자동으로:

- ✅ 작업 시간 계산 및 Work Log 기록
- ✅ 상태를 "Done"으로 변경

**GitHub Issue 닫기** → 완료! 🎉

---

### 방법 2: 로컬 스크립트 사용

#### 작업 시작

```bash
npm run issue:start
```

자동 처리:

- Jira 상태를 "진행 중"으로 변경
- Work Log 시작 기록
- 담당자 설정

#### 작업 완료

```bash
npm run issue:end
```

자동 처리:

- 작업 시간 계산
- Work Log 기록
- 상태를 "Done"으로 변경

> 💡 로컬 스크립트는 GitHub Secrets를 자동으로 사용하므로 `.env` 파일이 없어도 작동합니다!

---

## 🔄 워크플로우 (전체 흐름)

### 🆕 GitHub Actions 기반 (추천)

```
1. npm run issue
   → GitHub Issue 생성
      ↓
2. [create-jira-issue.yml] 자동 실행
   → Jira 티켓 생성 (예: FMTW-123)
   → 브랜치 자동 생성 (FMTW-123-branch-name)
      ↓
3. git fetch & git checkout
   → 로컬에서 브랜치 체크아웃
      ↓
4. GitHub Issue에 "work:start" 라벨 추가
      ↓
5. [jira-worklog.yml] 자동 실행
   → Jira 상태: "진행 중"
   → Work Log 시작 기록
   → 담당자 설정
      ↓
6. 코드 작업 & 커밋
      ↓
7. GitHub Issue에 "review" 라벨 추가
      ↓
8. [sync-issue-status.yml] 자동 실행
   → Jira 상태: "리뷰 중"
      ↓
9. PR 리뷰 & 머지
      ↓
10. GitHub Issue에 "work:end" 라벨 추가
      ↓
11. [jira-worklog.yml] 자동 실행
    → 작업 시간 계산 & Work Log 기록
    → Jira 상태: "Done"
       ↓
12. GitHub Issue 닫기
    → 완료! 🎉
```

### 로컬 스크립트 방식 (기존)

```
1. npm run issue
   → GitHub Issue + Jira 티켓 + 브랜치 생성
      ↓
2. git fetch & git checkout
      ↓
3. npm run issue:start
   → Jira 상태: "진행 중" + Work Log 시작
      ↓
4. 코드 작업 & 커밋
      ↓
5. npm run issue:end
   → 작업 시간 계산 + Jira Work Log + 상태: "Done"
      ↓
6. 완료! 🎉
```

> 💡 **두 방식을 혼용**할 수도 있습니다. 예: 이슈 생성은 GitHub Actions, 작업 관리는 로컬 스크립트

---

## 🚨 문제 해결

### 로컬 스크립트 실패 (npm run issue:start/end)

**원인**: `.env` 파일 없음 또는 API 토큰 만료

**해결**:

```bash
# 1. .env 파일 확인
cat .env

# 2. 새 API 토큰 생성 (필요시)
# https://id.atlassian.com/manage-profile/security/api-tokens

# 3. .env 파일 업데이트
vi .env  # JIRA_API_TOKEN 값 업데이트
```

### GitHub Actions 실패 (자동 이슈 생성)

**원인**: GitHub Secrets 미설정 또는 만료

**해결**:

```bash
# 1. GitHub Secrets 확인
# Repository → Settings → Secrets and variables → Actions

# 2. 새 API 토큰 생성 (필요시)
# https://id.atlassian.com/manage-profile/security/api-tokens

# 3. GitHub Secrets 업데이트 (관리자)
# JIRA_API_TOKEN 값 업데이트
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
├── create-issue.js           # 이슈 생성 스크립트 (Node.js)
├── create-issue.sh           # 이슈 생성 스크립트 (Bash)
├── start-work.js             # 작업 시작 (Work Log 시작)
├── end-work.js               # 작업 종료 (Work Log 종료)
├── setup-github-labels.sh    # GitHub 라벨 자동 생성
├── issue-config.json         # 설정 파일
├── README.md                 # 기본 사용 가이드
└── README-GITHUB-ACTIONS.md  # GitHub Actions 상세 가이드

.github/workflows/
├── create-jira-issue.yml     # Issue 생성 → Jira 티켓 + 브랜치 생성
├── sync-issue-status.yml     # Issue 라벨 변경 → Jira 상태 동기화
└── jira-worklog.yml          # work:start/end 라벨 → Work Log 기록
```

## 📚 추가 문서

- **[GitHub Actions 상세 가이드](./README-GITHUB-ACTIONS.md)** - 워크플로우 상세 설명
- **[작업 로그](./WORK_LOG.md)** - 개발 히스토리

---

## 💡 새 팀원 온보딩

```bash
# 1. 저장소 클론
git clone <repository-url>
cd design-system
npm install

# 2. GitHub CLI 설정 (필수)
brew install gh
gh auth login

# 3. 테스트
npm run issue
```

**끝! 이게 전부입니다.** ✨

`.env` 파일 없이도 작동합니다! GitHub Secrets가 자동으로 사용됩니다.

### 📝 인증 방법 비교

| 방법               | 설정 위치           | 사용 대상                      | 장점                        |
| ------------------ | ------------------- | ------------------------------ | --------------------------- |
| **GitHub Secrets** | Repository Settings | GitHub Actions + 로컬 스크립트 | ✅ 중앙 관리, `.env` 불필요 |
| `.env` 파일        | 각 개발자 로컬      | 로컬 스크립트만                | ✅ 오프라인 작업 가능       |
| 환경변수           | 셸 설정             | 로컬 스크립트만                | ✅ CI/CD 환경에서 유용      |

> 💡 **추천**: GitHub Secrets만 설정하고, GitHub CLI를 통해 로컬에서도 사용

---

## 📞 지원

문제 발생 시:

1. 위 문제 해결 섹션 확인
2. 팀 슬랙 채널에 문의
3. GitHub Issues 생성
