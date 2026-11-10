import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { EquipmentSlot, GameState, Port, Resources } from '../domain/types';
import { PORTS } from '../domain/caribbean';
import { createVoyage, isVoyageComplete } from '../domain/voyage';
import { rollLoot } from '../domain/loot';
import { loadGame, saveGame } from '../services/storage';
import { webNotificationAdapter } from '../services/notifications';

const initialState: GameState = {
  resources: { gold: 15200, wood: 480, iron: 210, rum: 35 },
  captain: { name: 'Capitão', level: 3, xp: 20, attack: 8, defense: 6, luck: 4 },
  inventory: [],
  equipped: {},
  selectedPortId: 'nassau',
  voyage: null,
  lastSavedAt: Date.now()
};

type GameContextValue = {
  state: GameState;
  hydrated: boolean;
  selectPort: (id: string) => void;
  startVoyage: () => void;
  claimVoyage: () => void;
  equipItem: (id: string, slot: EquipmentSlot) => void;
  addResources: (delta: Partial<Resources>) => void;
};

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let alive = true;
    loadGame().then(saved => {
      if (alive && saved) setState(saved);
      if (alive) setHydrated(true);
    });
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (hydrated) void saveGame(state);
  }, [state, hydrated]);

  useEffect(() => {
    if (!state.voyage || state.voyage.claimed) return;
    if (isVoyageComplete(state.voyage) && state.voyage.status !== 'completed') {
      setState(current => current.voyage ? { ...current, voyage: { ...current.voyage, status: 'completed' } } : current);
      const destination = PORTS.find(p => p.id === state.voyage?.toPortId);
      if (destination) webNotificationAdapter.onVoyageCompleted({ title: 'Viagem concluída', body: `Chegamos a ${destination.name}!`, voyageId: state.voyage.id });
    }
    const timer = setInterval(() => {
      setState(current => {
        if (!current.voyage || current.voyage.status === 'completed' || !isVoyageComplete(current.voyage)) return current;
        return { ...current, voyage: { ...current.voyage, status: 'completed' } };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [state.voyage?.id, state.voyage?.status]);

  const selectPort = useCallback((id: string) => setState(current => ({ ...current, selectedPortId: id })), []);
  const startVoyage = useCallback(() => {
    setState(current => {
      if (current.voyage && !current.voyage.claimed && !isVoyageComplete(current.voyage)) return current;
      const from = PORTS.find(p => p.id === (current.voyage?.toPortId ?? 'havana')) ?? PORTS[0];
      const to = PORTS.find(p => p.id === current.selectedPortId);
      if (!to || to.id === from.id) return current;
      const voyage = createVoyage(from, to);
      webNotificationAdapter.onVoyageStarted({ title: 'Viagem iniciada', body: `Rumo a ${to.name}`, voyageId: voyage.id });
      return { ...current, voyage };
    });
  }, []);
  const claimVoyage = useCallback(() => {
    setState(current => {
      if (!current.voyage || !isVoyageComplete(current.voyage) || current.voyage.claimed) return current;
      const loot = rollLoot();
      return {
        ...current,
        inventory: [loot, ...current.inventory],
        resources: { ...current.resources, gold: current.resources.gold + 250 + Math.round(current.voyage.distanceKm / 5), wood: current.resources.wood + 12, iron: current.resources.iron + 5 },
        captain: { ...current.captain, xp: current.captain.xp + 35 },
        voyage: { ...current.voyage, claimed: true, status: 'completed' }
      };
    });
  }, []);
  const equipItem = useCallback((id: string, slot: EquipmentSlot) => setState(current => ({ ...current, equipped: { ...current.equipped, [slot]: id } })), []);
  const addResources = useCallback((delta: Partial<Resources>) => setState(current => ({
    ...current, resources: { ...current.resources, ...Object.fromEntries(Object.entries(delta).map(([key, value]) => [key, current.resources[key as keyof Resources] + (value ?? 0)])) }
  })), []);

  const value = useMemo(() => ({ state, hydrated, selectPort, startVoyage, claimVoyage, equipItem, addResources }), [state, hydrated, selectPort, startVoyage, claimVoyage, equipItem, addResources]);
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const value = useContext(GameContext);
  if (!value) throw new Error('useGame deve ser usado dentro de GameProvider');
  return value;
}