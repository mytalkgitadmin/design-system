/**
 * Brand A Theme
 * Project A의 브랜드 테마 정의
 */

import { color } from 'storybook/theming';

import { rounded, theme } from '../../tokens';
import { createTheme } from '../createTheme';

export const brandATheme = createTheme({
  global: {
    color: {
      brand: {
        default: theme.brand1.default,
        hover: theme.brand1.subtle,
        active: theme.brand1.strong,
        subtle: theme.brand1.subtle,
        strong: theme.brand1.strong,
        strongest: theme.brand1.strongest,
      },
    },
  },
  components: {
    Button: {
      radius: rounded.none,
      colorSchemes: {
        primary: {
          default: theme.brand1.default,
          hover: theme.brand1.subtle,
          active: theme.brand1.strong,
          text: color.inverseText,
        },
      },
    },
    Text: {
      colorSchemes: {
        brand1: theme.brand1.default, // Brand A의 primary 브랜드 컬러
        brand2: theme.brand1.subtle, // Brand A의 secondary 브랜드 컬러
      },
    },
  },
});
