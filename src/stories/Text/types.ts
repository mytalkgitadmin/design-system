// Text 컴포넌트 타입 정의

// 독립적인 속성 타입
export type TextSize =
  | '4xl'
  | '3xl'
  | '2xl'
  | 'xl'
  | 'lg'
  | 'md'
  | 'sm'
  | 'base'
  | 'default'
  | 'xs'
  | '2xs'
  | '3xs';
export type TextWeight = 'regular' | 'semibold' | 'bold';
export type TextAlign = 'left' | 'center' | 'right';
export type TextLineHeight = 'tight' | 'normal' | 'relaxed';
export type TextLetterSpacing = 'tight' | 'normal' | 'wide';

// HTML 엘리먼트 타입
export type TextElement =
  | 'p'
  | 'span'
  | 'div'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'label'
  | 'a';

// Preset 타입 (자주 쓰는 조합)
export type TextPreset =
  | 'display1'
  | 'display2'
  | 'display3'
  | 'display4'
  | 'title1'
  | 'title2'
  | 'title3'
  | 'body1'
  | 'body2'
  | 'body3'
  | 'body4'
  | 'caption1'
  | 'caption2';

// Text Props
export interface TextProps {
  // Preset (선택사항 - preset을 사용하면 size, weight, lineHeight 자동 설정)
  preset?: TextPreset;

  // 기본 스타일 속성 (개별 제어 가능, preset 오버라이드 가능)
  size?: TextSize;
  weight?: TextWeight;
  lineHeight?: TextLineHeight;
  letterSpacing?: TextLetterSpacing;

  color?: string;
  align?: TextAlign;

  // 추가 옵션
  underline?: boolean;
  truncate?: boolean;

  // HTML 태그
  as?: TextElement;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

// Storybook을 위한 options 배열
export const TEXT_SIZES: TextSize[] = [
  '4xl',
  '3xl',
  '2xl',
  'xl',
  'lg',
  'md',
  'sm',
  'base',
  'default',
  'xs',
  '2xs',
  '3xs',
];
export const TEXT_WEIGHTS: TextWeight[] = ['regular', 'semibold', 'bold'];
export const TEXT_ALIGNS: TextAlign[] = ['left', 'center', 'right'];
export const TEXT_LINE_HEIGHTS: TextLineHeight[] = [
  'tight',
  'normal',
  'relaxed',
];
export const TEXT_LETTER_SPACINGS: TextLetterSpacing[] = [
  'tight',
  'normal',
  'wide',
];
export const TEXT_PRESETS: TextPreset[] = [
  'display1',
  'display2',
  'display3',
  'display4',
  'title1',
  'title2',
  'title3',
  'body1',
  'body2',
  'body3',
  'body4',
  'caption1',
  'caption2',
];
