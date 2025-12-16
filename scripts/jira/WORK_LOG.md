# ⏱️ Jira Work Log 시간 추적

Jira와 연동하여 작업 시간을 자동으로 추적하고 기록하는 도구입니다.

---

## 🚀 빠른 시작

### 1️⃣ 작업 시작

```bash
npm run issue:start
```

**자동 실행**:
- 현재 브랜치에서 Jira 티켓 번호 추출
- Jira 상태 → "진행 중" 변경
- 시작 시간 기록
- Work Log에 시작 코멘트 추가

### 2️⃣ 작업 종료

```bash
npm run issue:end
```

**자동 실행**:
- 작업 시간 계산 (시작 ~ 종료)
- Jira 상태 → "완료" 변경
- Work Log에 작업 시간 추가
- 완료 코멘트 추가

---

## 📋 사용 예시

```bash
# 1. Jira 티켓과 연결된 브랜치로 이동
git checkout FMTW-1234-feature-name

# 2. 작업 시작
npm run issue:start

⏱️  작업 시작 - Jira Work Log

📍 현재 브랜치: FMTW-1234-feature-name
🎟️  Jira 티켓: FMTW-1234
⏰ 시작 시간: 2024. 12. 16. 오후 3:00:00

📥 Jira 이슈 정보 조회 중...
✅ 이슈: 로그인 페이지 UI 개선
📊 현재 상태: To Do

🔄 상태를 '진행 중'으로 변경 중...
✅ 상태 변경 완료: In Progress

📝 Work Log 추가 중...
✅ Work Log 추가 완료

🎉 작업 시작이 기록되었습니다!

# 3. 코드 작업...

# 4. 작업 완료
npm run issue:end

⏱️  작업 종료 - Jira Work Log

📍 현재 브랜치: FMTW-1234-feature-name
🎟️  Jira 티켓: FMTW-1234
⏰ 시작 시간: 2024. 12. 16. 오후 3:00:00
⏰ 종료 시간: 2024. 12. 16. 오후 5:30:00
⏱️  작업 시간: 2시간 30분

📥 Jira 이슈 정보 조회 중...
✅ 이슈: 로그인 페이지 UI 개선
📊 현재 상태: In Progress

📝 Work Log 추가 중...
✅ Work Log 추가 완료

🔄 상태를 '완료'로 변경 중...
✅ 상태 변경 완료: Done

🎉 작업 완료가 기록되었습니다!

📊 요약:
   작업 시간: 2시간 30분
   티켓: FMTW-1234
```

---

## ⚙️ 사전 요구사항

### .env 파일 설정

프로젝트 루트에 `.env` 파일이 있어야 합니다:

```bash
# .env.example을 복사
cp .env.example .env

# .env 파일 수정
JIRA_BASE_URL=https://your-domain.atlassian.net
JIRA_USER_EMAIL=your-email@company.com
JIRA_API_TOKEN=your-api-token
```

> 💡 Jira API 토큰 생성: https://id.atlassian.com/manage-profile/security/api-tokens  
> ⚠️ `.env` 파일은 Git에 커밋되지 않습니다

### 브랜치 네이밍 규칙

브랜치명은 반드시 **Jira 티켓 번호로 시작**해야 합니다:

✅ 올바른 형식:
- `FMTW-1234-feature-name`
- `PROJ-567-fix-bug`
- `ABC-123-update-docs`

❌ 잘못된 형식:
- `feature-name` (티켓 번호 없음)
- `feature-FMTW-1234` (티켓 번호가 앞에 없음)

---

## 🔄 워크플로우

```
브랜치 체크아웃 (JIRA-123-feature)
    ↓
npm run start
    ├─ Jira: To Do → In Progress
    ├─ 시작 시간 기록
    └─ Work Log 추가
    ↓
코드 작업 진행 ⏳
    ↓
npm run end
    ├─ 작업 시간 계산
    ├─ Work Log 추가 (시간 포함)
    ├─ Jira: In Progress → Done
    └─ 완료!
```

---

## 📊 Jira에서 확인하기

### Work Log 위치
1. Jira 티켓 열기
2. **Work log** 탭 확인
3. 작업 시간 및 코멘트 확인

### 자동 기록 내용
- 🚀 작업 시작 시간
- ⏱️ 작업 소요 시간
- ✅ 작업 완료 시간
- 📝 코멘트 (시작/종료 시간 포함)

---

## 🚨 문제 해결

### "작업 시작 기록을 찾을 수 없습니다"

**원인**: `npm run issue:start`를 실행하지 않음

**해결**:
```bash
npm run issue:start
```

### "브랜치명에서 Jira 티켓을 찾을 수 없습니다"

**원인**: 브랜치명이 `JIRA-123-name` 형식이 아님

**해결**:
```bash
# 올바른 브랜치로 체크아웃
git checkout FMTW-1234-feature-name
```

### "Jira 인증 정보가 없습니다"

**원인**: `.env` 파일이 없거나 설정이 누락됨

**해결**:
```bash
# .env.example을 복사
cp .env.example .env

# .env 파일 수정
vi .env  # 또는 원하는 에디터 사용
```

### "'진행 중' 상태를 찾을 수 없습니다"

**원인**: Jira 워크플로우 상태 이름이 다름

**해결**:
- 이미 "진행 중" 상태일 수 있음 (정상)
- Work Log는 추가되므로 문제없음
- Jira에서 수동으로 상태 변경 가능

---

## 💡 팁

### 작업 중단 후 재개

```bash
# 작업 중단 (npm run issue:end 실행하지 않음)
# ... 다른 작업 진행 ...

# 다시 돌아왔을 때
npm run issue:start  # 새로운 시작 시간으로 재기록
```

### 여러 태스크 작업

각 브랜치마다 독립적으로 시간 추적:

```bash
# Task 1
git checkout FMTW-1234-task1
npm run issue:start
# 작업...
npm run issue:end

# Task 2
git checkout FMTW-5678-task2
npm run issue:start
# 작업...
npm run issue:end
```

### 시간 수동 조정

Jira 웹에서 Work Log를 직접 수정 가능:
1. Jira 티켓 → Work log 탭
2. 해당 로그 클릭
3. 시간 수정

---

## 📂 파일 구조

```
scripts/jira/
├── start-work.js          # 작업 시작 스크립트
├── end-work.js            # 작업 종료 스크립트
├── .work-time.json        # 시간 추적 데이터 (gitignore)
└── WORK_LOG.md            # 이 문서
```

---

## 🔮 향후 계획

- [ ] `npm run issue:end` 실행 시 자동 PR 생성
- [ ] 일일/주간 작업 시간 리포트
- [ ] 여러 태스크 동시 추적 지원
- [ ] VS Code Extension 연동

---

## 📞 지원

문제 발생 시:
1. 이 문서의 문제 해결 섹션 확인
2. `.env` 파일 설정 확인
3. Jira 티켓 존재 여부 확인
4. 팀 슬랙 채널에 문의

