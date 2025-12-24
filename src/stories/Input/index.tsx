import { assignInlineVars } from '@vanilla-extract/dynamic';

import { useTheme } from '../../theme';
import { Icon } from '../Icon';
import { InputProps } from './types';

import {
  errorTextStyle,
  helperTextStyle,
  iconContainer,
  inputContainerStyle,
  inputStyle,
  inputVars,
  inputWrapper,
  inputWrapperFull,
  labelStyle,
  leftIconContainer,
  requiredMark,
  rightIconContainer,
  srOnly,
  successTextStyle,
  warnTextStyle,
} from './Input.css';

export type { InputProps } from './types';

const iconSize = {
  xs: 14,
  sm: 16,
  md: 18,
  lg: 20,
  xl: 22,
};

// 상태별 아이콘 매핑
const statusIcons = {
  help: 'tabler:check' as const,
  success: 'tabler:check' as const,
  warn: 'tabler:alert-circle-filled' as const,
  error: 'tabler:alert-circle-filled' as const,
};

// 아이콘 버튼 공통 스타일
const iconButtonStyle = {
  pointerEvents: 'auto' as const,
  cursor: 'pointer',
  border: 'none',
  background: 'transparent',
  padding: 0,
};

// Status 메시지 공통 스타일
const statusMessageStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
};

export const Input = ({
  // Appearance
  size = 'md',
  color = 'primary',
  full = false,

  // Label & Helper Text
  hiddenLabel,
  label,
  required = false,

  // Status & Message
  status,
  statusMessage,
  showStatusIcon = false,

  // Icons
  leftIcon,
  rightIcon,
  onLeftIconClick,
  onRightIconClick,

  // State
  disabled = false,
  error = false,

  // HTML Input Props
  type = 'text',
  placeholder = '텍스트를 입력하세요',
  value,
  defaultValue,
  name,
  id,
  min,
  max,

  // Style
  textAlign,

  // Event Handlers
  onChange,
  onFocus,
  onBlur,
}: InputProps) => {
  // 1. 테마 가져오기
  const { global, components } = useTheme();
  const inputTheme = components.Input;

  // 2. 최종 스타일 값 결정 (우선순위: props > component theme > global theme)
  const finalSize = size ?? inputTheme.defaultSize;
  const finalRadius = inputTheme.radius ?? global.radius.sm;
  const finalFontWeight =
    inputTheme.fontWeight ?? global.typography.fontWeight.regular;

  // Label 폰트 크기 기본값 (테마가 없으면 사용)
  const defaultLabelFontSize = {
    xs: global.typography.fontSize.sm,
    sm: global.typography.fontSize.sm,
    md: global.typography.fontSize.md,
    lg: global.typography.fontSize.lg,
    xl: global.typography.fontSize.lg,
  };
  const finalLabelFontSize = inputTheme.labelFontSize ?? defaultLabelFontSize;

  // 3. 컬러 스킴 결정
  // 테마에 정의된 컬러 스킴 찾기 (primary, secondary 등)
  const colorScheme =
    inputTheme.colorSchemes[color as keyof typeof inputTheme.colorSchemes];

  // 없으면 커스텀 컬러로 처리
  const finalColorScheme = colorScheme ?? {
    default: color,
    hover: color,
    focus: color,
    focusShadow: `${color}80`,
    error: global.color.text.negative,
  };

  // ========================================
  // 4. CSS Variables 주입
  // ========================================
  const vars = assignInlineVars({
    // 텍스트 색상
    [inputVars.textColor]: global.color.text.secondary,
    [inputVars.placeholderColor]: global.color.text.muted,
    [inputVars.disabledTextColor]: global.color.text.disabled,

    // Label 색상
    [inputVars.labelColor]: global.color.text.tertiary,

    // Container & Border 색상 (테마 컬러 스킴에서 가져옴)
    [inputVars.borderColor]: finalColorScheme.default,
    [inputVars.hoverBorderColor]: finalColorScheme.hover,
    [inputVars.focusBorderColor]: finalColorScheme.focus,
    [inputVars.focusShadowColor]: finalColorScheme.focusShadow,
    [inputVars.errorBorderColor]: finalColorScheme.error,

    // Background 색상
    [inputVars.bgColor]: global.color.bg.default,
    [inputVars.disabledBgColor]: global.color.bg.disabled,

    // Helper Text 색상
    [inputVars.helperTextColor]: global.color.text.muted,
    [inputVars.successTextColor]: global.color.text.positive,
    [inputVars.errorTextColor]: global.color.text.negative,
    [inputVars.warnTextColor]: global.color.text.warning,

    // 타이포그래피
    [inputVars.fontFamily]: global.typography.fontFamily,
    [inputVars.fontWeight]: String(finalFontWeight),

    // Label 폰트 크기 (size별)
    [inputVars.labelFontSizeXs]: `${finalLabelFontSize.xs}px`,
    [inputVars.labelFontSizeSm]: `${finalLabelFontSize.sm}px`,
    [inputVars.labelFontSizeMd]: `${finalLabelFontSize.md}px`,
    [inputVars.labelFontSizeLg]: `${finalLabelFontSize.lg}px`,
    [inputVars.labelFontSizeXl]: `${finalLabelFontSize.xl}px`,

    // 레이아웃
    [inputVars.borderRadius]: `${finalRadius}px`,
  });

  // ID 생성 (label과 input 연결용)
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div
      className={`${inputWrapper} ${full ? inputWrapperFull : ''}`}
      style={{ ...vars }}
    >
      {/* 접근성 고려: hiddenLabel이 true면 시각적으로만 숨김 */}
      <label
        htmlFor={inputId}
        className={hiddenLabel ? srOnly : labelStyle({ size: finalSize })}
      >
        {label}
        {required && !hiddenLabel && <span className={requiredMark}>*</span>}
      </label>

      {/* Input Container */}
      <div
        className={inputContainerStyle({ error: error || status === 'error' })}
      >
        {/* left Icon */}
        {leftIcon && (
          <>
            {onLeftIconClick ? (
              <button
                type='button'
                className={`${iconContainer} ${leftIconContainer}`}
                style={iconButtonStyle}
                onClick={onLeftIconClick}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onLeftIconClick();
                  }
                }}
              >
                <Icon name={leftIcon} size={iconSize[finalSize]} />
              </button>
            ) : (
              <div className={`${iconContainer} ${leftIconContainer}`}>
                <Icon name={leftIcon} size={iconSize[finalSize]} />
              </div>
            )}
          </>
        )}

        {/* Input Element */}
        <input
          id={inputId}
          name={name}
          type={type}
          className={`${inputStyle({
            size: finalSize,
            full,
            leftIcon: !!leftIcon,
            rightIcon: !!rightIcon,
          })}`}
          style={{
            textAlign: textAlign,
          }}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          min={min}
          max={max}
          disabled={disabled}
          required={required}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
        />

        {/* Right Icon */}
        {rightIcon && (
          <>
            {onRightIconClick ? (
              <button
                type='button'
                className={`${iconContainer} ${rightIconContainer}`}
                style={iconButtonStyle}
                onClick={onRightIconClick}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onRightIconClick();
                  }
                }}
              >
                <Icon name={rightIcon} size={iconSize[finalSize]} />
              </button>
            ) : (
              <div className={`${iconContainer} ${rightIconContainer}`}>
                <Icon name={rightIcon} size={iconSize[finalSize]} />
              </div>
            )}
          </>
        )}
      </div>

      {/* Status Message  */}
      {(() => {
        // Helper function to render status message
        const renderStatusMessage = (
          className: string,
          message: string,
          iconName?: (typeof statusIcons)[keyof typeof statusIcons]
        ) => (
          <div className={className} style={statusMessageStyle}>
            {iconName && showStatusIcon && <Icon name={iconName} size={12} />}
            <span>{message}</span>
          </div>
        );

        // status + statusMessage로 상태 메시지 표시
        if (status && statusMessage) {
          const statusClass = {
            help: helperTextStyle,
            success: successTextStyle,
            warn: warnTextStyle,
            error: errorTextStyle,
          }[status];

          return renderStatusMessage(
            statusClass,
            statusMessage,
            showStatusIcon ? statusIcons[status] : undefined
          );
        }

        return null;
      })()}
    </div>
  );
};
