import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GameProvider } from './src/state/GameContext';
import { GameShell } from './src/ui/GameShell';

export default function App() {
  return (
    <GameProvider>
      <StatusBar style="light" />
      <GameShell />
    </GameProvider>
  );
}