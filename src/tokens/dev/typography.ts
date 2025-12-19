/**
 * Typography Scales
 * CSS 레벨에서 관리하는 타이포그래피 스케일
 * 피그마 토큰(font.json)과 분리하여 개발용으로 관리
 */

export const fontSize = {
  56: '5.6rem',
  44: '4.4rem',
  40: '4.0rem',
  32: '3.2rem',
  26: '2.6rem',
  22: '2.2rem',
  20: '2.0rem',
  18: '1.8rem',
  16: '1.6rem',
  15: '1.5rem',
  14: '1.4rem',
  13: '1.3rem',
  12: '1.2rem',
  11: '1.1rem',
} as const;

export const lineHeight = {
  tight: 1.2,
  normal: 1.4,
  relaxed: 1.5,
} as const;

export const letterSpacing = {
  tight: '-0.1rem',
  normal: '0',
  wide: '0.1rem',
} as const;

export const fontWeight = {
  regular: 'regular',
  semibold: 'semibold',
  bold: 'bold',
} as const;

export const textAlign = {
  left: 'left',
  center: 'center',
  right: 'right',
  justify: 'justify',
} as const;

export const textWrap = {
  wrap: 'wrap',
  nowrap: 'nowrap',
  balance: 'balance',
  pretty: 'pretty',
} as const;

export const wordBreak = {
  normal: 'normal',
  breakAll: 'break-all',
  keepAll: 'keep-all',
  breakWord: 'break-word',
} as const;

export const textElement = {
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  p: 'p',
  label: 'label',
  span: 'span',
  div: 'div',
} as const;

// 타입 export
export type FontSize = keyof typeof fontSize;
export type LineHeight = keyof typeof lineHeight;
export type LetterSpacing = keyof typeof letterSpacing;
export type FontWeight = keyof typeof fontWeight;
export type TextAlign = keyof typeof textAlign;
export type TextWrap = keyof typeof textWrap;
export type WordBreak = keyof typeof wordBreak;
export type TextElement = keyof typeof textElement;

/**
 * Typography Presets
 * 자주 사용하는 타이포그래피 스타일 조합
 */
export interface TypographyPreset {
  size: FontSize;
  weight: FontWeight;
  lineHeight: LineHeight;
  letterSpacing: LetterSpacing;
  element: TextElement; // 기본 HTML 태그
  textAlign?: TextAlign;
  textWrap?: TextWrap;
  wordBreak?: WordBreak;
}

export const typographyPresets = {
  // Display 프리셋 - 큰 제목
  display1: {
    size: 56,
    weight: 'bold',
    lineHeight: 'tight',
    letterSpacing: 'tight',
    element: 'h2',
  },
  display2: {
    size: 44,
    weight: 'bold',
    lineHeight: 'tight',
    letterSpacing: 'tight',
    element: 'h2',
  },

  // Title 프리셋 - 중간 제목
  title1: {
    size: 40,
    weight: 'bold',
    lineHeight: 'tight',
    letterSpacing: 'normal',
    element: 'h2',
  },
  title2: {
    size: 32,
    weight: 'bold',
    lineHeight: 'tight',
    letterSpacing: 'normal',
    element: 'h3',
  },
  title3: {
    size: 26,
    weight: 'bold',
    lineHeight: 'tight',
    letterSpacing: 'normal',
    element: 'h4',
  },
  title4: {
    size: 22,
    weight: 'semibold',
    lineHeight: 'tight',
    letterSpacing: 'normal',
    element: 'h5',
  },
  title5: {
    size: 20,
    weight: 'semibold',
    lineHeight: 'tight',
    letterSpacing: 'normal',
    element: 'h6',
  },

  // SubTitle 프리셋 - 중간 제목
  subTitle1: {
    size: 18,
    weight: 'semibold',
    lineHeight: 'normal',
    letterSpacing: 'normal',
    element: 'h3',
  },
  subTitle2: {
    size: 16,
    weight: 'semibold',
    lineHeight: 'normal',
    letterSpacing: 'normal',
    element: 'h4',
  },
  subTitle3: {
    size: 14,
    weight: 'semibold',
    lineHeight: 'normal',
    letterSpacing: 'wide',
    element: 'h5',
  },

  // Body 프리셋 - 본문
  body1: {
    size: 18,
    weight: 'regular',
    lineHeight: 'normal',
    letterSpacing: 'normal',
    element: 'p',
  },
  body2: {
    size: 16,
    weight: 'regular',
    lineHeight: 'normal',
    letterSpacing: 'normal',
    element: 'p',
  },
  body3: {
    size: 15,
    weight: 'regular',
    lineHeight: 'normal',
    letterSpacing: 'normal',
    element: 'p',
  },
  body4: {
    size: 13,
    weight: 'regular',
    lineHeight: 'normal',
    letterSpacing: 'wide',
    element: 'p',
  },

  // Caption 프리셋 - 작은 텍스트
  label1: {
    size: 15,
    weight: 'regular',
    lineHeight: 'normal',
    letterSpacing: 'normal',
    element: 'label',
  },
  label2: {
    size: 14,
    weight: 'regular',
    lineHeight: 'normal',
    letterSpacing: 'wide',
    element: 'label',
  },
  label3: {
    size: 13,
    weight: 'regular',
    lineHeight: 'normal',
    letterSpacing: 'wide',
    element: 'label',
  },

  // Caption 프리셋 - 작은 텍스트
  caption1: {
    size: 12,
    weight: 'regular',
    lineHeight: 'normal',
    letterSpacing: 'wide',
    element: 'span',
  },
  caption2: {
    size: 12,
    weight: 'regular',
    lineHeight: 'normal',
    letterSpacing: 'wide',
    element: 'span',
  },
} as const satisfies Record<string, TypographyPreset>;

export type TypographyPresetName = keyof typeof typographyPresets;

/**
 * Storybook을 위한 options 배열
 * 객체의 키에서 자동 생성되므로 수동 관리 불필요
 */
export const fontSizeOptions = Object.keys(fontSize).map(Number) as FontSize[];
export const fontWeightOptions = Object.keys(fontWeight) as FontWeight[];
export const textAlignOptions = Object.keys(textAlign) as TextAlign[];
export const textWrapOptions = Object.keys(textWrap) as TextWrap[];
export const wordBreakOptions = Object.keys(wordBreak) as WordBreak[];
export const lineHeightOptions = Object.keys(lineHeight) as LineHeight[];
export const letterSpacingOptions = Object.keys(
  letterSpacing
) as LetterSpacing[];
export const presetOptions = Object.keys(
  typographyPresets
) as TypographyPresetName[];

/**
 * Text Component Props
 */
export interface TextProps {
  // Preset (선택사항 - preset을 사용하면 size, weight, lineHeight 자동 설정)
  preset?: TypographyPresetName;

  // 기본 스타일 속성 (개별 제어 가능, preset 오버라이드 가능)
  size?: FontSize;
  weight?: FontWeight;
  lineHeight?: LineHeight;
  letterSpacing?: LetterSpacing;
  color?: string;
  align?: TextAlign;
  textWrap?: TextWrap;
  wordBreak?: WordBreak;

  // 추가 옵션
  underline?: boolean;
  truncate?: boolean | number; // true or 1: 1줄 말줄임, 2 이상: 다중 라인 말줄임

  // HTML 태그
  as?: TextElement;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}
