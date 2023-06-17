import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Game, GameStatus, GameType, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtPayloadDto } from '../auth/dto';
import { GameState, Status, defaultGameState } from './games.interface';
import { GameDto } from './dto/games.dto';
import { UsersAchievementsService } from '../users/users-achievements.service';
import { Server, Socket } from 'socket.io';

@Injectable()
export class GamesService {
  constructor(private prisma: PrismaService, private achievement: UsersAchievementsService) { }

  private games = new Map<number, GameState>();

  async allGames() {
    return await this.prisma.game.findMany({});
  }

  async createGame(payload: any, gameDto: GameDto) {
    try {
      const game_exist = await this.prisma.game.findFirst({
        where: {
          AND: [
            {
              OR: [
                { status: GameStatus.MATCHMAKING },
                { status: GameStatus.ONGOING },
                { status: GameStatus.INVITE },
              ]
            },
            {
              OR: [
                { player1Id: payload.id },
                { player2Id: payload.id },
              ]
            },
          ],
        }
      })
      if (game_exist) {
        throw new ForbiddenException(`User with id of ${payload.id} is already in a game`);
      }

      const user = await this.prisma.user.findUnique({
        where: {
          id: payload.id,
        }
      });

      if (!user)
        throw new NotFoundException(`User not found`);

      const game = await this.prisma.game.create({
        data: {
          player1: {
            connect: { id: user.id }
          },
          status: GameStatus.MATCHMAKING,
          gametype: gameDto.gametype
        }
      })
      return game;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  //Need to add a func to cancel matchmaking which will delete the pending game

  async findPendingGame(payload: any, gameDto: GameDto) {
    let pending = await this.prisma.game.findFirst({
      where: {
        status: GameStatus.MATCHMAKING,
        gametype: gameDto.gametype,
        player2Id: null,
        NOT: {
          player1Id: payload.id
        },
      },
    });

    if (!pending)
      return (pending);
    try {
      pending = await this.prisma.game.update({
        where: { id: pending.id },
        data: {
          player2Id: payload.id,
          status: GameStatus.ONGOING,
        },
      });
      return pending;
    } catch (e) {
      throw e;
    }
  }

  async findOngoingGame(payload: JwtPayloadDto) {
    try {
      const game = await this.prisma.game.findFirst({
        where: {
          status: GameStatus.ONGOING,
          OR: [
            { player1Id: payload.id },
            { player2Id: payload.id },
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
      const games = await this.prisma.game.findMany({
        where: {
          AND: [
            {
              OR: [
                { status: GameStatus.MATCHMAKING },
                { status: GameStatus.INVITE },
                { status: GameStatus.ONGOING },
              ]
            },
            {
              OR: [
                { player1Id: payload.id },
                { player2Id: payload.id },
              ]
            },
          ],
        }
      })
      console.log(games);
      for (const game of games) {
        if (game.status === GameStatus.MATCHMAKING || game.status === GameStatus.INVITE) {
          await this.prisma.game.delete({
            where: { id: game.id }
          });
        }
        if (game.status === GameStatus.ONGOING) {
          const ongoingGame = this.games.get(game.id);
          if (game.player1Id === payload.id) {
            ongoingGame.status = Status.P2WIN;
          }
          if (game.player2Id === payload.id) {
            ongoingGame.status = Status.P1WIN;
          }
        }
      }
    } catch (e) {
      console.log(e);
      throw(e);
    }
  }

  async deleteMatchmakingGame(payload: JwtPayloadDto) {
    try {
      await this.prisma.game.deleteMany({
        where: {
          AND: [
            { status: GameStatus.MATCHMAKING },
            {
              OR: [
                { player1Id: payload.id },
                { player2Id: payload.id },
              ]
            },
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
    } catch (e) {
      console.log(e);
    }
  }

  moveUp(gameId: number, userId: number) {
    const game = this.games.get(gameId);
    if (game.player1.id === userId) {
      if (game.player1.y - 5 > 0)
        game.player1.y -= 5 * game.player1.speed;
    }
    if (game.player2.id === userId) {
      if (game.player2.y - 5 > 0)
        game.player2.y -= 5 * game.player2.speed;
    }
  }

  moveDown(gameId: number, userId: number) {
    const game = this.games.get(gameId);
    if (game.player1.id === userId) {
      if (game.player1.y + 5 + game.player1.height < game.height)
        game.player1.y += 5 * game.player1.speed;
    }
    if (game.player2.id === userId) {
      if (game.player2.y + 5 + game.player2.height < game.height)
        game.player2.y += 5 * game.player2.speed;
    }
  }

  async startGame(room: Game, server: Server, userTosocket:  Map<number, string>) {
    let game = new GameState();
    game = JSON.parse(JSON.stringify(defaultGameState));
    game.gametype = room.gametype;
    console.log(defaultGameState);
    this.games.set(room.id, game);
    this.initPlayer(game, room);
    this.initBall(game);
    console.log(game);
    server.to(`room-${room.id}`).emit('updatedState', game);
    const frameRate = 60; //FPS that we want
    const tickRate = 1000 / frameRate // Updates will be send at this interval
    setTimeout(() => {
      const gameLoopInterval = setInterval(async () => {
        this.gameLoop(game);
        server.to(`room-${room.id}`).emit('updatedState', game);
        if (this.isGameOver(game)) {
          clearInterval(gameLoopInterval);
          const finishedGame = await this.updateGame(room, game);
          await this.updateStats(room, game);
          this.updateAchievement(finishedGame, server, userTosocket);
          server.to(`room-${room.id}`).emit('finishedGame', finishedGame);
        }
      }, tickRate);
    }, 3000);
  }

  private async updateAchievement(room: Game, server: Server, clientMap:  Map<number, string>) {
    const P1Achievement = this.achievement.checkAndUnlockAchievements(room.player1Id, server, clientMap);
    const P2Achievement = this.achievement.checkAndUnlockAchievements(room.player2Id, server, clientMap);
  }

  async updateGame(room: Game, game: GameState) {
    if (game.status === Status.P1WIN) {
      return await this.prisma.game.update({
        where: {id: room.id},
        data: {
          player1Score: game.score.player1Score,
          player2Score: game.score.player2Score,
          wonBy: room.player1Id,
          status: GameStatus.FINISHED
        }
      })
    }
    if (game.status === Status.P2WIN) {
      return await this.prisma.game.update({
        where: {id: room.id},
        data: {
          player1Score: game.score.player1Score,
          player2Score: game.score.player2Score,
          wonBy: room.player2Id,
          status: GameStatus.FINISHED
        }
      })
    }
    this.games.delete(room.id); //Delete the gameState associated with the room;
  }

  async updateStats(room: Game, game: GameState) {
    const oldP1Stats = await this.prisma.stats.findUnique({
      where: {userId: room.player1Id}
    })
    const oldP2Stats = await this.prisma.stats.findUnique({
      where: {userId: room.player2Id}
    })
    const P1Expected = this.expectedWinProbability(oldP1Stats.eloRating, oldP2Stats.eloRating);
    const P2Expected = this.expectedWinProbability(oldP2Stats.eloRating, oldP1Stats.eloRating);
    const kfactor = 32;
    if (game.status === Status.P1WIN) {
      const newRatingP1 = Math.round(oldP1Stats.eloRating + kfactor * (1 - P1Expected));
      const newRatingP2 = Math.round(oldP2Stats.eloRating + kfactor * (0 - P2Expected));
      await this.prisma.stats.update({
        where: {userId: room.player1Id},
        data: {
          matchesPlayed: {increment: 1},
          matchesWon: {increment: 1},
          eloRating: newRatingP1,
          winStreak: {increment: 1},
          lossStreak: 0,
          goalsScored: {increment: game.score.player1Score},
          goalsTaken: {increment: game.score.player2Score}
        }
      })
      await this.prisma.stats.update({
        where: {userId: room.player2Id},
        data: {
          matchesPlayed: {increment: 1},
          matchesLost: {increment: 1},
          eloRating: newRatingP2,
          winStreak: 0,
          lossStreak: {increment: 1},
          goalsScored: {increment: game.score.player2Score},
          goalsTaken: {increment: game.score.player1Score},
        }
      })
    }
    if (game.status === Status.P2WIN) {
      const newRatingP1 = Math.round(oldP1Stats.eloRating + kfactor * (0 - P1Expected));
      const newRatingP2 = Math.round(oldP2Stats.eloRating + kfactor * (1 - P2Expected));
      await this.prisma.stats.update({
        where: {userId: room.player2Id},
        data: {
          matchesPlayed: {increment: 1},
          matchesWon: {increment: 1},
          eloRating: newRatingP2,
          winStreak: {increment: 1},
          lossStreak: 0,
          goalsScored: {increment: game.score.player2Score},
          goalsTaken: {increment: game.score.player1Score}
        }
      })
      await this.prisma.stats.update({
        where: {userId: room.player1Id},
        data: {
          matchesPlayed: {increment: 1},
          matchesLost: {increment: 1},
          eloRating: newRatingP1,
          winStreak: 0,
          lossStreak: {increment: 1},
          goalsScored: {increment: game.score.player1Score},
          goalsTaken: {increment: game.score.player2Score}
        }
      })
    }
  }

  expectedWinProbability(playerRating: number, opponentRating: number) {
    const exponent = (opponentRating - playerRating) / 400;
    return (1 / (1 + Math.pow(10, exponent)));
  }

  //Init player position based on width and height of the board. In case the board dimensions need to change in the future
  initPlayer(game: GameState, room: Game) {
    game.player1.id = room.player1Id;
    game.player1.x = game.width * 0.02;
    game.player1.y = game.height / 2 - game.player1.height;

    game.player2.id = room.player2Id;
    game.player2.x = game.width - game.width * 0.03;
    game.player2.y = game.height / 2 - game.player2.height;
  }

  resetPlayer(game: GameState) {
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
    game.ball.speed = 1;
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
        nextPosY > game.player2.y && nextPosY < game.player2.y + game.player2.height)) {
      game.ball.velX *= -1;
      if (game.gametype === GameType.SPEEDUP)
          game.ball.speed += 1;
    }

    if (nextPosX < 0 || nextPosX > game.width) {
      if (nextPosX < 0)
        game.score.player2Score++;
      else if (nextPosX > game.width)
        game.score.player1Score++;

      this.initBall(game);
      this.resetPlayer(game);
      return (1);
    }
    if (nextPosY < 0 || nextPosY > game.height) {
      game.ball.velY *= -1;
    }
    else {
      game.ball.x += game.ball.velX * game.ball.speed;
      game.ball.y += game.ball.velY * game.ball.speed;
    }
    return (0)
  }

  getGameState(gameId: number) {
    return this.games.get(gameId);
  }

  isGameOver(game: GameState) {
    if (game.status === Status.FORFEIT || game.status === Status.P1WIN || game.status === Status.P2WIN)
      return (true);
    if (game.score.player1Score >= game.score.winScore) {
      game.status = Status.P1WIN;
      return (true);
    }
    if (game.score.player2Score >= game.score.winScore) {
      game.status = Status.P2WIN;
      return (true);
    }
    return (false);
  }
}
