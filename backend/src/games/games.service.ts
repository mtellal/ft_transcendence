import { Injectable } from '@nestjs/common';
import { Game, GameStatus, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtPayloadDto } from '../auth/dto';

@Injectable()
export class GamesService {
  constructor(private prisma: PrismaService) {}

  async allGames() {
    return await this.prisma.game.findMany({});
  }

  async createGame(payload: any) {
    const game_exist = await this.prisma.game.findFirst({
      where: {
        AND: [ 
          { OR: [
            { status: GameStatus.MATCHMAKING },
            { status: GameStatus.ONGOING },
        ]},
          { OR: [
            { player1Id: payload.id },
            { player2Id: payload.id },
          ]},
        ],
      }
    })
    if (game_exist) {
      console.log('user is already in game');
      return ;
    }
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: payload.id,
        }
      });

      const game = await this.prisma.game.create({
        data: {
          player1: {
            connect: { id: user.id }
          },
          status: GameStatus.MATCHMAKING,
        }
      })
      return game;
    } catch (e) {
      console.log(e);
    }
  }

  //Need to add a func to cancel matchmaking which will delete the pending game

  async findPendingGame(payload: any) {
    const pending = await this.prisma.game.findFirst({
      where: {
        status: GameStatus.MATCHMAKING,
        player2Id: null,
        NOT: { 
          player1Id: payload.id
        },
      },
    });

    if (!pending)
      return (pending);
    try {
      await this.prisma.game.update({
        where: { id: pending.id },
        data: {
          player2Id: payload.id,
          status: GameStatus.ONGOING,
        },
      });
      return pending;
    } catch (e) {
      return null;
    }
  }

  async findOngoingGame(payload: JwtPayloadDto) {
    try {
      const game = await this.prisma.game.findFirst({
        where: {
          status: GameStatus.ONGOING,
          OR: [ 
            { player1Id: payload.id},
            { player2Id: payload.id},
          ]
        }
      })
      return game; 
    } catch (e) {
      console.log(e);
    }
  }

  //Have to add logic to get the ongoing games and disconnect the opponent from that game as well as giving him the win
  async deleteUnfinishedGame(payload: JwtPayloadDto) {
    //have to seperate 
    try {
      await this.prisma.game.deleteMany({
        where: {
          AND: [ 
            { OR: [
              { status: GameStatus.MATCHMAKING },
              { status: GameStatus.ONGOING },
          ]},
            { OR: [
              { player1Id: payload.id },
              { player2Id: payload.id },
            ]},
          ],
        }
      })
    } catch (e) {
      console.log(e);
    }
  }

  async deleteMatchmakingGame(payload: JwtPayloadDto) {
    try {
      await this.prisma.game.deleteMany({
        where: {
          AND: [ 
            { status: GameStatus.MATCHMAKING },
            { OR: [
              { player1Id: payload.id },
              { player2Id: payload.id },
            ]},
          ],
        }
      })
    } catch (e) {
      console.log(e);
    }
  }

  async deleteAllGames() {
    try {
      await this.prisma.game.deleteMany({
        
      });
    } catch(e) {
      console.log(e);
    }
  }

  startGame(roomId: number, server: any) {
  }
}
