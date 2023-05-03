import { NotFoundException, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { ExtractJwt } from 'passport-jwt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@WebSocketGateway({cors: {origin: 'https://hoppscotch.io'}})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server;

  constructor(private jwtService: JwtService, private userService: UsersService){}

  @SubscribeMessage('message')
  async handleMessage(@MessageBody() content: string, @ConnectedSocket() client: Socket) {
    try {
      const authToken = client.handshake.auth.token;
      const decodedToken = await this.jwtService.decode(authToken) as { id: number };
      const user = await this.userService.findOne(decodedToken.id);
      console.log(user);
    }
    catch {
      this.server.emit('Error', new UnauthorizedException());
      client.disconnect();
    }
    this.server.emit('message', content);
  }

  async handleConnection(client: Socket) {

    try {
      const authToken = client.handshake.auth.token;
      const decodedToken = await this.jwtService.decode(authToken) as { id: number };
      const user = await this.userService.findOne(decodedToken.id);
      console.log(user);
    }
    catch {
      this.server.emit('Error', new UnauthorizedException());
      client.disconnect();
    }
    this.server.emit('message', 'Welcome!');
    console.log("New client connected");
  }

  handleDisconnect(client: Socket) {
    client.disconnect();
    console.log("Client disconnected");
  }
}
