import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersGateway } from './users.gateway';
import { JwtService } from '@nestjs/jwt';
import { UsersAchievementsService } from './users-achievements.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersGateway, JwtService, UsersAchievementsService],
  imports: [PrismaModule],
})
export class UsersModule {}
