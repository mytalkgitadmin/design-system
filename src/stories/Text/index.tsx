import React from 'react';

import { assignInlineVars } from '@vanilla-extract/dynamic';

import { useTheme } from '../../theme';
import {
  type TextProps,
  typographyPresets,
} from '../../tokens/dev/helpers/typography';

import { textStyle, textVars } from './Text.css';

export type { TextProps } from '../../tokens/dev/helpers/typography';

export const Text = ({
  preset,
  size,
  weight,
  lineHeight,
  letterSpacing,
  color,
  align,
  textWrap,
  wordBreak,
  underline = false,
  truncate = false,
  as,
  className,
  style,
  children = `[${preset}] ABC abc 가나다 123 !@#`,
}: TextProps) => {
  const { components } = useTheme();
  const textTheme = components.Text;

  // Preset이 있으면 preset 값을 기본으로 사용하고, 개별 속성이 있으면 오버라이드
  const presetValues = preset ? typographyPresets[preset] : undefined;

  const finalSize = size ?? presetValues?.size ?? 16;
  const finalWeight = weight ?? presetValues?.weight ?? 'regular';
  const finalLineHeight = lineHeight ?? presetValues?.lineHeight ?? 'normal';
  const finalLetterSpacing =
    letterSpacing ?? presetValues?.letterSpacing ?? 'normal';
  const finalColor = color ?? textTheme.defaultColor;

  // HTML 태그 결정: as prop > preset 기본값 > 'p'
  const Component = as || presetValues?.element || 'p';

  // Truncate 스타일 처리
  const getTruncateStyle = (): React.CSSProperties => {
    if (!truncate) return {};

    // truncate가 true 또는 1인 경우: 1줄 말줄임
    if (truncate === true || truncate === 1) {
      return {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      };
    }

    // truncate가 2 이상인 경우: 다중 라인 말줄임
    return {
      display: '-webkit-box',
      WebkitBoxOrient: 'vertical',
      WebkitLineClamp: truncate,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    };
  };

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
    ...(textWrap && { textWrap }),
    ...(wordBreak && { wordBreak }),
    ...(underline && { underline: true }),
  });

  return React.createElement(
    Component,
    {
      className: `${styleClass} ${className || ''}`.trim(),
      style: { ...vars, ...getTruncateStyle(), ...style },
    },
    children
  );
};
