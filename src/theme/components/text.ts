/**
 * Text 컴포넌트 테마
 * Text의 기본 preset과 색상 정책을 정의
 */

export type TextPreset =
  | 'display1'
  | 'display2'
  | 'title1'
  | 'title2'
  | 'title3'
  | 'title4'
  | 'title5'
  | 'subTitle1'
  | 'subTitle2'
  | 'subTitle3'
  | 'body1'
  | 'body2'
  | 'body3'
  | 'body4'
  | 'label1'
  | 'label2'
  | 'label3'
  | 'caption1'
  | 'caption2';

export type TextTheme = {
  defaultPreset: TextPreset;
  defaultColor: string;
};

export const textTheme: TextTheme = {
  defaultPreset: 'body1',
  defaultColor: '#2f3744',
};
