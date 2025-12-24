import React from 'react';

import { assignInlineVars } from '@vanilla-extract/dynamic';

import { useTheme } from '../../theme';
import { Icon } from '../Icon';
import { ButtonProps } from './types';

import { buttonStyle, buttonVars } from './Button.css';

export type { ButtonProps } from './types';

const iconSize = {
  xs: 16,
  sm: 18,
  md: 20,
  lg: 24,
  xl: 24,
};

export const Button = ({
  leftIcon,
  rightIcon,
  icon,
  variant,
  color = 'primary',
  size,
  type = 'button',
  label,
  full = false,
  disabled = false,
  onClick,
  as,
  href,
  target,
}: ButtonProps) => {
  const { global, components } = useTheme();
  const buttonTheme = components.Button;

  const Component = as === 'a' ? 'a' : 'button';

  // 우선순위: props > component theme > global theme
  const finalSize = size ?? buttonTheme.defaultSize;
  const finalVariant = variant ?? buttonTheme.defaultVariant;
  const finalRadius = buttonTheme.radius ?? global.radius.sm;
  const finalFontWeight =
    buttonTheme.fontWeight ?? global.typography.fontWeight.semibold;

  // 컬러 스킴 가져오기
  // 1. Theme에 정의된 프리셋인지 확인
  const colorScheme =
    buttonTheme.colorSchemes[color as keyof typeof buttonTheme.colorSchemes];

  // 2. 프리셋이 없으면 커스텀 컬러로 처리
  const finalColorScheme = colorScheme ?? {
    default: color,
    hover: color,
    active: color,
    text: color,
  };

  // CSS Variables 주입
  const vars = assignInlineVars({
    [buttonVars.defaultColor]: finalColorScheme.default,
    [buttonVars.hoverColor]: finalColorScheme.hover,
    [buttonVars.activeColor]: finalColorScheme.active,
    [buttonVars.textColor]: finalColorScheme.text,
    [buttonVars.fontFamily]: global.typography.fontFamily,
    [buttonVars.fontWeight]: String(finalFontWeight),
    [buttonVars.borderRadius]: `${finalRadius}px`,
    [buttonVars.disabledBgColor]: global.color.bg.disabled,
    [buttonVars.disabledTextColor]: global.color.text.disabled,
  });

  return React.createElement(Component, {
    type: { type },
    className: `${buttonStyle({
      variant: finalVariant,
      size: finalSize,
      full,
      leftIcon: !!leftIcon,
      rightIcon: !!rightIcon,
      icon: !!icon,
    })}`,
    style: { ...vars },
    onClick: onClick,
    disabled: disabled,
    target: target,
    href: href,
    children: (
      <>
        {leftIcon && <Icon name={leftIcon} size={iconSize[finalSize]} />}
        {icon ? <Icon name={icon} size={iconSize[finalSize]} /> : label}
        {rightIcon && <Icon name={rightIcon} size={iconSize[finalSize]} />}
      </>
    ),
  });
};
