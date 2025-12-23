/**
 * Brand B Theme
 * Project B의 브랜드 테마 정의
 */

import { createTheme } from '../createTheme';

export const brandBTheme = createTheme({
  global: {
    color: {
      brand: {
        default: '#0066FF',
        hover: '#0052CC',
        active: '#0041A3',
        subtle: '#4D94FF',
        strong: '#0052CC',
        strongest: '#0041A3',
      },
    },
  },
  components: {
    Button: {
      radius: 999, // 완전한 라운드 스타일
      colorSchemes: {
        primary: {
          default: '#0066FF',
          hover: '#0052CC',
          active: '#0041A3',
          text: '#FFFFFF',
        },
      },
    },
  },
});
