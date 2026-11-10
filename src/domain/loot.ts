import type { Equipment, EquipmentRarity, EquipmentSlot } from './types';

const LOOT_TABLE: Array<Omit<Equipment, 'id'> & { weight: number }> = [
  { name: 'Sabre enferrujado', slot: 'weapon', rarity: 'Comum', attack: 2, defense: 0, luck: 0, icon: '⚔️', weight: 42 },
  { name: 'Casaco de marinheiro', slot: 'coat', rarity: 'Comum', attack: 0, defense: 2, luck: 0, icon: '🧥', weight: 30 },
  { name: 'Botas do corsário', slot: 'boots', rarity: 'Incomum', attack: 0, defense: 2, luck: 1, icon: '🥾', weight: 16 },
  { name: 'Anel das marés', slot: 'ring', rarity: 'Raro', attack: 1, defense: 1, luck: 3, icon: '💍', weight: 8 },
  { name: 'Lâmina do Kraken', slot: 'weapon', rarity: 'Épico', attack: 9, defense: 1, luck: 2, icon: '🗡️', weight: 3 },
  { name: 'Amuleto do tesouro', slot: 'amulet', rarity: 'Lendário', attack: 2, defense: 2, luck: 8, icon: '📿', weight: 1 }
];

export function rollLoot(now = Date.now()): Equipment {
  const total = LOOT_TABLE.reduce((sum, item) => sum + item.weight, 0);
  let roll = Math.random() * total;
  const chosen = LOOT_TABLE.find(item => (roll -= item.weight) <= 0) ?? LOOT_TABLE[0];
  const { weight: _weight, ...equipment } = chosen;
  return { ...equipment, id: `loot-${now}-${Math.floor(Math.random() * 10000)}` };
}

export function rarityColor(rarity: EquipmentRarity): string {
  return ({ Comum: '#aeb9c4', Incomum: '#69c58a', Raro: '#54a8ed', Épico: '#bd82f4', Lendário: '#f4bd55' })[rarity];
}

export const SLOT_LABELS: Record<EquipmentSlot, string> = {
  head: 'Cabeça', coat: 'Casaco', weapon: 'Arma', boots: 'Botas', ring: 'Anel', amulet: 'Amuleto'
};