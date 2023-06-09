import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { GamesModule } from './games/games.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, ChatModule, GamesModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
