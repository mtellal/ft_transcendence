import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage,  WebSocketGateway } from '@nestjs/websockets';
import { GamesService } from './games.service';
import { Socket, Server } from 'socket.io';
import { User } from '@prisma/client';
import { UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({namespace:'game'})
export class GamesGateway implements OnGatewayConnection, OnGatewayDisconnect{
  constructor(private readonly gamesService: GamesService, private readonly userService: UsersService, private readonly jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    console.log("Connected to game socket");
  }

  async handleDisconnect(client: any) {
    console.log('Disconnect games gateway');
  }

  @SubscribeMessage('up')
  async handleUp(client:any) {

  }

  @SubscribeMessage('down')
  async handleDown(client: any) {

  }

  @SubscribeMessage('joinGame')
  async handleTest(client: any) {
    let user: User;
    let token = client.handshake.headers.cookie;
    if (token)
    {
      // token === cookies (for now it is just access_token=xxxxxxxxxxx)
      token = token.split('=')[1];
    }
}
