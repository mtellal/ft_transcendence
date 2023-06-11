import { Injectable } from '@nestjs/common';
import { Game, GameStatus, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtPayloadDto } from '../auth/dto';
import { GameState, defaultGameState } from './games.interface';

@Injectable()
export class GamesService {
  constructor(private prisma: PrismaService) {}

  private games = new Map<number, GameState>();

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

  startGame(room: Game, server: any) {
    const game = new GameState();
    Object.assign(game, defaultGameState);
    console.log(game);
    this.initPlayer(game);
    this.initBall(game);
    console.log(game);
    const frameRate = 60; //FPS that we want
    const tickRate = 1000 / frameRate // Updates will be send at this interval
    const gameLoopInterval = setInterval(() => {
      this.gameLoop(game);
      //server.to(`room-${room.id}`).emit(game);
      console.log(game);
    }, tickRate);
/*     while (1) {
      this.gameLoop(game);
      console.log(game);
    } */
  }

  //Init player position based on width and height of the board. In case the board dimensions need to change in the future
  initPlayer(game: GameState) {
    game.player1.x = game.width * 0.02;
    game.player1.y = game.height / 2 - game.player1.height;

    game.player2.x = game.width - game.width * 0.03;
    game.player2.y = game.height / 2 - game.player2.height;
  }

  initBall(game: GameState) {
    const signx = Math.floor(Math.random() * 10) % 2 === 0 ? 0 : 1;
    const signy = Math.floor(Math.random() * 10) % 2 === 0 ? 0 : 1;

    game.ball.x = game.width / 2;
    game.ball.y = game.height / 2;
    game.ball.velX = signx ? Math.floor(Math.random() * 2) + 1 : -1 * (Math.floor(Math.random() * 2) + 1) 
    game.ball.velY = signy ? Math.floor(Math.random() * 2) + 1 : -1 * (Math.floor(Math.random() * 2) + 1) 
  }

  gameLoop(game: GameState) {
    let nextPosX = game.ball.x + game.ball.velX;
        nextPosX += game.ball.velX > 0 ? game.ball.radius : -game.ball.radius; 
        let nextPosY = game.ball.y + game.ball.velY;
        nextPosY += game.ball.velY > 0 ? game.ball.radius : -game.ball.radius; 

        if ((nextPosX > game.player1.x && nextPosX < game.player1.x + game.player1.width &&
                nextPosY > game.player1.y && nextPosY < game.player1.y + game.player1.height) || 
                (nextPosX > game.player2.x && nextPosX < game.player2.x + game.player2.width &&
                    nextPosY > game.player2.y && nextPosY < game.player2.y + game.player2.height))
        {
            game.ball.velX *= -1;
        }

        if (nextPosX < 0 || nextPosX > game.width)
        {
            if (nextPosX < 0)
                game.score.player2Score++;
            else if (nextPosX > game.width)
                game.score.player1Score++;

            this.initBall(game);
            this.initPlayer(game);
            return (1);
        }
        if (nextPosY < 0 || nextPosY > game.height)
        {
            game.ball.velY *= -1;
        }
        else
        {
            game.ball.x += game.ball.velX;
            game.ball.y += game.ball.velY;
        }
        return (0)
  }
}