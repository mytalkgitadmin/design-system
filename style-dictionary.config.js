/**
 * Style Dictionary 설정 파일
 *
 * 토큰 파일들을 읽어서 TypeScript와 CSS로 변환합니다.
 * - TypeScript: 중첩 객체 형태로 export
 * - CSS: Tailwind 스타일의 CSS 변수로 export
 */

const { roundedToBorderRadius, tailwindNaming } = require('./scripts/style-dictionary/transforms');
const { typescriptNestedObject } = require('./scripts/style-dictionary/formats');

module.exports = {
  // 토큰 소스 파일
  source: [
    'src/tokens/design/primitives/**/*.json',
    'src/tokens/design/semantic/**/*.json',
    'src/tokens/dev/primitives/**/*.json',
  ],

  // 커스텀 transforms와 formats 등록
  hooks: {
    transforms: {
      'attribute/rounded-to-border-radius': roundedToBorderRadius,
      'name/css/tailwind': tailwindNaming,
    },
    formats: {
      'typescript/nested-object': typescriptNestedObject,
    },
  },

  // 플랫폼별 빌드 설정
  platforms: {
    // TypeScript 파일 생성
    ts: {
      transformGroup: 'js',
      buildPath: 'src/tokens/',
      files: [
        {
          destination: 'index.ts',
          format: 'typescript/nested-object',
        },
      ],
    },

    // CSS 변수 생성
    css: {
      transforms: [
        'attribute/cti',
        'attribute/rounded-to-border-radius',
        'name/css/tailwind',
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
