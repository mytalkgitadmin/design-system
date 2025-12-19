module.exports = {
  types: [
    {
      value: "✨ Feat",
      name: "✨ Feat:      새로운 기능 추가",
    },
    {
      value: "⚡ Perf",
      name: "⚡ Perf:      성능 개선(속도/메모리/용량)",
    },
    {
      value: "🐛 Fix",
      name: "🐛 Fix:       버그 수정",
    },
    {
      value: "🎨 UI/UX",
      name: "🎨 UI/UX:     사용자 인터페이스 변경",
    },
    {
      value: "💄 Style",
      name: "💄 Style:     코드 스타일 (비즈니스 로직 변경 없음)",
    },
    {
      value: "➕ Add",
      name: "➕ Add:       의존성 추가",
    },
    {
      value: "♻️ Refactor",
      name: "♻️ Refactor:  코드 리팩토링",
    },
    {
      value: "🔧 Chore",
      name: "🔧 Chore:     기타 변경사항 (빌드 스크립트 등)",
    },
    {
      value: "🏗️ Build",
      name: "🏗️ Build:     빌드 관련 파일 수정",
    },
    {
      value: "👷 CI",
      name: "👷 CI:        CI 관련 설정 수정",
    },
    {
      value: "📝 Docs",
      name: "📝 Docs:      문서 (추가, 수정, 삭제)",
    },
    {
      value: "🔥 Remove",
      name: "🔥 Remove:    코드/파일/기능 삭제",
    },
    {
      value: "🔍 SEO",
      name: "🔍 SEO:       검색 엔진 최적화",
    },
    {
      value: "🚧 WIP",
      name: "🚧 WIP:       작업 진행 중 (Work In Progress)",
    },
    {
      value: "♿ A11y",
      name: "♿ A11y:      접근성 개선",
    },
    {
      value: "🧪 Test",
      name: "🧪 Test:      테스트 (비즈니스 로직 변경 없음)",
    },
  ],

  messages: {
    type: "커밋 타입을 선택하세요:",
    subject: "커밋 제목을 입력하세요 (명령조, 첫글자 대문자, 마침표 X):\n",
    body: '상세 설명 (Enter=스킵, 긴 내용은 "git commit"으로 작성):\n',
    footer:
      "Jira 티켓과 스마트 커밋 (선택사항):\n  예: FMTW-123 #comment 작업 완료\n  명령어: #comment, #time 2h, #start, #resolve, #close\n",
    confirmCommit: "위 내용으로 커밋하시겠습니까?",
  },

  allowCustomScopes: false,
  allowBreakingChanges: [],
  skipQuestions: ["scope", "breaking"],

  subjectLimit: 100,
  footerPrefix: "",

  // 커밋 메시지 포맷 커스터마이징
  formatCommit: function (answers) {
    const type = answers.type;
    const subject = answers.subject;
    const body = answers.body;
    const footer = answers.footer;

    let message = `${type}: ${subject}`;

    // Jira 티켓 번호가 있으면 추가
    if (footer) {
      message += ` ${footer}`;
    }

    // 본문이 있으면 추가
    if (body) {
      message += "\n\n" + body;
    }

    return message;
  },
};
