# ✏️ 수동 관리 토큰

이 디렉토리는 **개발 편의를 위한 추가 토큰**을 수동으로 관리합니다.

## 📁 디렉토리 구조

```
src/tokens/dev/
├─ primitives/
│  └─ zIndex.json          # ✏️ Z-Index 토큰 정의
├─ rounded.global.css.ts   # ✏️ Tailwind 스타일 유틸리티 클래스
├─ zIndex.global.css.ts    # ✏️ Z-Index 유틸리티 클래스
├─ spacing.ts              # ✏️ CSS 변수 참조 JS 토큰
└─ spacing.global.css.ts   # ✏️ Tailwind 스타일 유틸리티 클래스 (예정)
```

## 🎯 목적

### Figma 토큰 (`src/tokens/`) vs 개발 토큰 (`src/tokens/dev/`)

| 항목     | Figma 토큰           | 개발 토큰                 |
| -------- | -------------------- | ------------------------- |
| **관리** | 🤖 자동 생성         | ✏️ 수동 관리              |
| **소스** | Figma 디자이너       | 개발자                    |
| **형식** | 원시 값 (숫자, 색상) | CSS 변수 참조, 유틸리티   |
| **용도** | 기본 토큰 제공       | 개발 편의성 향상          |
| **예시** | `rounded.md = 12`    | `.rounded-md` HTML 클래스 |

## 📝 파일별 설명

### 1. zIndex.global.css.ts

**목적:** 레이어 순서 관리를 위한 시맨틱한 z-index 클래스 제공

```typescript
/**
 * Z-Index 유틸리티 클래스
 */
globalStyle('.z-modal', {
  zIndex: 'var(--z-modal)',
});

globalStyle('.z-tooltip', {
  zIndex: 'var(--z-tooltip)',
});
```

**사용처:**

```tsx
import '@/tokens/dev/zIndex.global.css';

<div className="z-modal">모달</div>
<div className="z-tooltip">툴팁</div>
<div className="z-overlay">오버레이</div>
```

---

### 2. rounded.global.css.ts

**목적:** HTML에서 직접 사용 가능한 Tailwind 스타일 클래스 제공

```typescript
/**
 * Tailwind 스타일 유틸리티 클래스
 */
globalStyle('.rounded-md', {
  borderRadius: 'var(--rounded-md)',
});

globalStyle('.rounded-t-lg', {
  borderTopLeftRadius: 'var(--rounded-lg)',
  borderTopRightRadius: 'var(--rounded-lg)',
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

2. **HTML 클래스 유틸리티**
   - 예: `.rounded-md` (빠른 프로토타이핑용)

3. **특수 케이스**
   - 예: `z-index` (레이어 관리)

#### ❌ 추가하지 말아야 하는 경우

1. **Figma에서 이미 제공하는 값**
   - ❌ `rounded.md = 12` (이미 `src/tokens/auto/index.ts`에 있음)
   - ✅ 자동 생성 토큰 사용: `import { rounded } from '@/tokens/auto'`

2. **CSS 변수 참조 래퍼**
   - ❌ `rounded.md = 'var(--rounded-md)'` (직접 사용으로 충분)
   - ✅ 직접 사용: `borderRadius: 'var(--rounded-md)'`

---

## 🔄 Figma 토큰과의 관계

```
[Figma 토큰]                    [개발 토큰]
src/tokens/auto/                src/tokens/dev/
  ↓                                ↓
variables.css                   rounded.global.css.ts
--rounded-md: 1.2rem      →     .rounded-md { border-radius: var(--rounded-md) }

index.ts
rounded.md = 12           →     Storybook, 컴포넌트에서 직접 사용
```

**핵심:**

- Figma 토큰(`auto/`)이 **원천 (Single Source of Truth)**
- 개발 토큰(`dev/`)은 **HTML 클래스 유틸리티만 제공**
- 숫자 값, CSS 변수는 `auto/`에서 직접 사용

---

## 📋 체크리스트

### 새 토큰 추가 전

- [ ] Figma 토큰에 이미 존재하는가? (`src/tokens/auto/index.ts` 확인)
- [ ] CSS 변수로 대체 가능한가? (`src/tokens/auto/variables.css` 확인)
- [ ] HTML 클래스가 정말 필요한가? (프로토타이핑 목적인가?)

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

### zIndex

- **파일:** `primitives/zIndex.json`, `zIndex.global.css.ts`
- **목적:** 레이어 순서 관리를 위한 시맨틱 z-index 값
- **제공:**
  - 토큰 값: `zIndex.modal = 1400`, `zIndex.tooltip = 1800` 등
  - HTML 클래스: `.z-modal`, `.z-tooltip`, `.z-overlay` 등
  - CSS 변수: `var(--z-modal)`, `var(--z-tooltip)` 등
- **참고:** Figma가 아닌 개발자가 직접 관리하는 토큰

### rounded

- **파일:** `rounded.global.css.ts`
- **목적:** HTML 유틸리티 클래스 제공
- **제공:**
  - HTML 클래스: `.rounded-md`, `.rounded-t-lg`, `.rounded-tl-md` 등
  - 전체/방향별/개별 코너 적용 가능
- **참고:** 숫자 값은 `@/tokens/auto`에서 직접 사용

### spacing

- **파일:** `spacing.ts`
- **목적:** 여백 토큰 (rem 단위)
- **제공:**
  - JS 토큰: `spacing[8] = '0.8rem'`
  - 음수: `negativeSpacing[8] = '-0.8rem'`

---

## 📚 관련 문서

- 자동 생성 토큰: `src/tokens/Auto-Generated-Tokens.md`
- Vanilla Extract: [공식 문서](https://vanilla-extract.style/)
