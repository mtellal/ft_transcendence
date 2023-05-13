import { NotFoundException, Request, UnauthorizedException, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket, WsException } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { CreateChannelDto, JoinChannelDto, MessageDto } from './dto/channel.dto';
import { ChatService } from './chat.service';

@WebSocketGateway({cors: {origin: 'https://hoppscotch.io'}})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server;

  constructor(private jwtService: JwtService, private userService: UsersService, private chatService: ChatService ){}

  @SubscribeMessage('message')
  async handleMessage(@MessageBody() messageDto: MessageDto, @ConnectedSocket() client: Socket) {
    let user: User;
    try {
      /* Temporary to test with postman, will need to be changed depending on the way the front sends the info */
      const authToken = Array.isArray(client.handshake.headers.access_token) ?
      client.handshake.headers.access_token[0] :
      client.handshake.headers.access_token;
      if (!authToken)
        throw new UnauthorizedException();
      const decodedToken = await this.jwtService.decode(authToken) as { id: number };
      user = await this.userService.findOne(decodedToken.id);
      if (!user)
        throw new UnauthorizedException();
      console.log(user);
    }
    catch(error) {
      console.error(error);
      client.disconnect();
      return ;
    }
    const channel = await this.chatService.findOne(messageDto.channelId);
    if (!channel) {
      throw new NotFoundException('Channel not found');
    }
    const message = await this.chatService.createMessage(messageDto, user);
    console.log(message);
    this.server.to(channel.id.toString()).emit('message', message);
    //this.server.emit('message', message.content);
  }

  @SubscribeMessage('createChannel')
  @UsePipes(new ValidationPipe())
  async createChannel(@ConnectedSocket() client: Socket, @MessageBody() dto: CreateChannelDto)
  {
    let user: User;
    try {
      /* Temporary to test with postman, will need to be changed depending on the way the front sends the info */
      const authToken = Array.isArray(client.handshake.headers.access_token) ?
      client.handshake.headers.access_token[0] :
      client.handshake.headers.access_token;
      if (!authToken)
        throw new UnauthorizedException();
      const decodedToken = await this.jwtService.decode(authToken) as { id: number };
      user = await this.userService.findOne(decodedToken.id);
      if (!user)
        throw new UnauthorizedException();
    }
    catch(error) {
      console.error(error);
      client.disconnect();
      return ;
    }
    console.log(dto);
    const newChannel = await this.chatService.create(dto, user);
    client.join(`channel:${newChannel.id}`);
  }

  @SubscribeMessage('joinChannel')
  async joinChannel(@ConnectedSocket() client: Socket, @MessageBody() dto: JoinChannelDto) {
    let user: User;
    try {
      /* Temporary to test with postman, will need to be changed depending on the way the front sends the info */
      const authToken = Array.isArray(client.handshake.headers.access_token) ?
        client.handshake.headers.access_token[0] :
        client.handshake.headers.access_token;
      if (!authToken)
        throw new UnauthorizedException();
      const decodedToken = await this.jwtService.decode(authToken) as { id: number };
      user = await this.userService.findOne(decodedToken.id);
      if (!user)
        throw new UnauthorizedException();
      console.log(user);
    }
    catch (error) {
      console.error(error);
      client.disconnect();
      return ;
    }
    try {
      const channel = await this.chatService.findOne(dto.channelId);
      if (!channel)
        console.log("Channel does not exist");
      console.log(channel);
      if (channel.type === 'PUBLIC')
        console.log("Channel is PUBLIC");
      this.chatService.join(dto, channel, user);
      client.join(channel.id.toString());
      const messages = await this.chatService.getMessage(channel.id);
      client.emit('message', messages);
    }
    catch (error) {
      throw new WsException(error);
    }
  }

  async handleConnection(client: Socket) {
    try {
      /* Temporary to test with postman, will need to be changed depending on the way the front sends the info */
      const authToken = Array.isArray(client.handshake.headers.access_token) ?
      client.handshake.headers.access_token[0] :
      client.handshake.headers.access_token;
      if (!authToken)
        throw new UnauthorizedException();
      const decodedToken = await this.jwtService.decode(authToken) as { id: number };
      const user = await this.userService.findOne(decodedToken.id);
      if (!user)
        throw new UnauthorizedException();
      console.log(user);
    }
    catch(error) {
      console.error(error);
      client.disconnect();
      return ;
    }
    console.log("New client connected");
  }

  handleDisconnect(client: Socket) {
    client.disconnect();
    console.log("Client disconnected");
  }
}
