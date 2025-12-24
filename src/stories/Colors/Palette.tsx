import { useState } from 'react';

import styles from './Palette.module.css';

export type CopyFormat = 'hex' | 'token' | 'var';

export type PaletteProps = {
  color?: string;
  name?: string;
  isBorder?: boolean;
  title?: string;
  colors?: {
    [key: string]: string;
  };
  copyFormat?: CopyFormat;
  category?: 'primitive' | 'semantic' | 'brand';
  description?: string;
};

const ColorBox: React.FC<{
  color: string;
  name: string;
  isBorder?: boolean;
  copyFormat: CopyFormat;
  category?: 'primitive' | 'semantic' | 'brand';
}> = ({ color, name, isBorder, copyFormat, category = 'primitive' }) => {
  const [copied, setCopied] = useState(false);

  const getFormattedValue = (format: CopyFormat): string => {
    const nameParts = name.toLowerCase().split('-');

    switch (format) {
      case 'hex':
        return color;
      case 'token':
        // Semantic 색상: bg-default -> color.bg.default
        if (category === 'semantic') {
          if (nameParts.length >= 2) {
            return `color.${nameParts[0]}.${nameParts.slice(1).join('-')}`;
          }
        }
        // Brand 색상: brand-1-default -> theme.brand1.default
        if (category === 'brand') {
          // "Brand 1 (Blue)-default" → ["brand", "1", "(blue)", "default"]
          // "brand1-default" → ["brand1", "default"]
          const brandParts = name.toLowerCase().replace(/\s+/g, '-').split('-');

          // "Brand 1"이나 "Brand 2" 형식 처리
          if (brandParts[0] === 'brand' && brandParts[1].match(/\d/)) {
            const brandNum = brandParts[1];
            const propName = brandParts
              .filter((p) => !p.match(/\(|\)/))
              .slice(2)
              .join('-');
            return `theme.brand${brandNum}.${propName}`;
          }

          // "brand1" 형식 처리
          return `theme.${nameParts[0]}.${nameParts.slice(1).join('-')}`;
        }
        // Primitive 색상: gray-500 -> color.gray[500]
        if (nameParts.length === 2 && !isNaN(Number(nameParts[1]))) {
          return `color.${nameParts[0]}[${nameParts[1]}]`;
        }
        // w8, b100 등 alpha 색상
        if (nameParts[0].match(/^[wb]\d+$/)) {
          return `color.alpha.${nameParts[0]}`;
        }
        // white, black 등
        return `color.base.${nameParts[0]}`;
      case 'var':
        // gray-500 -> var(--gray-500)
        return `var(--${name.toLowerCase()})`;
      default:
        return color;
    }
  };

  const handleClick = () => {
    const valueToCopy = getFormattedValue(copyFormat);
    navigator.clipboard.writeText(valueToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={styles.click} onClick={handleClick}>
      <div
        className={styles.box}
        style={{
          backgroundColor: color,
          border: isBorder ? '1px solid #eee' : '0',
          position: 'relative',
        }}
      >
        {copied && (
          <div className={styles.copy}>{getFormattedValue(copyFormat)}</div>
        )}
      </div>
      <p className={styles.text}>
        <strong>{name.toLowerCase()}</strong>
        <br />
        <span>{color}</span>
      </p>
    </div>
  );
};

export const Palette: React.FC<PaletteProps> = (props) => {
  const defaultCopyFormat: CopyFormat = props.copyFormat || 'hex';

  // Primitive 색상 팔레트 (50-950 shades)
  if (props.title && props.colors && props.category === 'primitive') {
    const shades = [
      '50',
      '100',
      '200',
      '300',
      '400',
      '500',
      '600',
      '700',
      '800',
      '900',
      '950',
    ];

    return (
      <section>
        <h3>{props.title}</h3>

        <div className='grid11'>
          {shades.map((shade) => {
            const colorValue = props.colors![shade];
            return colorValue ? (
              <ColorBox
                key={shade}
                name={`${props.title}-${shade}`}
                color={colorValue}
                copyFormat={defaultCopyFormat}
                category='primitive'
              />
            ) : (
              <div key={shade} />
            );
          })}
        </div>
      </section>
    );
  }

  // Semantic 또는 Brand 색상 팔레트 (키-값 형태)
  if (props.title && props.colors) {
    return (
      <section>
        <h3>{props.title}</h3>
        {props.description && (
          <p
            style={{ fontSize: '14px', color: '#888e9c', marginBottom: '16px' }}
          >
            {props.description}
          </p>
        )}

        <div className='grid7'>
          {Object.entries(props.colors).map(([key, value]) => (
            <ColorBox
              key={key}
              name={`${props.title}-${key}`}
              color={value}
              copyFormat={defaultCopyFormat}
              category={props.category}
              isBorder={value === '#ffffff' || value.toLowerCase() === '#fff'}
            />
          ))}
        </div>
      </section>
    );
  }

  // 단일 색상 박스
  if (props.color && props.name) {
    return (
      <ColorBox
        color={props.color}
        name={props.name}
        isBorder={props.isBorder}
        copyFormat={defaultCopyFormat}
        category={props.category}
      />
    );
  }

  return null;
};
