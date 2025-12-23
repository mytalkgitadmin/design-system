/**
 * Default Theme
 * Design System의 기본 테마
 * 프로젝트는 이 테마를 기반으로 커스터마이징
 */

import { buttonTheme, iconTheme, textTheme } from './components';
import { globalTheme } from './global';

import type { Theme } from './types';

export const defaultTheme: Theme = {
  global: globalTheme,
  components: {
    Button: buttonTheme,
    Icon: iconTheme,
    Text: textTheme,
  },
};
