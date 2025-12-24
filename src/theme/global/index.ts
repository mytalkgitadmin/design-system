/**
 * Global Theme 통합
 * 모든 전역 테마를 하나로 묶어서 export
 */

import { type ColorTheme, colorTheme } from './color';
import { type RadiusTheme, radiusTheme } from './radius';
import { type TypographyTheme, typographyTheme } from './typography';

export type GlobalTheme = {
  typography: TypographyTheme;
  color: ColorTheme;
  radius: RadiusTheme;
};

export const globalTheme: GlobalTheme = {
  typography: typographyTheme,
  color: colorTheme,
  radius: radiusTheme,
};

// 개별 타입 re-export
export type { ColorTheme, RadiusTheme, TypographyTheme };
