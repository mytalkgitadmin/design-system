import React from 'react';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import { textStyle, textVars } from './Text.css';
import { TextProps, TextPreset, TextElement } from './types';
import { theme } from '../../tokens';

export type { TextProps } from './types';

// Preset 설정 - 자주 쓰는 스타일 조합 정의
const textPresets: Record<
  TextPreset,
  Partial<Pick<TextProps, 'size' | 'weight' | 'lineHeight' | 'letterSpacing'>>
> = {
  // Display 프리셋
  display1: {
    size: '4xl',
    weight: 'bold',
    lineHeight: 'tight',
    letterSpacing: 'tight',
  },
  display2: {
    size: '3xl',
    weight: 'bold',
    lineHeight: 'tight',
    letterSpacing: 'tight',
  },
  display3: {
    size: '2xl',
    weight: 'bold',
    lineHeight: 'tight',
    letterSpacing: 'tight',
  },
  display4: {
    size: 'xl',
    weight: 'bold',
    lineHeight: 'tight',
    letterSpacing: 'normal',
  },

  // Title 프리셋
  title1: {
    size: 'lg',
    weight: 'semibold',
    lineHeight: 'tight',
    letterSpacing: 'normal',
  },
  title2: {
    size: 'md',
    weight: 'semibold',
    lineHeight: 'normal',
    letterSpacing: 'normal',
  },
  title3: {
    size: 'sm',
    weight: 'semibold',
    lineHeight: 'normal',
    letterSpacing: 'normal',
  },

  // Body 프리셋
  body1: {
    size: 'base',
    weight: 'regular',
    lineHeight: 'normal',
    letterSpacing: 'normal',
  },
  body2: {
    size: 'default',
    weight: 'regular',
    lineHeight: 'normal',
    letterSpacing: 'normal',
  },
  body3: {
    size: 'xs',
    weight: 'regular',
    lineHeight: 'normal',
    letterSpacing: 'normal',
  },
  body4: {
    size: '2xs',
    weight: 'regular',
    lineHeight: 'relaxed',
    letterSpacing: 'normal',
  },

  // Caption 프리셋
  caption1: {
    size: '2xs',
    weight: 'regular',
    lineHeight: 'normal',
    letterSpacing: 'wide',
  },
  caption2: {
    size: '3xs',
    weight: 'regular',
    lineHeight: 'normal',
    letterSpacing: 'wide',
  },
};

// Preset별 기본 HTML 태그 매핑
const presetElements: Record<TextPreset, TextElement> = {
  display1: 'h2',
  display2: 'h2',
  display3: 'h2',
  display4: 'h2',
  title1: 'h2',
  title2: 'h3',
  title3: 'h4',
  body1: 'p',
  body2: 'p',
  body3: 'p',
  body4: 'p',
  caption1: 'span',
  caption2: 'span',
};

const Text = ({
  preset,
  size,
  weight,
  lineHeight,
  letterSpacing,
  color = theme.brand1.text.title,
  align,
  underline = false,
  truncate = false,
  as,
  className,
  style,
  children,
}: TextProps) => {
  // Preset이 있으면 preset 값을 기본으로 사용하고, 개별 속성이 있으면 오버라이드
  const presetValues = preset ? textPresets[preset] : {};

  const finalSize = size ?? presetValues.size ?? 'default';
  const finalWeight = weight ?? presetValues.weight ?? 'regular';
  const finalLineHeight = lineHeight ?? presetValues.lineHeight ?? 'normal';
  const finalLetterSpacing =
    letterSpacing ?? presetValues.letterSpacing ?? 'normal';
  const finalColor = color;

  // HTML 태그 결정: as prop > preset 기본값 > 'p'
  const Component = as || (preset ? presetElements[preset] : 'p');

  // 동적 스타일 변수 (color)
  const vars = assignInlineVars({
    [textVars.textColor]: finalColor,
  });

  // 스타일 클래스 생성
  const styleClass = textStyle({
    size: finalSize,
    weight: finalWeight,
    lineHeight: finalLineHeight,
    letterSpacing: finalLetterSpacing,
    ...(align && { align }),
    ...(underline && { underline: true }),
    ...(truncate && { truncate: true }),
  });

  return React.createElement(
    Component,
    {
      className: `${styleClass} ${className || ''}`.trim(),
      style: { ...vars, ...style },
    },
    children
  );
};

export default Text;
