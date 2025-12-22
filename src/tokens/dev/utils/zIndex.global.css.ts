/**
 * Z-Index Global Utility Classes
 * CSS 변수를 참조하는 Tailwind 스타일 유틸리티 클래스
 *
 * @description
 * - HTML에서 직접 사용 가능한 글로벌 클래스 생성
 * - variables.css의 --z-* CSS 변수를 참조
 * - 레이어 순서 관리를 위한 시맨틱한 클래스명 제공
 *
 * @example
 * import '@/tokens/dev/zIndex.global.css';
 *
 * <div className="z-modal">모달</div>
 * <div className="z-tooltip">툴팁</div>
 * <div className="z-overlay">오버레이</div>
 */
import { globalStyle } from '@vanilla-extract/css';

// 사용 가능한 z-index 레벨
const levels = [
  'hide',
  'base',
  'docked',
  'dropdown',
  'sticky',
  'banner',
  'overlay',
  'modal',
  'popover',
  'skipLink',
  'toast',
  'tooltip',
] as const;

// Z-Index 유틸리티 클래스 .z-{level}
levels.forEach((level) => {
  globalStyle(`.z-${level}`, {
    zIndex: `var(--z-${level})`,
  });
});
