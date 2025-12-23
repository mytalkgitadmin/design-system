/**
 * Brand A Theme
 * Project A의 브랜드 테마 정의
 */

import { createTheme } from '../createTheme';

export const brandATheme = createTheme({
  global: {
    color: {
      brand: {
        default: '#FFD400',
        hover: '#E6C000',
        active: '#CCB000',
        subtle: '#FFF4B3',
        strong: '#E6C000',
        strongest: '#CCB000',
      },
    },
  },
  components: {
    Button: {
      radius: 0, // 직각 스타일
      colorSchemes: {
        primary: {
          default: '#FFD400',
          hover: '#E6C000',
          active: '#CCB000',
          text: '#000000',
        },
      },
    },
  },
});
