// src/lobby/lobby.module.ts
import { Module } from '@nestjs/common';
import { LobbyGateway } from './lobby.gateway';
import { LobbyService } from './lobby.service';
import { LobbyController } from './lobby.controller';
import { PlayerModule } from '../player/player.module';

@Module({
  imports: [PlayerModule], // gives us PlayerService
  controllers: [LobbyController],
  providers: [LobbyGateway, LobbyService],
  exports: [LobbyService], // game module will need this
})
export class LobbyModule {}
