// Icon.tsx
import { Icon as IconifyIcon } from '@iconify/react';
import { IconProps } from './types';
import { theme } from '../../tokens/auto';

export type { IconType } from './types';

// 시맨틱 컬러 프리셋별 컬러 매핑
const getIconColor = (color?: string): string | undefined => {
  if (!color) return undefined;

  // 시맨틱 토큰 매핑
  const colorPresets: Record<string, string> = {
    primary: theme.brand1.btn.primaryDefault,
    secondary: theme.brand1.icon.primary,
    warning: '#ffb020',
    success: theme.brand1.status.possitiveIcon,
    danger: theme.brand1.status.negativeIcon,
  };

  // 시맨틱 토큰이면 해당 색상 반환
  if (colorPresets[color]) {
    return colorPresets[color];
  }

  // 커스텀 컬러면 그대로 반환
  return color;
};

const Icon = ({ name, size = 20, color, className }: IconProps) => {
  const iconColor = getIconColor(color);

  return (
    <IconifyIcon
      icon={name}
      width={size}
      height={size}
      color={iconColor}
      className={className}
    />
  );
};

export default Icon;
