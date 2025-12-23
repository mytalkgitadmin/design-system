import { ProductDetailPage } from './ProductDetailPage';

import type { Meta, StoryObj } from '@storybook/react';

/**
 * 실제 페이지 레이아웃에서 디자인 시스템 컴포넌트들이 어떻게 동작하는지 테스트합니다.
 *
 * ## 목적
 * - 완성된 컴포넌트들을 실제 UI에 바로 적용해보기
 * - 컴포넌트 간 조합 및 상호작용 확인
 * - 실제 사용 케이스에서의 동작 검증
 *
 * ## 페이지 종류
 * - **ProductDetail**: 상품 상세 페이지 (e-커머스)
 * - 추후 추가 예정: 로그인, 대시보드, 설정 페이지 등
 */
const meta = {
  title: 'Pages/Examples',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 상품 상세 페이지
 *
 * 현재 사용 중인 컴포넌트:
 * - **Button**: 네비게이션, 액션 버튼, 수량 조절, 구매 버튼
 *
 * 향후 추가 예정:
 * - Text, Icon, Badge, Input 등
 */
export const ProductDetail: Story = {
  render: () => <ProductDetailPage />,
};
