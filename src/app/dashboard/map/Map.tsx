'use client';

import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './map.css';

// Fix Leaflet default icon issue with bundlers
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface Port {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
}

interface Route {
  id: string;
  from: Port;
  to: Port;
  type: string;
  color: string;
}

function AnimatedPolyline({ positions, color }: { positions: [number, number][]; color: string }) {
  const map = useMap();
  const polylineRef = useRef<L.Polyline | null>(null);

  useEffect(() => {
    if (polylineRef.current) {
      polylineRef.current.remove();
    }

    const line = L.polyline(positions, {
      color,
      weight: 2,
      opacity: 0.8,
      dashArray: '8 4',
    }).addTo(map);

    polylineRef.current = line;

    let frame: number;
    let offset = 0;
    const animate = () => {
      offset = (offset + 0.3) % 100;
      line.setStyle({ dashOffset: `-${offset}` });
      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      line.remove();
    };
  }, [map, positions, color]);

  return null;
}

export default function Map() {
  const [ports, setPorts] = useState<Port[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);

  useEffect(() => {
    fetch('/api/routes')
      .then(res => res.json())
      .then(data => {
        setPorts(data.ports);
        setRoutes(data.routes);
      });
  }, []);

  const majorPorts = ports.filter(p =>
    ['上海港', '新加坡港', '鹿特丹港', '洛杉矶港', '汉堡港', '杰贝阿里港'].includes(p.name)
  );

  const cardStyle: React.CSSProperties = {
    position: 'absolute',
    background: 'rgba(15, 23, 42, 0.9)',
    borderRadius: 10,
    padding: '16px 20px',
    zIndex: 1000,
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.1)',
  };

  return (
    <div style={{ position: 'fixed', top: 56, left: 90, right: 0, bottom: 0 }}>
      <MapContainer
        center={[20, 0]}
        zoom={2}
        minZoom={2}
        maxZoom={10}
        style={{ width: '100%', height: '100%' }}
        worldCopyJump
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {routes.map(route => (
          <AnimatedPolyline
            key={route.id}
            positions={[
              [route.from.lat, route.from.lng],
              [route.to.lat, route.to.lng],
            ]}
            color={route.color}
          />
        ))}

        {ports.map(port => (
          <CircleMarker
            key={port.id}
            center={[port.lat, port.lng]}
            radius={majorPorts.includes(port) ? 6 : 4}
            pathOptions={{
              color: majorPorts.includes(port) ? '#f59e0b' : '#60a5fa',
              fillColor: majorPorts.includes(port) ? '#f59e0b' : '#3b82f6',
              fillOpacity: 0.9,
              weight: 2,
            }}
          >
            <Popup>
              <div style={{ fontFamily: 'system-ui', minWidth: 160 }}>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4, color: '#1e293b' }}>
                  {port.name}
                </div>
                <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>
                  {port.country}
                </div>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>
                  坐标: {port.lat.toFixed(2)}, {port.lng.toFixed(2)}
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      {/* Route legend */}
      <div style={{ ...cardStyle, bottom: 24, left: 24 }}>
        <div style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 600, marginBottom: 10 }}>
          航线图例
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 20, height: 2, background: '#3b82f6', borderRadius: 1 }} />
            <span style={{ color: '#94a3b8', fontSize: 12 }}>主要航线</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 20, height: 2, background: '#60a5fa', borderRadius: 1 }} />
            <span style={{ color: '#94a3b8', fontSize: 12 }}>次要航线</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
            <span style={{ color: '#94a3b8', fontSize: 12 }}>主要港口</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6' }} />
            <span style={{ color: '#94a3b8', fontSize: 12 }}>一般港口</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ ...cardStyle, top: 24, right: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 600 }}>航运数据</div>
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#60a5fa', fontSize: 22, fontWeight: 700 }}>{ports.length}</div>
              <div style={{ color: '#64748b', fontSize: 11 }}>港口</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#60a5fa', fontSize: 22, fontWeight: 700 }}>{routes.length}</div>
              <div style={{ color: '#64748b', fontSize: 11 }}>航线</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
