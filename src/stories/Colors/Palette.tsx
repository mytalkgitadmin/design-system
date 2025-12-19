import { useState } from 'react';

import styles from './Palette.module.css';

export type CopyFormat = 'hex' | 'token' | 'var';

export interface PaletteProps {
  color?: string;
  name?: string;
  isBorder?: boolean;
  title?: string;
  colors?: {
    [key: string]: string;
  };
  copyFormat?: CopyFormat;
}

const ColorBox: React.FC<{
  color: string;
  name: string;
  isBorder?: boolean;
  copyFormat: CopyFormat;
}> = ({ color, name, isBorder, copyFormat }) => {
  const [copied, setCopied] = useState(false);

  const getFormattedValue = (format: CopyFormat): string => {
    const nameParts = name.toLowerCase().split('-');

    switch (format) {
      case 'hex':
        return color;
      case 'token':
        // gray-500 -> color.gray[500]
        if (nameParts.length === 2) {
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

const Palette: React.FC<PaletteProps> = (props) => {
  const defaultCopyFormat: CopyFormat = props.copyFormat || 'hex';

  if (props.title && props.colors) {
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
              />
            ) : (
              <div key={shade} />
            );
          })}
        </div>
      </section>
    );
  }

  if (props.color && props.name) {
    return (
      <ColorBox
        color={props.color}
        name={props.name}
        isBorder={props.isBorder}
        copyFormat={defaultCopyFormat}
      />
    );
  }

  return null;
};

export default Palette;
