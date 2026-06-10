import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { AuthModule } from './auth/auth.module';
import { SavesModule } from './saves/saves.module';
import { InventoryModule } from './inventory/inventory.module';
import { ProgressionModule } from './progression/progression.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DbModule,
    AuthModule,
    SavesModule,
    InventoryModule,
    ProgressionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
