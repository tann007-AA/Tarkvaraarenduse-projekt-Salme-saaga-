import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { GameController } from './game.controller';
import { DbModule } from '../../db/db.module';
import { PlayerModule } from '../player/player.module';

@Module({
  imports: [DbModule, PlayerModule],
  controllers: [GameController],
  providers: [GameService, GameGateway],
  exports: [GameService],
})
export class GameModule {}
