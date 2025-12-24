/**
 * Theme 시스템의 핵심 타입 정의
 */

import type { ButtonTheme } from './components/button';
import type { IconTheme } from './components/icon';
import type { InputTheme } from './components/input';
import type { TextTheme } from './components/text';
import type { GlobalTheme } from './global';

/**
 * 전체 Theme 구조
 * - global: 모든 컴포넌트에서 공통으로 사용하는 디자인 토큰
 * - components: 각 컴포넌트별 기본값 및 정책
 */
export type Theme = {
  global: GlobalTheme;
  components: {
    Button: ButtonTheme;
    Icon: IconTheme;
    Input: InputTheme;
    Text: TextTheme;
  };
};

/**
 * DeepPartial 유틸리티 타입
 * createTheme에서 부분 override를 위해 사용
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
