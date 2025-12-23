# Theme Architecture

## 🎯 목표

Design System은 **재사용 가능한 컴포넌트**와 **Theme 생성 규칙**만 제공하고,
각 프로젝트(Project A, B)는 **자신만의 Theme를 정의**하여 사용합니다.

### 핵심 원칙

1. **Design System은 라이브러리**
   - 규칙과 기본값만 제공
   - 프로젝트 A/B 이름은 절대 포함하지 않음

2. **Project는 사용자**
   - Theme를 선택하고 override
   - Design System 수정 없이 새 프로젝트 추가 가능

3. **단방향 의존성**
   - Theme → Component (Context로 주입)
   - Component는 Theme를 모르고, Context만 소비

---

## 📁 디렉토리 구조

```
src/
├─ tokens/                    # 디자인 토큰 (자동 생성)
│  ├─ index.ts               # color, spacing, typography 등
│  └─ variables.css          # CSS Variables
│
├─ theme/                     # 🆕 Theme 시스템
│  ├─ global/                # 전역 테마
│  │  ├─ typography.ts       # fontFamily, fontSize, lineHeight
│  │  ├─ color.ts            # 색상 시스템
│  │  ├─ radius.ts           # border-radius
│  │  └─ index.ts            # Global Theme export
│  │
│  ├─ components/            # 컴포넌트별 테마
│  │  ├─ button.ts           # Button 기본값 정책
│  │  ├─ icon.ts             # Icon 기본값 정책
│  │  ├─ text.ts             # Text 기본값 정책
│  │  └─ index.ts            # Component Themes export
│  │
│  ├─ types.ts               # Theme 타입 정의
│  ├─ createTheme.ts         # Theme 생성 함수
│  ├─ ThemeProvider.tsx      # Context Provider
│  └─ index.ts               # 전체 export
│
└─ components/                # 컴포넌트
   └─ Button/
      ├─ Button.tsx          # useTheme()로만 Theme 접근
      ├─ Button.css.ts       # CSS Variables만 선언
      └─ types.ts            # Props 타입
```

---

## 🏗️ Theme 구조

### 1. Global Theme (전역 공통)

모든 컴포넌트에서 공통으로 사용하는 디자인 토큰입니다.

```typescript
// theme/global/index.ts
export const globalTheme = {
  typography: {
    fontFamily: 'Pretendard',
    fontSize: { sm: 12, md: 14, lg: 16, xl: 20 },
    lineHeight: { tight: 1.2, normal: 1.5, relaxed: 1.8 }
  },
  color: {
    brand: {
      default: '#4f7cff',
      hover: '#2747be',
      active: '#1a318b'
    },
    text: {
      primary: '#2f3744',
      secondary: '#697180',
      inverse: '#ffffff'
    }
  },
  radius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    full: 999
  }
};

export type GlobalTheme = typeof globalTheme;
```

---

### 2. Component Theme (컴포넌트별 정책)

각 컴포넌트의 기본 동작과 스타일 정책을 정의합니다.

#### Button Theme

```typescript
// theme/components/button.ts
export type ButtonTheme = {
  defaultSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  defaultVariant: 'solid' | 'outline';
  radius?: string; // global radius override 가능

  colorSchemes: {
    primary: ColorScheme;
    secondary: ColorScheme;
  };
};

type ColorScheme = {
  default: string;
  hover: string;
  active: string;
  text: string;
};

export const buttonTheme: ButtonTheme = {
  defaultSize: 'md',
  defaultVariant: 'solid',

  colorSchemes: {
    primary: {
      default: '#4f7cff',
      hover: '#2747be',
      active: '#1a318b',
      text: '#ffffff'
    },
    secondary: {
      default: '#edf0f5',
      hover: '#e3e6ee',
      active: '#c5c9d3',
      text: '#697180'
    }
  }
};
```

#### Icon Theme

```typescript
// theme/components/icon.ts
export type IconTheme = {
  defaultSize: number;
  defaultColor: string;
};

export const iconTheme: IconTheme = {
  defaultSize: 24,
  defaultColor: '#4b5465'
};
```

#### Text Theme

```typescript
// theme/components/text.ts
export type TextTheme = {
  defaultPreset: 'body1' | 'body2' | 'caption' | 'h1' | 'h2' | 'h3';
  defaultColor: string;
};

export const textTheme: TextTheme = {
  defaultPreset: 'body1',
  defaultColor: '#2f3744'
};
```

---

### 3. Theme 전체 타입

```typescript
// theme/types.ts
import { GlobalTheme } from './global';
import { ButtonTheme, IconTheme, TextTheme } from './components';

export type Theme = {
  global: GlobalTheme;
  components: {
    Button: ButtonTheme;
    Icon: IconTheme;
    Text: TextTheme;
  };
};
```

---

### 4. createTheme 함수

프로젝트가 Theme를 커스터마이징할 수 있도록 하는 함수입니다.

```typescript
// theme/createTheme.ts
import { defaultTheme } from './defaultTheme';
import { Theme } from './types';

export const createTheme = (
  overrides?: DeepPartial<Theme>
): Theme => {
  return {
    global: {
      ...defaultTheme.global,
      ...overrides?.global,
    },
    components: {
      Button: {
        ...defaultTheme.components.Button,
        ...overrides?.components?.Button,
      },
      Icon: {
        ...defaultTheme.components.Icon,
        ...overrides?.components?.Icon,
      },
      Text: {
        ...defaultTheme.components.Text,
        ...overrides?.components?.Text,
      },
    },
  };
};
```

---

### 5. ThemeProvider

Theme를 Context로 주입하는 Provider입니다.

```typescript
// theme/ThemeProvider.tsx
import React, { createContext, useContext } from 'react';
import { Theme } from './types';
import { defaultTheme } from './defaultTheme';

const ThemeContext = createContext<Theme>(defaultTheme);

export const ThemeProvider = ({
  theme,
  children
}: {
  theme: Theme;
  children: React.ReactNode;
}) => (
  <ThemeContext.Provider value={theme}>
    {children}
  </ThemeContext.Provider>
);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
```

---

## 🔧 컴포넌트 구현 규칙

### Button 예시

#### 1. Button.css.ts (CSS Variables만 선언)

```typescript
import { createVar, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

// ❌ 직접 import 금지
// import { color, spacing } from '../../tokens';

// ✅ CSS Variables만 선언
export const buttonVars = {
  defaultColor: createVar(),
  hoverColor: createVar(),
  activeColor: createVar(),
  textColor: createVar(),
  radius: createVar(),
  fontFamily: createVar(),
};

const baseButton = style({
  borderRadius: buttonVars.radius,
  fontFamily: buttonVars.fontFamily,
  // ...
});

export const buttonStyle = recipe({
  base: baseButton,
  variants: {
    variant: {
      solid: {
        backgroundColor: buttonVars.defaultColor,
        color: buttonVars.textColor,
        // ...
      },
      outline: {
        backgroundColor: 'transparent',
        color: buttonVars.defaultColor,
        border: `1px solid ${buttonVars.defaultColor}`,
        // ...
      }
    },
    // ...
  }
});
```

#### 2. Button.tsx (useTheme로만 접근)

```typescript
import { useTheme } from '../../theme';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import { buttonVars, buttonStyle } from './Button.css';

export const Button = ({
  size,
  variant,
  color = 'primary',
  ...props
}: ButtonProps) => {
  const { global, components } = useTheme();
  const buttonTheme = components.Button;

  // 우선순위: props > component theme > global theme
  const finalSize = size ?? buttonTheme.defaultSize;
  const finalVariant = variant ?? buttonTheme.defaultVariant;
  const radius = buttonTheme.radius ?? global.radius.md;

  // 컬러 스킴 가져오기
  const colorScheme = buttonTheme.colorSchemes[color] ?? {
    default: color,
    hover: color,
    active: color,
    text: color
  };

  // CSS Variables 주입
  const vars = assignInlineVars({
    [buttonVars.defaultColor]: colorScheme.default,
    [buttonVars.hoverColor]: colorScheme.hover,
    [buttonVars.activeColor]: colorScheme.active,
    [buttonVars.textColor]: colorScheme.text,
    [buttonVars.radius]: `${radius}px`,
    [buttonVars.fontFamily]: global.typography.fontFamily,
  });

  return (
    <button
      className={buttonStyle({ variant: finalVariant, size: finalSize })}
      style={vars}
      {...props}
    />
  );
};
```

---

## 📦 프로젝트에서 사용하기

### Project A - 각진 디자인

```typescript
// project-a/src/theme/theme.ts
import { createTheme } from '@bemily/design-system/theme';

export const projectATheme = createTheme({
  components: {
    Button: {
      defaultSize: 'md',
      radius: '0px', // 각진 버튼
      colorSchemes: {
        primary: {
          default: '#ff6b6b',
          hover: '#ee5a52',
          active: '#d84339',
          text: '#ffffff'
        }
      }
    }
  }
});
```

```tsx
// project-a/src/App.tsx
import { ThemeProvider } from '@bemily/design-system/theme';
import { Button } from '@bemily/design-system';
import { projectATheme } from './theme/theme';

export const App = () => (
  <ThemeProvider theme={projectATheme}>
    <Button label="Click me" />
    {/* radius: 0px, color: #ff6b6b */}
  </ThemeProvider>
);
```

---

### Project B - 둥근 디자인

```typescript
// project-b/src/theme/theme.ts
import { createTheme } from '@bemily/design-system/theme';

export const projectBTheme = createTheme({
  components: {
    Button: {
      defaultSize: 'lg',
      radius: '999px', // 완전히 둥근 버튼
      colorSchemes: {
        primary: {
          default: '#4f7cff',
          hover: '#2747be',
          active: '#1a318b',
          text: '#ffffff'
        }
      }
    }
  }
});
```

```tsx
// project-b/src/App.tsx
import { ThemeProvider } from '@bemily/design-system/theme';
import { Button } from '@bemily/design-system';
import { projectBTheme } from './theme/theme';

export const App = () => (
  <ThemeProvider theme={projectBTheme}>
    <Button label="Click me" />
    {/* radius: 999px, color: #4f7cff */}
  </ThemeProvider>
);
```

---

## 🎨 우선순위 규칙

컴포넌트에서 값을 결정하는 우선순위는 다음과 같습니다:

```
1. Props (가장 높음)
   ↓
2. Component Theme
   ↓
3. Global Theme (기본값)
```

### 예시

```tsx
// Global Theme
global.radius.md = 8

// Component Theme
components.Button.radius = undefined (global 사용)

// Component Usage
<Button radius={16} /> // ✅ 16 사용 (Props)
<Button />             // ✅ 8 사용 (Global)

// Component Theme Override
components.Button.radius = '0px'
<Button />             // ✅ 0 사용 (Component Theme)
<Button radius={16} /> // ✅ 16 사용 (Props가 우선)
```

---

## ✅ 체크리스트

### Design System 개발자

- [ ] `tokens`를 컴포넌트에서 직접 import하지 않는다
- [ ] 모든 컴포넌트는 `useTheme()`으로만 Theme에 접근한다
- [ ] Component Theme에 기본값과 정책을 정의한다
- [ ] 프로젝트 이름(A, B)을 절대 사용하지 않는다

### 프로젝트 개발자

- [ ] `createTheme()`으로 커스텀 Theme를 생성한다
- [ ] `ThemeProvider`로 앱 전체를 감싼다
- [ ] Design System을 수정하지 않고 Theme만 override한다

---

## 🔥 핵심 한 문장

**Design System은 라이브러리이고, Project는 사용자다.**
**Theme는 Context로만 연결된다.**

---

## 📚 관련 파일

- [`src/theme/`](src/theme/) - Theme 시스템 구현
- [`src/components/Button/`](src/components/Button/) - Button 컴포넌트 예시
- [`src/tokens/`](src/tokens/) - 디자인 토큰
