import type { Meta, StoryObj } from '@storybook/react';
import { spacing } from '../../tokens/dev/spacing';
import { SpacingDemo } from './SpacingDemo';

/**
 * 디자인 시스템 전반에서 사용되는 **여백(margin)**, **안쪽 여백(padding)**, **간격(gap)**의 기준 값입니다.
 *
 * ## 📐 스케일 체계
 *
 * - **8px 기반** 스케일 체계
 * - **숫자는 픽셀 단위** 기준 (실제 값은 rem으로 변환)
 * - 예: `spacing[16]` → `1.6rem` (16px)
 *
 * ## ✅ 사용 원칙
 *
 * 1. **Spacing은 컴포넌트로 만들지 않습니다** (DOM 증가 방지)
 * 2. **모든 여백 값은 spacing 토큰을 사용합니다** (일관성 유지)
 * 3. **임의의 px, rem 값 직접 사용을 지양합니다** (디자인 시스템 준수)
 *
 * ## 💻 사용법
 *
 * ### 1️⃣ CSS-in-JS (vanilla-extract)
 *
 * ```typescript
 * import { spacing } from '@/tokens/dev/spacing';
 *
 * export const box = style({
 *   // Padding
 *   padding: spacing[16],           // 전체
 *   paddingTop: spacing[8],         // 상단만
 *
 *   // Margin
 *   margin: spacing[24],            // 전체
 *   marginBottom: spacing[16],      // 하단만
 *
 *   // Gap (Grid/Flexbox)
 *   gap: spacing[12],               // 상하좌우 동일
 *   rowGap: spacing[16],            // 세로 간격 (gap-y)
 *   columnGap: spacing[8],          // 가로 간격 (gap-x)
 * });
 * ```
 *
 * ### 2️⃣ Utility Class (vanilla-extract)
 *
 * ```typescript
 * // Padding 예시
 * <div className={p[16]}>padding 전체</div>
 * <div className={pt[8]}>paddingTop</div>
 * <div className={px[12]}>paddingLeft + paddingRight</div>
 *
 * // Margin 예시
 * <div className={m[24]}>margin 전체</div>
 * <div className={mt[16]}>marginTop</div>
 * <div className={mx[8]}>marginLeft + marginRight</div>
 *
 * // Gap 예시 (Grid/Flexbox)
 * <div className={gap[16]}>gap 전체</div>
 * <div className={gapY[24]}>gap-y (세로)</div>
 * <div className={gapX[12]}>gap-x (가로)</div>
 * ```
 *
 * ## 📋 사용 가능한 유틸리티 클래스
 *
 * ### Padding
 * - `p[16]` - padding (전체)
 * - `pt[16]` - paddingTop
 * - `pr[16]` - paddingRight
 * - `pb[16]` - paddingBottom
 * - `pl[16]` - paddingLeft
 * - `px[16]` - paddingLeft + paddingRight (가로)
 * - `py[16]` - paddingTop + paddingBottom (세로)
 *
 * ### Margin
 * - `m[16]` - margin (전체)
 * - `mt[16]` - marginTop
 * - `mr[16]` - marginRight
 * - `mb[16]` - marginBottom
 * - `ml[16]` - marginLeft
 * - `mx[16]` - marginLeft + marginRight (가로)
 * - `my[16]` - marginTop + marginBottom (세로)
 *
 * ### Gap
 * - `gap[16]` - gap (상하좌우 동일)
 * - `gapY[16]` - rowGap / gap-y (세로 간격)
 * - `gapX[16]` - columnGap / gap-x (가로 간격)
 */

const meta = {
  title: 'Foundation/Spacing',
  component: SpacingDemo,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs', '!dev'],
  argTypes: {},
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 인터랙티브 Spacing 데모
 *
 * 우측 Controls 패널에서 Margin, Padding, Gap을 일괄 또는 개별로 조절하여
 * 실시간으로 spacing의 효과를 확인할 수 있습니다.
 *
 * - **일괄 적용**: margin, padding을 한 번에 설정 (모든 방향 동일)
 * - **개별 조정**: 각 방향(top, right, bottom, left)을 세밀하게 조정
 * - 개별 값이 설정되면 일괄 값을 오버라이드합니다
 */
export const Interactive: Story = {
  render: (args) => <SpacingDemo {...args} />,
  args: {
    margin: 16,
    padding: 16,
    gap: 16,
  },
  argTypes: {
    margin: {
      control: { type: 'select' },
      options: Object.keys(spacing).map(Number),
      description: '모든 방향의 외부 여백 일괄 적용 (margin)',
    },
    marginTop: {
      control: { type: 'select' },
      options: Object.keys(spacing).map(Number),
      description: '상단 외부 여백 (margin-top) - margin 값을 오버라이드',
      table: { category: 'margin (개별)' },
    },
    marginRight: {
      control: { type: 'select' },
      options: Object.keys(spacing).map(Number),
      description: '우측 외부 여백 (margin-right) - margin 값을 오버라이드',
      table: { category: 'margin (개별)' },
    },
    marginBottom: {
      control: { type: 'select' },
      options: Object.keys(spacing).map(Number),
      description: '하단 외부 여백 (margin-bottom) - margin 값을 오버라이드',
      table: { category: 'margin (개별)' },
    },
    marginLeft: {
      control: { type: 'select' },
      options: Object.keys(spacing).map(Number),
      description: '좌측 외부 여백 (margin-left) - margin 값을 오버라이드',
      table: { category: 'margin (개별)' },
    },
    padding: {
      control: { type: 'select' },
      options: Object.keys(spacing).map(Number),
      description: '모든 방향의 내부 여백 일괄 적용 (padding)',
    },
    paddingTop: {
      control: { type: 'select' },
      options: Object.keys(spacing).map(Number),
      description: '상단 내부 여백 (padding-top) - padding 값을 오버라이드',
      table: { category: 'padding (개별)' },
    },
    paddingRight: {
      control: { type: 'select' },
      options: Object.keys(spacing).map(Number),
      description: '우측 내부 여백 (padding-right) - padding 값을 오버라이드',
      table: { category: 'padding (개별)' },
    },
    paddingBottom: {
      control: { type: 'select' },
      options: Object.keys(spacing).map(Number),
      description: '하단 내부 여백 (padding-bottom) - padding 값을 오버라이드',
      table: { category: 'padding (개별)' },
    },
    paddingLeft: {
      control: { type: 'select' },
      options: Object.keys(spacing).map(Number),
      description: '좌측 내부 여백 (padding-left) - padding 값을 오버라이드',
      table: { category: 'padding (개별)' },
    },
    gapY: {
      control: { type: 'select' },
      options: Object.keys(spacing).map(Number),
      description: 'Grid의 세로 간격 (gap-y / row-gap)',
      table: { category: 'gap (개별)' },
    },
    gapX: {
      control: { type: 'select' },
      options: Object.keys(spacing).map(Number),
      description: 'Grid의 가로 간격 (gap-x / column-gap)',
      table: { category: 'gap (개별)' },
    },
  },
};
