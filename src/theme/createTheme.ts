/**
 * createTheme 함수
 * 프로젝트가 커스텀 Theme를 생성할 수 있도록 지원
 *
 * @example
 * ```ts
 * const projectATheme = createTheme({
 *   components: {
 *     Button: {
 *       defaultSize: 'lg',
 *       radius: 0,
 *     }
 *   }
 * });
 * ```
 */

import { defaultTheme } from './defaultTheme';

import type { DeepPartial, Theme } from './types';

/**
 * Deep merge 유틸리티 함수
 * 중첩된 객체를 재귀적으로 병합
 */
function deepMerge<T extends object>(target: T, source: DeepPartial<T>): T {
  const output = { ...target };

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      const sourceValue = source[key as keyof typeof source];
      const targetValue = target[key as keyof T];

      if (isObject(sourceValue) && isObject(targetValue)) {
        // @ts-expect-error - Deep merge type complexity
        output[key as keyof T] = deepMerge(targetValue, sourceValue);
      } else if (sourceValue !== undefined) {
        // @ts-expect-error - Deep merge type complexity
        output[key as keyof T] = sourceValue;
      }
    });
  }

  return output;
}

function isObject(item: unknown): item is Record<string, unknown> {
  return item !== null && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Theme 생성 함수
 * defaultTheme을 기반으로 부분적으로 override된 새로운 Theme를 생성
 */
export function createTheme(overrides?: DeepPartial<Theme>): Theme {
  if (!overrides) {
    return defaultTheme;
  }

  return deepMerge(defaultTheme, overrides);
}
