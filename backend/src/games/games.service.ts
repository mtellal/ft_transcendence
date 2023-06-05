import { Injectable } from '@nestjs/common';
import { Game, GameStatus, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GamesService {
  constructor(private prisma: PrismaService) {}

  async createGame(user: User) {
    const game = await this.prisma.game.create({
      data: {
        player1: {
          connect: {id: user.id}
        },
        status: GameStatus.MATCHMAKING
      }
    })
    return game;
  }

  //Need to add a func to cancel matchmaking which will delete the pending game

  async findPendingGame() {
    const pending = await this.prisma.game.findFirst({
      where: {
        status: GameStatus.MATCHMAKING
      }
    })
    return (pending);
  }
}
