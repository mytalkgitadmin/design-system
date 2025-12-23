// Icon.tsx
import { Icon as IconifyIcon } from '@iconify/react';

import { useTheme } from '../../theme';
import { IconProps } from './types';

export type { IconType } from './types';

export const Icon = ({ name, size, color, className }: IconProps) => {
  const { components } = useTheme();
  const iconTheme = components.Icon;

  // 우선순위: props > component theme
  const finalSize = size ?? iconTheme.defaultSize;

  // 컬러 처리
  // 1. color가 없으면 undefined (iconify 기본값 사용)
  // 2. color가 프리셋 이름이면 Theme에서 가져오기
  // 3. 커스텀 컬러면 그대로 사용
  let finalColor: string | undefined = undefined;

  if (color) {
    const presetColor =
      iconTheme.colorPresets[color as keyof typeof iconTheme.colorPresets];
    finalColor = presetColor ?? color;
  }

  return (
    <IconifyIcon
      icon={name}
      width={finalSize}
      height={finalSize}
      color={finalColor}
      className={className}
    />
  );
};
