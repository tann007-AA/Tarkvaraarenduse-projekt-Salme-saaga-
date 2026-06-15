import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';

export interface Player {
  id: string;
  token: string;
  name: string;
}

export interface Lobby {
  id: string;
  code: string;
  hostId: string;
  guestId?: string;
  status: 'waiting' | 'active' | 'ended';
}

export interface GameSession {
  sessionId: string;
  role: 'attacker' | 'defender';
  attackerId: string;
  defenderId: string;
  boardState: string[][];
  currentTurn: 'attacker' | 'defender';
  status: 'active' | 'ended';
  winnerId?: string | null;
  winReason?: string | null;
  opponentDisconnected?: boolean;
  disconnectTimeRemaining?: number;
}

export class BoardGameMultiplayerService {
  private static instance: BoardGameMultiplayerService;
  private player: Player | null = null;
  private lobbySocket: Socket | null = null;
  private gameSocket: Socket | null = null;
  private baseUrl = (import.meta as any).env?.VITE_API_URL || 'http://217.146.72.174:3000';

  private constructor() {
    const savedPlayer = localStorage.getItem('hnefatafl_player');
    if (savedPlayer) {
      this.player = JSON.parse(savedPlayer);
    }
  }

  static getInstance(): BoardGameMultiplayerService {
    if (!BoardGameMultiplayerService.instance) {
      BoardGameMultiplayerService.instance = new BoardGameMultiplayerService();
    }
    return BoardGameMultiplayerService.instance;
  }

  getPlayer(): Player | null {
    return this.player;
  }

  async createPlayer(name: string): Promise<Player> {
    const response = await fetch(`${this.baseUrl}/players`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) throw new Error('Failed to create player');
    this.player = await response.json();
    localStorage.setItem('hnefatafl_player', JSON.stringify(this.player));
    return this.player!;
  }

  async createLobby(): Promise<Lobby> {
    if (!this.player) throw new Error('Not authenticated');
    const response = await fetch(`${this.baseUrl}/lobbies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-player-token': this.player.token },
    });
    if (!response.ok) throw new Error('Failed to create lobby');
    return await response.json();
  }

  async getActiveGame(): Promise<{ session: GameSession | null }> {
    if (!this.player) return { session: null };
    const response = await fetch(`${this.baseUrl}/games/active/me`, {
      headers: { 'Authorization': `Bearer ${this.player.token}` },
    });
    if (!response.ok) return { session: null };
    return await response.json();
  }

  connectToLobby(
    onEvent: (event: string, data: any) => void,
    onConnect?: () => void,
    lobbyCode?: string,
  ): Socket {
    if (!this.player) throw new Error('Not authenticated');
    if (this.lobbySocket) this.lobbySocket.disconnect();

    this.lobbySocket = io(`${this.baseUrl}/lobby`, {
      auth: { token: this.player.token },
    });

    this.lobbySocket.on('connect', () => {
      if (lobbyCode) {
        setTimeout(() => {
          this.lobbySocket?.emit('lobby:host', { code: lobbyCode });
        }, 100);
      }
      if (onConnect) onConnect();
    });

    this.lobbySocket.onAny((event: string, ...args: any[]) => {
      onEvent(event, args[0]);
    });

    return this.lobbySocket;
  }

  connectToGame(
    sessionId: string,
    onEvent: (event: string, data: any) => void,
    onConnect?: () => void,
  ): Socket {
    if (!this.player) throw new Error('Not authenticated');
    if (this.gameSocket) this.gameSocket.disconnect();

    this.gameSocket = io(`${this.baseUrl}/game`, {
      auth: { token: this.player.token },
    });

    this.gameSocket.on('connect', () => {
      setTimeout(() => {
        this.gameSocket?.emit('game:join', { sessionId });
      }, 100);
      if (onConnect) onConnect();
    });

    this.gameSocket.onAny((event: string, ...args: any[]) => {
      onEvent(event, args[0]);
    });

    return this.gameSocket;
  }

  disconnectLobby(): void {
    if (this.lobbySocket) {
      this.lobbySocket.disconnect();
      this.lobbySocket = null;
    }
  }

  disconnectGame(): void {
    if (this.gameSocket) {
      this.gameSocket.disconnect();
      this.gameSocket = null;
    }
  }

  emitLobby(event: string, data?: any): void {
    if (this.lobbySocket) this.lobbySocket.emit(event, data);
  }

  emitGame(event: string, data?: any): void {
    if (this.gameSocket) this.gameSocket.emit(event, data);
  }
}
