// src/player/player.controller.ts
import { Body, Controller, Post, HttpCode } from '@nestjs/common';
import { PlayerService } from './player.service';

class CreateGuestDto {
  name: string;
}

@Controller('players')
export class PlayerController {
  constructor(private playerService: PlayerService) {}

  // POST /players
  // Body: { "name": "Ragnar" }
  // Returns: { "id": "...", "name": "Ragnar", "token": "...", "createdAt": "..." }
  @Post()
  @HttpCode(201)
  async createGuest(@Body() body: CreateGuestDto) {
    const { player, token } = await this.playerService.createGuest(body.name);
    return {
      id: player.id,
      name: player.name,
      token: token, // client stores this in localStorage
      createdAt: player.createdAt,
    };
  }
}
