import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { GamesService } from './games.service';
import { Socket, Server } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { JwtWsGuard, UserPayload } from '../auth/guard/jwt.ws.guard';
import { JwtPayloadDto } from '../auth/dto';
import { GameDto } from './dto/games.dto';

@WebSocketGateway({ namespace: 'game' })
export class GamesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly gamesService: GamesService, private readonly userService: UsersService, private readonly jwtService: JwtService) { }

  private userToSocket = new Map<number, string>();

  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    
    ///Have to find a better way of doing this
    console.log('Connection');
    const jwtService = this.jwtService;
    const cookie = client.handshake.headers?.cookie;
    if (!cookie) {
      console.log('ERROR');
      client.disconnect();
      return ;
    }
    const token = cookie.split('=')[1];
    const decoded: JwtPayloadDto = jwtService.decode(token) as JwtPayloadDto;

    if (!decoded) {
      console.log('game: decode error');
      client.disconnect();
      return ;
    }

    if (this.userToSocket.has(decoded.id)) {
      console.log('game: User already connected on a socket');
      client.disconnect();
      return ;
    }

    this.userToSocket.set(decoded.id, client.id);
    console.log(`ID:${decoded.id} USER:${decoded.username} has connected to game socket`);
  }

  async handleDisconnect(client: Socket) {
    const jwtService = this.jwtService;
    const cookie = client.handshake.headers?.cookie;
    if (!cookie) {
      console.log('ERROR');
      client.disconnect();
      return ;
    }
    const token = cookie.split('=')[1];
    const decoded: JwtPayloadDto = jwtService.decode(token) as JwtPayloadDto;

    this.userToSocket.delete(decoded.id);
    await this.gamesService.deleteMatchmakingGame(decoded);
    await this.gamesService.deleteUnfinishedGame(decoded);
    console.log(`ID:${decoded.id} USER:${decoded.username} has disconnected to game socket`);
  }

  @SubscribeMessage('moveUp')
  @UseGuards(JwtWsGuard)
  async handleUp(@ConnectedSocket() client: any, @UserPayload() payload: JwtPayloadDto, @MessageBody() gameRoom: number) {
    console.log(`${payload.id} moved up!`)
    this.gamesService.moveUp(gameRoom, payload.id);
  }

  @SubscribeMessage('moveDown')
  @UseGuards(JwtWsGuard)
  async handleDown(@ConnectedSocket() client: any, @UserPayload() payload: JwtPayloadDto, @MessageBody() gameRoom: number) {
    console.log(`${payload.id} moved down!`)
    this.gamesService.moveDown(gameRoom, payload.id);
  }

  @SubscribeMessage('cancel')
  @UseGuards(JwtWsGuard)
  async handleCancel(@ConnectedSocket() client: any, @UserPayload() payload: JwtPayloadDto) {
    client.leave();
    this.gamesService.deleteMatchmakingGame(payload);
  }

  @SubscribeMessage('join')
  @UseGuards(JwtWsGuard)
  async HandleJoin(@ConnectedSocket() client: Socket, @UserPayload() payload: JwtPayloadDto, @MessageBody() gameDto: GameDto) {
    const room = await this.gamesService.findPendingGame(payload, gameDto);
    console.log("event received");
    if (!room) {
      const newRoom = await this.gamesService.createGame(payload, gameDto);
      if (!newRoom)
        return;
      client.join(`room-${newRoom.id}`);
      this.server.to(`room-${newRoom.id}`).emit('joinedGame', newRoom);
      this.server.to(`room-${newRoom.id}`).emit('waitingforP2', newRoom);
      //this.gamesService.startGame(room, this.server);
    } else {
      client.join(`room-${room.id}`);
      this.server.to(`room-${room.id}`).emit('joinedGame', room);
      this.server.to(`room-${room.id}`).emit('foundGame', room);
      this.server.to(`room-${room.id}`).emit('GameStart', { message: 'Game is going to start in 5s' });
      this.gamesService.startGame(room, this.server, this.userToSocket);
      console.log()
      /* setTimeout(() => {
        this.gamesService.startGame(room, this.server);
      }, 5000); */
    }
  }


}
