import { BadRequestException, NotAcceptableException, NotFoundException, Request, UnauthorizedException, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket, WsException } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { CreateChannelDto, JoinChannelDto, LeaveChannelDto, MessageDto } from './dto/channel.dto';
import { ChatService } from './chat.service';

@WebSocketGateway({cors: {origin: '*'}})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<number, string>();

  constructor(private jwtService: JwtService, private userService: UsersService, private chatService: ChatService ){}

  @SubscribeMessage('message')
  @UsePipes(new ValidationPipe())
  async handleMessage(@MessageBody() messageDto: MessageDto, @ConnectedSocket() client: Socket) {
    console.log("/////////////////////////////// EVENT MESSAGE ///////////////////////////////")
    let user: User;
    let token = client.handshake.headers.cookie;
    if (token)
    {
      // token === cookies (for now it is just access_token=xxxxxxxxxxx)
      token = token.split('=')[1];
    }
    try {
      /* Temporary to test with postman, will need to be changed depending on the way the front sends the info */
      const authToken = token;
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
      console.log("/////////////////////////////// EVENT MESSAGE ///////////////////////////////")
      return ;
    }
    try {
      const channel = await this.chatService.findOne(messageDto.channelId);
      if (!channel) {
        throw new NotFoundException('Channel not found');
      }
      const message = await this.chatService.createMessage(messageDto, user);
      console.log(message);
      this.server.to(channel.id.toString()).emit('message', message);
    }
    catch (error) {
      throw new WsException(error)
    }
    //this.server.emit('message', message.content);
    console.log("/////////////////////////////// EVENT MESSAGE ///////////////////////////////")
  }

  @SubscribeMessage('createChannel')
  @UsePipes(new ValidationPipe())
  async createChannel(@ConnectedSocket() client: Socket, @MessageBody() dto: CreateChannelDto)
  {
    console.log("/////////////////////////////// EVENT CREATCHANNEL ///////////////////////////////")

    let user: User;

    let token = client.handshake.headers.cookie;
    if (token)
    {
      // token === cookies (for now it is just access_token=xxxxxxxxxxx)
      token = token.split('=')[1];
    }
    try {
      /* Temporary to test with postman, will need to be changed depending on the way the front sends the info */
      const authToken = token;
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
      console.log("!!!!!!!!!! FAILED in creating channel !!!!!!!!!!")
      console.log("/////////////////////////////// EVENT CREATCHANNEL ///////////////////////////////")
      return ;
    }
    console.log(dto);
    try {
      const newChannel = await this.chatService.createChannel(dto, user);
      for (const memberId of newChannel.members) {
        const socketId = this.connectedUsers.get(memberId);
        if (socketId) {
          const socket = this.server.sockets.sockets.get(socketId);
          socket.join(newChannel.id.toString());
        }
      }
    }
    catch (error) {
      throw new WsException(error);
    }
    console.log("!!!!!!!!!! SUCCEED in creating channel !!!!!!!!!!")
    console.log("/////////////////////////////// EVENT CREATCHANNEL ///////////////////////////////")
  }

  @SubscribeMessage('joinChannel')
  @UsePipes(new ValidationPipe())
  async joinChannel(@ConnectedSocket() client: Socket, @MessageBody() dto: JoinChannelDto) {
    console.log("/////////////////////////////// EVENT JOINCHANNEL ///////////////////////////////")

    let user: User;
    let token = client.handshake.headers.cookie;
    if (token)
    {
      // token === cookies (for now it is just access_token=xxxxxxxxxxx)
      token = token.split('=')[1];
    }
    try {
      /* Temporary to test with postman, will need to be changed depending on the way the front sends the info */
      const authToken = token;
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
      console.log("/////////////////////////////// EVENT JOINCHANNEL ///////////////////////////////")
      return ;
    }
    try {
      const channel = await this.chatService.findOne(dto.channelId);
      if (!channel)
        throw new NotFoundException('Channel not found');
      console.log(channel);
      if (client.rooms.has(channel.id.toString()))
        throw new NotAcceptableException('Client already on the channel');
      this.chatService.join(dto, channel, user);
      client.join(channel.id.toString());
      const messages = await this.chatService.getMessage(channel.id);
      client.emit('message', messages);
    }
    catch (error) {
      throw new WsException(error);
    }
    console.log("/////////////////////////////// EVENT JOINCHANNEL ///////////////////////////////")
  }

/*   @SubscribeMessage('whisper')
  @UsePipes(new ValidationPipe())
  async createWhisperChannel(@ConnectedSocket() client: Socket, @MessageBody() dto: ) */

  @SubscribeMessage('leaveChannel')
  @UsePipes(new ValidationPipe())
  async leaveChannel(@ConnectedSocket() client: Socket, @MessageBody() dto: LeaveChannelDto) {
    console.log("/////////////////////////////// EVENT LEAVECHANNEL ///////////////////////////////")

    let user: User;
    let token = client.handshake.headers.cookie;
    if (token)
    {
      // token === cookies (for now it is just access_token=xxxxxxxxxxx)
      token = token.split('=')[1];
    }
    try {
      /* Temporary to test with postman, will need to be changed depending on the way the front sends the info */
      const authToken = token;
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
      console.log("/////////////////////////////// EVENT LEAVECHANNEL ///////////////////////////////")
      return ;
    }
    try {
      const channel = await this.chatService.findOne(dto.channelId);
      if (!channel)
        throw new NotFoundException('Channel not found');
      if (!user.channelList.includes(channel.id))
        throw new BadRequestException('User is not on the channel');
      client.leave(channel.id.toString());
      await this.chatService.leave(channel, user);
    }
    catch(error) {
      throw new WsException(error);
    }
    console.log("/////////////////////////////// EVENT LEAVECHANNEL ///////////////////////////////")
  }

  async handleConnection(client: Socket) {
    console.log("/////////////////////////////// EVENT HANDLECONNECTION ///////////////////////////////")

    let user: User;
    let token = client.handshake.headers.cookie;
    if (token)
    {
      // token === cookies (for now it is just access_token=xxxxxxxxxxx)
      token = token.split('=')[1];
    }

    try {
      /* Temporary to test with postman, will need to be changed depending on the way the front sends the info */
      const authToken = token
      if (!authToken)
        throw new UnauthorizedException();
      const decodedToken = await this.jwtService.decode(authToken) as { id: number };
      user = await this.userService.findOne(decodedToken.id);
      if (!user)
        throw new UnauthorizedException();
      console.log("user => ", user);
    }
    catch(error) {
      console.error("error => ", error);
      client.disconnect();
      console.log("/////////////////////////////// EVENT HANDLECONNECTION ///////////////////////////////")
      return ;
    }
    this.connectedUsers.set(user.id, client.id);
    console.log(this.connectedUsers);
    console.log("New client connected");
    console.log("/////////////////////////////// EVENT HANDLECONNECTION ///////////////////////////////")
  }

  handleDisconnect(client: Socket) {
    this.removeSocketId(client.id);
    console.log(this.connectedUsers);
    client.disconnect();
    console.log("Client disconnected");
  }

  getSocketId(userId: number) {
    return this.connectedUsers.get(userId);
  }

  removeSocketId(clientId: string) {
    for (const [userId, socketId] of this.connectedUsers.entries()) {
      if (socketId === clientId) {
        this.connectedUsers.delete(userId);
      }
    }
  }
}
