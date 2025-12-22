import { rounded } from '../../tokens/auto';
import { Box, RoundedDemo } from './RoundedDemo';

import type { Meta, StoryObj } from '@storybook/react';

/**
 * 디자인 시스템 전반에서 사용되는 **모서리 곡률(Border Radius)** 기준 값입니다.
 *
 * ## 📐 스케일 체계
 *
 * | 크기     | 값    | 설명                         |
 * | -------- | ----- | ---------------------------- |
 * | **none** | 0px   | 모서리 곡률 없음             |
 * | **xs**   | 4px   | 아주 작은 곡률               |
 * | **sm**   | 8px   | 작은 곡률                    |
 * | **md**   | 12px  | 중간 곡률 (기본값)           |
 * | **lg**   | 16px  | 큰 곡률                      |
 * | **xl**   | 24px  | 아주 큰 곡률                 |
 * | **full** | 999px | 완전히 둥근 형태 (pill 모양) |
 *
 * ## 🔄 토큰 소스
 *
 * - **소스**: Figma Tokens (semantic/brand-1 > shape.rounded)
 * - **자동 생성**: src/tokens/auto/primitives/rounded.json
 * - **빌드 결과**: src/tokens/auto/index.ts, src/tokens/auto/variables.css
 * - **빌드 명령**: npm run build:tokens
 *
 * ## ✅ 사용 원칙
 *
 * 1. **모든 모서리 곡률은 rounded 토큰을 사용합니다** (일관성 유지)
 * 2. **임의의 px 값 직접 사용을 지양합니다** (디자인 시스템 준수)
 * 3. **컴포넌트 성격에 맞는 적절한 크기를 선택합니다**
 *
 * ## 💻 사용법
 *
 * ### 1️⃣ TypeScript/JavaScript - 자동 생성 토큰 (권장)
 *
 * Figma에서 자동 생성된 숫자 값을 사용합니다.
 *
 * ```typescript
 * import { rounded } from '@/tokens/auto';
 *
 * // 인라인 스타일
 * const Card = () => (
 *   <div style={{ borderRadius: `${rounded.md}px` }}>카드</div>
 * );
 * // → borderRadius: '12px'
 *
 * // Vanilla Extract
 * export const card = style({
 *   borderRadius: `${rounded.md}px`,
 * });
 * ```
 *
 * ### 2️⃣ CSS 변수 - CSS-in-JS에서 사용
 *
 * CSS 변수를 직접 참조합니다.
 *
 * ```typescript
 * // Vanilla Extract
 * export const card = style({
 *   borderRadius: 'var(--rounded-md)',  // 1.2rem
 * });
 *
 * // styled-components
 * const Button = styled.button`
 *   border-radius: var(--rounded-sm);
 * `;
 * ```
 *
 * ### 3️⃣ HTML 글로벌 클래스 (빠른 프로토타이핑)
 *
 * Tailwind 스타일 유틸리티 클래스를 사용합니다.
 *
 * ```tsx
 * // 앱 최상위에서 한 번만 import
 * import '@/tokens/dev/rounded.global.css';
 *
 * // 사용
 * <div className="rounded-md">카드</div>
 * <div className="rounded-t-lg">상단만 둥글게</div>
 * <div className="rounded-tl-md">좌상단만</div>
 * ```
 *
 * ### 4️⃣ CSS 변수 직접 사용 (순수 CSS)
 *
 * CSS 파일에서 직접 사용 가능합니다.
 *
 * - .my-card { border-radius: var(--rounded-md); }
 * - 런타임 테마 변경: :root[data-theme="large"] { --rounded-md: 2rem; }
 *
 * ## 📋 사용 가능한 클래스
 *
 * ### HTML 클래스 (dev/rounded.global.css)
 *
 * - .rounded-{size} - 전체 모서리
 * - .rounded-t-{size} - 상단 모서리
 * - .rounded-r-{size} - 우측 모서리
 * - .rounded-b-{size} - 하단 모서리
 * - .rounded-l-{size} - 좌측 모서리
 * - .rounded-tl-{size} - 좌상단만
 * - .rounded-tr-{size} - 우상단만
 * - .rounded-br-{size} - 우하단만
 * - .rounded-bl-{size} - 좌하단만
 *
 * size: none, xs, sm, md, lg, xl, full
 *
 * ## 🎨 사용 예시
 *
 * ### 컴포넌트별 권장 크기
 *
 * - **버튼**: sm (8px) ~ md (12px)
 * - **카드**: md (12px) ~ lg (16px)
 * - **모달**: lg (16px) ~ xl (24px)
 * - **입력 필드**: sm (8px) ~ md (12px)
 * - **배지, 태그**: sm (8px) ~ full (pill 모양)
 * - **아바타**: full (완전히 둥글게)
 */

const meta = {
  title: 'Foundation/Rounded',
  component: RoundedDemo,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs', '!dev'],
  argTypes: {},
  args: {
    rounded: 'md',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 인터랙티브 Rounded 데모
 *
 * 우측 Controls 패널에서 borderRadius를 조절하여
 * 실시간으로 border-radius의 효과를 확인할 수 있습니다.
 */
export const Interactive: Story = {
  argTypes: {
    rounded: {
      control: { type: 'select' },
      options: Object.keys(rounded),
      description: '모서리 곡률 크기',
    },
  },
};

export const All: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
      <Box rounded='none' />
      <Box rounded='xs' />
      <Box rounded='sm' />
      <Box rounded='md' />
      <Box rounded='lg' />
      <Box rounded='xl' />
      <Box rounded='full' />
    </div>
  ),
};
