// src/game/game.controller.ts
import { Controller, Get, Param, Headers, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { GameService } from './game.service';
import { PlayerService } from '../player/player.service';

@Controller('games')
export class GameController {
  constructor(
    private gameService: GameService,
    private playerService: PlayerService
  ) {}

  // GET /games/:sessionId
  // Get game session details (for reconnection/state sync)
  @Get(':sessionId')
  async getSession(@Param('sessionId') sessionId: string, @Headers('authorization') authHeader: string) {
    const token = authHeader?.replace('Bearer ', '');
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    const player = await this.playerService.findByToken(token);
    const session = await this.gameService.findSessionById(sessionId);

    if (!session) {
      throw new NotFoundException('Game session not found');
    }

    // Verify player is part of this game
    if (player.id !== session.attackerId && player.id !== session.defenderId) {
      throw new UnauthorizedException('You are not in this game');
    }

    const moveHistory = await this.gameService.getSessionHistory(sessionId);
    const role = player.id === session.attackerId ? 'attacker' : 'defender';

    return {
      sessionId: session.id,
      role,
      attackerId: session.attackerId,
      defenderId: session.defenderId,
      boardState: session.boardState,
      currentTurn: session.currentTurn,
      status: session.status,
      winnerId: session.winnerId,
      winReason: session.winReason,
      startedAt: session.startedAt,
      endedAt: session.endedAt,
      moveHistory,
    };
  }

  // GET /games/active/me
  // Find active game session for the authenticated player (for reconnection)
  @Get('active/me')
  async getActiveSession(@Headers('authorization') authHeader: string) {
    const token = authHeader?.replace('Bearer ', '');
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    const player = await this.playerService.findByToken(token);
    const session = await this.gameService.findActiveSessionForPlayer(player.id);

    if (!session) {
      return { session: null };
    }

    const moveHistory = await this.gameService.getSessionHistory(session.id);
    const role = player.id === session.attackerId ? 'attacker' : 'defender';

    return {
      session: {
        sessionId: session.id,
        role,
        attackerId: session.attackerId,
        defenderId: session.defenderId,
        boardState: session.boardState,
        currentTurn: session.currentTurn,
        status: session.status,
        startedAt: session.startedAt,
        moveHistory,
      },
    };
  }
}
