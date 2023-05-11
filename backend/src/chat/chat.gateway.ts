import { NotFoundException, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { ExtractJwt } from 'passport-jwt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { createChannelDto } from './dto/channel.dto';

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

  @SubscribeMessage('createChannel')
  async createChannel(@ConnectedSocket() client: Socket, @MessageBody() dto: createChannelDto)
  {
    /* Need to pass in the payload: 
    - The name of the channel (Optional? Or give it a temp name?)
    - The type of the channel (PUBLIC, PROTECTED or PRIVATE)
    - The password if the channel is of type PROTECTED
    */
    console.log(dto);
    console.log(dto.channelName);
    console.log(dto.channelType);
    console.log(dto.channelPassword);
  }

  @SubscribeMessage('joinChannel')
  async joinChannel(@ConnectedSocket() client: Socket, payload: any)
  {
    /* Need to pass in the payload 
    - The id of the channel
    - The password if the channel is PROTECTED 
    Will need to check in this func if the conditions are respected:
    - If the channel is public, all good if the user is valid
    - If the channel is protected, check for a pwd. If no pwd or invalid pwd => Refuse
    - If the channel is private, check for a pending invite?  */
   
   console.log(payload);
   client.emit('joinChannel', payload);
   //console.log(payload.userid);
  }
  async handleConnection(client: Socket) {

    try {
/*       const authToken = client.handshake.auth.token;
      const decodedToken = await this.jwtService.decode(authToken) as { id: number };
      const user = await this.userService.findOne(decodedToken.id);
      console.log(user); */
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
