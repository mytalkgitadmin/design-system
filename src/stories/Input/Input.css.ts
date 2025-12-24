import { createVar, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

import { fontWeight } from '../../tokens/dev/helpers/typography';

/**
 * ========================================
 * CSS 변수 정의
 * ========================================
 * 런타임에 Theme에서 동적으로 주입되는 CSS 변수들
 */

// Container & Input 색상
const borderColorVar = createVar(); // 기본 border 색상
const hoverBorderColorVar = createVar(); // hover 시 border 색상
const focusBorderColorVar = createVar(); // focus 시 border 색상
const focusShadowColorVar = createVar(); // focus 시 그림자 색상
const errorBorderColorVar = createVar(); // error 상태 border 색상

const bgColorVar = createVar(); // 배경 색상
const disabledBgColorVar = createVar(); // disabled 배경 색상

// 텍스트 색상
const textColorVar = createVar(); // 입력 텍스트 색상
const placeholderColorVar = createVar(); // placeholder 색상
const disabledTextColorVar = createVar(); // disabled 텍스트 색상

const labelColorVar = createVar(); // label 색상
const helperTextColorVar = createVar(); // helper text 색상
const successTextColorVar = createVar(); // helper text 색상
const errorTextColorVar = createVar(); // error text 색상
const warnTextColorVar = createVar(); // warning text 색상

// 타이포그래피
const fontFamilyVar = createVar();
const fontWeightVar = createVar();

// Label 폰트 크기 (size별)
const labelFontSizeXsVar = createVar();
const labelFontSizeSmVar = createVar();
const labelFontSizeMdVar = createVar();
const labelFontSizeLgVar = createVar();
const labelFontSizeXlVar = createVar();

// 레이아웃
const borderRadiusVar = createVar();

/**
 * ========================================
 * 1. Wrapper 스타일
 * ========================================
 * 전체 Input 컴포넌트를 감싸는 최상위 컨테이너
 * (Label + InputContainer + HelperText)
 */

export const inputWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  width: 'fit-content',
});

export const inputWrapperFull = style({
  width: '100%',
});

/**
 * ========================================
 * 2. Label 관련 스타일
 * ========================================
 */

// Label 기본 스타일
const baseLabel = style({
  fontFamily: fontFamilyVar,
  fontWeight: fontWeight.semibold,
  color: labelColorVar,
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
});

// Label Recipe (size에 따라 fontSize 변경)
export const labelStyle = recipe({
  base: baseLabel,

  variants: {
    size: {
      xs: {
        fontSize: labelFontSizeXsVar,
      },
      sm: {
        fontSize: labelFontSizeSmVar,
      },
      md: {
        fontSize: labelFontSizeMdVar,
      },
      lg: {
        fontSize: labelFontSizeLgVar,
      },
      xl: {
        fontSize: labelFontSizeXlVar,
      },
    },
  },

  defaultVariants: {
    size: 'md',
  },
});

// 필수 입력 표시 (*)
export const requiredMark = style({
  color: errorTextColorVar,
});

// 접근성: 시각적으로 숨김, 스크린 리더에서는 읽힘
export const srOnly = style({
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: '0',
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: '0',
});

/**
 * ========================================
 * 3. Input Container 스타일
 * ========================================
 * Input 요소와 아이콘을 감싸는 컨테이너
 * Border, Background, 상태 변화를 담당
 */

const baseInputContainer = style({
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',

  // 외형
  borderRadius: borderRadiusVar,
  border: `1px solid ${borderColorVar}`,
  backgroundColor: bgColorVar,
  transition: 'all 0.2s ease',

  // 상태별 스타일
  selectors: {
    // Hover: disabled나 focus가 아닐 때만
    '&:hover:not(:has(input:disabled)):not(:has(input:focus))': {
      borderColor: hoverBorderColorVar,
    },

    // Focus: input이 focus 상태일 때
    '&:has(input:focus)': {
      borderColor: focusBorderColorVar,
      boxShadow: `0 0 10px 0 ${focusShadowColorVar}`,
    },

    // Disabled: input이 disabled 상태일 때
    '&:has(input:disabled)': {
      backgroundColor: disabledBgColorVar,
      borderColor: disabledBgColorVar,
    },
  },
});

// Input Container Recipe (variant 지원)
export const inputContainerStyle = recipe({
  base: baseInputContainer,

  variants: {
    error: {
      true: {
        borderColor: errorBorderColorVar,
        selectors: {
          '&:hover:not(:has(input:disabled))': {
            borderColor: focusBorderColorVar,
          },
          '&:has(input:focus)': {
            borderColor: focusBorderColorVar,
          },
        },
      },
    },
  },
});

/**
 * ========================================
 * 4. Input 요소 스타일
 * ========================================
 * 실제 텍스트 입력을 담당하는 input 요소
 * Border는 없고, Container가 border를 담당
 */

const baseInput = style({
  // 타이포그래피
  fontFamily: fontFamilyVar,
  fontWeight: fontWeightVar,
  color: textColorVar,

  // 레이아웃
  display: 'inline-flex',
  alignItems: 'center',
  padding: '0 1em',
  boxSizing: 'border-box',

  // 외형 (Container가 border를 담당하므로 투명)
  backgroundColor: 'transparent',
  border: 'none',
  outline: 'none',

  // 인터랙션
  cursor: 'text',

  // Placeholder
  '::placeholder': {
    color: placeholderColorVar,
  },

  // Disabled 상태
  ':disabled': {
    cursor: 'not-allowed',
    color: disabledTextColorVar,
  },

  // type='number'일 때 기본 스핀 버튼 제거
  '::-webkit-outer-spin-button': {
    WebkitAppearance: 'none',
    margin: 0,
  },
  '::-webkit-inner-spin-button': {
    WebkitAppearance: 'none',
    margin: 0,
  },
  // Firefox용
  selectors: {
    '&[type="number"]': {
      MozAppearance: 'textfield',
    },
  },
});

// Input Recipe (size, full, icon padding)
export const inputStyle = recipe({
  base: baseInput,

  variants: {
    size: {
      xl: {
        height: '64px',
        fontSize: '16px',
      },
      lg: {
        height: '56px',
        fontSize: '16px',
      },
      md: {
        height: '44px',
        fontSize: '14px',
      },
      sm: {
        height: '32px',
        fontSize: '12px',
      },
      xs: {
        height: '26px',
        fontSize: '12px',
      },
    },
    full: {
      true: {
        width: '100%',
      },
    },
    // 아이콘이 있을 때 padding 조정
    leftIcon: {
      true: {
        paddingLeft: '44px',
      },
    },
    rightIcon: {
      true: {
        paddingRight: '44px',
      },
    },
  },
});

/**
 * ========================================
 * 5. Icon Container 스타일
 * ========================================
 * Input 내부에 표시되는 아이콘 컨테이너
 */

export const iconContainer = style({
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  pointerEvents: 'none', // 기본적으로 클릭 불가 (onRightIconClick이 있으면 'auto'로 변경)
  color: textColorVar,
});

export const leftIconContainer = style({
  left: '12px',
});

export const rightIconContainer = style({
  right: '12px',
});

/**
 * ========================================
 * 6. Helper Text 스타일
 * ========================================
 * Input 아래 표시되는 도움말, 에러, 경고 메시지
 */

export const helperTextStyle = style({
  fontFamily: fontFamilyVar,
  fontSize: '12px',
  color: helperTextColorVar,
});

export const successTextStyle = style({
  fontFamily: fontFamilyVar,
  fontSize: '12px',
  color: successTextColorVar,
});

export const errorTextStyle = style({
  fontFamily: fontFamilyVar,
  fontSize: '12px',
  color: errorTextColorVar,
});

export const warnTextStyle = style({
  fontFamily: fontFamilyVar,
  fontSize: '12px',
  color: warnTextColorVar,
});

/**
 * ========================================
 * CSS 변수 Export
 * ========================================
 * Theme에서 런타임에 주입할 CSS 변수들
 */

export const inputVars = {
  // Container & Input 색상
  borderColor: borderColorVar,
  hoverBorderColor: hoverBorderColorVar,
  focusBorderColor: focusBorderColorVar,
  focusShadowColor: focusShadowColorVar,
  errorBorderColor: errorBorderColorVar,
  bgColor: bgColorVar,
  disabledBgColor: disabledBgColorVar,

  // 텍스트 색상
  textColor: textColorVar,
  placeholderColor: placeholderColorVar,
  disabledTextColor: disabledTextColorVar,
  labelColor: labelColorVar,
  helperTextColor: helperTextColorVar,
  successTextColor: successTextColorVar,
  errorTextColor: errorTextColorVar,
  warnTextColor: warnTextColorVar,

  // 타이포그래피
  fontFamily: fontFamilyVar,
  fontWeight: fontWeightVar,

  // Label 폰트 크기 (size별)
  labelFontSizeXs: labelFontSizeXsVar,
  labelFontSizeSm: labelFontSizeSmVar,
  labelFontSizeMd: labelFontSizeMdVar,
  labelFontSizeLg: labelFontSizeLgVar,
  labelFontSizeXl: labelFontSizeXlVar,

  // 레이아웃
  borderRadius: borderRadiusVar,
};
