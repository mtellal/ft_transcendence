import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { ChatController } from './chat.controller';
import { UsersGateway } from 'src/users/users.gateway';
import { GamesService } from 'src/games/games.service';
import { UsersAchievementsService } from 'src/users/users-achievements.service';

@Module({
  imports: [PrismaModule],
  providers: [ChatGateway, ChatService, JwtService, UsersService, GamesService, UsersAchievementsService, UsersGateway],
  controllers: [ChatController]
})
export class ChatModule {}
