import { color } from '../../tokens';
import { Button } from './index';
import {
  BUTTON_COLOR_PRESETS,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
} from './types';

import type { Meta, StoryObj } from '@storybook/react';

/**
 * Button 컴포넌트는 사용자 액션을 트리거하는 기본 버튼입니다.
 *
 * ## 주요 기능
 * - variant: solid, outline
 * - size: sm, md, lg
 * - 시맨틱 컬러 프리셋 (primary, secondary, warning, success, danger)
 * - 커스텀 hex/rgb 컬러 지원
 * - hover/active 상태 자동 처리
 * - 전체 너비 옵션
 * - Tabler 아이콘 지원
 *
 * ## 컬러 사용법
 * ### 시맨틱 토큰 (권장)
 * ```tsx
 * <Button color="primary" label="Primary" />
 * <Button color="secondary" label="Secondary" />
 * <Button color="warning" label="Warning" />
 * <Button color="success" label="Success" />
 * <Button color="danger" label="Danger" />
 * ```
 *
 * ### 커스텀 컬러
 * ```tsx
 * <Button color="#8facff" label="Custom Blue" />
 * <Button color="rgb(143, 172, 255)" label="Custom RGB" />
 * ```
 */
const meta = {
  title: '(test)Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs', '!dev'],
  argTypes: {
    variant: {
      control: 'select',
      options: BUTTON_VARIANTS,
      description: 'Button variant (solid, outline)',
      table: {
        category: 'Appearance',
      },
    },
    size: {
      control: 'select',
      options: BUTTON_SIZES,
      description: 'Button size',
      table: {
        category: 'Appearance',
      },
    },
    color: {
      control: 'select',
      options: [
        ...BUTTON_COLOR_PRESETS,
        color.blue['500'],
        color.pink['500'],
        color.indigo['500'],
        color.green['600'],
      ],
      description:
        '시맨틱 프리셋(primary, secondary 등) 또는 토큰 컬러 선택. 커스텀 hex 값은 직접 입력 가능',
      table: {
        category: 'Appearance',
      },
    },
    full: {
      control: 'boolean',
      description: 'Full width',
      table: {
        category: 'Appearance',
      },
    },

    leftIcon: {
      control: 'select',
      description: '왼쪽 아이콘',
      table: { category: 'Appearance' },
    },
    rightIcon: {
      control: 'select',
      description: '오른쪽 아이콘',
      table: { category: 'Appearance' },
    },

    icon: {
      control: 'select',
      description: '아이콘',
      table: { category: 'Appearance' },
    },
    label: {
      control: 'text',
      description: 'Button text',
      table: { category: 'HTML' },
    },
    type: {
      control: 'select',
      options: BUTTON_TYPES,
      description: 'Button type',
      table: { category: 'HTML' },
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
      table: { category: 'HTML' },
    },
  },
  args: {
    variant: 'solid',
    size: 'md',
    color: 'primary',
    label: 'Button',
    disabled: false,
    full: false,
    type: 'button',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

/**
 * 시맨틱 컬러 프리셋 - 디자인 시스템에서 정의한 색상과 hover/active 상태를 사용합니다.
 */
export const SemanticColors: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}
    >
      <Button variant='solid' size='md' color='primary' label='Primary' />
      <Button variant='solid' size='md' color='secondary' label='Secondary' />
      <Button variant='outline' size='md' color='primary' label='Outline' />
    </div>
  ),
};

/**
 * 버튼 사이즈
 */
export const Sizes: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gap: '16px',
        gridTemplateColumns: '40px repeat(3, 1fr)',
        placeItems: 'center start',
      }}
    >
      <p></p>
      <p>solid-primary</p>
      <p>solid-secondary</p>
      <p>outline-primary</p>

      <p>xs</p>
      <Button variant='solid' size='xs' color='primary' label='Button' />
      <Button variant='solid' size='xs' color='secondary' label='Button' />
      <Button variant='outline' size='xs' color='primary' label='Button' />

      <p>sm</p>
      <Button variant='solid' size='sm' color='primary' label='Button' />
      <Button variant='solid' size='sm' color='secondary' label='Button' />
      <Button variant='outline' size='sm' color='primary' label='Button' />

      <p>md</p>
      <Button variant='solid' size='md' color='primary' label='Button' />
      <Button variant='solid' size='md' color='secondary' label='Button' />
      <Button variant='outline' size='md' color='primary' label='Button' />

      <p>lg</p>
      <Button variant='solid' size='lg' color='primary' label='Button' />
      <Button variant='solid' size='lg' color='secondary' label='Button' />
      <Button variant='outline' size='lg' color='primary' label='Button' />

      <p>xl</p>
      <Button variant='solid' size='xl' color='primary' label='Button' />
      <Button variant='solid' size='xl' color='secondary' label='Button' />
      <Button variant='outline' size='xl' color='primary' label='Button' />
    </div>
  ),
};

/**
 * Disabled 상태
 */
export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <Button
        variant='solid'
        size='md'
        color='primary'
        label='Primary'
        disabled
      />
      <Button
        variant='solid'
        size='md'
        color='secondary'
        label='Secondary'
        disabled
      />
      <Button
        variant='outline'
        size='md'
        color='primary'
        label='Outline'
        disabled
      />
    </div>
  ),
};

/**
 * Full Width 버튼
 */
export const FullWidth: Story = {
  render: () => (
    <div
      style={{
        width: '400px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <Button variant='solid' size='md' color='primary' label='Button' full />
      <Button variant='solid' size='md' color='secondary' label='Button' full />
      <Button variant='outline' size='md' color='primary' label='Button' full />
    </div>
  ),
};

/**
 * 아이콘이 있는 버튼
 */
export const WithIcon: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gap: '16px',
        gridTemplateColumns: 'auto auto auto',
      }}
    >
      <Button label='Download' leftIcon='tabler:download' />
      <Button label='Trash' leftIcon='tabler:trash' />
      <Button label='search' leftIcon='tabler:search' />

      <Button label='Download' color='secondary' leftIcon='tabler:download' />
      <Button label='Trash' color='secondary' leftIcon='tabler:trash' />
      <Button label='search' color='secondary' leftIcon='tabler:search' />

      <Button variant='outline' label='Download' leftIcon='tabler:download' />
      <Button variant='outline' label='Trash' leftIcon='tabler:trash' />
      <Button variant='outline' label='search' leftIcon='tabler:search' />
    </div>
  ),
};
/**
 * 아이콘만 있는 버튼
 */
export const OnlyIcon: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gap: '16px',
        gridTemplateColumns: 'repeat(9, 1fr)',
      }}
    >
      {/* sm */}
      <Button size='sm' label='Download' icon='tabler:download' />
      <Button size='sm' label='Trash' icon='tabler:trash' />
      <Button size='sm' label='search' icon='tabler:search' />
      <Button
        size='sm'
        label='Download'
        color='secondary'
        icon='tabler:download'
      />
      <Button size='sm' label='Trash' color='secondary' icon='tabler:trash' />
      <Button size='sm' label='search' color='secondary' icon='tabler:search' />
      <Button
        size='sm'
        variant='outline'
        label='Download'
        icon='tabler:download'
      />
      <Button size='sm' variant='outline' label='Trash' icon='tabler:trash' />
      <Button size='sm' variant='outline' label='search' icon='tabler:search' />
      {/* md */}
      <Button label='Download' icon='tabler:download' />
      <Button label='Trash' icon='tabler:trash' />
      <Button label='search' icon='tabler:search' />
      <Button label='Download' color='secondary' icon='tabler:download' />
      <Button label='Trash' color='secondary' icon='tabler:trash' />
      <Button label='search' color='secondary' icon='tabler:search' />
      <Button variant='outline' label='Download' icon='tabler:download' />
      <Button variant='outline' label='Trash' icon='tabler:trash' />
      <Button variant='outline' label='search' icon='tabler:search' />

      {/* lg */}
      <Button size='lg' label='Download' icon='tabler:download' />
      <Button size='lg' label='Trash' icon='tabler:trash' />
      <Button size='lg' label='search' icon='tabler:search' />
      <Button
        size='lg'
        label='Download'
        color='secondary'
        icon='tabler:download'
      />
      <Button size='lg' label='Trash' color='secondary' icon='tabler:trash' />
      <Button size='lg' label='search' color='secondary' icon='tabler:search' />
      <Button
        size='lg'
        variant='outline'
        label='Download'
        icon='tabler:download'
      />
      <Button size='lg' variant='outline' label='Trash' icon='tabler:trash' />
      <Button size='lg' variant='outline' label='search' icon='tabler:search' />

      {/* xl */}
      <Button size='xl' label='Download' icon='tabler:download' />
      <Button size='xl' label='Trash' icon='tabler:trash' />
      <Button size='xl' label='search' icon='tabler:search' />
      <Button
        size='xl'
        label='Download'
        color='secondary'
        icon='tabler:download'
      />
      <Button size='xl' label='Trash' color='secondary' icon='tabler:trash' />
      <Button size='xl' label='search' color='secondary' icon='tabler:search' />
      <Button
        size='xl'
        variant='outline'
        label='Download'
        icon='tabler:download'
      />
      <Button size='xl' variant='outline' label='Trash' icon='tabler:trash' />
      <Button size='xl' variant='outline' label='search' icon='tabler:search' />
    </div>
  ),
};

/**
 * a
 */
export const Link: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gap: '16px',
        gridTemplateColumns: 'repeat(9, 1fr)',
      }}
    >
      {/* md */}
      <Button
        as='a'
        href='about:blank'
        target='_blank'
        label='Download'
        icon='tabler:download'
      />
    </div>
  ),
};
