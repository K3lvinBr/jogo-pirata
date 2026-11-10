import type { Port, Voyage } from './types';
import { distanceKm } from './caribbean';

export const SHIP_SPEED_KMH = 34;
export const MIN_VOYAGE_MS = 60_000;

export function createVoyage(from: Port, to: Port, now = Date.now()): Voyage {
  const distance = distanceKm(from, to);
  return {
    id: `voyage-${now}`,
    fromPortId: from.id,
    toPortId: to.id,
    startedAt: now,
    distanceKm: distance,
    durationMs: Math.max(MIN_VOYAGE_MS, (distance / SHIP_SPEED_KMH) * 60 * 60 * 1000),
    status: 'sailing',
    claimed: false
  };
}

export function getVoyageProgress(voyage: Voyage, now = Date.now()): number {
  return Math.min(1, Math.max(0, (now - voyage.startedAt) / voyage.durationMs));
}

export function getVoyageRemainingMs(voyage: Voyage, now = Date.now()): number {
  return Math.max(0, voyage.durationMs - (now - voyage.startedAt));
}

export function isVoyageComplete(voyage: Voyage, now = Date.now()): boolean {
  return now >= voyage.startedAt + voyage.durationMs;
}

export function formatDuration(ms: number): string {
  const totalMinutes = Math.ceil(ms / 60_000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`;
}