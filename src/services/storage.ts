import AsyncStorage from '@react-native-async-storage/async-storage';
import type { GameState } from '../domain/types';

const SAVE_KEY = 'corsarios-do-caribe:save:v1';

export async function loadGame(): Promise<GameState | null> {
  try {
    const raw = await AsyncStorage.getItem(SAVE_KEY);
    return raw ? (JSON.parse(raw) as GameState) : null;
  } catch (error) {
    console.warn('[save] Não foi possível carregar o jogo:', error);
    return null;
  }
}

export async function saveGame(state: GameState): Promise<void> {
  try {
    await AsyncStorage.setItem(SAVE_KEY, JSON.stringify({ ...state, lastSavedAt: Date.now() }));
  } catch (error) {
    console.warn('[save] Não foi possível salvar o jogo:', error);
  }
}