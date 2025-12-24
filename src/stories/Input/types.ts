// Input types
import { IconType } from '../Icon';

export type InputSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type InputType = 'text' | 'password' | 'email' | 'tel' | 'number';

// 시맨틱 토큰 이름 또는 커스텀 컬러 값(hex, rgb)을 모두 허용
export type InputColorPreset = 'primary' | 'secondary';
export type InputColor = InputColorPreset | string;

// Input 상태 타입
export type InputStatus = 'help' | 'success' | 'warn' | 'error';

export type InputColorScheme = {
  default: string;
  hover: string;
  focus: string;
  focusShadow: string;
  error: string;
};

export type InputProps = {
  // Appearance
  size?: InputSize;
  color?: InputColor;
  full?: boolean;

  // Label & Helper Text
  label: string; // 접근성을 위해 필수값
  hiddenLabel?: boolean; // true일 경우 시각적으로만 숨김 (스크린 리더에서는 읽힘)
  required?: boolean;

  // Status & Message
  status?: InputStatus; // help, success, warn, error
  statusMessage?: string; // 상태 메시지
  showStatusIcon?: boolean; // 상태 아이콘 표시 여부 (기본: false)

  // Icons
  leftIcon?: IconType;
  rightIcon?: IconType;
  onLeftIconClick?: () => void; // leftIcon 클릭 핸들러
  onRightIconClick?: () => void; // rightIcon 클릭 핸들러

  // State
  disabled?: boolean;
  error?: boolean;

  // HTML Input Props
  type?: InputType;
  placeholder?: string;
  value?: string | number;
  defaultValue?: string | number;
  name?: string;
  id?: string;
  min?: number;
  max?: number;

  // Style
  textAlign?: 'left' | 'center' | 'right';

  // Event Handlers
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
};

// Storybook을 위한 options 배열
export const INPUT_SIZES: InputSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];
export const INPUT_TYPES: InputType[] = [
  'text',
  'password',
  'email',
  'tel',
  'number',
];
export const INPUT_COLOR_PRESETS: InputColorPreset[] = ['primary', 'secondary'];
