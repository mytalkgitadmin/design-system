/**
 * Typography Global Utility Classes
 * NPM 패키지로 배포 시 글로벌 CSS 클래스로 사용 가능
 *
 * 사용법:
 * import '@your-package/styles/typography.css';
 * <p className="text-lg font-bold text-center">...</p>
 */
import { globalStyle } from '@vanilla-extract/css';

import * as typography from '../helpers/typography';

// Font Size - .text-{size}
Object.entries(typography.fontSize).forEach(([key, value]) => {
  globalStyle(`.text-${key}`, {
    fontSize: value,
  });
});

// Font Weight - .font-{weight}
globalStyle('.font-regular', {
  fontWeight: '400',
});
globalStyle('.font-semibold', {
  fontWeight: '600',
});
globalStyle('.font-bold', {
  fontWeight: '700',
});

// Line Height - .leading-{height}
Object.entries(typography.lineHeight).forEach(([key, value]) => {
  globalStyle(`.leading-${key}`, {
    lineHeight: value,
  });
});

// Letter Spacing - .tracking-{spacing}
Object.entries(typography.letterSpacing).forEach(([key, value]) => {
  globalStyle(`.tracking-${key}`, {
    letterSpacing: value,
  });
});

// Text Align - .text-{align}
Object.entries(typography.textAlign).forEach(([key, value]) => {
  globalStyle(`.text-${key}`, {
    textAlign: value,
  });
});

// Text Wrap - .text-{wrap}
Object.entries(typography.textWrap).forEach(([key, value]) => {
  const className = key.replace(/([A-Z])/g, '-$1').toLowerCase();
  globalStyle(`.text-${className}`, {
    textWrap: value,
  });
});

// Word Break - .break-{type}
Object.entries(typography.wordBreak).forEach(([key, value]) => {
  const className = key.replace(/([A-Z])/g, '-$1').toLowerCase();
  globalStyle(`.break-${className}`, {
    wordBreak: value,
  });
});

// 추가 유틸리티
globalStyle('.underline', {
  textDecoration: 'underline',
  textUnderlineOffset: '4px',
});

// Truncate - 1줄 말줄임
globalStyle('.truncate-1', {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

// Truncate - 다중 라인 말줄임 (2-10줄)
for (let i = 2; i <= 10; i++) {
  globalStyle(`.truncate-${i}`, {
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: i,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  });
}
