export type ResourceKey = 'gold' | 'wood' | 'iron' | 'rum';
export type Resources = Record<ResourceKey, number>;
export type EquipmentSlot = 'head' | 'coat' | 'weapon' | 'boots' | 'ring' | 'amulet';
export type EquipmentRarity = 'Comum' | 'Incomum' | 'Raro' | 'Épico' | 'Lendário';

export interface Equipment {
  id: string;
  name: string;
  slot: EquipmentSlot;
  rarity: EquipmentRarity;
  attack: number;
  defense: number;
  luck: number;
  icon: string;
}

export interface Captain {
  name: string;
  level: number;
  xp: number;
  attack: number;
  defense: number;
  luck: number;
}

export interface Port {
  id: string;
  name: string;
  region: string;
  lat: number;
  lon: number;
  description: string;
}

export interface Voyage {
  id: string;
  fromPortId: string;
  toPortId: string;
  startedAt: number;
  durationMs: number;
  distanceKm: number;
  status: 'sailing' | 'completed';
  claimed: boolean;
}

export interface GameState {
  resources: Resources;
  captain: Captain;
  inventory: Equipment[];
  equipped: Partial<Record<EquipmentSlot, string>>;
  selectedPortId: string;
  voyage: Voyage | null;
  lastSavedAt: number;
}