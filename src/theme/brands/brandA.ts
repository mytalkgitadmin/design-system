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
    Input: {
      // labelFontSize는 선택사항 - 정의하지 않으면 global.typography.fontSize 사용
      // labelFontSize: {
      //   xs: 12,
      //   sm: 13,
      //   md: 14,
      //   lg: 16,
      //   xl: 16,
      // },
      colorSchemes: {
        primary: {
          // default, hover, error는 defaultTheme의 global 색상 사용
          focus: theme.brand1.default, // Brand A의 focus 색상
          focusShadow: `${theme.brand1.default}80`, // Brand A의 focus shadow (투명도 50%)
        },
        secondary: {
          // default, hover, error는 defaultTheme의 global 색상 사용
          focus: theme.brand1.subtle, // Brand A의 secondary focus 색상
          focusShadow: `${theme.brand1.subtle}80`,
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
