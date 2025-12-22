# ✏️ 수동 관리 토큰

이 디렉토리는 **개발 편의를 위한 추가 토큰**을 수동으로 관리합니다.

## 📁 디렉토리 구조

```
src/tokens/dev/
├─ rounded.ts              # ✏️ CSS 변수 참조 JS 토큰
├─ rounded.global.css.ts   # ✏️ Tailwind 스타일 유틸리티 클래스
├─ spacing.ts              # ✏️ CSS 변수 참조 JS 토큰
└─ spacing.global.css.ts   # ✏️ Tailwind 스타일 유틸리티 클래스 (예정)
```

## 🎯 목적

### Figma 토큰 (`src/tokens/`) vs 개발 토큰 (`src/tokens/dev/`)

| 항목 | Figma 토큰 | 개발 토큰 |
|------|-----------|----------|
| **관리** | 🤖 자동 생성 | ✏️ 수동 관리 |
| **소스** | Figma 디자이너 | 개발자 |
| **형식** | 원시 값 (숫자, 색상) | CSS 변수 참조, 유틸리티 |
| **용도** | 기본 토큰 제공 | 개발 편의성 향상 |
| **예시** | `rounded.md = 12` | `rounded.md = 'var(--rounded-md)'` |

## 📝 파일별 설명

### 1. rounded.ts

**목적:** CSS-in-JS에서 사용하기 편한 형태로 제공

```typescript
/**
 * CSS 변수를 참조하는 JavaScript 토큰
 */
export const rounded = {
  md: 'var(--rounded-md)',  // CSS 변수 참조
} as const;

export const roundedPx = {
  md: 12,  // px 값 (Storybook 등에서 사용)
} as const;
```

**사용처:**
```typescript
import { rounded } from '@/tokens/dev/rounded';

// Vanilla Extract
const card = style({
  borderRadius: rounded.md, // 'var(--rounded-md)' → 런타임 적용
});

// styled-components
const Button = styled.button`
  border-radius: ${rounded.sm};
`;
```

---

### 2. rounded.global.css.ts

**목적:** HTML에서 직접 사용 가능한 Tailwind 스타일 클래스 제공

```typescript
/**
 * Tailwind 스타일 유틸리티 클래스
 */
globalStyle('.rounded-md', {
  borderRadius: 'var(--rounded-md)'
});

globalStyle('.rounded-t-lg', {
  borderTopLeftRadius: 'var(--rounded-lg)',
  borderTopRightRadius: 'var(--rounded-lg)'
});
```

**사용처:**
```tsx
import '@/tokens/dev/rounded.global.css';

<div className="rounded-md">카드</div>
<div className="rounded-t-lg">상단만 둥글게</div>
```

---

### 3. spacing.ts

**목적:** spacing 토큰을 rem 단위로 제공

```typescript
export const spacing = {
  0: '0rem',
  4: '0.4rem',
  8: '0.8rem',
  // ...
} as const;
```

---

## ✅ 관리 가이드

### 언제 수동 토큰을 추가해야 하나?

#### ✅ 추가해야 하는 경우

1. **Figma에 없는 유틸리티 기능**
   - 예: `.rounded-t-md` (상단만 둥글게)
   - 예: 음수 spacing (`-0.8rem`)

2. **CSS 변수 참조 래퍼**
   - 예: `rounded.md = 'var(--rounded-md)'` (타입 안전성)

3. **특수 케이스**
   - 예: `roundedPx` (Storybook에서 px 값 필요)
   - 예: `z-index` (레이어 관리)

#### ❌ 추가하지 말아야 하는 경우

1. **Figma에서 이미 제공하는 값**
   - ❌ `rounded.md = 12` (이미 `src/tokens/index.ts`에 있음)
   - ✅ CSS 변수로 사용: `var(--rounded-md)`

2. **단순 중복**
   - ❌ 같은 값을 다른 형태로 재정의

---

## 🔄 Figma 토큰과의 관계

```
[Figma 토큰]                [개발 토큰]
src/tokens/                 src/tokens/dev/
  ↓                            ↓
variables.css                rounded.ts (CSS 변수 참조)
--rounded-md: 1.2rem   ←─────rounded.md = 'var(--rounded-md)'

index.ts                     rounded.global.css.ts
rounded.md = 12        ←─────.rounded-md { border-radius: var(--rounded-md) }
```

**핵심:**
- Figma 토큰이 **원천 (Single Source of Truth)**
- 개발 토큰은 Figma 토큰을 **참조하여 편의 기능 제공**

---

## 📋 체크리스트

### 새 토큰 추가 전

- [ ] Figma 토큰에 이미 존재하는가? (`src/tokens/index.ts` 확인)
- [ ] CSS 변수로 대체 가능한가? (`src/tokens/variables.css` 확인)
- [ ] 정말 개발 편의를 위해 필요한가?

### 추가할 때

- [ ] JSDoc 주석 작성 (사용법 명시)
- [ ] TypeScript 타입 정의 (`as const`, `keyof typeof`)
- [ ] Storybook 예제 업데이트

### 추가 후

- [ ] `npm run type-check` 통과
- [ ] Storybook에서 정상 작동 확인
- [ ] 문서 업데이트 (이 README)

---

## 🎨 현재 제공 중인 토큰

### rounded
- **파일:** `rounded.ts`, `rounded.global.css.ts`
- **목적:** border-radius 토큰 + 유틸리티 클래스
- **제공:**
  - JS 토큰: `rounded.md = 'var(--rounded-md)'`
  - HTML 클래스: `.rounded-md`, `.rounded-t-lg`
  - px 값: `roundedPx.md = 12` (Storybook용)

### spacing
- **파일:** `spacing.ts`
- **목적:** 여백 토큰 (rem 단위)
- **제공:**
  - JS 토큰: `spacing[8] = '0.8rem'`
  - 음수: `negativeSpacing[8] = '-0.8rem'`

---

## 📚 관련 문서
- 자동 생성 토큰: `src/tokens/README.md`
- Vanilla Extract: [공식 문서](https://vanilla-extract.style/)
