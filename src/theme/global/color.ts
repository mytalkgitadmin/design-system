/**
 * Color 전역 테마
 * 브랜드 컬러, 텍스트 컬러, 배경 컬러 등을 정의
 */

export type ColorTheme = {
  brand: {
    default: string;
    hover: string;
    active: string;
    subtle: string;
    strong: string;
    strongest: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    muted: string;
    disabled: string;
    inverse: string;
    link: string;
    negative: string;
    positive: string;
    warning: string;
  };
  bg: {
    default: string;
    subtle: string;
    muted: string;
    disabled: string;
    inverse: string;
    gray: string;
    grayStrong: string;
    grayStrongest: string;
  };
  border: {
    default: string;
    strong: string;
    disabled: string;
    inverse: string;
  };
};

export const colorTheme: ColorTheme = {
  brand: {
    default: '#4f7cff',
    hover: '#355fea',
    active: '#1a318b',
    subtle: '#6f94ff',
    strong: '#355fea',
    strongest: '#1a318b',
  },
  text: {
    primary: '#2f3744',
    secondary: '#697180',
    tertiary: '#888e9c',
    muted: '#a6acb7',
    disabled: '#c5c9d3',
    inverse: '#ffffff',
    link: '#355fea',
    negative: '#e6374f',
    positive: '#1fa45c',
    warning: '#ffb020',
  },
  bg: {
    default: '#ffffff',
    subtle: '#f8f9fc',
    muted: '#f4f6fb',
    disabled: '#e3e6ee',
    inverse: '#2f3744',
    gray: '#edf0f5',
    grayStrong: '#e3e6ee',
    grayStrongest: '#c5c9d3',
  },
  border: {
    default: '#e3e6ee',
    strong: '#c5c9d3',
    disabled: '#e3e6ee',
    inverse: '#ffffff',
  },
};
