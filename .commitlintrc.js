module.exports = {
  // extends를 제거하여 커스텀 규칙만 사용
  // extends: ["@commitlint/config-conventional"],

  rules: {
    // 타입은 반드시 있어야 함
    "type-enum": [
      2,
      "always",
      [
        "✨ Feat",
        "⚡ Perf",
        "🐛 Fix",
        "🎨 UI/UX",
        "💄 Style",
        "➕ Add",
        "♻️ Refactor",
        "🔧 Chore",
        "🏗️ Build",
        "👷 CI",
        "📝 Docs",
        "🔥 Remove",
        "🔍 SEO",
        "🚧 WIP",
        "♿ A11y",
        "🧪 Test",
      ],
    ],

    // 타입은 대소문자 구분 없음 (gitmoji 포함하므로)
    "type-case": [0],

    // 타입은 비어있으면 안됨
    "type-empty": [2, "never"],

    // 제목은 비어있으면 안됨
    "subject-empty": [2, "never"],

    // 제목은 대문자로 시작
    "subject-case": [2, "always", "sentence-case"],

    // 제목 끝에 마침표 금지
    "subject-full-stop": [2, "never", "."],

    // 제목 최대 길이 (Jira 키와 스마트 커밋 명령어를 고려하여 증가)
    "subject-max-length": [2, "always", 200],

    // 본문 최대 줄 길이
    "body-max-line-length": [2, "always", 200],

    // 본문 앞에 빈 줄 필수
    "body-leading-blank": [2, "always"],

    // footer 앞에 빈 줄 필수
    "footer-leading-blank": [1, "always"],

    // 헤더 최대 길이 (Jira 키와 스마트 커밋 명령어를 고려하여 증가)
    "header-max-length": [2, "always", 250],
  },

  // 커스텀 파서 설정 (gitmoji와 Jira 키를 타입으로 인식)
  parserPreset: {
    parserOpts: {
      // Jira 키와 스마트 커밋 명령어를 포함한 패턴
      // 예: ✨ Feat: 제목 FMTW-123 #comment 내용
      headerPattern:
        /^((?:✨|⚡|🐛|🎨|💄|➕|♻️|🔧|🏗️|👷|📝|🔥|🔍|🚧|♿|🧪)\s+\w+):\s(.+)$/,
      headerCorrespondence: ["type", "subject"],
    },
  },

  // 커스텀 플러그인으로 gitmoji와 Jira 스마트 커밋 체크
  plugins: [
    {
      rules: {
        "gitmoji-required": (parsed) => {
          const gitmojiPattern =
            /^(✨|⚡|🐛|🎨|💄|➕|♻️|🔧|🏗️|👷|📝|🔥|🔍|🚧|♿|🧪)\s+/;
          const hasGitmoji = gitmojiPattern.test(parsed.raw);

          return [
            hasGitmoji,
            hasGitmoji
              ? ""
              : "커밋 메시지는 gitmoji로 시작해야 합니다 (예: ✨, 🐛, 📝)",
          ];
        },
        "type-format": (parsed) => {
          const typePattern =
            /^(✨|⚡|🐛|🎨|💄|➕|♻️|🔧|🏗️|👷|📝|🔥|🔍|🚧|♿|🧪)\s+(Feat|Perf|Fix|UI\/UX|Style|Add|Refactor|Chore|Build|CI|Docs|Remove|SEO|WIP|A11y|Test):/;
          const hasCorrectFormat = typePattern.test(parsed.raw);

          return [
            hasCorrectFormat,
            hasCorrectFormat
              ? ""
              : "타입 형식이 올바르지 않습니다 (예: ✨ Feat:, 🐛 Fix:)",
          ];
        },
        "jira-ticket-format": (parsed) => {
          const jiraKeyPattern = /\b([A-Z]+-\d+)\b/;
          const hasJiraKey = jiraKeyPattern.test(parsed.raw);

          // Jira 키가 있으면 형식 검증
          if (hasJiraKey) {
            const matches = parsed.raw.match(jiraKeyPattern);
            if (matches) {
              // Jira 키 형식은 올바름
              return [true, ""];
            }
          }

          // Jira 키가 없어도 통과 (선택사항)
          return [true, ""];
        },
         "smart-commit-format": (parsed) => {
           // 스마트 커밋 명령어 패턴 (comment, time만 지원)
           const smartCommitPattern = /#(comment|time)/i;
           const hasSmartCommit = smartCommitPattern.test(parsed.raw);

          if (hasSmartCommit) {
            // Jira 키도 있는지 확인
            const jiraKeyPattern = /\b([A-Z]+-\d+)\b/;
            const hasJiraKey = jiraKeyPattern.test(parsed.raw);

            if (!hasJiraKey) {
              return [
                false,
                "스마트 커밋 명령어(#comment, #time 등)를 사용하려면 Jira 티켓 번호가 필요합니다 (예: FMTW-123)",
              ];
            }

            // #comment나 #time이 있는데 내용이 없는지 확인
            if (/#comment\s*$/i.test(parsed.raw)) {
              return [false, "#comment 명령어 뒤에 코멘트 내용이 필요합니다"];
            }
            if (/#time\s*$/i.test(parsed.raw)) {
              return [
                false,
                "#time 명령어 뒤에 시간이 필요합니다 (예: 2h, 30m, 2h 30m)",
              ];
            }
          }

          return [true, ""];
        },
      },
    },
  ],

  // 커스텀 규칙 활성화
  rules: {
    "gitmoji-required": [2, "always"],
    "type-format": [2, "always"],
    "jira-ticket-format": [2, "always"],
    "smart-commit-format": [2, "always"],
  },
};
