import type { Meta, StoryObj } from '@storybook/react';
import Text from './index';
import {
  TEXT_SIZES,
  TEXT_WEIGHTS,
  TEXT_ALIGNS,
  TEXT_LINE_HEIGHTS,
  TEXT_LETTER_SPACINGS,
  TEXT_PRESETS,
} from './types';
import { theme } from '../../tokens';

/**
 * Text 컴포넌트는 디자인 시스템의 타이포그래피를 관리하는 기본 텍스트 컴포넌트입니다.
 *
 * ## 주요 기능
 * - **Preset 시스템**: 자주 쓰는 스타일 조합을 미리 정의 (display1-4, title1-3, body1-4, caption1-2)
 * - **독립적인 속성 제어**: size, weight, lineHeight, letterSpacing을 개별적으로 제어 가능
 * - **토큰 기반 타이포그래피**: 글로벌 디자인 토큰을 사용한 일관된 타이포그래피
 * - **오버라이드 가능**: preset을 사용하면서도 개별 속성으로 오버라이드 가능
 * - **색상 커스터마이징**: color prop으로 자유롭게 색상 변경
 * - **정렬 및 데코레이션**: align, underline, truncate 옵션
 * - **시맨틱 HTML**: as prop으로 적절한 HTML 태그 사용 가능
 *
 * ## 사용법
 * ```tsx
 * // Preset 사용
 * <Text preset="title1">페이지 제목</Text>
 * <Text preset="body1">본문 텍스트</Text>
 *
 * // Preset + 오버라이드
 * <Text preset="body1" weight="bold">강조된 본문</Text>
 *
 * // 개별 속성만 사용
 * <Text size="lg" weight="semibold" color="#000">커스텀 텍스트</Text>
 * ```
 */
const meta = {
  title: 'Foundation/Typo',
  component: Text,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs', '!dev'],
  argTypes: {
    // Preset
    preset: {
      control: { type: 'select' },
      options: [undefined, ...TEXT_PRESETS],
      description: '자주 쓰는 스타일 조합 프리셋',
      table: {
        category: 'Preset',
      },
    },

    // Appearance
    color: {
      control: { type: 'color' },
      description: '글자 색상',
      table: { category: 'Appearance' },
    },
    size: {
      control: { type: 'select' },
      options: TEXT_SIZES,
      description: 'Font size (토큰 기반)',
      table: { category: 'Appearance' },
    },
    weight: {
      control: { type: 'radio' },
      options: TEXT_WEIGHTS,
      description: 'Font weight',
      table: { category: 'Appearance' },
    },
    lineHeight: {
      control: { type: 'radio' },
      options: TEXT_LINE_HEIGHTS,
      description: 'Line height (비율 기반)',
      table: { category: 'Appearance' },
    },
    letterSpacing: {
      control: { type: 'radio' },
      options: TEXT_LETTER_SPACINGS,
      description: 'Letter spacing',
      table: { category: 'Appearance' },
    },

    align: {
      control: { type: 'radio' },
      options: TEXT_ALIGNS,
      description: '글자 정렬',
      table: { category: 'Appearance' },
    },
    underline: {
      control: { type: 'boolean' },
      description: 'Underline',
      table: { category: 'Appearance' },
    },
    truncate: {
      control: { type: 'boolean' },
      description: '말줄임 처리 (overflow ellipsis)',
      table: { category: 'Appearance' },
    },

    // HTML
    as: {
      control: { type: 'select' },
      options: [
        'p',
        'span',
        'div',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'label',
        'a',
      ],
      description: 'HTML 태그 변경 (p, span, div, h1~h6, label)',
      table: { category: 'HTML' },
    },
    className: {
      control: false,
      description: '추가 CSS 클래스',
      table: { category: 'HTML' },
    },
    style: {
      control: false,
      description: 'React CSSProperties',
      table: { category: 'HTML' },
    },
    children: {
      control: { type: 'text' },
      description: '텍스트 내용',
      table: { category: 'HTML' },
    },
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 기본 사용 예시 - preset과 개별 속성을 모두 테스트할 수 있습니다.
 * - preset을 선택하면 해당 preset의 스타일이 적용됩니다.
 * - preset을 선택한 후 개별 속성(size, weight 등)을 변경하면 오버라이드할 수 있습니다.
 */
export const Default: Story = {
  args: {
    // preset
    preset: undefined,

    // appearance
    size: undefined,
    weight: undefined,
    lineHeight: undefined,
    letterSpacing: undefined,
    color: theme.brand1.text.title,
    align: undefined,
    underline: false,
    truncate: false,

    // html
    children: '기본 텍스트입니다',
    as: undefined,
    className: undefined,
    style: undefined,
  },
};

/**
 * Preset 테스트용 - Controls로 다양한 Preset을 테스트할 수 있습니다.
 * Preset을 선택한 후 개별 속성을 변경해서 오버라이드도 테스트 가능합니다.
 */
export const PresetPlayground: Story = {
  args: {
    children: 'Preset을 선택하고 속성을 변경해보세요!',
    preset: 'body1',
  },
};

/**
 * Preset 시스템 - Display 프리셋
 * Display는 가장 큰 타이포그래피로, 랜딩 페이지나 대형 타이틀에 사용됩니다.
 */
export const DisplayPresets: Story = {
  args: { children: '' },
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
        width: '900px',
      }}
    >
      <div>
        <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>
          display1: 56px / Bold / Tight / Tight
        </p>
        <Text preset='display1'>무대 위의 감동을 곧장로 만나보세요</Text>
      </div>
      <div>
        <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>
          display2: 48px / Bold / Tight / Tight
        </p>
        <Text preset='display2'>Pretendard 프리텐다드 12345 !@#$</Text>
      </div>
      <div>
        <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>
          display3: 40px / Bold / Tight / Tight
        </p>
        <Text preset='display3'>Pretendard 프리텐다드 12345 !@#$</Text>
      </div>
      <div>
        <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>
          display4: 32px / Bold / Tight / Normal
        </p>
        <Text preset='display4'>Pretendard 프리텐다드 12345 !@#$</Text>
      </div>
    </div>
  ),
};

/**
 * Preset 시스템 - Title 프리셋
 * Title은 페이지 제목이나 섹션 타이틀에 사용됩니다.
 */
export const TitlePresets: Story = {
  args: { children: '' },
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        width: '700px',
      }}
    >
      <div>
        <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>
          title1: 28px / Semibold / Tight / Normal
        </p>
        <Text preset='title1'>
          ALLDAY PROJECT The 1st EP Album [ALLDAY PROJECT]
        </Text>
      </div>
      <div>
        <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>
          title2: 24px / Semibold / Normal / Normal
        </p>
        <Text preset='title2'>오랜만, 다시 만난 우리의 세계</Text>
      </div>
      <div>
        <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>
          title3: 20px / Semibold / Normal / Normal
        </p>
        <Text preset='title3'>너를 위한 라방대</Text>
      </div>
    </div>
  ),
};

/**
 * Preset 시스템 - Body 프리셋
 * Body는 본문 텍스트로, 가장 많이 사용됩니다.
 */
export const BodyPresets: Story = {
  args: { children: '' },
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        width: '700px',
      }}
    >
      <div>
        <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>
          body1: 18px / Regular / Normal / Normal
        </p>
        <Text preset='body1'>
          이번에 방문 계획 중인 공연이나 전시를 알려주시면 리뷰와 소식을 담은 새
          글과 함께 다시 찾아올게요.
        </Text>
      </div>
      <div>
        <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>
          body2: 16px / Regular / Normal / Normal (기본)
        </p>
        <Text preset='body2'>Pretendard 프리텐다드 12345 !@#$</Text>
      </div>
      <div>
        <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>
          body3: 14px / Regular / Normal / Normal
        </p>
        <Text preset='body3'>
          <span>Pretendard 프리텐다드 12345 !@#$</span>
        </Text>
      </div>
      <div>
        <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>
          body4: 12px / Regular / Relaxed / Normal
        </p>
        <Text preset='body4'>Pretendard 프리텐다드 12345 !@#$</Text>
      </div>
    </div>
  ),
};

/**
 * Preset 시스템 - Caption 프리셋
 * Caption은 가장 작은 텍스트로, 보조 정보에 사용됩니다.
 */
export const CaptionPresets: Story = {
  args: { children: '' },
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '500px',
      }}
    >
      <div>
        <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>
          caption1: 12px / Regular / Normal / Wide
        </p>
        <Text preset='caption1'>무대</Text>
      </div>
      <div>
        <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>
          caption2: 10px / Regular / Normal / Wide
        </p>
        <Text preset='caption2'>Pretendard 프리텐다드 | 12345 !@#$</Text>
      </div>
    </div>
  ),
};

/**
 * 모든 Preset 한눈에 보기
 */
export const AllPresets: Story = {
  args: { children: '' },
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        width: '900px',
      }}
    >
      <Text preset='display1'>Display 1 - 56px Bold Tight</Text>
      <Text preset='display2'>Display 2 - 48px Bold Tight</Text>
      <Text preset='title1'>Title 1 - 28px Semibold Tight</Text>
      <Text preset='title2'>Title 2 - 24px Semibold Normal</Text>
      <Text preset='title3'>Title 3 - 20px Semibold Normal</Text>
      <Text preset='body1'>Body 1 - 18px Regular Normal</Text>
      <Text preset='body2'>Body 2 - 16px Regular Normal (기본)</Text>
      <Text preset='body3'>Body 3 - 14px Regular Normal</Text>
      <Text preset='body4'>Body 4 - 12px Regular Relaxed</Text>
      <Text preset='caption1'>Caption 1 - 12px Regular Wide</Text>
      <Text preset='caption2'>Caption 2 - 10px Regular Wide</Text>
    </div>
  ),
};

/**
 * Preset 오버라이드
 * Preset을 사용하면서도 개별 속성으로 오버라이드할 수 있습니다.
 */
export const PresetOverride: Story = {
  args: { children: '' },
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        width: '700px',
      }}
    >
      <div>
        <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>
          기본 body1 preset
        </p>
        <Text preset='body1'>일반 본문 텍스트입니다.</Text>
      </div>
      <div>
        <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>
          body1 preset + weight='bold' 오버라이드
        </p>
        <Text preset='body1' weight='bold'>
          강조된 본문 텍스트입니다.
        </Text>
      </div>
      <div>
        <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>
          body1 preset + size='xl' 오버라이드
        </p>
        <Text preset='body1' size='xl'>
          크기가 변경된 본문 텍스트입니다.
        </Text>
      </div>
      <div>
        <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>
          title2 preset + lineHeight='relaxed' 오버라이드
        </p>
        <Text preset='title2' lineHeight='relaxed'>
          줄 간격이 넓어진 제목입니다.
        </Text>
      </div>
    </div>
  ),
};

/**
 * 개별 속성 제어 - Size
 * Preset 없이 size만 독립적으로 제어할 수 있습니다.
 */
export const IndependentSize: Story = {
  args: { children: '' },
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '800px',
      }}
    >
      <Text size='4xl'>4xl - 56px</Text>
      <Text size='3xl'>3xl - 48px</Text>
      <Text size='2xl'>2xl - 40px</Text>
      <Text size='xl'>xl - 32px</Text>
      <Text size='lg'>lg - 28px</Text>
      <Text size='md'>md - 24px</Text>
      <Text size='sm'>sm - 20px</Text>
      <Text size='base'>base - 18px</Text>
      <Text size='default'>default - 16px</Text>
      <Text size='xs'>xs - 14px</Text>
      <Text size='2xs'>2xs - 12px</Text>
      <Text size='3xs'>3xs - 10px</Text>
    </div>
  ),
};

/**
 * 개별 속성 제어 - Weight
 */
export const IndependentWeight: Story = {
  args: { children: '' },
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '600px',
      }}
    >
      <Text size='lg' weight='regular'>
        Regular (400) - 일반 텍스트
      </Text>
      <Text size='lg' weight='semibold'>
        Semibold (600) - 강조 텍스트
      </Text>
      <Text size='lg' weight='bold'>
        Bold (700) - 굵은 텍스트
      </Text>
    </div>
  ),
};

/**
 * 개별 속성 제어 - Line Height
 */
export const IndependentLineHeight: Story = {
  args: { children: '' },
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        width: '600px',
      }}
    >
      <div>
        <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>
          tight (1.25) - 제목에 적합
        </p>
        <Text size='md' lineHeight='tight'>
          이것은 줄 간격이 좁은 텍스트입니다.
          <br />
          여러 줄로 작성하면 차이를 확인할 수 있습니다.
        </Text>
      </div>
      <div>
        <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>
          normal (1.5) - 본문에 적합
        </p>
        <Text size='md' lineHeight='normal'>
          이것은 일반 줄 간격의 텍스트입니다.
          <br />
          여러 줄로 작성하면 차이를 확인할 수 있습니다.
        </Text>
      </div>
      <div>
        <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>
          relaxed (1.75) - 긴 본문에 적합
        </p>
        <Text size='md' lineHeight='relaxed'>
          이것은 줄 간격이 넓은 텍스트입니다.
          <br />
          여러 줄로 작성하면 차이를 확인할 수 있습니다.
        </Text>
      </div>
    </div>
  ),
};

/**
 * 개별 속성 제어 - Letter Spacing
 */
export const IndependentLetterSpacing: Story = {
  args: { children: '' },
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '600px',
      }}
    >
      <div>
        <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>
          tight (-0.01em)
        </p>
        <Text size='lg' letterSpacing='tight'>
          자간이 좁은 텍스트 Tight Letter Spacing
        </Text>
      </div>
      <div>
        <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>
          normal (0)
        </p>
        <Text size='lg' letterSpacing='normal'>
          일반 자간 텍스트 Normal Letter Spacing
        </Text>
      </div>
      <div>
        <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>
          wide (0.01em)
        </p>
        <Text size='lg' letterSpacing='wide'>
          자간이 넓은 텍스트 Wide Letter Spacing
        </Text>
      </div>
    </div>
  ),
};

/**
 * 색상 커스터마이징
 */
export const Colors: Story = {
  args: { children: '' },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Text preset='body2' color={theme.brand1.text.title}>
        Title Color
      </Text>
      <Text preset='body2' color={theme.brand1.text.body}>
        Body Color
      </Text>
      <Text preset='body2' color={theme.brand1.text.secondary}>
        Secondary Color
      </Text>
      <Text preset='body2' color={theme.brand1.text.muted}>
        Muted Color
      </Text>
      <Text preset='body2' color={theme.brand1.text.brand}>
        Brand Color
      </Text>
      <Text preset='body2' color={theme.brand1.text.link}>
        Link Color
      </Text>
      <Text preset='body2' color='#f9556e'>
        Custom Color (Red)
      </Text>
    </div>
  ),
};

/**
 * Align 옵션
 */
export const Alignment: Story = {
  args: { children: '' },
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '500px',
      }}
    >
      <Text preset='body2' align='left'>
        왼쪽 정렬 텍스트
      </Text>
      <Text preset='body2' align='center'>
        가운데 정렬 텍스트
      </Text>
      <Text preset='body2' align='right'>
        오른쪽 정렬 텍스트
      </Text>
    </div>
  ),
};

/**
 * Underline 옵션
 */
export const Underline: Story = {
  args: { children: '' },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Text preset='body2' color={theme.brand1.text.link}>
        일반 링크 스타일
      </Text>
      <Text preset='body2' color={theme.brand1.text.link} underline>
        밑줄이 있는 링크 스타일
      </Text>
    </div>
  ),
};

/**
 * Truncate (말줄임)
 */
export const Truncate: Story = {
  args: { children: '' },
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '300px',
      }}
    >
      <div>
        <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>
          일반 텍스트 (넘치면 줄바꿈)
        </p>
        <Text preset='body2'>
          이것은 매우 긴 텍스트입니다. 컨테이너를 넘어가면 자동으로 줄바꿈이
          됩니다.
        </Text>
      </div>
      <div>
        <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>
          Truncate (말줄임)
        </p>
        <Text preset='body2' truncate>
          이것은 매우 긴 텍스트입니다. 컨테이너를 넘어가면 말줄임 처리됩니다.
        </Text>
      </div>
    </div>
  ),
};

/**
 * As prop으로 HTML 태그 변경
 */
export const CustomElement: Story = {
  args: { children: '' },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Text preset='body2' as='h1'>
        H1 태그로 렌더링
      </Text>
      <Text preset='body2' as='span'>
        Span 태그로 렌더링
      </Text>
      <Text preset='body2' as='div'>
        Div 태그로 렌더링
      </Text>
      <Text preset='body2' as='label'>
        Label 태그로 렌더링
      </Text>
    </div>
  ),
};

/**
 * 실전 사용 예시
 */
export const RealWorldExample: Story = {
  args: { children: '' },
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        width: '700px',
        padding: '32px',
        backgroundColor: '#f8f9fc',
        borderRadius: '12px',
      }}
    >
      <div>
        <Text preset='display2' as='h1'>
          공연 정보
        </Text>
      </div>

      <div
        style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
        }}
      >
        <Text preset='title2' as='h2' style={{ marginBottom: '12px' }}>
          ALLDAY PROJECT The 1st EP Album
        </Text>

        <Text
          preset='body3'
          color={theme.brand1.text.secondary}
          style={{ marginBottom: '16px' }}
        >
          2024.12.20 FRI 19:30
        </Text>

        <Text preset='body2' style={{ marginBottom: '16px' }}>
          이번에 방문 계획 중인 공연이나 전시를 알려주시면 리뷰와 소식을 담은 새
          글과 함께 다시 찾아올게요.
        </Text>

        <Text
          preset='body3'
          color={theme.brand1.text.link}
          underline
          as='a'
          style={{ cursor: 'pointer' }}
        >
          더 알아보기
        </Text>
      </div>

      <div>
        <Text preset='caption1' color={theme.brand1.text.muted}>
          마지막 업데이트: 2024년 12월 17일
        </Text>
      </div>
    </div>
  ),
};
