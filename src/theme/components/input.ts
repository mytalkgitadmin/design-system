/**
 * Input 컴포넌트 테마
 * Input의 기본 동작과 스타일 정책을 정의
 */

import { colorTheme } from '../global/color';

export type InputSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * 컬러 스킴 정의
 * default: 기본 border 상태
 * hover: 마우스 오버 상태
 * focus: 포커스 상태
 * focusShadow: 포커스 시 그림자 색상 (opacity 포함)
 * error: 에러 상태
 */
export type InputColorScheme = {
  default: string;
  hover: string;
  focus: string;
  focusShadow: string;
  error: string;
};

/**
 * Label 폰트 크기 맵
 * Input size에 따른 Label 폰트 크기 정의
 */
export type InputLabelFontSize = {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
};

export type InputTheme = {
  defaultSize: InputSize;
  radius?: number; // undefined면 global.radius.sm 사용
  fontWeight?: number; // undefined면 global.typography.fontWeight.regular 사용
  labelFontSize?: InputLabelFontSize; // undefined면 기본값 사용

  colorSchemes: {
    primary: InputColorScheme;
    secondary: InputColorScheme;
  };
};

export const inputTheme: InputTheme = {
  defaultSize: 'md',
  // radius: undefined, // global.radius.sm 사용
  // fontWeight: undefined, // global.typography.fontWeight.regular 사용
  // labelFontSize: undefined, // 기본값 사용

  colorSchemes: {
    primary: {
      default: colorTheme.border.default, // #e3e6ee
      hover: colorTheme.border.strong, // #c5c9d3
      focus: colorTheme.brand.default, // #4f7cff
      focusShadow: `${colorTheme.brand.default}80`, // #4f7cff80
      error: colorTheme.text.negative, // #e6374f
    },
    secondary: {
      default: colorTheme.border.strong, // #c5c9d3
      hover: colorTheme.text.muted, // #a6acb7
      focus: colorTheme.brand.strong, // #355fea
      focusShadow: `${colorTheme.brand.strong}80`, // #355fea80
      error: colorTheme.text.negative, // #e6374f
    },
  },
};
