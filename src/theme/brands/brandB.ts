/**
 * Brand B Theme
 * Project B의 브랜드 테마 정의
 */

import { color } from 'storybook/theming';

import { rounded, theme } from '../../tokens';
import { createTheme } from '../createTheme';

export const brandBTheme = createTheme({
  global: {
    color: {
      brand: {
        default: theme.brand2.default,
        hover: theme.brand2.subtle,
        active: theme.brand2.strong,
        subtle: theme.brand2.subtle,
        strong: theme.brand2.strong,
        strongest: theme.brand2.strongest,
      },
    },
  },
  components: {
    Button: {
      radius: rounded.lg, // 완전한 라운드 스타일
      colorSchemes: {
        primary: {
          default: theme.brand2.default,
          hover: theme.brand2.subtle,
          active: theme.brand2.strong,
          text: color.inverseText,
        },
      },
    },
    Text: {
      colorSchemes: {
        brand1: theme.brand2.default, // Brand B의 primary 브랜드 컬러
        brand2: theme.brand2.subtle, // Brand B의 secondary 브랜드 컬러
      },
    },
  },
});
