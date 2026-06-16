// src/player/player.service.ts
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { eq } from 'drizzle-orm';
import { DbService } from '../../db/db.service';
import { players, type Player, type NewPlayer } from '../../db/schema';

@Injectable()
export class PlayerService {
  constructor(private db: DbService) {}

  async createGuest(name: string): Promise<{ player: Player; token: string }> {
    const trimmed = name.trim();

    if (!trimmed || trimmed.length < 2) {
      throw new Error('Name must be at least 2 characters');
    }
    if (trimmed.length > 32) {
      throw new Error('Name must be 32 characters or fewer');
    }

    const newPlayer: NewPlayer = {
      id: uuidv4(),
      token: uuidv4(), // this is what the client holds onto
      name: trimmed,
    };

    await this.db.db.insert(players).values(newPlayer);

    // fetch back so we get DB-generated createdAt
    const player = await this.db.db
      .select()
      .from(players)
      .where(eq(players.id, newPlayer.id))
      .limit(1)
      .then((r) => r[0]);

    return { player, token: player.token };
  }

  async findByToken(token: string): Promise<Player> {
    if (!token) throw new UnauthorizedException('No token provided');

    const player = await this.db.db
      .select()
      .from(players)
      .where(eq(players.token, token))
      .limit(1)
      .then((r) => r[0] ?? null);

    if (!player) throw new UnauthorizedException('Invalid session token');

    return player;
  }

  async findById(id: string): Promise<Player> {
    const player = await this.db.db
      .select()
      .from(players)
      .where(eq(players.id, id))
      .limit(1)
      .then((r) => r[0] ?? null);

    if (!player) throw new NotFoundException(`Player ${id} not found`);

    return player;
  }
}
