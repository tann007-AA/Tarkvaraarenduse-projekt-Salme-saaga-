import { Module } from '@nestjs/common';
import { GameModule } from './game/game.module';
import { LobbyModule } from './lobby/lobby.module';
import { PlayerModule } from './player/player.module';
import { HnefataflModule } from './hnefatafl/hnefatafl.module';

@Module({
  imports: [GameModule, LobbyModule, PlayerModule, HnefataflModule],
})
export class BoardGameModule {}
