/**
 * Radius 전역 테마
 * border-radius 값을 정의
 */

export type RadiusTheme = {
  none: number;
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  full: number;
};

export const radiusTheme: RadiusTheme = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 999,
};
