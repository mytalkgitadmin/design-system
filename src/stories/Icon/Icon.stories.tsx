import type { Meta, StoryObj } from '@storybook/react';
import Icon from './index';
import type { IconType } from './types';
import { ICON_COLOR_PRESETS } from './types';
import { color } from '../../tokens';

/**
 * Icon 컴포넌트는 Tabler 아이콘을 사용하는 아이콘 컴포넌트입니다.
 *
 * ## 주요 기능
 * - SVG 기반의 아이콘 시스템
 * - 크기 조절이 자유로움
 * - 시맨틱 컬러 프리셋 (primary, secondary, warning, success, danger)
 * - 커스텀 hex/rgb 컬러 지원
 * - 접근성 고려
 *
 * ## 컬러 사용법
 * ### 시맨틱 토큰 (권장)
 * ```tsx
 * <Icon name="tabler:check" color="primary" />
 * <Icon name="tabler:check" color="success" />
 * <Icon name="tabler:check" color="danger" />
 * ```
 *
 * ### 커스텀 컬러
 * ```tsx
 * <Icon name="tabler:check" color="#8facff" />
 * <Icon name="tabler:check" color="rgb(143, 172, 255)" />
 * ```
 */
const meta = {
  title: '(test)Components/Icon',
  component: Icon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs', '!dev'],
  argTypes: {
    name: {
      control: 'select',
      options: [
        'tabler:check',
        'tabler:x',
        'tabler:plus',
        'tabler:minus',
        'tabler:arrow-right',
        'tabler:arrow-left',
        'tabler:search',
        'tabler:settings',
        'tabler:user',
        'tabler:home',
        'tabler:menu',
        'tabler:dots',
        'tabler:edit',
        'tabler:trash',
        'tabler:download',
        'tabler:upload',
      ],
    },
    size: {
      control: { type: 'number', min: 12, max: 64, step: 4 },
    },
    color: {
      control: 'select',
      options: [
        ...ICON_COLOR_PRESETS,
        color.gray['500'],
        color.gray['700'],
        color.blue['600'],
        color.pink['600'],
        color.indigo['600'],
        color.green['600'],
      ],
      description:
        '시맨틱 프리셋(primary, secondary 등) 또는 토큰 컬러 선택. 커스텀 hex 값은 직접 입력 가능',
    },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'tabler:check',
    size: 20,
    color: 'primary',
  },
};

/**
 * 시맨틱 컬러 프리셋 - 디자인 시스템에서 정의한 색상을 사용합니다.
 */
export const SemanticColors: Story = {
  args: {
    name: 'tabler:check',
  },
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: '24px',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <Icon name='tabler:check' size={32} color='primary' />
        <p style={{ marginTop: '8px', fontSize: '12px' }}>Primary</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Icon name='tabler:check' size={32} color='secondary' />
        <p style={{ marginTop: '8px', fontSize: '12px' }}>Secondary</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Icon name='tabler:check' size={32} color='warning' />
        <p style={{ marginTop: '8px', fontSize: '12px' }}>Warning</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Icon name='tabler:check' size={32} color='success' />
        <p style={{ marginTop: '8px', fontSize: '12px' }}>Success</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Icon name='tabler:check' size={32} color='danger' />
        <p style={{ marginTop: '8px', fontSize: '12px' }}>Danger</p>
      </div>
    </div>
  ),
};

/**
 * 커스텀 컬러 - 토큰의 원시 컬러를 직접 사용할 수 있습니다.
 */
export const CustomColors: Story = {
  args: {
    name: 'tabler:check',
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: 600 }}>
          디자인 토큰 색상
        </h3>
        <div
          style={{
            display: 'flex',
            gap: '24px',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <Icon name='tabler:check' size={32} color={color.blue['600']} />
            <p style={{ marginTop: '8px', fontSize: '12px' }}>Blue 600</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Icon name='tabler:check' size={32} color={color.pink['600']} />
            <p style={{ marginTop: '8px', fontSize: '12px' }}>Pink 600</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Icon name='tabler:check' size={32} color={color.indigo['600']} />
            <p style={{ marginTop: '8px', fontSize: '12px' }}>Indigo 600</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Icon name='tabler:check' size={32} color={color.green['600']} />
            <p style={{ marginTop: '8px', fontSize: '12px' }}>Green 600</p>
          </div>
        </div>
      </div>
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: 600 }}>
          커스텀 Hex 값
        </h3>
        <div
          style={{
            display: 'flex',
            gap: '24px',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <Icon name='tabler:check' size={32} color='#8facff' />
            <p style={{ marginTop: '8px', fontSize: '12px' }}>Custom Blue</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Icon name='tabler:check' size={32} color='#f159cb' />
            <p style={{ marginTop: '8px', fontSize: '12px' }}>Custom Pink</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Icon name='tabler:check' size={32} color='#3fbe75' />
            <p style={{ marginTop: '8px', fontSize: '12px' }}>Custom Green</p>
          </div>
        </div>
      </div>
    </div>
  ),
};

/**
 * 아이콘 사이즈
 */
export const Sizes: Story = {
  args: {
    name: 'tabler:check',
  },
  render: () => (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <Icon name='tabler:check' size={16} color='primary' />
        <p style={{ marginTop: '8px', fontSize: '12px' }}>16px</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Icon name='tabler:check' size={20} color='primary' />
        <p style={{ marginTop: '8px', fontSize: '12px' }}>20px</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Icon name='tabler:check' size={24} color='primary' />
        <p style={{ marginTop: '8px', fontSize: '12px' }}>24px</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Icon name='tabler:check' size={32} color='primary' />
        <p style={{ marginTop: '8px', fontSize: '12px' }}>32px</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Icon name='tabler:check' size={48} color='primary' />
        <p style={{ marginTop: '8px', fontSize: '12px' }}>48px</p>
      </div>
    </div>
  ),
};

export const AllIcons: Story = {
  args: {
    name: 'tabler:check',
  },
  render: () => {
    const icons: IconType[] = [
      'tabler:check',
      'tabler:x',
      'tabler:plus',
      'tabler:minus',
      'tabler:arrow-right',
      'tabler:arrow-left',
      'tabler:search',
      'tabler:settings',
      'tabler:user',
      'tabler:home',
      'tabler:menu',
      'tabler:dots',
      'tabler:edit',
      'tabler:trash',
      'tabler:download',
      'tabler:upload',
    ];

    const handleCopy = (iconName: IconType) => {
      const code = `<Icon name="${iconName}" />`;
      navigator.clipboard.writeText(code);
    };

    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
          gap: '16px',
          maxWidth: '800px',
        }}
      >
        {icons.map((icon) => (
          <button
            key={icon}
            onClick={() => handleCopy(icon)}
            style={{
              background: 'none',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              padding: '16px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#007bff';
              e.currentTarget.style.backgroundColor = '#f8f9fa';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e0e0e0';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <Icon name={icon} size={32} />
            <p
              style={{
                fontSize: '11px',
                margin: 0,
                color: '#6c757d',
                wordBreak: 'break-all',
              }}
            >
              {icon.replace('tabler:', '')}
            </p>
          </button>
        ))}
      </div>
    );
  },
};
