/**
 * Style Dictionary 커스텀 Format 정의
 */

const { toCamelCase } = require('./utils/string-helpers');
const { stringifyObject } = require('./utils/object-helpers');
const { buildNestedObject } = require('./token-processors');

/**
 * TypeScript 중첩 객체 포맷
 *
 * 토큰을 타입별로 그룹화하여 중첩된 TypeScript 객체로 출력
 * 예: export const color = { gray: { '50': '#f9fafb' } }
 */
const typescriptNestedObject = ({ dictionary }) => {
  const nestedTokens = buildNestedObject(dictionary.allTokens);

  // TypeScript 파일 생성
  let output = `/**\n * Do not edit directly, this file was auto-generated.\n */\n\n`;

  Object.entries(nestedTokens).forEach(([category, value]) => {
    const safeName = toCamelCase(category);
    output += `export const ${safeName} = ${stringifyObject(value)};\n\n`;
  });

  return output;
};

module.exports = {
  typescriptNestedObject,
};
