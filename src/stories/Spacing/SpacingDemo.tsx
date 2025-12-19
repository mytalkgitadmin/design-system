import { spacing } from '../../tokens/dev/spacing';

export interface SpacingDemoProps {
  margin?: keyof typeof spacing;
  marginTop?: keyof typeof spacing;
  marginRight?: keyof typeof spacing;
  marginBottom?: keyof typeof spacing;
  marginLeft?: keyof typeof spacing;
  padding?: keyof typeof spacing;
  paddingTop?: keyof typeof spacing;
  paddingRight?: keyof typeof spacing;
  paddingBottom?: keyof typeof spacing;
  paddingLeft?: keyof typeof spacing;
  gap?: keyof typeof spacing;
  gapY?: keyof typeof spacing;
  gapX?: keyof typeof spacing;
}

export function SpacingDemo({
  margin = 0,
  marginTop: marginTopProp,
  marginRight: marginRightProp,
  marginBottom: marginBottomProp,
  marginLeft: marginLeftProp,
  padding = 0,
  paddingTop: paddingTopProp,
  paddingRight: paddingRightProp,
  paddingBottom: paddingBottomProp,
  paddingLeft: paddingLeftProp,
  gap = 0,
  gapY: gapYProp,
  gapX: gapXProp,
}: SpacingDemoProps) {
  // 일괄 적용(margin)이 있으면 우선 사용, 없으면 개별 값 사용
  const marginTop = marginTopProp ?? margin;
  const marginRight = marginRightProp ?? margin;
  const marginBottom = marginBottomProp ?? margin;
  const marginLeft = marginLeftProp ?? margin;

  // 일괄 적용(padding)이 있으면 우선 사용, 없으면 개별 값 사용
  const paddingTop = paddingTopProp ?? padding;
  const paddingRight = paddingRightProp ?? padding;
  const paddingBottom = paddingBottomProp ?? padding;
  const paddingLeft = paddingLeftProp ?? padding;

  // 일괄 적용(gap)이 있으면 우선 사용, 없으면 개별 값 사용
  const gapY = gapYProp ?? gap;
  const gapX = gapXProp ?? gap;

  const hasMargin =
    marginTop > 0 || marginRight > 0 || marginBottom > 0 || marginLeft > 0;
  const hasPadding =
    paddingTop > 0 || paddingRight > 0 || paddingBottom > 0 || paddingLeft > 0;

  return (
    <div
      style={{
        width: '600px',
        maxWidth: '100%',
        backgroundColor: '#fef3c7',
        border: hasMargin ? '1px solid #f59e0b' : 0,
        borderRadius: '12px',
      }}
    >
      <div
        style={{
          border: hasPadding ? '1px dashed #818cf8' : 0,
          marginTop: spacing[marginTop],
          marginRight: spacing[marginRight],
          marginBottom: spacing[marginBottom],
          marginLeft: spacing[marginLeft],
          paddingTop: spacing[paddingTop],
          paddingRight: spacing[paddingRight],
          paddingBottom: spacing[paddingBottom],
          paddingLeft: spacing[paddingLeft],
          backgroundColor: '#e0e7ff',
          borderRadius: '8px',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            rowGap: spacing[gapY],
            columnGap: spacing[gapX],
            background: `
              repeating-linear-gradient(
                -45deg,
                #fff,
                #fff 8px,
                #ccc 8px,
                #fff 9px
              )
            `,
            borderRadius: '8px',
          }}
        >
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <div
              key={num}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100px',
                backgroundColor: '#1e90ff',
                border: '1px solid #0b7defff',
                color: 'white',
                fontSize: '24px',
                fontWeight: 700,
                borderRadius: '8px',
              }}
            >
              {String(num).padStart(2, '0')}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
