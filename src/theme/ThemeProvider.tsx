/**
 * ThemeProvider
 * Theme를 Context로 주입하고, 하위 컴포넌트에서 useTheme()으로 접근 가능
 */

import React, { createContext, useContext } from 'react';

import { defaultTheme } from './defaultTheme';

import type { Theme } from './types';

const ThemeContext = createContext<Theme | undefined>(undefined);

export type ThemeProviderProps = {
  theme?: Theme;
  children: React.ReactNode;
}

/**
 * ThemeProvider
 * 앱 전체 또는 특정 영역에 Theme를 주입
 *
 * @example
 * ```tsx
 * import { ThemeProvider } from '@bemily/design-system/theme';
 * import { projectATheme } from './theme';
 *
 * <ThemeProvider theme={projectATheme}>
 *   <App />
 * </ThemeProvider>
 * ```
 */
export const ThemeProvider = ({
  theme = defaultTheme,
  children,
}: ThemeProviderProps) => {
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};

/**
 * useTheme Hook
 * 현재 Context의 Theme를 가져옴
 *
 * @throws {Error} ThemeProvider 외부에서 사용할 경우
 *
 * @example
 * ```tsx
 * const { global, components } = useTheme();
 * const buttonTheme = components.Button;
 * ```
 */
export const useTheme = (): Theme => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    // ThemeProvider 없이 사용된 경우 defaultTheme 반환
    return defaultTheme;
  }

  return context;
};
