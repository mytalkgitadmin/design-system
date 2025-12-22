import { assignInlineVars } from '@vanilla-extract/dynamic';

import { theme } from '../../tokens';
import { Icon } from '../Icon';
import { ButtonColorScheme, ButtonProps } from './types';

import { buttonStyle, buttonVars } from './Button.css';

export type { ButtonProps } from './types';

// 시맨틱 컬러 프리셋별 컬러 스킴 매핑
const getColorScheme = (color: string): ButtonColorScheme => {
  // 시맨틱 토큰 매핑
  const colorPresets: Record<string, ButtonColorScheme> = {
    primary: {
      default: theme.brand.default,
      hover: theme.brand.subtle,
      active: theme.brand.strong,
    },
    // secondary: {
    //   default: theme.brand.default,
    //   hover: theme.brand.subtle,
    //   active: theme.brand.strong,
    // },
    warning: {
      default: '#ffb020',
      hover: '#cc8a18',
      active: '#996713',
    },
    success: {
      default: '#0d964f',
      hover: '#17824a',
      active: '#10613a',
    },
    danger: {
      default: '#d81633',
      hover: '#c8263d',
      active: '#c8263d',
    },
  };

  // 시맨틱 토큰이면 해당 스킴 반환
  if (colorPresets[color]) {
    return colorPresets[color];
  }

  // 커스텀 컬러면 동일한 색상 사용 (hover/active 구분 없음)
  return {
    default: color,
    hover: color,
    active: color,
  };
};

export const Button = ({
  leftIcon,
  variant = 'solid',
  color = 'primary',
  size = 'md',
  type = 'button',
  label,
  full = false,
  disabled = false,
  onClick,
}: ButtonProps) => {
  const colorScheme = getColorScheme(color);

  const vars = assignInlineVars({
    [buttonVars.defaultColor]: colorScheme.default,
    [buttonVars.hoverColor]: colorScheme.hover,
    [buttonVars.activeColor]: colorScheme.active,
    [buttonVars.textColor]:
      variant === 'solid' ? '#ffffff' : colorScheme.default,
    [buttonVars.disabledColor]: '#eee',
  });

  return (
    <button
      type={type}
      className={buttonStyle({
        variant,
        size,
        full,
        withIcon: !!leftIcon,
      })}
      style={vars}
      onClick={onClick}
      disabled={disabled}
    >
      {leftIcon && <Icon name={leftIcon} size={16} />}
      <span>{label}</span>
    </button>
  );
};
