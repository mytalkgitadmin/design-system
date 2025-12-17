import { createVar, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { font, typography } from '../../tokens';

// CSS 변수 정의
const textColorVar = createVar();

// 기본 텍스트 스타일
const baseText = style({
  fontFamily: font.family.Pretendard,
  margin: 0,
  padding: 0,
  color: textColorVar,
});

// Typography 스타일 레시피
export const textStyle = recipe({
  base: baseText,

  variants: {
    // Font Size (토큰 기반)
    size: {
      '4xl': { fontSize: typography.fontSize['4xl'] },
      '3xl': { fontSize: typography.fontSize['3xl'] },
      '2xl': { fontSize: typography.fontSize['2xl'] },
      xl: { fontSize: typography.fontSize.xl },
      lg: { fontSize: typography.fontSize.lg },
      md: { fontSize: typography.fontSize.md },
      sm: { fontSize: typography.fontSize.sm },
      base: { fontSize: typography.fontSize.base },
      default: { fontSize: typography.fontSize.default },
      xs: { fontSize: typography.fontSize.xs },
      '2xs': { fontSize: typography.fontSize['2xs'] },
      '3xs': { fontSize: typography.fontSize['3xs'] },
    },

    // Weight
    weight: {
      regular: { fontWeight: font.weight.regular },
      semibold: { fontWeight: font.weight.semibold },
      bold: { fontWeight: font.weight.bold },
    },

    // Line Height
    lineHeight: {
      tight: { lineHeight: typography.lineHeight.tight },
      normal: { lineHeight: typography.lineHeight.normal },
      relaxed: { lineHeight: typography.lineHeight.relaxed },
    },

    // Letter Spacing
    letterSpacing: {
      tight: { letterSpacing: typography.letterSpacing.tight },
      normal: { letterSpacing: typography.letterSpacing.normal },
      wide: { letterSpacing: typography.letterSpacing.wide },
    },

    // Align
    align: {
      left: { textAlign: 'left' },
      center: { textAlign: 'center' },
      right: { textAlign: 'right' },
    },

    // Underline
    underline: {
      true: {
        textDecoration: 'underline',
        textUnderlineOffset: '4px',
      },
    },

    // Truncate (말줄임)
    truncate: {
      true: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
    },
  },

  defaultVariants: {
    size: 'default',
    weight: 'regular',
    lineHeight: 'normal',
    letterSpacing: 'normal',
  },
});

// vars 객체 export
export const textVars = {
  textColor: textColorVar,
};
