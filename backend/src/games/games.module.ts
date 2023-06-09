import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesGateway } from './games.gateway';
import { GamesController } from './games.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { UsersAchievementsService } from '../users/users-achievements.service';

@Module({
  providers: [GamesGateway, GamesService, JwtService, UsersService, UsersAchievementsService],
  controllers: [GamesController],
  imports: [PrismaModule]
})
export class GamesModule {}
