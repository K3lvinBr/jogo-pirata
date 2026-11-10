// Boundary for future online features. Domain/gameplay code should depend on
// this interface rather than a specific WebSocket, REST or multiplayer vendor.
export type RealtimeEvent<T = unknown> = {
  type: string;
  payload: T;
  sentAt: number;
  playerId?: string;
};

export interface RealtimeTransport {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  publish<T>(event: RealtimeEvent<T>): Promise<void>;
  subscribe<T>(eventType: string, listener: (event: RealtimeEvent<T>) => void): () => void;
}

export class OfflineTransport implements RealtimeTransport {
  async connect() {}
  async disconnect() {}
  async publish<T>(_event: RealtimeEvent<T>) {
    console.info('[multiplayer:offline] Evento aguardando transporte online.');
  }
  subscribe<T>(_eventType: string, _listener: (event: RealtimeEvent<T>) => void) {
    return () => undefined;
  }
}
