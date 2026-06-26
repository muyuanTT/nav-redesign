'use client';

import dynamic from 'next/dynamic';

const MapPage = dynamic(() => import('./Map'), {
  ssr: false,
  loading: () => (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0f172a',
      color: '#64748b',
      fontSize: '14px',
    }}>
      地图加载中...
    </div>
  ),
});

export default function Page() {
  return <MapPage />;
}
