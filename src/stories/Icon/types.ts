// Icon types
export type IconType =
  | 'tabler:check'
  | 'tabler:x'
  | 'tabler:plus'
  | 'tabler:minus'
  | 'tabler:arrow-right'
  | 'tabler:arrow-left'
  | 'tabler:arrow-up'
  | 'tabler:search'
  | 'tabler:settings'
  | 'tabler:user'
  | 'tabler:home'
  | 'tabler:menu'
  | 'tabler:dots'
  | 'tabler:edit'
  | 'tabler:trash'
  | 'tabler:download'
  | 'tabler:upload'
  | 'tabler:tag'
  | 'tabler:device-laptop'
  | 'tabler:device-desktop'
  | 'tabler:heart'
  | 'tabler:heart-filled'
  | 'tabler:shopping-cart'
  | 'tabler:shopping-bag'
  | 'tabler:share'
  | 'tabler:message'
  | 'tabler:message-circle';

// 시맨틱 토큰 이름 또는 커스텀 컬러 값(hex, rgb)을 모두 허용
export type IconColorPreset =
  | 'primary'
  | 'secondary'
  | 'warning'
  | 'success'
  | 'danger';
export type IconColor = IconColorPreset | string;

export type IconProps = {
  /** 아이콘 이름 (tabler 아이콘 사용) */
  name: IconType;
  /** 아이콘 크기 (px) */
  size?: number;
  /** 아이콘 색상 - 시맨틱 토큰(primary, secondary, warning, success, danger) 또는 hex/rgb 값 */
  color?: IconColor;
  /** 추가 클래스명 */
  className?: string;
};

// Storybook을 위한 options 배열
export const ICON_COLOR_PRESETS: IconColorPreset[] = [
  'primary',
  'secondary',
  'warning',
  'success',
  'danger',
];
