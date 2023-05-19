import { BadRequestException, ForbiddenException, NotAcceptableException, NotFoundException, Request, UnauthorizedException, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket, WsException } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { AddUserDto, CreateChannelDto, JoinChannelDto, LeaveChannelDto, MessageDto } from './dto/channel.dto';
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
        throw new NotAcceptableException('Client is already in the room');
      if (!user.channelList.includes(channel.id))
        await this.chatService.join(dto, channel, user);
      client.join(channel.id.toString());
      const messages = await this.chatService.getMessage(channel.id);
      client.emit('message', messages);
    }
    catch (error) {
      throw new WsException(error);
    }
    console.log("/////////////////////////////// EVENT JOINCHANNEL ///////////////////////////////")
  }

  @SubscribeMessage('addtoChannel')
  @UsePipes(new ValidationPipe())
  async addUsertoChannel(@ConnectedSocket() client: Socket, @MessageBody() dto: AddUserDto) {

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
      if (!channel) {
        throw new NotFoundException(`Channel with id of ${dto.channelId} does not exist`);
      }
      if (!channel.administrators.includes(user.id)) {
        throw new ForbiddenException(`User does not have permission to add a user to a channel`);
      }
      const usertoAdd = await this.userService.findOne(dto.userId);
      if (!usertoAdd) {
        throw new NotFoundException(`User with id of ${dto.userId} does not exist`);
      }
      if (usertoAdd.channelList.includes(channel.id)) {
        throw new NotAcceptableException(`User already on the channel`);
      }
      this.chatService.addUsertoChannel(channel, usertoAdd);
      const socketId = this.connectedUsers.get(usertoAdd.id);
      if (socketId) {
        const socket = this.server.sockets.sockets.get(socketId);
        //Might need to send an event to notify the user that he has been added? So that the list of channel can be updated on the front end side?
        socket.join(channel.id.toString());
        this.server.to(socketId).emit('addedtoChannel', {channelId: channel.id});
        const messages = await this.chatService.getMessage(channel.id);
        this.server.to(socketId).emit('message', messages);
      }
    }
    catch(error) {
      throw new WsException(error);
    }
  }

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
      await this.chatService.leave(channel, user);
      client.leave(channel.id.toString());
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
