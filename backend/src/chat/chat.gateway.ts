import { NotFoundException, Request, UnauthorizedException, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { ExtractJwt } from 'passport-jwt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { CreateChannelDto } from './dto/channel.dto';
import { ChatService } from './chat.service';

@WebSocketGateway({cors: {origin: 'https://hoppscotch.io'}})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server;

  constructor(private jwtService: JwtService, private userService: UsersService, private chatService: ChatService ){}

  @SubscribeMessage('message')
  async handleMessage(@MessageBody() content: string, @ConnectedSocket() client: Socket) {
    try {
      /* Temporary to test with postman, will need to be changed depending on the way the front sends the info */
      const authToken = Array.isArray(client.handshake.headers.access_token) ?
      client.handshake.headers.access_token[0] :
      client.handshake.headers.access_token;
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

  @SubscribeMessage('createChannel')
  @UsePipes(new ValidationPipe())
  async createChannel(@ConnectedSocket() client: Socket, @MessageBody() dto: CreateChannelDto)
  {
    /* Temporary to test with postman, will need to be changed depending on the way the front sends the info */
    const authToken = Array.isArray(client.handshake.headers.access_token) ?
      client.handshake.headers.access_token[0] :
      client.handshake.headers.access_token;
    if (!authToken)
      throw new UnauthorizedException();
    const decodedToken = await this.jwtService.decode(authToken) as { id: number };
    const user = await this.userService.findOne(decodedToken.id);
    console.log(user);
    if (!user)
      throw new UnauthorizedException();
    try {
      const newChannel = await this.chatService.create(dto, user)
    }
    catch {

    }
  }

  @SubscribeMessage('joinChannel')
  async joinChannel(@ConnectedSocket() client: Socket, payload: any) {
    try {
      /* Temporary to test with postman, will need to be changed depending on the way the front sends the info */
      const authToken = Array.isArray(client.handshake.headers.access_token) ?
        client.handshake.headers.access_token[0] :
        client.handshake.headers.access_token;
      const decodedToken = await this.jwtService.decode(authToken) as { id: number };
      const user = await this.userService.findOne(decodedToken.id);
      console.log(user);
    }
    catch {
      this.server.emit('Error', new UnauthorizedException());
      client.disconnect();
    }
    console.log(payload);
    client.emit('joinChannel', payload);
    //console.log(payload.userid);
  }

  async handleConnection(client: Socket) {
/*     try {
      Temporary to test with postman, will need to be changed depending on the way the front sends the info
      const authToken = Array.isArray(client.handshake.headers.access_token) ?
      client.handshake.headers.access_token[0] :
      client.handshake.headers.access_token;
      const decodedToken = await this.jwtService.decode(authToken) as { id: number };
      const user = await this.userService.findOne(decodedToken.id);
      console.log(user);
    }
    catch {
      this.server.emit('Error', new UnauthorizedException());
      client.disconnect();
    } */
    this.server.emit('message', 'Welcome!');
    console.log("New client connected");
  }

  handleDisconnect(client: Socket) {
    client.disconnect();
    console.log("Client disconnected");
  }
}
