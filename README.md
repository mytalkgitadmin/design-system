# Design System

디자인 시스템 컴포넌트 라이브러리

## 🚀 빠른 시작

```bash
npm install
npm run storybook
```

---

## 📝 이슈 생성 및 Jira 연동

### 처음 설정 (최초 1회)

#### 1. GitHub CLI 로그인

```bash
gh auth login
```

#### 2. .env 파일 생성 (로컬 개발용)

프로젝트 루트에 `.env` 파일을 생성하고 Jira 정보를 입력하세요:

```bash
# .env 파일 생성
cp .env.example .env
```

`.env` 파일 내용:

```bash
JIRA_BASE_URL=https://your-domain.atlassian.net
JIRA_USER_EMAIL=your-email@company.com
JIRA_API_TOKEN=your-jira-api-token
JIRA_PROJECT=FMTW
```

> 💡 **보안**: `.env` 파일은 git에 커밋하지 않습니다 (`.gitignore`에 포함됨)
>
> 💡 Jira API 토큰 생성: https://id.atlassian.com/manage-profile/security/api-tokens

#### 3. GitHub Secrets 설정 (관리자, 최초 1회)

GitHub Actions가 자동으로 Jira 연동하려면 Secrets 설정이 필요합니다:

**Settings** → **Secrets and variables** → **Actions**

| Secret Name       | 설명             | 예시                                |
| ----------------- | ---------------- | ----------------------------------- |
| `JIRA_BASE_URL`   | Jira URL         | `https://your-domain.atlassian.net` |
| `JIRA_USER_EMAIL` | Jira 이메일      | `your-email@company.com`            |
| `JIRA_API_TOKEN`  | Jira API 토큰    | `your-jira-api-token`               |
| `JIRA_PROJECT`    | Jira 프로젝트 키 | `FMTW`                              |

> 💡 **Secrets는 관리자가 한 번만 설정하면, 모든 팀원이 사용할 수 있습니다**

### 이슈 생성

```bash
npm run issue
```

**자동으로 처리되는 작업**:

- ✅ GitHub 이슈 생성
- ✅ Jira 티켓 생성
- ✅ 브랜치 생성 (`JIRA-123-feature-name`)

> 💡 생성된 브랜치는 GitHub Actions가 자동으로 생성하며, 로컬에서 체크아웃하려면:
>
> ```bash
> git fetch origin
> git checkout -b FMTW-123-feature-name origin/FMTW-123-feature-name
> ```

---

## 🔄 워크플로우

```
npm run issue
    ↓
GitHub 이슈 생성
    ↓
GitHub Actions 자동 실행
    ├─ Jira 티켓 생성 (FMTW-123)
    ├─ 브랜치 생성 (FMTW-123-feature-name)
    └─ 이슈/티켓 연결
    ↓
로컬 브랜치 자동 체크아웃
    ↓
작업 시작! 🎉
```

---

## 🛠️ 주요 명령어

### Storybook

```bash
npm run storybook          # 개발 서버
npm run build-storybook    # 빌드
```

### Jira 연동

```bash
npm run issue              # 이슈 생성
npm run issue:start        # 작업 시작 (Work Log)
npm run issue:end          # 작업 종료 (Work Log)
```

> 📖 Work Log 상세 가이드: [scripts/jira/WORK_LOG.md](scripts/jira/WORK_LOG.md)

---

## 📂 프로젝트 구조

```
design-system/
├── src/
│   ├── stories/              # Storybook 컴포넌트
│   └── figma/                # 디자인 토큰
├── scripts/jira/             # Jira 연동 스크립트
│   ├── create-issue.js       # 이슈 생성
│   ├── issue-config.json     # 기본 설정
│   └── README.md             # 상세 가이드
├── .github/workflows/        # GitHub Actions
└── package.json
```

---

## 🤝 기여하기

1. 이슈 생성: `npm run issue`
2. 브랜치에서 작업
3. 커밋 및 푸시
4. Pull Request 생성

**상세 문서**: [scripts/jira/README.md](scripts/jira/README.md)

---

## 📄 라이선스

ISC
