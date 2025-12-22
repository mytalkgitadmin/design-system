/**
 * 토큰 빌드 관련 상수
 */

// Figma 토큰 셋 이름
const FIGMA_TOKEN_SETS = {
  PRIMITIVE: 'primitive/value',
  SEMANTIC_PREFIX: 'semantic/',
  BRAND_PREFIX: 'brand/',
};

// 토큰 카테고리
const TOKEN_CATEGORIES = {
  // Primitives
  COLOR: 'color',
  FONT: 'font',
  NUMBER: 'number',
  ROUNDED: 'rounded',
  ZINDEX: 'zIndex',
  SPACING: 'spacing',
  TYPOGRAPHY: 'typography',

  // Semantics
  BRAND: 'brand',
  THEME: 'theme',
};

// 파일 경로
const PATHS = {
  FIGMA_TOKENS: 'src/tokens/figma/tokens.json',
  OUTPUT_DIR: 'src/tokens/design',
  PRIMITIVES_DIR: 'src/tokens/design/primitives',
  SEMANTIC_DIR: 'src/tokens/design/semantic',
};

// 출력 파일명
const OUTPUT_FILES = {
  PRIMITIVES: {
    COLOR: 'color.json',
    FONT: 'font.json',
    NUMBER: 'number.json',
    ROUNDED: 'rounded.json',
  },
  SEMANTIC: {
    BRANDS: 'brands.json',
    COLORS: 'colors.json',
  },
};

module.exports = {
  FIGMA_TOKEN_SETS,
  TOKEN_CATEGORIES,
  PATHS,
  OUTPUT_FILES,
};
