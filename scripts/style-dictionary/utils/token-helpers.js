/**
 * 토큰 처리 관련 헬퍼 함수들
 */

/**
 * 토큰 값의 참조를 변환 (재귀적 처리)
 * @param {Object} tokenObj - 토큰 객체
 * @param {string} oldPattern - 변경할 패턴 (정규식 문자열)
 * @param {string} newPattern - 새로운 패턴
 * @returns {Object} 변환된 토큰 객체
 * @example
 * transformTokenReferences(rounded, /\{number\.unit\.(\d+)\}/g, '{number.$1}')
 */
function transformTokenReferences(tokenObj, oldPattern, newPattern) {
  const transformed = {};

  Object.keys(tokenObj).forEach((key) => {
    const token = tokenObj[key];

    if (token.value && typeof token.value === 'string') {
      // 단순 문자열 value
      transformed[key] = {
        ...token,
        value: token.value.replace(oldPattern, newPattern),
      };
    } else if (token.value && typeof token.value === 'object') {
      // 중첩 객체 value (Typography 컴포넌트 등)
      const transformedValue = {};
      Object.keys(token.value).forEach((valueKey) => {
        const valueItem = token.value[valueKey];
        if (typeof valueItem === 'string') {
          transformedValue[valueKey] = valueItem.replace(oldPattern, newPattern);
        } else {
          transformedValue[valueKey] = valueItem;
        }
      });
      transformed[key] = {
        ...token,
        value: transformedValue,
      };
    } else if (typeof token === 'object' && !token.value) {
      // 중첩 토큰 객체 (재귀 처리)
      transformed[key] = transformTokenReferences(token, oldPattern, newPattern);
    } else {
      transformed[key] = token;
    }
  });

  return transformed;
}

/**
 * 토큰이 비어있는지 확인
 * @param {Object} tokenObj - 확인할 토큰 객체
 * @returns {boolean} 비어있으면 true
 */
function isEmptyToken(tokenObj) {
  return !tokenObj || Object.keys(tokenObj).length === 0;
}

module.exports = {
  transformTokenReferences,
  isEmptyToken,
};
