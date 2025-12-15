/**
 * 디자인 토큰 색상 매핑
 * 토큰 이름을 실제 CSS 변수로 변환
 */

export const colorTokenMap: Record<string, string> = {
  // Semantic colors
  primary: '#006aff',
  success: '#00ff62',

  // Primitive colors (fallback)
  blue: '#006aff',
  green: '#00ff62',
  gray: '#333333',
  white: '#ffffff',
};

/**
 * 색상 값을 실제 CSS 값으로 변환
 * @param color - 토큰 이름 또는 HEX/RGB 값
 * @returns CSS 색상 값
 */
export function getColorValue(color: string): string {
  // HEX 또는 RGB 값이면 그대로 반환
  if (color.startsWith('#') || color.startsWith('rgb')) {
    return color;
  }

  // 토큰 이름이면 매핑된 값 반환
  return colorTokenMap[color] || color;
}
