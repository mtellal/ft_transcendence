import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { GamesService } from './games.service';
import { Socket, Server } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { JwtWsGuard, UserPayload } from '../auth/guard/jwt.ws.guard';
import { JwtPayloadDto } from '../auth/dto';

@WebSocketGateway({ namespace: 'game' })
export class GamesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly gamesService: GamesService, private readonly userService: UsersService, private readonly jwtService: JwtService) { }

  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    
    ///Have to find a better way of doing this
    const jwtService = this.jwtService;
    const cookie = client.handshake.headers?.cookie;
    if (!cookie) {
      console.log('ERROR');
      client.disconnect();
      return ;
    }
    const token = cookie.split('=')[1];
    const decoded: JwtPayloadDto = jwtService.decode(token) as JwtPayloadDto;

    console.log(`ID:${decoded.id} USER:${decoded.username} has connected to game socket`);

    //will need to delete
    const game = await this.gamesService.findOngoingGame(decoded);
    if (game) {
      console.log('ONGOING GAME FOUND!');
      client.join(`room-${game.id}`);
    }
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

    await this.gamesService.deleteUnfinishedGame(decoded);
    console.log(`ID:${decoded.id} USER:${decoded.username} has disconnected to game socket`);
  }

  @SubscribeMessage('up')
  async handleUp(@ConnectedSocket() client: any) {
  }

  @SubscribeMessage('down')
  @UseGuards(JwtWsGuard)
  async handleDown(@ConnectedSocket() client: any, @UserPayload() payload: JwtPayloadDto) {
    return 'down success';
  }

  @SubscribeMessage('cancel')
  @UseGuards(JwtWsGuard)
  async handleCancel(@ConnectedSocket() client: any, @UserPayload() payload: JwtPayloadDto) {
    client.leave();
    this.gamesService.deleteMatchmakingGame(payload);
  }

  @SubscribeMessage('join')
  @UseGuards(JwtWsGuard)
  async HandleJoin(@ConnectedSocket() client: Socket, @UserPayload() payload: JwtPayloadDto) {
    const room = await this.gamesService.findPendingGame(payload);
    if (!room) {
      const new_game = await this.gamesService.createGame(payload);
      client.emit('joinWait', {message: 'waiting for another player', roomId: new_game.id });
      client.join(`room-${new_game.id}`);
    } else {
      client.emit('joinSuccess', {message: 'Joining a game', roomId: room.id});
      client.join(`room-${room.id}`);
      this.server.to(`room-${room.id}`).emit('GameStart', {message: 'Game is going to start in 5s'});

      setTimeout(()=> {
        this.gamesService.startGame(room.id, this.server);
      }, 5000);
    }
    return 'Join success';
  }


}