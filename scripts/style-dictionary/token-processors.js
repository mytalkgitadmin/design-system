/**
 * 토큰 타입별 처리 함수
 */

const { cleanPath } = require('./utils/string-helpers');
const { setNestedValue } = require('./utils/object-helpers');

/**
 * 토큰 경로와 값을 받아 중첩 객체에 저장하는 공통 함수
 * @param {Object} target - 대상 객체
 * @param {string[]} path - 토큰 경로 (첫 번째 요소는 이미 제거된 상태)
 * @param {*} value - 토큰 값
 */
function processTokenPath(target, path, value) {
  setNestedValue(target, path, value);
}

/**
 * 토큰 타입별 처리기 맵
 * 각 처리기는 토큰을 받아 { category, subPath } 를 반환
 */
const tokenProcessors = {
  color: (token) => ({
    category: 'color',
    subPath: token.path.slice(1), // 'color' 제거
  }),

  font: (token) => {
    const fontPath = token.path.slice(1); // 'font' 제거

    // 'font-family' → 'family'로 변경
    if (fontPath[0] === 'font-family') {
      fontPath[0] = 'family';
    }

    return {
      category: 'font',
      subPath: fontPath,
    };
  },

  number: (token) => ({
    category: 'number',
    subPath: token.path.slice(1), // 'number' 제거
  }),

  rounded: (token) => ({
    category: 'rounded',
    subPath: token.path.slice(1), // 'rounded' 제거
  }),

  zIndex: (token) => ({
    category: 'zIndex',
    subPath: token.path.slice(1), // 'zIndex' 제거
  }),

  spacing: (token) => ({
    category: 'spacing',
    subPath: token.path.slice(1), // 'spacing' 제거
  }),

  typography: (token) => ({
    category: 'typography',
    subPath: token.path.slice(1), // 'typography' 제거
  }),

  // Semantic 토큰 (brand로 시작하는 토큰)
  brand: (token, semantics) => {
    const brandName = token.path[0];
    const subPath = token.path.slice(1);

    if (!semantics.theme[brandName]) {
      semantics.theme[brandName] = {};
    }

    return {
      category: 'theme',
      target: semantics.theme[brandName],
      subPath,
    };
  },
};

/**
 * 토큰 배열을 primitive와 semantic 객체로 변환
 * @param {Array} tokens - 토큰 배열
 * @returns {Object} { primitives, semantics }
 */
function buildNestedObject(tokens) {
  const primitives = {
    color: {},
    font: {},
    number: {},
    rounded: {},
    zIndex: {},
    spacing: {},
    typography: {},
  };

  const semantics = {
    theme: {},
  };

  tokens.forEach((token) => {
    // 괄호 제거
    let path = cleanPath(token.path.slice());
    const tokenType = path[0];

    // Semantic 토큰 (brand로 시작)
    if (tokenType.startsWith('brand')) {
      const result = tokenProcessors.brand({ ...token, path }, semantics);
      processTokenPath(result.target, result.subPath, token.value);
      return;
    }

    // Primitive 토큰
    const processor = tokenProcessors[tokenType];
    if (processor) {
      const result = processor({ ...token, path });
      const target = primitives[result.category];
      processTokenPath(target, result.subPath, token.value);
    }
  });

  return { ...primitives, ...semantics };
}

module.exports = {
  buildNestedObject,
};
