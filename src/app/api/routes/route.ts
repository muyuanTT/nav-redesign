import { NextResponse } from 'next/server';

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
  type: 'sea' | 'air' | 'rail';
  color: string;
}

const ports: Port[] = [
  { id: 'shanghai', name: '上海港', country: '中国', lat: 31.23, lng: 121.47 },
  { id: 'shenzhen', name: '深圳港', country: '中国', lat: 22.54, lng: 114.06 },
  { id: 'ningbo', name: '宁波港', country: '中国', lat: 29.87, lng: 121.55 },
  { id: 'singapore', name: '新加坡港', country: '新加坡', lat: 1.29, lng: 103.85 },
  { id: 'rotterdam', name: '鹿特丹港', country: '荷兰', lat: 51.92, lng: 4.48 },
  { id: 'losangeles', name: '洛杉矶港', country: '美国', lat: 33.75, lng: -118.25 },
  { id: 'hamburg', name: '汉堡港', country: '德国', lat: 53.55, lng: 9.99 },
  { id: 'dubai', name: '杰贝阿里港', country: '阿联酋', lat: 25.07, lng: 55.27 },
  { id: 'tokyo', name: '东京港', country: '日本', lat: 35.68, lng: 139.69 },
  { id: 'busan', name: '釜山港', country: '韩国', lat: 35.18, lng: 129.08 },
  { id: 'sydney', name: '悉尼港', country: '澳大利亚', lat: -33.87, lng: 151.21 },
  { id: 'capetown', name: '开普敦港', country: '南非', lat: -33.93, lng: 18.42 },
  { id: 'mumbai', name: '孟买港', country: '印度', lat: 19.08, lng: 72.88 },
  { id: ' Santos', name: '桑托斯港', country: '巴西', lat: -23.96, lng: -46.33 },
];

const routes: Route[] = [
  { id: 'r1', from: ports[0], to: ports[5], type: 'sea', color: '#3b82f6' },
  { id: 'r2', from: ports[0], to: ports[2], type: 'sea', color: '#3b82f6' },
  { id: 'r3', from: ports[1], to: ports[5], type: 'sea', color: '#3b82f6' },
  { id: 'r4', from: ports[0], to: ports[3], type: 'sea', color: '#3b82f6' },
  { id: 'r5', from: ports[3], to: ports[4], type: 'sea', color: '#3b82f6' },
  { id: 'r6', from: ports[4], to: ports[5], type: 'sea', color: '#3b82f6' },
  { id: 'r7', from: ports[0], to: ports[6], type: 'sea', color: '#3b82f6' },
  { id: 'r8', from: ports[0], to: ports[7], type: 'sea', color: '#3b82f6' },
  { id: 'r9', from: ports[0], to: ports[8], type: 'sea', color: '#3b82f6' },
  { id: 'r10', from: ports[8], to: ports[5], type: 'sea', color: '#3b82f6' },
  { id: 'r11', from: ports[9], to: ports[5], type: 'sea', color: '#3b82f6' },
  { id: 'r12', from: ports[0], to: ports[10], type: 'sea', color: '#3b82f6' },
  { id: 'r13', from: ports[11], to: ports[6], type: 'sea', color: '#3b82f6' },
  { id: 'r14', from: ports[12], to: ports[7], type: 'sea', color: '#3b82f6' },
  { id: 'r15', from: ports[0], to: ports[13], type: 'sea', color: '#3b82f6' },
  { id: 'r16', from: ports[0], to: ports[4], type: 'sea', color: '#60a5fa' },
  { id: 'r17', from: ports[3], to: ports[6], type: 'sea', color: '#60a5fa' },
  { id: 'r18', from: ports[2], to: ports[9], type: 'sea', color: '#60a5fa' },
];

export async function GET() {
  return NextResponse.json({ ports, routes });
}
