import { useState } from 'react';

import { color } from '../../tokens';
import { Input } from './index';
import { INPUT_COLOR_PRESETS, INPUT_SIZES, INPUT_TYPES } from './types';

import type { Meta, StoryObj } from '@storybook/react';

/**
 * Input 컴포넌트는 사용자로부터 텍스트 입력을 받는 기본 입력 필드입니다.
 *
 * ## 주요 기능
 * - **크기**: xs, sm, md, lg, xl (Label 폰트 크기도 자동 조정)
 * - **타입**: text, password, email, tel, number
 * - **컬러**: 시맨틱 프리셋(primary, secondary) 및 커스텀 hex/rgb
 * - **상태**: hover, focus, disabled 자동 처리
 * - **레이아웃**: full width 옵션
 *
 * ## Label & 접근성
 * - **label** (필수): 접근성을 위해 항상 제공해야 합니다
 * - **required**: 필수 입력 표시 (*)
 * - **hiddenLabel**: 시각적으로 숨기고 스크린 리더만 읽음
 *
 * ## 아이콘
 * - **leftIcon / rightIcon**: 좌/우측 아이콘 표시
 * - **onLeftIconClick / onRightIconClick**: 아이콘을 클릭 가능하게 만듦
 *
 * ## 상태 메시지
 * ```tsx
 * <Input status="help" statusMessage="도움말 메시지" />
 * <Input status="success" statusMessage="성공 메시지" />
 * <Input status="warn" statusMessage="경고 메시지" />
 * <Input status="error" statusMessage="에러 메시지" />
 *
 * // 아이콘 표시
 * <Input status="success" statusMessage="성공!" showStatusIcon />
 * ```
 *
 * ## 컬러 사용법
 * ```tsx
 * // 시맨틱 프리셋
 * <Input color="primary" />
 * <Input color="secondary" />
 *
 * // 커스텀 컬러
 * <Input color="#8facff" />
 * <Input color="rgb(143, 172, 255)" />
 * ```
 */
const meta = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs', '!dev'],
  argTypes: {
    size: {
      control: 'select',
      options: INPUT_SIZES,
      description: 'Input size',
      table: {
        category: 'Appearance',
      },
    },
    color: {
      control: 'select',
      options: [
        ...INPUT_COLOR_PRESETS,
        color.blue['500'],
        color.pink['500'],
        color.indigo['500'],
        color.green['600'],
      ],
      description:
        '시맨틱 프리셋(primary, secondary) 또는 토큰 컬러 선택. 커스텀 hex 값은 직접 입력 가능',
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
    label: {
      control: 'text',
      description: 'Label text',
      table: {
        category: 'Label',
      },
    },
    required: {
      control: 'boolean',
      description: 'Required field (shows asterisk)',
      table: {
        category: 'Label',
      },
    },
    status: {
      control: 'select',
      options: ['help', 'success', 'warn', 'error'],
      description: '입력 상태 (help, success, warn, error)',
      table: {
        category: 'Status',
      },
    },
    statusMessage: {
      control: 'text',
      description: '상태 메시지',
      table: {
        category: 'Status',
      },
    },
    showStatusIcon: {
      control: 'boolean',
      description: '상태 아이콘 표시 여부',
      table: {
        category: 'Status',
      },
    },
    leftIcon: {
      control: 'select',
      description: '왼쪽 아이콘',
      table: { category: 'Icons' },
    },
    rightIcon: {
      control: 'select',
      description: '오른쪽 아이콘',
      table: { category: 'Icons' },
    },
    error: {
      control: 'boolean',
      description: 'Error state',
      table: {
        category: 'State',
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
      table: { category: 'State' },
    },

    placeholder: {
      control: 'text',
      description: 'Placeholder text',
      table: { category: 'HTML' },
    },

    value: {
      table: {
        category: 'HTML',
      },
    },
    defaultValue: {
      table: {
        category: 'HTML',
      },
    },
    id: {
      table: {
        category: 'HTML',
      },
    },

    name: {
      table: {
        category: 'HTML',
      },
    },

    onChange: {
      table: {
        category: 'HTML',
      },
    },

    onFocus: {
      table: {
        category: 'HTML',
      },
    },

    onBlur: {
      table: {
        category: 'HTML',
      },
    },

    type: {
      control: 'select',
      options: INPUT_TYPES,
      description: 'Input type',
      table: {
        category: 'HTML',
      },
    },
  },
  args: {
    label: '입력',
    size: 'md',
    color: 'primary',
    type: 'text',
    placeholder: '검색어를 입력하세요',
    disabled: false,
    full: false,
    error: false,
    required: false,
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    label: '입력',
  },
};

/**
 * Input 사이즈
 */
export const Sizes: Story = {
  args: {
    label: '크기',
  },
  render: () => (
    <div
      style={{
        display: 'grid',
        gap: '16px',
      }}
    >
      <Input label='XS' size='xs' />
      <Input label='SM' size='sm' />
      <Input label='MD' size='md' />
      <Input label='LG' size='lg' />
      <Input label='XL' size='xl' />
    </div>
  ),
};

/**
 * 상태
 */
export const State: Story = {
  args: {
    label: '상태',
  },
  render: () => (
    <div
      style={{
        display: 'grid',
        gap: '16px',
      }}
    >
      <Input label='default' />
      <Input label='filled' defaultValue='기본입력값' />
      <Input label='error' status='error' statusMessage='에러 상태입니다' />
      <Input disabled label='disabled' />
    </div>
  ),
};
/**
 * Label과 Required
 */
export const WithLabel: Story = {
  args: {
    label: 'Label',
  },
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '300px',
      }}
    >
      <Input label='이름' placeholder='이름을 입력하세요' />
      <Input
        label='이메일'
        type='email'
        placeholder='email@example.com'
        required
      />
      <Input label='비밀번호' />
    </div>
  ),
};
/**
 * Full Width Input
 */
export const FullWidth: Story = {
  args: {
    label: 'Full Width',
  },
  render: () => (
    <div
      style={{
        width: '400px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <Input label='Full Width' placeholder='Full Width Primary' full />
    </div>
  ),
};

/**
 * 상태 메시지
 * status와 statusMessage를 사용하여 다양한 피드백 제공
 */
export const StatusMessages: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
      }}
    >
      {/* help */}
      <>
        <Input
          label='도움말'
          placeholder='입력하세요'
          status='help'
          statusMessage='도움말 메시지입니다'
        />

        <Input
          label='도움말 (아이콘)'
          placeholder='입력하세요'
          status='help'
          statusMessage='도움말 메시지입니다'
          showStatusIcon
        />
      </>

      {/* success */}
      <>
        <Input
          label='성공'
          type='password'
          placeholder='비밀번호 입력'
          status='success'
          statusMessage='사용 가능한 비밀번호입니다'
        />

        <Input
          label='성공 (아이콘)'
          type='password'
          placeholder='비밀번호 입력'
          status='success'
          statusMessage='사용 가능한 비밀번호입니다'
          showStatusIcon
        />
      </>

      {/* warn */}
      <>
        <Input
          label='경고'
          type='password'
          placeholder='비밀번호 입력'
          status='warn'
          statusMessage='비밀번호 강도가 약합니다'
        />

        <Input
          label='경고 (아이콘)'
          type='password'
          placeholder='비밀번호 입력'
          status='warn'
          statusMessage='비밀번호 강도가 약합니다'
          showStatusIcon
        />
      </>

      {/* error */}
      <>
        <Input
          label='에러'
          type='password'
          placeholder='비밀번호 입력'
          status='error'
          statusMessage='비밀번호는 최소 8자 이상이어야 합니다'
        />

        <Input
          label='에러 (아이콘)'
          type='password'
          placeholder='비밀번호 입력'
          status='error'
          statusMessage='비밀번호는 최소 8자 이상이어야 합니다'
          showStatusIcon
        />
      </>
    </div>
  ),
};

/**
 * 아이콘이 있는 Input
 */
export const WithIcons: Story = {
  args: {
    label: '아이콘',
  },
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '300px',
      }}
    >
      <Input
        label='검색'
        placeholder='검색어를 입력하세요'
        leftIcon='tabler:search'
      />
      <Input
        label='이메일'
        type='email'
        placeholder='email@example.com'
        leftIcon='tabler:mail'
      />
      <Input
        label='전화번호'
        type='tel'
        placeholder='010-1234-5678'
        leftIcon='tabler:phone'
      />
      <Input
        label='URL'
        type='text'
        placeholder='https://example.com'
        rightIcon='tabler:link'
      />
    </div>
  ),
};

/**
 * 비밀번호 토글 예시
 */
export const PasswordToggle: Story = {
  args: {
    label: '비밀번호 토글',
  },
  render: () => {
    const PasswordInput = () => {
      const [showPassword, setShowPassword] = useState(false);
      const [count, setCount] = useState(0);

      return (
        <div
          style={{
            width: '300px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <Input
            label='비밀번호'
            type={showPassword ? 'text' : 'password'}
            placeholder='비밀번호를 입력하세요'
            rightIcon={showPassword ? 'tabler:eye' : 'tabler:eye-off'}
            onRightIconClick={() => setShowPassword(!showPassword)}
            status='help'
            statusMessage='아이콘을 클릭하여 비밀번호를 표시/숨김할 수 있습니다'
          />

          <Input
            label='수량'
            type='number'
            placeholder='0'
            leftIcon='tabler:minus'
            rightIcon='tabler:plus'
            value={count}
            min={0}
            max={100}
            textAlign='center'
            onLeftIconClick={() => setCount((prev) => Math.max(0, prev - 1))}
            onRightIconClick={() => setCount((prev) => Math.min(100, prev + 1))}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 0;
              setCount(Math.max(0, Math.min(100, value)));
            }}
            status='help'
            statusMessage='좌우 아이콘을 클릭하여 수량을 조절할 수 있습니다 (0-100)'
          />
        </div>
      );
    };

    return <PasswordInput />;
  },
};

/**
 * 종합 예제 - 회원가입 폼
 */
export const SignupForm: Story = {
  args: {
    label: '회원가입',
  },
  render: () => {
    const SignupFormComponent = () => {
      const [showPassword, setShowPassword] = useState(false);
      const [showConfirmPassword, setShowConfirmPassword] = useState(false);

      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            width: '400px',
            padding: '24px',
            border: '1px solid #e3e6ee',
            borderRadius: '8px',
          }}
        >
          <h3 style={{ margin: '0 0 8px 0' }}>회원가입</h3>

          <Input
            label='이름'
            placeholder='홍길동'
            required
            full
            status='help'
            statusMessage='실명을 입력해주세요'
          />

          <Input
            label='이메일'
            type='email'
            placeholder='email@example.com'
            leftIcon='tabler:mail'
            required
            full
            status='help'
            statusMessage='로그인 시 사용할 이메일 주소입니다'
          />

          <Input
            label='비밀번호'
            type={showPassword ? 'text' : 'password'}
            placeholder='비밀번호 입력'
            rightIcon={showPassword ? 'tabler:eye' : 'tabler:eye-off'}
            onRightIconClick={() => setShowPassword(!showPassword)}
            required
            full
            status='help'
            statusMessage='8자 이상, 영문/숫자/특수문자 조합'
          />

          <Input
            label='비밀번호 확인'
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder='비밀번호 재입력'
            rightIcon={showConfirmPassword ? 'tabler:eye' : 'tabler:eye-off'}
            onRightIconClick={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
            required
            full
            status='error'
            statusMessage='비밀번호가 일치하지 않습니다'
          />

          <Input
            label='전화번호'
            type='tel'
            placeholder='010-1234-5678'
            leftIcon='tabler:phone'
            full
          />
        </div>
      );
    };

    return <SignupFormComponent />;
  },
};
