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

```bash
# GitHub CLI 로그인
gh auth login
```

### 이슈 생성

```bash
npm run issue
```

**자동으로 처리되는 작업**:

- ✅ GitHub 이슈 생성
- ✅ Jira 티켓 생성
- ✅ 브랜치 생성 (`JIRA-123-feature-name`)
- ✅ 로컬 브랜치 자동 체크아웃

---

## 🔧 GitHub Secrets 설정 (관리자)

처음 한 번만 설정하면 모든 팀원이 사용할 수 있습니다.

**Settings** → **Secrets and variables** → **Actions**

| Secret Name       | 설명             | 예시                                                                     |
| ----------------- | ---------------- | ------------------------------------------------------------------------ |
| `JIRA_BASE_URL`   | Jira URL         | `https://your-domain.atlassian.net`                                      |
| `JIRA_USER_EMAIL` | Jira 이메일      | `admin@company.com`                                                      |
| `JIRA_API_TOKEN`  | Jira API 토큰    | [생성 방법](https://id.atlassian.com/manage-profile/security/api-tokens) |
| `JIRA_PROJECT`    | Jira 프로젝트 키 | `FMTW`                                                                   |

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

```bash
# Storybook 개발 서버
npm run storybook

# Storybook 빌드
npm run build-storybook

# 이슈 생성
npm run issue
```

---

## 🚨 문제 해결

### "Jira API error (401)"

**원인**: GitHub Secrets 미설정 또는 API 토큰 만료

**해결**:

```bash
# 1. 새 API 토큰 생성
https://id.atlassian.com/manage-profile/security/api-tokens

# 2. GitHub Secrets 업데이트 (관리자)
Settings → Secrets and variables → Actions
```

### "브랜치를 찾을 수 없음"

**해결**:

```bash
# GitHub Actions 로그 확인
# https://github.com/<your-repo>/actions

# 수동으로 브랜치 확인
git fetch origin
git branch -r
```

### "gh: command not found"

**해결**:

```bash
brew install gh
gh auth login
```

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
