import { rounded } from '../../tokens';

export type RoundedDemoProps = {
  rounded?: keyof typeof rounded;
};

export const RoundedDemo = ({
  rounded: roundedSize = 'none',
}: RoundedDemoProps) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
      }}
    >
      <Box width={100} height={100} rounded={roundedSize} />
      <Box width={200} height={100} rounded={roundedSize} />
    </div>
  );
};

export const Box = ({
  width = 80,
  height = 80,
  rounded: roundedSize = 'none',
}: {
  width?: number;
  height?: number;
  rounded?: keyof typeof rounded;
}) => {
  const radiusValue = rounded[roundedSize];

  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: '#8FACFF',
        borderRadius: `${radiusValue}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '16px',
        fontWeight: 600,
        transition: 'all 0.3s ease',
      }}
    >
      <div style={{ textAlign: 'center', fontSize: '14px' }}>
        {radiusValue}px
        <br />
        <span style={{ fontSize: '12px', opacity: 0.8 }}>{roundedSize}</span>
      </div>
    </div>
  );
};
