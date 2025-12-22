import { createVar, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

import { font } from '../../tokens';
import * as typography from '../../tokens/dev/helpers/typography';

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
    // Weight 피그마 토큰
    weight: {
      regular: { fontWeight: font.weight.regular },
      semibold: { fontWeight: font.weight.semibold },
      bold: { fontWeight: font.weight.bold },
    },

    // Font Size (토큰에서 자동 생성)
    size: Object.fromEntries(
      Object.entries(typography.fontSize).map(([key, value]) => [
        key,
        { fontSize: value },
      ])
    ) as Record<typography.FontSize, { fontSize: string }>,

    // Line Height (토큰에서 자동 생성)
    lineHeight: Object.fromEntries(
      Object.entries(typography.lineHeight).map(([key, value]) => [
        key,
        { lineHeight: value },
      ])
    ) as Record<typography.LineHeight, { lineHeight: number }>,

    // Letter Spacing (토큰에서 자동 생성)
    letterSpacing: Object.fromEntries(
      Object.entries(typography.letterSpacing).map(([key, value]) => [
        key,
        { letterSpacing: value },
      ])
    ) as Record<typography.LetterSpacing, { letterSpacing: string }>,

    // Align (토큰에서 자동 생성)
    align: Object.fromEntries(
      Object.entries(typography.textAlign).map(([key, value]) => [
        key,
        { textAlign: value as 'left' | 'center' | 'right' | 'justify' },
      ])
    ) as Record<
      typography.TextAlign,
      { textAlign: 'left' | 'center' | 'right' | 'justify' }
    >,

    // Text Wrap (토큰에서 자동 생성)
    textWrap: Object.fromEntries(
      Object.entries(typography.textWrap).map(([key, value]) => [
        key,
        { textWrap: value as 'wrap' | 'nowrap' | 'balance' | 'pretty' },
      ])
    ) as Record<
      typography.TextWrap,
      { textWrap: 'wrap' | 'nowrap' | 'balance' | 'pretty' }
    >,

    // Word Break (토큰에서 자동 생성)
    wordBreak: Object.fromEntries(
      Object.entries(typography.wordBreak).map(([key, value]) => [
        key,
        {
          wordBreak: value as
            | 'normal'
            | 'break-all'
            | 'keep-all'
            | 'break-word',
        },
      ])
    ) as Record<
      typography.WordBreak,
      { wordBreak: 'normal' | 'break-all' | 'keep-all' | 'break-word' }
    >,

    // Underline
    underline: {
      true: {
        textDecoration: 'underline',
        textUnderlineOffset: '4px',
      },
    },
  },

  defaultVariants: {
    size: 16,
    weight: 'regular',
    lineHeight: 'normal',
    letterSpacing: 'normal',
  },
});

// vars 객체 export
export const textVars = {
  textColor: textColorVar,
};
