# Jira 연동 가이드

이 문서는 Design System 프로젝트에서 Jira를 연동하는 방법에 대한 상세 가이드입니다.

## 📋 목차

- [개요](#개요)
- [초기 설정](#초기-설정)
- [Jira 티켓 생성](#jira-티켓-생성)
- [스마트 커밋](#스마트-커밋)
- [설정 파일](#설정-파일)
- [문제 해결](#문제-해결)

---

## 개요

프로젝트는 두 가지 주요 Jira 연동 기능을 제공합니다:

1. **Jira 티켓 생성**: CLI를 통해 대화형으로 티켓 생성
2. **스마트 커밋**: 커밋 메시지를 통한 자동 Jira 업데이트

모든 기능은 GitHub Actions를 통해 실행되며, GitHub Secrets에 저장된 Jira 인증 정보를 사용합니다.

---

## 초기 설정

### 1. GitHub CLI 설치 및 인증

```bash
# GitHub CLI 설치 (Mac)
brew install gh

# 인증
gh auth login
```

### 2. GitHub Secrets 설정

프로젝트 관리자가 다음 Secrets를 설정해야 합니다:

**GitHub Repository** → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

| Secret Name       | 설명                         | 예시                                |
| ----------------- | ---------------------------- | ----------------------------------- |
| `JIRA_BASE_URL`   | Jira 인스턴스 URL            | `https://your-domain.atlassian.net` |
| `JIRA_USER_EMAIL` | Jira에 로그인하는 이메일     | `your-email@company.com`            |
| `JIRA_API_TOKEN`  | Jira API 토큰                | `ATATTxxxx...`                      |
| `JIRA_PROJECT`    | Jira 프로젝트 키 (대문자)    | `FMTW`                              |

#### Jira API 토큰 생성 방법

1. https://id.atlassian.com/manage-profile/security/api-tokens 접속
2. **Create API token** 클릭
3. 토큰 이름 입력 (예: `design-system-github`)
4. 생성된 토큰 복사 → GitHub Secrets에 저장

---

## Jira 티켓 생성

### 기본 사용법

```bash
npm run jira:create
```

### 대화형 프롬프트

명령어를 실행하면 다음 정보를 입력하게 됩니다:

```
📋 이슈 제목: 버튼 컴포넌트 리팩토링
📝 상세 내용: 기존 버튼 컴포넌트의 prop 구조를 개선합니다.
🏷️  이슈 타입 (Task/Story/Bug) [Task]: Task
🎟️  상위 티켓 번호 (선택사항, Enter로 스킵):
```

### 실행 흐름

1. **CLI에서 정보 입력** → GitHub Actions 워크플로우 트리거
2. **GitHub Actions 실행** → Jira API를 통해 티켓 생성
3. **결과 확인** → CLI에 생성된 티켓 번호와 URL 출력

### 예시

```bash
$ npm run jira:create

🚀 Jira 이슈 생성 도구 (CLI)
💡 GitHub Actions를 통해 Jira 티켓을 생성합니다.

📋 이슈 제목: Icon 컴포넌트 추가
📝 상세 내용: Iconify를 사용한 아이콘 컴포넌트 구현
🏷️  이슈 타입 (Task/Story/Bug) [Task]: Task
🎟️  상위 티켓 번호 (선택사항, Enter로 스킵): FMTW-100

🚀 GitHub Actions 워크플로우 트리거 중...
✅ GitHub Actions 워크플로우가 시작되었습니다!
⏳ 워크플로우 완료를 기다리는 중...

✅ 워크플로우 완료!
📋 Jira 티켓 정보를 가져오는 중...

🎉 Jira 이슈가 성공적으로 생성되었습니다!

📍 Jira 티켓: FMTW-123
🔗 URL: https://your-domain.atlassian.net/browse/FMTW-123
📎 상위 티켓: FMTW-100
```

### GitHub Actions에서 수동 실행

GitHub 웹사이트에서 직접 워크플로우를 실행할 수도 있습니다:

1. **Actions** 탭 이동
2. **Create Jira Issue (Manual)** 워크플로우 선택
3. **Run workflow** 클릭
4. 필요한 정보 입력 후 실행

---

## 스마트 커밋

커밋 메시지에 특수 명령어를 포함하여 자동으로 Jira 티켓을 업데이트할 수 있습니다.

### 지원하는 명령어

#### 1. 코멘트 추가 (`#comment`)

```bash
git commit -m "FMTW-123 버튼 스타일 개선 #comment 호버 효과 추가 완료"
```

결과: Jira 티켓에 "호버 효과 추가 완료" 코멘트와 커밋 링크가 추가됩니다.

#### 2. 작업 시간 기록 (`#time`)

```bash
git commit -m "FMTW-123 아이콘 컴포넌트 구현 #time 2h 30m"
```

지원하는 시간 단위:
- `w` - 주 (1주 = 5일 = 40시간)
- `d` - 일 (1일 = 8시간)
- `h` - 시간
- `m` - 분

예시:
- `#time 1h` - 1시간
- `#time 30m` - 30분
- `#time 1h 30m` - 1시간 30분
- `#time 2d` - 2일 (16시간)
- `#time 1w 2d 3h` - 1주 2일 3시간

#### 3. 작업 시작 (`#start`)

```bash
git commit -m "FMTW-123 작업 시작 #start"
```

결과: Jira 티켓 상태가 "작업 중(In Progress)"으로 변경됩니다.

> ⚠️ `jira-workflow-config.json`에 `start` transition ID가 설정되어 있어야 합니다.

#### 4. 완료 처리 (`#resolve` 또는 `#close`)

```bash
git commit -m "FMTW-123 버튼 컴포넌트 완료 #resolve"
# 또는
git commit -m "FMTW-123 버그 수정 완료 #close"
```

결과: Jira 티켓 상태가 "완료(Done)" 또는 "해결(Resolved)"로 변경됩니다.

> ⚠️ `jira-workflow-config.json`에 `end` transition ID가 설정되어 있어야 합니다.

### 여러 명령어 조합

하나의 커밋 메시지에 여러 명령어를 함께 사용할 수 있습니다:

```bash
git commit -m "FMTW-123 버튼 컴포넌트 완료 #time 3h #comment 테스트 완료, 리뷰 준비됨 #resolve"
```

위 커밋은 다음을 수행합니다:
1. 3시간 작업 시간 기록
2. "테스트 완료, 리뷰 준비됨" 코멘트 추가
3. 티켓 상태를 완료로 변경

### 여러 티켓 동시 업데이트

하나의 커밋으로 여러 Jira 티켓을 업데이트할 수 있습니다:

```bash
git commit -m "FMTW-123 FMTW-124 공통 스타일 수정 #comment 두 컴포넌트 스타일 통일"
```

### 자동 실행

스마트 커밋은 코드를 푸시할 때 자동으로 실행됩니다:

```bash
git push origin feature-branch
```

GitHub Actions가 자동으로:
1. 푸시된 커밋 메시지 분석
2. Jira 티켓 키(예: FMTW-123) 추출
3. 명령어 파싱 및 실행
4. Jira API를 통해 티켓 업데이트

### 스마트 커밋 도움말

언제든지 도움말을 확인할 수 있습니다:

```bash
npm run commit:help
```

---

## 설정 파일

### `jira-create-config.json`

티켓 생성 시 기본값을 설정합니다:

```json
{
  "defaultParentTicket": "FMTW-100"
}
```

- `defaultParentTicket`: 상위 티켓의 기본값 (선택사항)

### `jira-workflow-config.json`

Jira 워크플로우의 상태 전환 ID를 설정합니다:

```json
{
  "mappings": {
    "init": "11",
    "start": "21",
    "end": "31"
  }
}
```

- `init`: 티켓 생성 시 초기 상태로 전환 (선택사항)
- `start`: `#start` 명령어로 전환할 상태 ID
- `end`: `#resolve` / `#close` 명령어로 전환할 상태 ID

#### Transition ID 확인 방법

프로젝트는 Transition ID를 조회하는 워크플로우를 제공합니다:

1. **Actions** 탭 이동
2. **Get Jira Transitions** 워크플로우 선택
3. **Run workflow** 클릭
4. 조회할 Jira 티켓 번호 입력 (예: `FMTW-123`)
5. 워크플로우 로그에서 사용 가능한 Transition ID 확인

예시 결과:

```
Available transitions for FMTW-123:
  - "작업 중" (ID: 21)
  - "리뷰 중" (ID: 41)
  - "완료" (ID: 31)
```

---

## 문제 해결

### 1. "GitHub CLI가 설치되어 있지 않습니다"

```bash
brew install gh
gh auth login
```

### 2. "워크플로우 실행 실패"

**확인사항:**
- GitHub Secrets가 올바르게 설정되어 있는지
- Jira API 토큰이 유효한지
- Jira 프로젝트 키가 올바른지

**로그 확인:**
1. GitHub Actions 탭에서 실패한 워크플로우 클릭
2. 각 스텝의 로그 확인
3. 에러 메시지 확인

### 3. "상태 전환 실패"

**원인:**
- `jira-workflow-config.json`의 Transition ID가 잘못되었거나 설정되지 않음
- 현재 티켓 상태에서 해당 전환이 불가능함

**해결방법:**
1. **Get Jira Transitions** 워크플로우로 올바른 ID 확인
2. `jira-workflow-config.json` 업데이트
3. Jira 워크플로우 설정 확인

### 4. "스마트 커밋이 동작하지 않음"

**확인사항:**
- 커밋 메시지에 올바른 Jira 티켓 키가 포함되어 있는지 (예: `FMTW-123`)
- 명령어 문법이 올바른지
- GitHub Actions에서 워크플로우가 실행되었는지

**디버깅:**
1. GitHub Actions 탭에서 **Jira Smart Commit** 워크플로우 확인
2. 워크플로우 로그에서 커밋 처리 내역 확인
3. Jira 티켓에서 변경 이력 확인

### 5. "Artifact 다운로드 실패"

티켓 생성 후 CLI에 정보가 표시되지 않는 경우:

1. GitHub Actions 워크플로우 페이지에서 직접 확인
2. 워크플로우 Summary에서 생성된 티켓 번호 확인

---

## 추가 리소스

- [Atlassian Smart Commits 문서](https://support.atlassian.com/jira-software-cloud/docs/process-issues-with-smart-commits/)
- [Jira REST API 문서](https://developer.atlassian.com/cloud/jira/platform/rest/v2/)
- [GitHub CLI 문서](https://cli.github.com/manual/)

---

## 파일 구조

```
scripts/jira/
├── create-jira-only.js           # CLI 티켓 생성 도구
├── process-smart-commits.js      # 스마트 커밋 처리 스크립트
├── validate-commit-msg.js        # 커밋 메시지 검증 (Husky 훅)
├── smart-commit-help.js          # 스마트 커밋 도움말
├── jira-create-config.json       # 티켓 생성 기본 설정
├── jira-workflow-config.json     # 워크플로우 전환 설정
└── README.md                     # 이 문서
```

---

## 워크플로우 파일

```
.github/workflows/
├── create-jira-only.yml          # Jira 티켓 생성 워크플로우
├── jira-smart-commit.yml         # 스마트 커밋 처리 워크플로우
└── get-jira-transitions.yml      # Transition ID 조회 워크플로우
```

