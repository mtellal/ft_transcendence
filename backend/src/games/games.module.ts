import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesGateway } from './games.gateway';
import { GamesController } from './games.controller';

@Module({
  providers: [GamesGateway, GamesService],
  controllers: [GamesController]
})
export class GamesModule {}
