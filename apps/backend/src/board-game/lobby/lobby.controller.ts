// src/lobby/lobby.controller.ts
import { Body, Controller, Post, Get, Param, HttpCode, Headers, UnauthorizedException } from '@nestjs/common';
import { LobbyService } from './lobby.service';
import { PlayerService } from '../player/player.service';

@Controller('lobbies')
export class LobbyController {
  constructor(
    private lobbyService: LobbyService,
    private playerService: PlayerService
  ) {}

  // POST /lobbies
  // Header: x-player-token: <token>
  // Returns: { code: '5249' }
  @Post()
  @HttpCode(201)
  async create(@Headers('x-player-token') token: string) {
    const player = await this.playerService.findByToken(token);
    const lobby = await this.lobbyService.create(player.id);
    return { code: lobby.code };
  }

  // GET /lobbies/:code
  // Header: x-player-token: <token>
  // Returns lobby status (used to poll or verify before WS connect)
  @Get(':code')
  async findOne(@Param('code') code: string, @Headers('x-player-token') token: string) {
    await this.playerService.findByToken(token); // just verify token is valid
    const lobby = await this.lobbyService.findByCode(code);
    if (!lobby) throw new UnauthorizedException('Lobby not found');
    return lobby;
  }
}
