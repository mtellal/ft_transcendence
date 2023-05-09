import { Module } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { ChannelsController } from './channels.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [ChannelsController],
  providers: [ChannelsService],
  imports: [PrismaModule, UsersModule],
})
export class ChannelsModule {}
