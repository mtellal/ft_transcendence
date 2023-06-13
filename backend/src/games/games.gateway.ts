import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
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

  @SubscribeMessage('test')
  async handleTest(@ConnectedSocket() client: any, @MessageBody() content: any) {
    console.log('Here');
    console.log(content);
  }

  @SubscribeMessage('join')
  @UseGuards(JwtWsGuard)
  async HandleJoin(@ConnectedSocket() client: Socket, @UserPayload() payload: JwtPayloadDto) {
    // let room only used to test with one player, in the future, the game will not start without two players
    let room = await this.gamesService.findPendingGame(payload);
    console.log("event received");
    if (!room) {
      room = await this.gamesService.createGame(payload);
      client.emit('joinWait', {message: 'waiting for another player', roomId: room.id });
      client.join(`room-${room.id}`);
      this.server.to(`room-${room.id}`).emit('joinedGame', room);
      //this.gamesService.startGame(room, this.server);
    } else {
      client.emit('joinSuccess', {message: 'Joining a game', roomId: room.id});
      client.join(`room-${room.id}`);
      this.server.to(`room-${room.id}`).emit('joinedGame', room);
      console.log("Second player joined");
      console.log(room);
      this.server.to(`room-${room.id}`).emit('GameStart', {message: 'Game is going to start in 5s'});

      setTimeout(()=> {
        this.gamesService.startGame(room, this.server);
      }, 5000);
    }
    return 'Join success';
  }


}
