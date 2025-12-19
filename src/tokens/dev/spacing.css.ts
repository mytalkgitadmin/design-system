/**
 * Spacing Utility Classes
 * spacing.ts에서 자동 생성되는 유틸리티 클래스
 */
import { styleVariants } from '@vanilla-extract/css';
import * as spacingTokens from './spacing';

// Margin utilities
export const m = styleVariants(spacingTokens.spacing, (value) => ({
  margin: value,
}));

export const mt = styleVariants(spacingTokens.spacing, (value) => ({
  marginTop: value,
}));

export const mr = styleVariants(spacingTokens.spacing, (value) => ({
  marginRight: value,
}));

export const mb = styleVariants(spacingTokens.spacing, (value) => ({
  marginBottom: value,
}));

export const ml = styleVariants(spacingTokens.spacing, (value) => ({
  marginLeft: value,
}));

export const mx = styleVariants(spacingTokens.spacing, (value) => ({
  marginLeft: value,
  marginRight: value,
}));

export const my = styleVariants(spacingTokens.spacing, (value) => ({
  marginTop: value,
  marginBottom: value,
}));

// Padding utilities
export const p = styleVariants(spacingTokens.spacing, (value) => ({
  padding: value,
}));

export const pt = styleVariants(spacingTokens.spacing, (value) => ({
  paddingTop: value,
}));

export const pr = styleVariants(spacingTokens.spacing, (value) => ({
  paddingRight: value,
}));

export const pb = styleVariants(spacingTokens.spacing, (value) => ({
  paddingBottom: value,
}));

export const pl = styleVariants(spacingTokens.spacing, (value) => ({
  paddingLeft: value,
}));

export const px = styleVariants(spacingTokens.spacing, (value) => ({
  paddingLeft: value,
  paddingRight: value,
}));

export const py = styleVariants(spacingTokens.spacing, (value) => ({
  paddingTop: value,
  paddingBottom: value,
}));

// Gap utilities (Flexbox/Grid)
export const gap = styleVariants(spacingTokens.spacing, (value) => ({
  gap: value,
}));

export const rowGap = styleVariants(spacingTokens.spacing, (value) => ({
  rowGap: value,
}));

export const columnGap = styleVariants(spacingTokens.spacing, (value) => ({
  columnGap: value,
}));

// Inset Spacing utilities
export const inset = styleVariants(spacingTokens.insetSpacing, (value) => ({
  paddingTop: value.y,
  paddingBottom: value.y,
  paddingLeft: value.x,
  paddingRight: value.x,
}));
