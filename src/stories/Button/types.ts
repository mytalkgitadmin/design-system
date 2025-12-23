// Button types
import { IconType } from '../Icon';

export type ButtonVariant = 'solid' | 'outline';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ButtonType = 'button' | 'submit';

// 시맨틱 토큰 이름 또는 커스텀 컬러 값(hex, rgb)을 모두 허용
export type ButtonColorPreset = 'primary' | 'secondary';
export type ButtonColor = ButtonColorPreset | string;

export type ButtonColorScheme = {
  default: string;
  hover: string;
  active: string;
  text: string;
};

export type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  color?: ButtonColor;
  full?: boolean;
  type?: ButtonType;

  label: string;
  disabled?: boolean;
  onClick?: () => void;

  icon?: IconType;
  leftIcon?: IconType;
  rightIcon?: IconType;

  as?: 'a';
  href?: string;
  target?: '_blank' | '_self';
};

// Storybook을 위한 options 배열
export const BUTTON_VARIANTS: ButtonVariant[] = ['solid', 'outline'];
export const BUTTON_SIZES: ButtonSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];
export const BUTTON_TYPES: ButtonType[] = ['button', 'submit'];
export const BUTTON_COLOR_PRESETS: ButtonColorPreset[] = [
  'primary',
  'secondary',
];
