import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { GamesService } from './games.service';
import { Socket, Server, Namespace } from 'socket.io';
import { ForbiddenException, NotFoundException, UseGuards } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { JwtWsGuard, UserPayload } from '../auth/guard/jwt.ws.guard';
import { JwtPayloadDto } from '../auth/dto';
import { GameDto } from './dto/games.dto';
import { GameStatus } from '@prisma/client';

@WebSocketGateway({ namespace: 'game' })
export class GamesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly gamesService: GamesService, private readonly userService: UsersService, private readonly jwtService: JwtService) { }

  private userToSocket = new Map<number, string>();

  @WebSocketServer()
  io: Namespace;

  async handleConnection(client: Socket) {
    
    ///Have to find a better way of doing this
    const jwtService = this.jwtService;
    const cookie = client.handshake.headers?.cookie;
    if (!cookie) {
      client.disconnect();
      return ;
    }
    const token = cookie.split('=')[1];
    const decoded: JwtPayloadDto = jwtService.decode(token) as JwtPayloadDto;

    if (!decoded) {
      client.disconnect();
      return ;
    }

    if (this.userToSocket.has(decoded.id)) {
      this.io.to(client.id).emit('alreadyConnected', decoded.id);
	  const socketId = this.userToSocket.get(decoded.id);
		if (socketId) {
			const socket = this.io.sockets.get(socketId);
			socket.disconnect()
		}
    }

    this.userToSocket.set(decoded.id, client.id);
  }

  async handleDisconnect(client: Socket) {
    const jwtService = this.jwtService;
    const cookie = client.handshake.headers?.cookie;
    if (!cookie) {
      client.disconnect();
      return ;
    }
    const token = cookie.split('=')[1];
    const decoded: JwtPayloadDto = jwtService.decode(token) as JwtPayloadDto;

    this.userToSocket.delete(decoded.id);
    await this.gamesService.deleteMatchmakingGame(decoded);
    await this.gamesService.deleteUnfinishedGame(decoded);
  }

  @SubscribeMessage('moveUp')
  @UseGuards(JwtWsGuard)
  async handleUp(@ConnectedSocket() client: any, @UserPayload() payload: JwtPayloadDto, @MessageBody() gameRoom: number) {
    this.gamesService.moveUp(gameRoom, payload.id);
  }

  @SubscribeMessage('moveDown')
  @UseGuards(JwtWsGuard)
  async handleDown(@ConnectedSocket() client: any, @UserPayload() payload: JwtPayloadDto, @MessageBody() gameRoom: number) {
    this.gamesService.moveDown(gameRoom, payload.id);
  }

  @SubscribeMessage('stopMove')
  @UseGuards(JwtWsGuard)
  async stopMove(@ConnectedSocket() client: any, @UserPayload() payload: JwtPayloadDto, @MessageBody() gameRoom: number) {
    this.gamesService.stopMove(gameRoom, payload.id);
  }

  @SubscribeMessage('cancel')
  @UseGuards(JwtWsGuard)
  async handleCancel(@ConnectedSocket() client: any, @UserPayload() payload: JwtPayloadDto) {
    client.leave();
    await this.gamesService.deleteMatchmakingGame(payload);
  }

  @SubscribeMessage('join')
  @UseGuards(JwtWsGuard)
  async handleJoin(@ConnectedSocket() client: Socket, @UserPayload() payload: JwtPayloadDto, @MessageBody() gameDto: GameDto) {
    if (await this.gamesService.isUserinGame(payload.id)) {
      throw new ForbiddenException(`User with id of ${payload.id} is already in game`);
    }
    await this.gamesService.removePendingInvite(payload.id);
    const room = await this.gamesService.findPendingGame(payload, gameDto);
    if (!room) {
      const newRoom = await this.gamesService.createGame(payload, gameDto);
      if (!newRoom)
        return;
      client.join(`room-${newRoom.id}`);
      this.io.to(`room-${newRoom.id}`).emit('joinedGame', newRoom);
      this.io.to(`room-${newRoom.id}`).emit('waitingforP2', newRoom);
      //this.gamesService.startGame(room, this.io);
    } else {
      client.join(`room-${room.id}`);
      this.io.to(`room-${room.id}`).emit('joinedGame', room);
      this.io.to(`room-${room.id}`).emit('foundGame', room);
      this.io.to(`room-${room.id}`).emit('GameStart', { message: 'Game is going to start in 5s' });
      console.log("Starting game");
      this.gamesService.startGame(room, this.io, this.userToSocket);
      /* setTimeout(() => {
        this.gamesService.startGame(room, this.io);
      }, 5000); */
    }
  }

  @SubscribeMessage('joinInvite')
  @UseGuards(JwtWsGuard)
  async joinInvite(@ConnectedSocket() client: Socket, @UserPayload() payload: JwtPayloadDto, @MessageBody() gameId: number) {
    try {
      const room = await this.gamesService.findOne(gameId);
      if (!room) {
        throw new NotFoundException(`Game with id of ${gameId} does not exist`);
      }
      if (room.status === GameStatus.FINISHED) {
        this.io.to(`room-${room.id}`).emit('finishedGame', room);
      }
      client.join(`room-${gameId}`);
      this.io.to(`room-${gameId}`).emit('joinedGame', room);
      let otherPlayer: boolean = false
      if (client.id === this.userToSocket.get(room.player1Id)) {
        const socketIdP2 = this.userToSocket.get(room.player2Id);
        if (!socketIdP2) {
          return ;
        }
        const socketP2 = this.io.sockets.get(socketIdP2);
        if (!socketP2.rooms.has(`room-${gameId}`)) {
          this.io.to(`room-${room.id}`).emit('waitingforP2', room);
          return ;
        }
        otherPlayer = true;
      }
      if (client.id === this.userToSocket.get(room.player2Id)) {
        const socketIdP1 = this.userToSocket.get(room.player1Id);
        if (!socketIdP1) {
          return ;
        }
        const socketP1 = this.io.sockets.get(socketIdP1);
        if (!socketP1.rooms.has(`room-${gameId}`)) {
          this.io.to(`room-${room.id}`).emit('waitingforP2', room);
          return ;
        }
        otherPlayer = true;
      }
      if (otherPlayer) {
        /* await this.gamesService.changeGameStatus(gameId, GameStatus.ONGOING); */
        this.io.to(`room-${gameId}`).emit('joinedGame', room);
        this.io.to(`room-${room.id}`).emit('GameStart', { message: 'Game is going to start in 5s' });
        this.gamesService.startGame(room, this.io, this.userToSocket);
      }
    }
    catch (e) {
      throw new WsException(e)
    };
  }
}
