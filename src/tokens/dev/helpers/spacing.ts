/**
 * Spacing Scale
 * CSS 레벨에서 관리하는 공간 스케일
 * 피그마 토큰(number.json)과 분리하여 개발용으로 관리
 *
 * @description
 * - 8px 기반 스케일 체계
 * - 숫자는 픽셀 단위 기준 (실제 값은 rem으로 변환)
 * - 레이아웃 컴포넌트(Stack, Box 등)에서 사용
 *
 * @example
 * spacing[8]  // 0.8rem (8px)
 * spacing[16] // 1.6rem (16px)
 * spacing[24] // 2.4rem (24px)
 */

export const spacing = {
  0: '0rem', // 0px
  4: '0.4rem', // 4px - 최소 단위
  8: '0.8rem', // 8px - 기본 단위
  12: '1.2rem', // 12px
  16: '1.6rem', // 16px
  24: '2.4rem', // 24px
  32: '3.2rem', // 32px
  48: '4.8rem', // 48px
  64: '6.4rem', // 64px
} as const;

/**
 * Pixel 기반 Spacing (특수 케이스용)
 * rem 대신 px가 필요한 경우에만 사용
 */
export const spacingPx = {
  0: 0,
  4: 4,
  8: 8,
  12: 12,
  16: 16,
  24: 24,
  32: 32,
  48: 48,
  64: 64,
} as const;

/**
 * Negative Spacing (음수 마진용)
 * 레이아웃 오버랩, 오프셋 조정 시 사용
 */
export const negativeSpacing = {
  4: '-0.4rem',
  8: '-0.8rem',
  12: '-1.2rem',
  16: '-1.6rem',
  24: '-2.4rem',
  32: '-3.2rem',
  48: '-4.8rem',
  64: '-6.4rem',
} as const;

/**
 * Inset Spacing (내부 여백용)
 * padding, gap 등에 사용되는 프리셋
 */
export const insetSpacing = {
  squish: {
    y: spacing[8], // 상하: 8px
    x: spacing[12], // 좌우: 12px
  },
  default: {
    y: spacing[12], // 상하: 12px
    x: spacing[16], // 좌우: 16px
  },
  comfortable: {
    y: spacing[16], // 상하: 16px
    x: spacing[24], // 좌우: 24px
  },
} as const;

// 타입 export
export type Spacing = keyof typeof spacing;
export type SpacingPx = keyof typeof spacingPx;
export type NegativeSpacing = keyof typeof negativeSpacing;
export type InsetSpacingKey = keyof typeof insetSpacing;

/**
 * Storybook을 위한 options 배열
 */
export const spacingOptions = Object.keys(spacing).map(Number) as Spacing[];
export const spacingPxOptions = Object.keys(spacingPx).map(
  Number
) as SpacingPx[];

/**
 * Spacing 유틸리티 함수
 */
export const spacingUtils = {
  /**
   * spacing 키를 rem 값으로 변환
   */
  toRem: (key: Spacing): string => spacing[key],

  /**
   * spacing 키를 px 숫자로 변환
   */
  toPx: (key: SpacingPx): number => spacingPx[key],

  /**
   * 여러 spacing 값을 CSS shorthand로 변환
   * @example toShorthand('md', 'lg') => '1.6rem 2.4rem'
   */
  toShorthand: (...keys: Spacing[]): string => {
    return keys.map((key) => spacing[key]).join(' ');
  },
} as const;
