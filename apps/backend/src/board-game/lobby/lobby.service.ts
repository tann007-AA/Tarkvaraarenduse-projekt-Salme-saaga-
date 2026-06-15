// src/lobby/lobby.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { DbService } from '../../db/db.service';
import { lobbies, gameSessions, type Lobby, type GameSession } from '../../db/schema';
import { HnefataflEngine } from '../hnefatafl/hnefatafl.engine';

@Injectable()
export class LobbyService {
  constructor(private db: DbService) {}

  async create(hostId: string): Promise<Lobby> {
    const code = await this.generateUniqueCode();

    const newLobby = {
      id: uuidv4(),
      code,
      hostId,
      status: 'waiting' as const,
    };

    await this.db.db.insert(lobbies).values(newLobby);
    const lobby = await this.findByCode(code);
    if (!lobby) throw new Error('Failed to create lobby');
    return lobby;
  }

  async findByCode(code: string): Promise<Lobby | null> {
    return this.db.db
      .select()
      .from(lobbies)
      .where(eq(lobbies.code, code))
      .limit(1)
      .then((r) => r[0] ?? null);
  }

  async addGuest(code: string, guestId: string): Promise<void> {
    await this.db.db.update(lobbies).set({ guestId }).where(eq(lobbies.code, code));
  }

  async removeGuest(code: string): Promise<void> {
    await this.db.db.update(lobbies).set({ guestId: null }).where(eq(lobbies.code, code));
  }

  async abandon(code: string): Promise<void> {
    await this.db.db.update(lobbies).set({ status: 'abandoned' }).where(eq(lobbies.code, code));
  }

  async startGame(code: string): Promise<GameSession> {
    const lobby = await this.findByCode(code);
    if (!lobby) throw new NotFoundException('Lobby not found');
    if (!lobby.guestId) throw new BadRequestException('No guest in lobby');

    // randomly assign sides
    const [attackerId, defenderId] =
      Math.random() > 0.5 ? [lobby.hostId, lobby.guestId] : [lobby.guestId, lobby.hostId];

    const session = {
      id: uuidv4(),
      lobbyId: lobby.id,
      attackerId,
      defenderId,
      boardState: HnefataflEngine.initialBoard(), // 11x11 starting position
      currentTurn: 'attacker' as const,
      status: 'active' as const,
    };

    await this.db.db.insert(gameSessions).values(session);

    // mark lobby as active so it can't be joined again
    await this.db.db.update(lobbies).set({ status: 'active' }).where(eq(lobbies.code, code));

    return session as GameSession;
  }

  // ─── Generates a 4-digit numeric code not already in use ───────────────────

  private async generateUniqueCode(): Promise<string> {
    for (let attempt = 0; attempt < 10; attempt++) {
      const code = String(Math.floor(1000 + Math.random() * 9000));
      const existing = await this.findByCode(code);
      if (!existing) return code;
    }
    throw new Error('Could not generate a unique lobby code — try again');
  }
}
