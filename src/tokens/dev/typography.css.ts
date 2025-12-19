/**
 * Typography Utility Classes
 * typography.ts에서 자동 생성되는 유틸리티 클래스
 */
import { styleVariants } from '@vanilla-extract/css';
import * as typography from './typography';

// Font Size utilities
export const textSize = styleVariants(typography.fontSize, (value) => ({
  fontSize: value,
}));

// Font Weight utilities
export const fontWeight = styleVariants(typography.fontWeight, (value) => ({
  fontWeight: value,
}));

// Line Height utilities
export const lineHeight = styleVariants(typography.lineHeight, (value) => ({
  lineHeight: value,
}));

// Letter Spacing utilities
export const letterSpacing = styleVariants(typography.letterSpacing, (value) => ({
  letterSpacing: value,
}));

// Text Align utilities
export const textAlign = styleVariants(typography.textAlign, (value) => ({
  textAlign: value,
}));
