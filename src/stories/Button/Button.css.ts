import { createVar, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

// CSS 변수 정의 - 런타임에 Theme에서 주입됨
const defaultColorVar = createVar();
const hoverColorVar = createVar();
const activeColorVar = createVar();
const textColorVar = createVar();
const disabledColorVar = createVar();
const fontFamilyVar = createVar();
const fontWeightVar = createVar();
const borderRadiusVar = createVar();
const disabledBgColorVar = createVar();
const disabledTextColorVar = createVar();

const baseButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,

  cursor: 'pointer',
  border: 'none',

  transition: 'all 0.2s ease',

  gap: '8px',
  borderRadius: borderRadiusVar,

  fontFamily: fontFamilyVar,
  fontWeight: fontWeightVar,
  boxSizing: 'border-box',
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

        '&:hover:not(:disabled)': {
          backgroundColor: hoverColorVar,
        },
        '&:active:not(:disabled)': {
          backgroundColor: activeColorVar,
        },
        '&:disabled': {
          backgroundColor: disabledBgColorVar,
          color: disabledTextColorVar,
        },
      },
      outline: {
        backgroundColor: 'transparent',
        color: defaultColorVar,
        border: `1px solid ${defaultColorVar}`,

        '&:hover:not(:disabled)': {
          color: hoverColorVar,
          borderColor: hoverColorVar,
        },
        '&:active:not(:disabled)': {
          color: activeColorVar,
          borderColor: activeColorVar,
        },
        '&:disabled': {
          border: 'none',
          backgroundColor: disabledBgColorVar,
          color: disabledTextColorVar,
        },
      },
    },
    size: {
      xl: {
        height: '64px',
        fontSize: '16px',
        padding: '0 32px',
      },
      lg: {
        height: '56px',
        fontSize: '16px',
        padding: '0 24px',
      },
      md: {
        height: '44px',
        fontSize: '14px',
        padding: '0 20px',
      },
      sm: {
        height: '34px',
        fontSize: '12px',
        padding: '0 12px',
      },
      xs: {
        height: '26px',
        fontSize: '12px',
        padding: '0 8px',
      },
    },
    full: {
      true: {
        width: '100%',
      },
    },
    leftIcon: {
      true: {},
    },
    rightIcon: { true: {} },
    icon: {
      true: {
        padding: 0,
        width: 'auto',
        aspectRatio: '1/1',
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
  fontFamily: fontFamilyVar,
  fontWeight: fontWeightVar,
  borderRadius: borderRadiusVar,
  disabledBgColor: disabledBgColorVar,
  disabledTextColor: disabledTextColorVar,
};
