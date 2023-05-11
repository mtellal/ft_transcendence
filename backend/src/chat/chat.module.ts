import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { ChatController } from './chat.controller';

@Module({
  imports: [PrismaModule],
  providers: [ChatGateway, ChatService, JwtService, UsersService],
  controllers: [ChatController]
})
export class ChatModule {}
