/**
 * Rounded Global Utility Classes
 * CSS 변수를 참조하는 Tailwind 스타일 유틸리티 클래스
 *
 * @description
 * - HTML에서 직접 사용 가능한 글로벌 클래스 생성
 * - variables.css의 --rounded-* CSS 변수를 참조
 * - 런타임 테마 변경 지원
 *
 * @example
 * import '@/tokens/dev/rounded.global.css';
 *
 * <div className="rounded-md">카드</div>
 * <img className="rounded-full" />
 * <div className="rounded-t-lg">상단만 둥글게</div>
 */
import { globalStyle } from '@vanilla-extract/css';

// 사용 가능한 크기 키
const sizes = ['none', 'xs', 'sm', 'md', 'lg', 'xl', 'full'] as const;

// Border Radius - 전체 .rounded-{size}
sizes.forEach((size) => {
  globalStyle(`.rounded-${size}`, {
    borderRadius: `var(--rounded-${size})`,
  });
});

// Border Radius - 상단 .rounded-t-{size}
sizes.forEach((size) => {
  globalStyle(`.rounded-t-${size}`, {
    borderTopLeftRadius: `var(--rounded-${size})`,
    borderTopRightRadius: `var(--rounded-${size})`,
  });
});

// Border Radius - 우측 .rounded-r-{size}
sizes.forEach((size) => {
  globalStyle(`.rounded-r-${size}`, {
    borderTopRightRadius: `var(--rounded-${size})`,
    borderBottomRightRadius: `var(--rounded-${size})`,
  });
});

// Border Radius - 하단 .rounded-b-{size}
sizes.forEach((size) => {
  globalStyle(`.rounded-b-${size}`, {
    borderBottomLeftRadius: `var(--rounded-${size})`,
    borderBottomRightRadius: `var(--rounded-${size})`,
  });
});

// Border Radius - 좌측 .rounded-l-{size}
sizes.forEach((size) => {
  globalStyle(`.rounded-l-${size}`, {
    borderTopLeftRadius: `var(--rounded-${size})`,
    borderBottomLeftRadius: `var(--rounded-${size})`,
  });
});

// Border Radius - 개별 코너
// 좌상단 .rounded-tl-{size}
sizes.forEach((size) => {
  globalStyle(`.rounded-tl-${size}`, {
    borderTopLeftRadius: `var(--rounded-${size})`,
  });
});

// 우상단 .rounded-tr-{size}
sizes.forEach((size) => {
  globalStyle(`.rounded-tr-${size}`, {
    borderTopRightRadius: `var(--rounded-${size})`,
  });
});

// 우하단 .rounded-br-{size}
sizes.forEach((size) => {
  globalStyle(`.rounded-br-${size}`, {
    borderBottomRightRadius: `var(--rounded-${size})`,
  });
});

// 좌하단 .rounded-bl-{size}
sizes.forEach((size) => {
  globalStyle(`.rounded-bl-${size}`, {
    borderBottomLeftRadius: `var(--rounded-${size})`,
  });
});
