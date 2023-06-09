import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { GamesService } from './games.service';
import { Socket, Server } from 'socket.io';
import { ExecutionContext, ForbiddenException, UnauthorizedException, UseGuards, createParamDecorator } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { JwtWsGuard, UserPayload } from '../auth/guard/jwt.ws.guard';
import { JwtGuard } from '../auth/guard';
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

    this.gamesService.deleteUnfinishedGame(decoded)
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
    this.gamesService.deleteMatchmakingGame(payload);
  }

  @SubscribeMessage('joinGame')
  @UseGuards(JwtWsGuard)
  async HandleJoin(@ConnectedSocket() client: Socket, @UserPayload() payload: JwtPayloadDto) {
    const room = await this.gamesService.findPendingGame(payload);
    if (!room) {
      await this.gamesService.createGame(payload);
      client.emit('joinWait', {message: 'waiting for another player'});
    } else {
      client.emit('joinSuccess', {message: 'Joining a game'});
    }
    return 'Join success';
  }

}