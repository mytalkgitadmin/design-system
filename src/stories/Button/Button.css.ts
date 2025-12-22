import { createVar, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

import { font } from '../../tokens';

// CSS 변수 정의
const defaultColorVar = createVar();
const hoverColorVar = createVar();
const activeColorVar = createVar();
const textColorVar = createVar();
const disabledColorVar = createVar();

const basePaddingVar = '1.2em';

const baseButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,

  cursor: 'pointer',
  border: 'none',

  transition: 'all 0.2s ease',

  gap: '8px',
  borderRadius: '4px',

  padding: `0 ${basePaddingVar}`,

  fontFamily: font.family.Pretendard,
  fontWeight: font.weight.semibold,

  ':disabled': {
    cursor: 'not-allowed',
  },
});

export const buttonStyle = recipe({
  base: baseButton,

  variants: {
    variant: {
      solid: {
        backgroundColor: defaultColorVar,
        color: textColorVar,
        border: 'none',

        ':hover:not(:disabled)': {
          backgroundColor: hoverColorVar,
        },
        ':active:not(:disabled)': {
          backgroundColor: activeColorVar,
        },
        ':disabled': {
          backgroundColor: disabledColorVar,
          color: '#a6acb7',
        },
      },
      outline: {
        backgroundColor: 'transparent',
        color: defaultColorVar,
        border: `1px solid ${defaultColorVar}`,

        ':hover:not(:disabled)': {
          backgroundColor: defaultColorVar,
          color: textColorVar,
          borderColor: hoverColorVar,
        },
        ':active:not(:disabled)': {
          backgroundColor: hoverColorVar,
          borderColor: activeColorVar,
        },
        ':disabled': {
          borderColor: disabledColorVar,
          color: '#a6acb7',
        },
      },
    },
    size: {
      sm: { height: '40px', fontSize: '14px' },
      md: { height: '44px', fontSize: '16px' },
      lg: { height: '52px', fontSize: '18px' },
    },
    full: {
      true: {
        width: '100%',
      },
    },
    withIcon: {
      true: {
        paddingLeft: `calc(${basePaddingVar} + 0.2em)`,

        '& span': {
          position: 'relative',
          paddingLeft: '0.5em',

          '&::before': {
            content: "''",
            display: 'block',
            width: '1px',
            height: '0.7em',
            backgroundColor: 'currentColor',
            position: 'absolute',
            top: '50%',
            left: '0',
            transform: 'translateY(-50%)',
          },
        },
      },
    },
  },
});

// vars 객체 export
export const buttonVars = {
  defaultColor: defaultColorVar,
  hoverColor: hoverColorVar,
  activeColor: activeColorVar,
  textColor: textColorVar,
  disabledColor: disabledColorVar,
};
