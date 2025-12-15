import { createGlobalTheme } from '@vanilla-extract/css';

/**
 * Figma tokens.json 파일을 기반으로 생성된 디자인 토큰
 * Primitive 토큰: 가장 기본이 되는 색상, 크기 등의 값
 */

// Primitive 토큰
export const primitiveTokens = createGlobalTheme(':root', {
  color: {
    blue: {
      50: '#c0daff',
      100: '#006aff',
    },
    green: {
      100: '#00ff62',
    },
    gray: {
      100: '#333333',
    },
    white: '#ffffff',
  },
  scale: {
    2: '2px',
    4: '4px',
    8: '8px',
    12: '12px',
    14: '14px',
    16: '16px',
    20: '20px',
    24: '24px',
  },
  font: {
    size: {
      xs: '12px',
      sm: '14px',
      md: '16px',
      lg: '20px',
      xl: '24px',
    },
    weight: {
      300: '300',
      400: '400',
      500: '500',
      600: '600',
      700: '700',
    },
    family: {
      primary: 'Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
    },
  },
  opacity: {
    0: '0',
    50: '0.5',
    60: '0.6',
    100: '1',
  },
});

/**
 * Semantic 토큰: 용도에 따라 의미를 부여한 토큰
 * 예: primary, success 등
 */
export const semanticTokens = createGlobalTheme(':root', {
  color: {
    primary: {
      main: primitiveTokens.color.blue[50],
    },
    success: {
      main: primitiveTokens.color.blue[50],
    },
  },
  button: {
    solid: {
      bg: primitiveTokens.color.blue[100],
      bgHover: primitiveTokens.color.blue[100],
      bgActive: primitiveTokens.color.blue[100],
      text: primitiveTokens.color.white,
    },
  },
  spacing: {
    xs: primitiveTokens.scale[4],
  },
});
