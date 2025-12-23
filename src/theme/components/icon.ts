/**
 * Icon 컴포넌트 테마
 * Icon의 기본 크기와 색상 정책을 정의
 */

export type IconTheme = {
  defaultSize: number;
  defaultColor: string;

  colorPresets: {
    primary: string;
    warning: string;
    success: string;
    danger: string;
  };
};

export const iconTheme: IconTheme = {
  defaultSize: 20,
  defaultColor: '#4b5465',

  colorPresets: {
    primary: '#4f7cff',
    warning: '#ffb020',
    success: '#1fa45c',
    danger: '#e6374f',
  },
};
