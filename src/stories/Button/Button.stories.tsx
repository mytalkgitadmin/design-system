import type { Meta, StoryObj } from '@storybook/react';
import Button from './index';
import {
  BUTTON_VARIANTS,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_COLOR_PRESETS,
} from './types';
import { color } from '../../tokens';

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
    },
    size: {
      control: 'select',
      options: BUTTON_SIZES,
      description: 'Button size',
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
    },
    full: {
      control: 'boolean',
      description: 'Full width',
    },
    label: {
      control: 'text',
      description: 'Button text',
    },
    type: {
      control: 'select',
      options: BUTTON_TYPES,
      description: 'Button type',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'solid',
    size: 'md',
    color: 'primary',
    label: 'Button',
    disabled: false,
    full: false,
    type: 'button',
  },
};

/**
 * 시맨틱 컬러 프리셋 - 디자인 시스템에서 정의한 색상과 hover/active 상태를 사용합니다.
 */
export const SemanticColors: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: 600 }}>
          Solid Variant
        </h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Button variant='solid' size='md' color='primary' label='Primary' />
          <Button
            variant='solid'
            size='md'
            color='secondary'
            label='Secondary'
          />
          <Button variant='solid' size='md' color='warning' label='Warning' />
          <Button variant='solid' size='md' color='success' label='Success' />
          <Button variant='solid' size='md' color='danger' label='Danger' />
        </div>
      </div>
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: 600 }}>
          Outline Variant
        </h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Button variant='outline' size='md' color='primary' label='Primary' />
          <Button
            variant='outline'
            size='md'
            color='secondary'
            label='Secondary'
          />
          <Button variant='outline' size='md' color='warning' label='Warning' />
          <Button variant='outline' size='md' color='success' label='Success' />
          <Button variant='outline' size='md' color='danger' label='Danger' />
        </div>
      </div>
    </div>
  ),
};

/**
 * 커스텀 컬러 - 토큰의 원시 컬러를 직접 사용할 수 있습니다.
 */
export const CustomColors: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: 600 }}>
          디자인 토큰 색상
        </h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Button
            variant='solid'
            size='md'
            color={color.blue['500']}
            label='Blue 500'
          />
          <Button
            variant='solid'
            size='md'
            color={color.pink['500']}
            label='Pink 500'
          />
          <Button
            variant='solid'
            size='md'
            color={color.indigo['500']}
            label='Indigo 500'
          />
          <Button
            variant='solid'
            size='md'
            color={color.green['600']}
            label='Green 600'
          />
        </div>
      </div>
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: 600 }}>
          커스텀 Hex 값
        </h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Button
            variant='solid'
            size='md'
            color='#8facff'
            label='Custom Blue'
          />
          <Button
            variant='solid'
            size='md'
            color='#f159cb'
            label='Custom Pink'
          />
          <Button
            variant='outline'
            size='md'
            color='#3fbe75'
            label='Custom Green'
          />
        </div>
      </div>
    </div>
  ),
};

/**
 * 버튼 사이즈
 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Button variant='solid' size='sm' color='primary' label='Small' />
      <Button variant='solid' size='md' color='primary' label='Medium' />
      <Button variant='solid' size='lg' color='primary' label='Large' />
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
    <div style={{ width: '400px' }}>
      <Button
        variant='solid'
        size='md'
        color='primary'
        label='Full Width Button'
        full
      />
    </div>
  ),
};

/**
 * 아이콘이 있는 버튼
 */
export const WithIcon: Story = {
  args: {
    label: 'Button',
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: 600 }}>
          Solid Variant
        </h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Button
            variant='solid'
            size='md'
            color='primary'
            label='Check'
            leftIcon='tabler:check'
          />
          <Button
            variant='solid'
            size='md'
            color='success'
            label='Plus'
            leftIcon='tabler:plus'
          />
          <Button
            variant='solid'
            size='md'
            color='danger'
            label='Trash'
            leftIcon='tabler:trash'
          />
          <Button
            variant='solid'
            size='md'
            color='secondary'
            label='Search'
            leftIcon='tabler:search'
          />
        </div>
      </div>
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: 600 }}>
          Outline Variant
        </h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Button
            variant='outline'
            size='md'
            color='primary'
            label='Download'
            leftIcon='tabler:download'
          />
          <Button
            variant='outline'
            size='md'
            color='success'
            label='Upload'
            leftIcon='tabler:upload'
          />
          <Button
            variant='outline'
            size='md'
            color='warning'
            label='Edit'
            leftIcon='tabler:edit'
          />
        </div>
      </div>
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: 600 }}>
          Different Sizes
        </h3>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Button
            variant='solid'
            size='sm'
            color='primary'
            label='Small'
            leftIcon='tabler:check'
          />
          <Button
            variant='solid'
            size='md'
            color='primary'
            label='Medium'
            leftIcon='tabler:check'
          />
          <Button
            variant='solid'
            size='lg'
            color='primary'
            label='Large'
            leftIcon='tabler:check'
          />
        </div>
      </div>
    </div>
  ),
};

/*
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    size: 'md',
    label: 'Secondary Button',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    size: 'md',
    label: 'Outline Button',
  },
};

export const WithIcon: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    label: 'Search',
    leftIcon: 'tabler:search',
  },
};

export const Sizes: Story = {
  args: {
    label: 'Button',
  },
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Button variant='primary' size='xs' label='Extra Small' />
      <Button variant='primary' size='sm' label='Small' />
      <Button variant='primary' size='md' label='Medium' />
      <Button variant='primary' size='lg' label='Large' />
    </div>
  ),
};

export const Variants: Story = {
  args: {
    label: 'Button',
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', gap: '16px' }}>
        <Button variant='primary' size='md' label='Primary' />
        <Button variant='secondary' size='md' label='Secondary' />
        <Button variant='outline' size='md' label='Outline' />
      </div>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Button',
  },
  render: () => (
    <div style={{ display: 'flex', gap: '16px' }}>
      <Button variant='primary' size='md' label='Primary Disabled' disabled={true} />
      <Button variant='secondary' size='md' label='Secondary Disabled' disabled={true} />
      <Button variant='outline' size='md' label='Outline Disabled' disabled={true} />
    </div>
  ),
};

export const FullWidth: Story = {
  args: {
    label: 'Full Width Button',
  },
  render: () => (
    <div style={{ width: '400px' }}>
      <Button
        variant='primary'
        size='md'
        label='Full Width Button'
        full={true}
      />
    </div>
  ),
};

export const IconButtons: Story = {
  args: {
    label: 'Button',
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', gap: '16px' }}>
        <Button
          variant='primary'
          size='md'
          label='Check'
          leftIcon='tabler:check'
        />
        <Button
          variant='secondary'
          size='md'
          label='Add'
          leftIcon='tabler:plus'
        />
        <Button
          variant='outline'
          size='md'
          label='Search'
          leftIcon='tabler:search'
        />
      </div>
    </div>
  ),
};

*/
