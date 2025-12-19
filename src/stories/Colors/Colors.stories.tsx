import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Palette, { type CopyFormat } from './Palette';
import { color } from '../../tokens/auto';

/**
 * Colors 컴포넌트는 디자인 시스템의 색상 팔레트를 보여줍니다.
 *
 * ## 사용법
 * 각 색상을 클릭하면 선택한 형식으로 복사됩니다.
 *
 * ### 1. JavaScript/TypeScript - 토큰 사용
 * ```tsx
 * import { color } from '@/tokens';
 *
 * const blueColor = color.blue[500]; // "#6f94ff"
 * const grayColor = color.gray[900]; // "#2f3744"
 * ```
 *
 * ### 2. CSS 변수 사용
 * `var(--blue-500)`
 * ```css
 * .custom {
 *   background-color: var(--blue-500);
 *   color: var(--gray-900);
 * }
 * .overlay {
 *   background-color: var(--alpha-b8);
 * }
 * ```

 */
const meta = {
  title: 'Foundation/Colors',
  component: Palette,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs', '!dev'],
} satisfies Meta<typeof Palette>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllColors: Story = {
  args: {
    title: 'All Colors',
    colors: color.gray,
  },
  render: () => {
    const [copyFormat, setCopyFormat] = useState<CopyFormat>('hex');

    return (
      <div className='maxWidth'>
        {/* Header */}
        <section>
          <h1>Colors</h1>
          <p>
            디자인 시스템의 색상 팔레트입니다. 각 색상을 클릭하면 선택한
            형식으로 복사됩니다.
          </p>

          <div style={{ marginTop: '16px' }}>
            <label
              htmlFor='copy-format'
              style={{ marginRight: '8px', fontWeight: '500' }}
            >
              복사 형식:
            </label>
            <select
              id='copy-format'
              value={copyFormat}
              onChange={(e) => setCopyFormat(e.target.value as CopyFormat)}
              style={{
                padding: '8px 12px',
                fontSize: '14px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                backgroundColor: 'white',
                cursor: 'pointer',
                minWidth: '150px',
              }}
            >
              <option value='hex'>HEX (#6f94ff)</option>
              <option value='token'>Token (color.blue[500])</option>
              <option value='var'>CSS Variable (var(--blue-500))</option>
            </select>
          </div>
        </section>

        {/* Base Colors Section */}
        <section className='container'>
          <h2>Base</h2>

          <div className='grid2'>
            {Object.entries(color.base).map(([name, value]) => (
              <Palette
                key={name}
                color={value}
                name={name}
                isBorder={true}
                copyFormat={copyFormat}
              />
            ))}
          </div>
        </section>

        <section className='container'>
          <h2>Color</h2>

          {/* Color palettes */}
          <Palette title='Gray' colors={color.gray} copyFormat={copyFormat} />
          <Palette title='Blue' colors={color.blue} copyFormat={copyFormat} />
          <Palette title='Red' colors={color.red} copyFormat={copyFormat} />
          <Palette title='Green' colors={color.green} copyFormat={copyFormat} />
          <Palette title='Pink' colors={color.pink} copyFormat={copyFormat} />
          <Palette
            title='Indigo'
            colors={color.indigo}
            copyFormat={copyFormat}
          />
          <Palette
            title='Yellow'
            colors={color.yellow}
            copyFormat={copyFormat}
          />
        </section>

        {/* Alpha Colors Section */}
        <section className='container'>
          <h2>Alpha Colors</h2>
          <p
            style={{ fontSize: '14px', color: '#888e9c', marginBottom: '24px' }}
          >
            투명도가 적용된 흑백 색상입니다. 클릭하면 HEX 코드가 복사됩니다.
          </p>

          {/* White alpha colors */}

          <div
            className='grid7'
            style={{
              padding: '10px',
              background: '#000',
              color: '#fff',
            }}
          >
            {Object.entries(color.alpha)
              .filter(([name]) => name.startsWith('w'))
              .sort((a, b) => {
                const numA = parseInt(a[0].substring(1)) || 0;
                const numB = parseInt(b[0].substring(1)) || 0;
                return numA - numB;
              })
              .map(([name, value]) => (
                <Palette
                  key={name}
                  color={value}
                  name={name}
                  copyFormat={copyFormat}
                />
              ))}
          </div>

          {/* Black alpha colors */}
          <div
            className='grid7'
            style={{
              padding: '10px',
              border: '1px solid #eee',
            }}
          >
            {Object.entries(color.alpha)
              .filter(([name]) => name.startsWith('b'))
              .sort((a, b) => {
                const numA = parseInt(a[0].substring(1)) || 0;
                const numB = parseInt(b[0].substring(1)) || 0;
                return numA - numB;
              })
              .map(([name, value]) => (
                <Palette
                  key={name}
                  color={value}
                  name={name}
                  copyFormat={copyFormat}
                />
              ))}
          </div>
        </section>
      </div>
    );
  },
};
