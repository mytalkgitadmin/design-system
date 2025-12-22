import { zIndex } from '../../tokens';
import { LayerStack, ZIndexDemo } from './ZIndexDemo';

import type { Meta, StoryObj } from '@storybook/react';

/**
 * 디자인 시스템 전반에서 사용되는 **레이어 순서(Z-Index)** 기준 값입니다.
 *
 * ## 📐 레이어 체계
 *
 * | 레벨       | 값    | 설명                                    |
 * | ---------- | ----- | --------------------------------------- |
 * | **hide**   | -1    | 요소를 뒤로 숨김                        |
 * | **base**   | 0     | 기본 레이어 (문서 흐름)                 |
 * | **docked** | 10    | 고정된 요소 (사이드바, 네비게이션 바)   |
 * | **dropdown** | 1000 | 드롭다운 메뉴                          |
 * | **sticky** | 1100 | Sticky 헤더/푸터                        |
 * | **banner** | 1200 | 공지 배너                               |
 * | **overlay** | 1300 | 오버레이/백드롭                        |
 * | **modal**  | 1400 | 모달 다이얼로그                         |
 * | **popover** | 1500 | 팝오버                                 |
 * | **skipLink** | 1600 | 접근성 스킵 링크                      |
 * | **toast**  | 1700 | 토스트 알림                             |
 * | **tooltip** | 1800 | 툴팁 (최상위 레이어)                   |
 *
 * ## 🔄 토큰 소스
 *
 * - **소스**: 개발자 관리 토큰 (dev/primitives/zIndex.json)
 * - **자동 생성**: src/tokens/index.ts, src/tokens/variables.css
 * - **빌드 명령**: npm run build:tokens
 *
 * ## ✅ 사용 원칙
 *
 * 1. **모든 레이어 순서는 zIndex 토큰을 사용합니다** (일관성 유지)
 * 2. **임의의 숫자 값 직접 사용을 지양합니다** (충돌 방지)
 * 3. **컴포넌트 성격에 맞는 시맨틱한 레벨을 선택합니다**
 * 4. **100 단위로 간격이 있어 중간 값 추가가 가능합니다**
 *
 * ## 💻 사용법
 *
 * ### 1️⃣ TypeScript/JavaScript - 자동 생성 토큰 (권장)
 *
 * ```typescript
 * import { zIndex } from '@/tokens';
 *
 * // 인라인 스타일
 * const Modal = () => (
 *   <div style={{ zIndex: zIndex.modal }}>모달</div>
 * );
 * // → zIndex: 1400
 *
 * // Vanilla Extract
 * export const modal = style({
 *   zIndex: zIndex.modal,
 * });
 * ```
 *
 * ### 2️⃣ CSS 변수 - CSS-in-JS에서 사용
 *
 * CSS 변수를 직접 참조합니다.
 *
 * ```typescript
 * // Vanilla Extract
 * export const modal = style({
 *   zIndex: 'var(--z-modal)',  // 1400
 * });
 *
 * // styled-components
 * const Tooltip = styled.div`
 *   z-index: var(--z-tooltip);
 * `;
 * ```
 *
 * ### 3️⃣ HTML 글로벌 클래스 (빠른 프로토타이핑)
 *
 * Tailwind 스타일 유틸리티 클래스를 사용합니다.
 *
 * ```tsx
 * // 앱 최상위에서 한 번만 import
 * import '@/tokens/dev/zIndex.global.css';
 *
 * // 사용
 * <div className="z-modal">모달</div>
 * <div className="z-tooltip">툴팁</div>
 * <div className="z-overlay">오버레이</div>
 * ```
 *
 * ### 4️⃣ CSS 변수 직접 사용 (순수 CSS)
 *
 * CSS 파일에서 직접 사용 가능합니다.
 *
 * - .modal { z-index: var(--z-modal); }
 * - .tooltip { z-index: var(--z-tooltip); }
 *
 * ## 📋 사용 가능한 클래스
 *
 * ### HTML 클래스 (dev/zIndex.global.css)
 *
 * - .z-hide - 요소 숨김 (-1)
 * - .z-base - 기본 레이어 (0)
 * - .z-docked - 고정 요소 (10)
 * - .z-dropdown - 드롭다운 (1000)
 * - .z-sticky - Sticky 요소 (1100)
 * - .z-banner - 배너 (1200)
 * - .z-overlay - 오버레이 (1300)
 * - .z-modal - 모달 (1400)
 * - .z-popover - 팝오버 (1500)
 * - .z-skipLink - 스킵 링크 (1600)
 * - .z-toast - 토스트 (1700)
 * - .z-tooltip - 툴팁 (1800)
 *
 * ## 🎨 사용 예시
 *
 * ### 컴포넌트별 권장 레벨
 *
 * - **사이드바, 네비게이션**: docked (10)
 * - **드롭다운 메뉴**: dropdown (1000)
 * - **Sticky 헤더**: sticky (1100)
 * - **공지 배너**: banner (1200)
 * - **모달 백드롭**: overlay (1300)
 * - **모달 콘텐츠**: modal (1400)
 * - **팝오버**: popover (1500)
 * - **토스트 알림**: toast (1700)
 * - **툴팁**: tooltip (1800)
 *
 * ## ⚠️ 주의사항
 *
 * - z-index는 같은 stacking context 내에서만 비교됩니다
 * - position: static이 아닌 요소에만 z-index가 적용됩니다
 * - 너무 많은 z-index 사용은 레이어 관리를 복잡하게 만듭니다
 */

const meta = {
  title: 'Foundation/ZIndex',
  component: ZIndexDemo,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs', '!dev'],
  argTypes: {},
  args: {
    level: 'base',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 인터랙티브 Z-Index 데모
 *
 * 우측 Controls 패널에서 레벨을 조절하여
 * 실시간으로 z-index의 효과를 확인할 수 있습니다.
 */
export const Interactive: Story = {
  argTypes: {
    level: {
      control: { type: 'select' },
      options: Object.keys(zIndex),
      description: 'Z-Index 레벨',
    },
  },
};

/**
 * 모든 Z-Index 레벨
 *
 * 높이로 시각화된 모든 z-index 레벨을 확인할 수 있습니다.
 */
export const AllLevels: Story = {
  render: () => <LayerStack />,
};
