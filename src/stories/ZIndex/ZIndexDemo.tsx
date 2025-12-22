import { color, zIndex } from '../../tokens';

export type ZIndexDemoProps = {
  level?: keyof typeof zIndex;
};

const layers = [
  { name: 'base', value: zIndex.base, color: '#e3e6ee', textColor: '#4b5465' },
  {
    name: 'docked',
    value: zIndex.docked,
    color: '#c5c9d3',
    textColor: '#2f3744',
  },
  {
    name: 'dropdown',
    value: zIndex.dropdown,
    color: color.blue[200],
    textColor: '#fff',
  },
  {
    name: 'sticky',
    value: zIndex.sticky,
    color: color.blue[200],
    textColor: '#fff',
  },
  {
    name: 'banner',
    value: zIndex.banner,
    color: color.blue[300],
    textColor: '#fff',
  },
  {
    name: 'overlay',
    value: zIndex.overlay,
    color: color.blue[500],
    textColor: '#fff',
  },
  {
    name: 'modal',
    value: zIndex.modal,
    color: color.blue[600],
    textColor: '#fff',
  },
  {
    name: 'popover',
    value: zIndex.popover,
    color: color.blue[700],
    textColor: '#fff',
  },
  {
    name: 'skipLink',
    value: zIndex.skipLink,
    color: color.blue[800],
    textColor: '#fff',
  },
  {
    name: 'toast',
    value: zIndex.toast,
    color: color.blue[900],
    textColor: '#fff',
  },

  {
    name: 'tooltip',
    value: zIndex.tooltip,
    color: color.blue[950],
    textColor: '#fff',
  },
];

export const ZIndexDemo = ({ level = 'base' }: ZIndexDemoProps) => {
  const zValue = zIndex[level];

  return (
    <div
      style={{
        backgroundColor: '#f4f6fb',
        borderRadius: '8px',

        padding: '10px',
        position: 'relative',
        height: '300px',
        width: '800px',

        display: 'flex',
      }}
    >
      {/* 배경 레이어 */}
      {layers.map((layer, index) => (
        <div
          key={layer.name}
          style={{
            width: '80px',
            height: `80px`,
            backgroundColor: layer.color,
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: layer.textColor,
            fontSize: '14px',
            fontWeight: 600,
            boxShadow: index === 0 ? 'none' : '0 2px 8px rgba(0,0,0,0.1)',
            zIndex: layer.value,
          }}
        >
          <div style={{ textAlign: 'center' }}>
            {layer.name}
            <br />
            <span style={{ fontSize: '12px', opacity: 0.8 }}>
              {layer.value}
            </span>
          </div>
        </div>
      ))}

      {/* 선택된 레벨 레이어 */}
      <div
        style={{
          position: 'absolute',
          top: '60px',
          left: '40px',
          width: '750px',
          height: '150px',
          backgroundColor: '#6f94ff',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: parseInt(zValue),
          color: 'white',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}
      >
        <div style={{ textAlign: 'center', fontSize: '16px', fontWeight: 600 }}>
          {level}
          <br />
          <span style={{ fontSize: '14px', opacity: 0.9 }}>
            z-index: {zValue}
          </span>
        </div>
      </div>
    </div>
  );
};

export const LayerStack = () => {
  return (
    <div
      style={{
        display: 'flex',
        gap: '4px',
        alignItems: 'flex-end',
      }}
    >
      {layers.map((layer, index) => (
        <div
          key={layer.name}
          style={{
            width: '80px',
            height: `${60 + index * 20}px`,
            backgroundColor: layer.color,
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: layer.textColor,
            fontSize: '14px',
            fontWeight: 600,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            {layer.name}
            <br />
            <span style={{ fontSize: '12px', opacity: 0.8 }}>
              {layer.value}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
