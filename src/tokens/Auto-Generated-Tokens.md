# 🤖 자동 생성 영역 (수정 금지)

이 디렉토리의 모든 파일은 **자동으로 생성**됩니다. 직접 수정하지 마세요!

## 📁 디렉토리 구조

```
src/tokens/auto/
├─ primitives/       # 🤖 Figma 토큰에서 자동 생성
│  ├─ color.json
│  ├─ font.json
│  ├─ number.json
│  └─ rounded.json
├─ semantic/         # 🤖 Figma 토큰에서 자동 생성
│  └─ colors.json
├─ index.ts          # 🤖 Style Dictionary가 자동 생성
└─ variables.css     # 🤖 Style Dictionary가 자동 생성
```

## 🔄 자동 생성 프로세스

```
1. Figma (디자이너 작업)
   ↓ Figma Tokens 플러그인

2. src/tokens/figma/tokens.json (자동 생성)
   ↓ npm run build:tokens

3. scripts/build-tokens.js
   - Figma 토큰을 타입별로 분리
   - rounded의 type을 'number' → 'borderRadius'로 변환
   ↓

4. src/tokens/auto/primitives/*.json 생성
   src/tokens/auto/semantic/*.json 생성
   ↓ Style Dictionary

5. src/tokens/auto/index.ts 생성 (color, font, number, rounded)
   src/tokens/auto/variables.css 생성 (모든 CSS 변수)
```

## ⚠️ 중요 규칙

### ❌ 하지 말아야 할 것

- 이 디렉토리의 파일을 직접 수정
- 자동 생성된 파일을 Git에 커밋 (변경사항 추적 불필요)

### ✅ 해야 할 것

- Figma에서 토큰 변경
- `npm run build:tokens` 실행하여 재생성
- 생성된 파일 확인

## 🎯 생성되는 파일들

### 1. index.ts - JavaScript/TypeScript 토큰

```typescript
// 자동 생성된 타입 안전 토큰
export const color = {
  gray: {
    '50': '#f8f9fc',
    '100': '#f4f6fb',
    // ...
  },
  blue: {
    /* ... */
  },
};

export const font = {
  family: {
    pretendard: 'Pretendard Variable, sans-serif',
  },
  weight: {
    regular: 400,
    bold: 700,
  },
};

export const number = {
  '0': 0,
  '4': 4,
  '8': 8,
  // ...
};

export const rounded = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};
```

### 2. variables.css - CSS 변수

```css
:root {
  /* Color */
  --gray-50: #f8f9fc;
  --blue-500: #6f94ff;

  /* Font */
  --family-pretendard: 'Pretendard Variable', sans-serif;

  /* Rounded */
  --rounded-none: 0;
  --rounded-xs: 0.4rem;
  --rounded-sm: 0.8rem;
  --rounded-md: 1.2rem;
  --rounded-lg: 1.6rem;
  --rounded-xl: 2.4rem;
  --rounded-full: 99.9rem;
}
```

## 📖 사용 방법

### TypeScript/JavaScript

```typescript
import { color, font, rounded } from '@/tokens';

// Storybook, 컴포넌트 등에서 사용
const textColor = color.gray['500'];
const fontFamily = font.family.pretendard;
const borderRadius = `${rounded.md}px`; // '12px'
```

### CSS에서 직접 사용

```css
.card {
  border-radius: var(--rounded-md);
  background-color: var(--gray-50);
  font-family: var(--family-pretendard);
}
```

### CSS-in-JS (Vanilla Extract 등)

```typescript
import { rounded } from '@/tokens/dev/rounded';

const card = style({
  borderRadius: rounded.md, // 'var(--rounded-md)' → CSS 변수 참조
});
```

## 🔧 문제 해결

### 토큰이 업데이트되지 않을 때

```bash
npm run build:tokens
```

### 빌드 오류가 발생할 때

```bash
# Figma 토큰 확인
cat src/tokens/figma/tokens.json

# 빌드 스크립트 직접 실행
node scripts/build-tokens.js
```

### Type 오류가 발생할 때

```bash
# TypeScript 타입 체크
npm run type-check
```

## 📚 관련 문서

- 수동 관리 토큰: `src/tokens/Dev-Tokens.md`
- Figma Tokens: [플러그인 문서](https://www.figma.com/community/plugin/843461159747178978)
- Style Dictionary: [공식 문서](https://amzn.github.io/style-dictionary/)
