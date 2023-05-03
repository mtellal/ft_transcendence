import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { ChannelsModule } from './channels/channels.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, ChatModule, ChannelsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
