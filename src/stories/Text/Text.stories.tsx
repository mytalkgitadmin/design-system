import type { Meta, StoryObj } from '@storybook/react';
import Text from './index';
import {
  fontSizeOptions as TEXT_SIZES,
  fontWeightOptions as TEXT_WEIGHTS,
  textAlignOptions as TEXT_ALIGNS,
  textWrapOptions as TEXT_WRAPS,
  wordBreakOptions as WORD_BREAKS,
  lineHeightOptions as TEXT_LINE_HEIGHTS,
  letterSpacingOptions as TEXT_LETTER_SPACINGS,
  presetOptions as TEXT_PRESETS,
  textElement,
} from '../../tokens/dev/typography';
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
 * - **텍스트 제어**: align, textWrap, wordBreak로 텍스트 레이아웃 제어
 * - **데코레이션**: underline, 다중 라인 truncate 지원
 * - **시맨틱 HTML**: as prop으로 적절한 HTML 태그 사용 가능
 * - **글로벌 CSS 클래스**: CDN을 통한 간편한 배포 및 사용
 *
 * ## 사용법 1: React 컴포넌트
 *
 * ### Preset 사용 (권장)
 * ```tsx
 * import { Text } from '@your-design-system';
 *
 * <Text preset="display1">큰 제목</Text>
 * <Text preset="body1">본문 텍스트</Text>
 * <Text preset="caption1">작은 텍스트</Text>
 * ```
 *
 * ### 개별 속성 제어
 * ```tsx
 * <Text size={18} weight="bold" align="center">커스텀 텍스트</Text>
 * <Text preset="body1" weight="bold">Preset + 오버라이드</Text>
 * ```
 *
 * ### 색상 및 데코레이션
 * ```tsx
 * <Text preset="body2" color="#f9556e">빨간색 텍스트</Text>
 * <Text preset="body2" underline>밑줄 텍스트</Text>
 * <Text preset="body2" truncate={1}>1줄 말줄임</Text>
 * <Text preset="body2" truncate={3}>3줄 말줄임</Text>
 * ```
 *
 * ### 텍스트 레이아웃 제어
 * ```tsx
 * <Text align="justify">양쪽 정렬</Text>
 * <Text textWrap="balance">균형잡힌 줄바꿈</Text>
 * <Text wordBreak="keepAll">한중일 단어 단위 줄바꿈</Text>
 * ```
 *
 * ## 사용법 2: 글로벌 CSS 클래스 (NCP 서버 CDN)
 *
 * ### 1. CSS 파일 로드
 * ```html
 * <link rel="stylesheet" href="https://your-cdn.ncp.com/design-system/styles.css">
 * ```
 *
 * ### 2. 글로벌 클래스 사용
 * ```html
 * <!-- 기본 사용 -->
 * <p class="text-18 font-bold text-center">제목</p>
 * <p class="text-16 leading-relaxed">본문 텍스트</p>
 * <p class="text-14 tracking-wide">작은 텍스트</p>
 *
 * <!-- 조합 사용 -->
 * <h2 class="text-32 font-bold leading-tight tracking-tight">큰 제목</h2>
 * <p class="text-16 font-regular leading-relaxed text-center">가운데 정렬 본문</p>
 *
 * <!-- 텍스트 레이아웃 제어 -->
 * <p class="text-16 text-justify text-balance">양쪽 정렬 + 균형잡힌 줄바꿈</p>
 * <p class="text-16 break-keep-all">한중일 단어 단위 줄바꿈</p>
 * <p class="text-16 truncate-2">2줄 말줄임</p>
 * ```
 *
 * ## 사용 가능한 글로벌 클래스
 * - **Font Size**: `.text-56`, `.text-44`, `.text-40`, `.text-32`, `.text-26`, `.text-22`, `.text-20`, `.text-18`, `.text-16`, `.text-15`, `.text-14`, `.text-13`, `.text-12`, `.text-11`
 * - **Font Weight**: `.font-regular` (400), `.font-semibold` (600), `.font-bold` (700)
 * - **Line Height**: `.leading-tight` (1.2), `.leading-normal` (1.4), `.leading-relaxed` (1.5)
 * - **Letter Spacing**: `.tracking-tight` (-0.1rem), `.tracking-normal` (0), `.tracking-wide` (0.1rem)
 * - **Text Align**: `.text-left`, `.text-center`, `.text-right`, `.text-justify`
 * - **Text Wrap**: `.text-wrap`, `.text-nowrap`, `.text-balance`, `.text-pretty`
 * - **Word Break**: `.break-normal`, `.break-all`, `.break-keep-all`, `.break-word`
 * - **Truncate**: `.truncate-1` ~ `.truncate-10` (1줄~10줄 말줄임)
 * - **Extra**: `.underline` (밑줄)
 *
 * **참고**: `.truncate-2`, `.truncate-3` 등 다중 라인 truncate 클래스는 글로벌 CSS에 미리 정의되어 있어야 합니다.
 * React 컴포넌트에서는 `truncate={3}` 처럼 동적으로 값을 설정할 수 있습니다.
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
      control: { type: 'select' },
      options: TEXT_WEIGHTS,
      description: 'Font weight',
      table: { category: 'Appearance' },
    },
    lineHeight: {
      control: { type: 'select' },
      options: TEXT_LINE_HEIGHTS,
      description: 'Line height (비율 기반)',
      table: { category: 'Appearance' },
    },
    letterSpacing: {
      control: { type: 'select' },
      options: TEXT_LETTER_SPACINGS,
      description: 'Letter spacing',
      table: { category: 'Appearance' },
    },

    align: {
      control: { type: 'select' },
      options: TEXT_ALIGNS,
      description: '글자 정렬',
      table: { category: 'Appearance' },
    },
    textWrap: {
      control: { type: 'select' },
      options: TEXT_WRAPS,
      description:
        '텍스트 줄바꿈 방식 (wrap: 기본, nowrap: 줄바꿈 안함, balance: 균형잡힌 줄바꿈, pretty: 가독성 최적화)',
      table: { category: 'Appearance' },
    },
    wordBreak: {
      control: { type: 'select' },
      options: WORD_BREAKS,
      description:
        '단어 줄바꿈 규칙 (normal: 기본, breakAll: 모든 문자에서 줄바꿈, keepAll: 한중일 단어 단위 줄바꿈, breakWord: 넘치는 단어 줄바꿈)',
      table: { category: 'Appearance' },
    },
    underline: {
      control: { type: 'boolean' },
      description: 'Underline',
      table: { category: 'Appearance' },
    },
    truncate: {
      control: { type: 'number', min: 0, max: 10, step: 1 },
      description:
        '말줄임 처리 (0 또는 false: 안함, 1 또는 true: 1줄, 2 이상: 다중 라인)',
      table: { category: 'Appearance' },
    },

    // HTML
    as: {
      control: { type: 'select' },
      options: Object.keys(textElement),
      description: 'HTML 태그 변경 (h2~h6, p, span, div, label)',
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
    children: '기본 텍스트입니다. ABC abc 가나다 123 !@#',
    as: undefined,
    className: undefined,
    style: undefined,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '600px', maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Preset 시스템
 * Display는 가장 큰 타이포그래피로, 랜딩 페이지나 대형 타이틀에 사용됩니다.
 */
export const Presets: Story = {
  args: { children: '' },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <Text preset='display1' />
        <Text preset='display2' />
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          border: '1px solid #eee',
          borderWidth: '1px 0',
          padding: '20px 0',
        }}
      >
        <Text preset='title1' />
        <Text preset='title2' />
        <Text preset='title3' />
        <Text preset='title4' />
        <Text preset='title5' />
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <Text preset='subTitle1' />
        <Text preset='subTitle2' />
        <Text preset='subTitle3' />
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          border: '1px solid #eee',
          borderWidth: '1px 0',
          padding: '20px 0',
        }}
      >
        <Text preset='body1' />
        <Text preset='body2' />
        <Text preset='body3' />
        <Text preset='body4' />
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <Text preset='label1' />
        <Text preset='label2' />
        <Text preset='label3' />
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          borderTop: '1px solid #eee',
          padding: '20px 0',
        }}
      >
        <Text preset='caption1' />
        <Text preset='caption2' />
      </div>
    </div>
  ),
};

export const Truncate: Story = {
  args: { children: '' },
  render: () => (
    <div
      style={{
        width: '400px',
        display: 'flex',
        flexDirection: 'column',
        gap: '30px',
      }}
    >
      <div>
        <h4 style={{ marginBottom: '10px', fontSize: '14px', color: '#666' }}>
          기본 (truncate 없음)
        </h4>
        <Text preset='body2'>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda
          expedita nemo incidunt odit quaerat et delectus, aperiam ab quasi
          voluptatum eaque libero neque eos debitis quidem a fugiat molestias
          at. 짜앗히산은가 간스월다 등온곺무는 간미다 릴가 잉베며 핀채련뒀의
          여이옽여울. 니따는 로슼어 욘이 토눈으링이다 다시쩹써간먹 드하어가
          콘껙마솝게의.
        </Text>
      </div>

      <div>
        <h4 style={{ marginBottom: '10px', fontSize: '14px', color: '#666' }}>
          1줄 말줄임 (truncate={'{1}'} 또는 truncate)
        </h4>
        <Text preset='body2' truncate={1}>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda
          expedita nemo incidunt odit quaerat et delectus, aperiam ab quasi
          voluptatum eaque libero neque eos debitis quidem a fugiat molestias
          at.
        </Text>
      </div>

      <div>
        <h4 style={{ marginBottom: '10px', fontSize: '14px', color: '#666' }}>
          2줄 말줄임 (truncate={'{2}'})
        </h4>
        <Text preset='body2' truncate={2}>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda
          expedita nemo incidunt odit quaerat et delectus, aperiam ab quasi
          voluptatum eaque libero neque eos debitis quidem a fugiat molestias
          at. 짜앗히산은가 간스월다 등온곺무는 간미다 릴가 잉베며 핀채련뒀의
          여이옽여울.
        </Text>
      </div>

      <div>
        <h4 style={{ marginBottom: '10px', fontSize: '14px', color: '#666' }}>
          3줄 말줄임 (truncate={'{3}'})
        </h4>
        <Text preset='body2' truncate={3}>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda
          expedita nemo incidunt odit quaerat et delectus, aperiam ab quasi
          voluptatum eaque libero neque eos debitis quidem a fugiat molestias
          at. 짜앗히산은가 간스월다 등온곺무는 간미다 릴가 잉베며 핀채련뒀의
          여이옽여울. 니따는 로슼어 욘이 토눈으링이다 다시쩹써간먹 드하어가
          콘껙마솝게의.
        </Text>
      </div>
    </div>
  ),
};
