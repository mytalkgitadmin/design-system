module.exports = {
  // 분리된 토큰 파일들을 모두 읽어옴
  source: ['src/tokens/primitives/**/*.json', 'src/tokens/semantic/**/*.json'],
  // hooks를 사용한 커스텀 transform, format 등록 (v5+)
  hooks: {
    transforms: {
      // Tailwind 스타일 네이밍 (CSS용)
      'name/css/tailwind': {
        type: 'name',
        transform: (token) => {
          // 토큰 경로에서 CSS 변수명 생성
          let path = token.path.slice(); // 복사본 생성

          // 1. 'color' prefix 제거 (색상은 타입이 명확하므로)
          if (path[0] === 'color') {
            path.shift();
          }

          // 4. 'font-family' → 'family'
          if (path.includes('font-family')) {
            const idx = path.indexOf('font-family');
            path[idx] = 'family';
          }

          // 5. 브랜드명에서 괄호 제거
          path = path.map((segment) => {
            return segment.replace(/\([^)]*\)/g, '').trim();
          });

          // 경로를 kebab-case로 연결
          return path.join('-');
        },
      },
    },
    formats: {
      // TypeScript 객체 그룹화 포맷
      'typescript/nested-object': ({ dictionary }) => {
        // 토큰을 중첩 객체로 변환
        const buildNestedObject = (tokens) => {
          const primitives = {
            color: {},
            font: {},
            number: {},
          };
          const semantics = {
            theme: {},
          };

          tokens.forEach((token) => {
            let path = token.path.slice();

            // 브랜드명에서 괄호 제거
            path = path.map((segment) => {
              return segment.replace(/\([^)]*\)/g, '').trim();
            });

            // Primitives 토큰 처리
            if (path[0] === 'color') {
              // color.gray.50 형태로 유지
              const colorPath = path.slice(1); // 'color' 제거
              let current = primitives.color;

              for (let i = 0; i < colorPath.length; i++) {
                const key = colorPath[i];
                if (i === colorPath.length - 1) {
                  current[key] = token.value;
                } else {
                  if (!current[key]) current[key] = {};
                  current = current[key];
                }
              }
            } else if (path[0] === 'font') {
              // font.family.pretendard, font.weight.bold 형태
              const fontPath = path.slice(1); // 'typo' 제거

              // font-family → family로 변경
              if (fontPath[0] === 'font-family') {
                fontPath[0] = 'family';
              }

              let current = primitives.font;
              for (let i = 0; i < fontPath.length; i++) {
                const key = fontPath[i];
                if (i === fontPath.length - 1) {
                  current[key] = token.value;
                } else {
                  if (!current[key]) current[key] = {};
                  current = current[key];
                }
              }
            } else if (path[0] === 'number') {
              // spacing.4, rounded.8 형태
              const numberPath = path.slice(1); // ex) ['4'], ['999']

              let current = primitives.number;
              for (let i = 0; i < numberPath.length; i++) {
                const key = numberPath[i];
                if (i === numberPath.length - 1) {
                  current[key] = token.value;
                } else {
                  if (!current[key]) current[key] = {};
                  current = current[key];
                }
              }
            }
            // Semantic 토큰 처리
            else if (path[0].startsWith('brand')) {
              // theme.brand1.background.default 형태
              const brandName = path[0]; // brand-1 → camelCase 변환은 나중에
              const semanticPath = path.slice(1);

              if (!semantics.theme[brandName]) {
                semantics.theme[brandName] = {};
              }

              let current = semantics.theme[brandName];
              for (let i = 0; i < semanticPath.length; i++) {
                const key = semanticPath[i];
                if (i === semanticPath.length - 1) {
                  current[key] = token.value;
                } else {
                  if (!current[key]) current[key] = {};
                  current = current[key];
                }
              }
            }
          });

          return { ...primitives, ...semantics };
        };

        // kebab-case를 camelCase로 변환
        const toCamelCase = (str) => {
          return str.replace(/-([a-z0-9])/g, (_, letter) =>
            letter.toUpperCase()
          );
        };

        // 재귀적으로 객체를 문자열로 변환 (키도 camelCase로 변환)
        const stringifyObject = (obj, indent = 2) => {
          const spaces = ' '.repeat(indent);
          const entries = Object.entries(obj);

          if (entries.length === 0) return '{}';

          const lines = entries.map(([key, value]) => {
            // 키를 camelCase로 변환
            const camelKey = toCamelCase(key);
            // 숫자로 시작하는 키는 따옴표로 감싸기 (예: '4xl', '2xs', '50')
            const safeKey = /^\d/.test(camelKey) ? `'${camelKey}'` : camelKey;

            if (typeof value === 'object' && value !== null) {
              return `${spaces}${safeKey}: ${stringifyObject(value, indent + 2)}`;
            } else {
              const stringValue =
                typeof value === 'string' ? `'${value}'` : value;
              return `${spaces}${safeKey}: ${stringValue}`;
            }
          });

          return `{\n${lines.join(',\n')}\n${' '.repeat(indent - 2)}}`;
        };

        const nestedTokens = buildNestedObject(dictionary.allTokens);

        // TypeScript 파일 생성
        let output = `/**\n * Do not edit directly, this file was auto-generated.\n */\n\n`;

        Object.entries(nestedTokens).forEach(([category, value]) => {
          const safeName = toCamelCase(category);
          output += `export const ${safeName} = ${stringifyObject(value)};\n\n`;
        });

        return output;
      },
    },
  },
  platforms: {
    // TypeScript 파일 생성 (중첩 객체 형태)
    ts: {
      transformGroup: 'js',
      buildPath: 'src/tokens/',
      files: [
        {
          destination: 'index.ts',
          format: 'typescript/nested-object', // 커스텀 포맷 사용
        },
      ],
    },
    // CSS 변수 생성 (Tailwind 스타일)
    css: {
      transforms: [
        'attribute/cti',
        'name/css/tailwind', // 커스텀 transform 사용
        'time/seconds',
        'html/icon',
        'size/rem',
        'color/css',
      ],
      buildPath: 'src/tokens/',
      files: [
        {
          destination: 'variables.css',
          format: 'css/variables',
          options: {
            outputReferences: true,
            showFileHeader: true,
          },
        },
      ],
    },
  },
};
