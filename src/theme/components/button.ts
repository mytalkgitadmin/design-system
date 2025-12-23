/**
 * Button 컴포넌트 테마
 * Button의 기본 동작과 스타일 정책을 정의
 */

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ButtonVariant = 'solid' | 'outline';

/**
 * 컬러 스킴 정의
 * default: 기본 상태
 * hover: 마우스 오버 상태
 * active: 클릭/활성화 상태
 * text: 텍스트 색상
 */
export type ColorScheme = {
  default: string;
  hover: string;
  active: string;
  text: string;
};

export type ButtonTheme = {
  defaultSize: ButtonSize;
  defaultVariant: ButtonVariant;
  radius?: number; // undefined면 global.radius.sm 사용
  fontWeight?: number; // undefined면 global.typography.fontWeight.semibold 사용

  colorSchemes: {
    primary: ColorScheme;
    secondary: ColorScheme;
  };
};

export const buttonTheme: ButtonTheme = {
  defaultSize: 'md',
  defaultVariant: 'solid',
  // radius: undefined, // global.radius.sm 사용
  // fontWeight: undefined, // global.typography.fontWeight.semibold 사용

  colorSchemes: {
    primary: {
      default: '#4f7cff',
      hover: '#2747be',
      active: '#1a318b',
      text: '#ffffff',
    },
    secondary: {
      default: '#edf0f5',
      hover: '#e3e6ee',
      active: '#c5c9d3',
      text: '#697180',
    },
  },
};
