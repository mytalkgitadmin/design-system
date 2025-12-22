/**
 * 문자열 변환 유틸리티 함수들
 */

/**
 * kebab-case 문자열을 camelCase로 변환
 * @param {string} str - 변환할 문자열
 * @returns {string} camelCase 문자열
 * @example toCamelCase('font-family') // 'fontFamily'
 */
function toCamelCase(str) {
  return str.replace(/-([a-z0-9])/g, (_, letter) => letter.toUpperCase());
}

/**
 * 문자열에서 괄호와 그 안의 내용을 제거
 * @param {string} str - 처리할 문자열
 * @returns {string} 괄호가 제거된 문자열
 * @example removeBrackets('brand (1)') // 'brand'
 */
function removeBrackets(str) {
  return str.replace(/\([^)]*\)/g, '').trim();
}

/**
 * 토큰 경로 배열에서 모든 괄호 제거
 * @param {string[]} path - 토큰 경로 배열
 * @returns {string[]} 괄호가 제거된 경로 배열
 */
function cleanPath(path) {
  return path.map(removeBrackets);
}

module.exports = {
  toCamelCase,
  removeBrackets,
  cleanPath,
};
