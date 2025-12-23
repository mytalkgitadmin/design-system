/**
 * Typography 전역 테마
 * 폰트 패밀리, 크기, 행간 등을 정의
 */

export type TypographyTheme = {
  fontFamily: string;
  fontWeight: {
    regular: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  fontSize: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    '2xl': number;
    '3xl': number;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };
};

export const typographyTheme: TypographyTheme = {
  fontFamily: 'Pretendard',
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  fontSize: {
    xs: 11,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 20,
    '2xl': 26,
    '3xl': 32,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.8,
  },
};
