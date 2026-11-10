import type { Port } from './types';

// Geographic coordinates are real latitude/longitude. The map projects them
// linearly for display; voyage distance uses the great-circle haversine formula.
export const CARIBBEAN_BOUNDS = { west: -90, east: -58, south: 8, north: 28 };

export const PORTS: Port[] = [
  { id: 'havana', name: 'Havana', region: 'Cuba', lat: 23.1136, lon: -82.3666, description: 'Porto movimentado, ideal para começar.' },
  { id: 'nassau', name: 'Nassau', region: 'Bahamas', lat: 25.0443, lon: -77.3504, description: 'Mercado de rumores e contrabandistas.' },
  { id: 'kingston', name: 'Kingston', region: 'Jamaica', lat: 17.9712, lon: -76.7936, description: 'Entreposto de especiarias e rum.' },
  { id: 'santiago', name: 'Santiago', region: 'Cuba', lat: 20.0169, lon: -75.8302, description: 'Estaleiros e reparos navais.' },
  { id: 'santodomingo', name: 'Santo Domingo', region: 'Hispaniola', lat: 18.4861, lon: -69.9312, description: 'Uma cidade rica em oportunidades.' },
  { id: 'sanjuan', name: 'San Juan', region: 'Porto Rico', lat: 18.4655, lon: -66.1057, description: 'Fortaleza espanhola e rotas comerciais.' },
  { id: 'willemstad', name: 'Willemstad', region: 'Curaçao', lat: 12.1224, lon: -68.8824, description: 'Porto seguro no sul do Caribe.' },
  { id: 'cartagena', name: 'Cartagena', region: 'Nova Granada', lat: 10.3910, lon: -75.4794, description: 'Tesouros coloniais e águas perigosas.' },
  { id: 'portobelo', name: 'Portobelo', region: 'Panamá', lat: 9.5528, lon: -79.6547, description: 'Ponto estratégico do comércio do istmo.' },
  { id: 'belize', name: 'Belize', region: 'América Central', lat: 17.2510, lon: -88.7590, description: 'Enseadas escondidas e madeira valiosa.' }
];

export function distanceKm(a: Port, b: Port): number {
  const rad = (v: number) => (v * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const lat1 = rad(a.lat);
  const lat2 = rad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}

export function projectCoordinates(lon: number, lat: number, width: number, height: number) {
  const x = ((lon - CARIBBEAN_BOUNDS.west) / (CARIBBEAN_BOUNDS.east - CARIBBEAN_BOUNDS.west)) * width;
  const y = ((CARIBBEAN_BOUNDS.north - lat) / (CARIBBEAN_BOUNDS.north - CARIBBEAN_BOUNDS.south)) * height;
  return { x, y };
}