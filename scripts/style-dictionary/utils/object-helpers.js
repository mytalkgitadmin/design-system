/**
 * 객체 처리 유틸리티 함수들
 */

const { toCamelCase } = require('./string-helpers');

/**
 * 중첩된 객체 구조에서 경로를 따라 값을 설정
 * @param {Object} obj - 대상 객체
 * @param {string[]} path - 경로 배열
 * @param {*} value - 설정할 값
 * @example
 * const obj = {};
 * setNestedValue(obj, ['color', 'gray', '50'], '#f9fafb');
 * // obj = { color: { gray: { '50': '#f9fafb' } } }
 */
function setNestedValue(obj, path, value) {
  let current = obj;

  for (let i = 0; i < path.length; i++) {
    const key = path[i];

    if (i === path.length - 1) {
      // 마지막 키: 값 설정
      current[key] = value;
    } else {
      // 중간 키: 객체가 없으면 생성
      if (!current[key]) {
        current[key] = {};
      }
      current = current[key];
    }
  }
}

/**
 * 재귀적으로 객체를 TypeScript 문자열로 변환
 * @param {Object} obj - 변환할 객체
 * @param {number} indent - 들여쓰기 레벨
 * @returns {string} TypeScript 객체 문자열
 */
function stringifyObject(obj, indent = 2) {
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
      const stringValue = typeof value === 'string' ? `'${value}'` : value;
      return `${spaces}${safeKey}: ${stringValue}`;
    }
  });

  return `{\n${lines.join(',\n')}\n${' '.repeat(indent - 2)}}`;
}

module.exports = {
  setNestedValue,
  stringifyObject,
};
