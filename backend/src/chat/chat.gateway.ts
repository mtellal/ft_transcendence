import { BadRequestException, ForbiddenException, NotAcceptableException, NotFoundException, Request, UnauthorizedException, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket, WsException } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'
import { User, MessageType } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { AddUserDto, AdminActionDto, CreateChannelDto, JoinChannelDto, LeaveChannelDto, MessageDto, MuteDto } from './dto/channel.dto';
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
      await this.chatService.checkMute(channel, user);
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
      if (channel.banList.includes(user.id)) {
        throw new ForbiddenException('User was banned from this channel');
      }
      console.log(channel);
      if (client.rooms.has(channel.id.toString()))
        throw new NotAcceptableException('Client is already in the room');
      /* If it's the User first time joining the channel */
      if (!user.channelList.includes(channel.id)) {
        await this.chatService.join(dto, channel, user);
        //First time someone joins a channel
        const notif: MessageDto = {
          channelId: channel.id,
          type: MessageType.NOTIF,
          content: `${user.username} joined the channel`
        }
        await this.chatService.createNotif(notif);
        this.server.to(channel.id.toString()).emit('message', notif);
      }
      client.join(channel.id.toString());
      const messages = await this.chatService.getMessage(channel.id);
      client.emit('message', messages);
    }
    catch (error) {
      console.log(error);
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
      if (usertoAdd.blockedList.includes(user.id)) {
        throw new ForbiddenException(`User has blocked you`);
      }
      if (channel.banList.includes(usertoAdd.id)) {
        throw new ForbiddenException(`User was banned from this channel`);
      }
      this.chatService.addUsertoChannel(channel, usertoAdd);
      const notif: MessageDto = {
        channelId: channel.id,
        type: MessageType.NOTIF,
        content: `${usertoAdd.username} was added to the channel by ${user.username}`
      }
      await this.chatService.createNotif(notif);
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
      console.log(error);
      throw new WsException(error);
    }
    console.log("/////////////////////////////// EVENT LEAVECHANNEL ///////////////////////////////")
  }

  @SubscribeMessage('kickUser')
  async kickfromChannel(@ConnectedSocket() client: Socket, @MessageBody() dto: AdminActionDto) {
    console.log("/////////////////////////////// EVENT KICKFROMCHANNEL ///////////////////////////////")

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
      console.log("/////////////////////////////// EVENT KICKUSER ///////////////////////////////")
      return ;
    }
    try {
      const channel = await this.chatService.findOne(dto.channelId);
      if (!channel)
        throw new NotFoundException(`Channel with id of ${dto.channelId} does not exist`);
      if (!channel.administrators.includes(user.id))
        throw new ForbiddenException(`You do not have the permissions on that channel to kick another user`);
      if (dto.userId === user.id)
        throw new ForbiddenException(`You can't kick yourself`);
      const usertoKick = await this.userService.findOne(dto.userId);
      if (!usertoKick)
        throw new NotFoundException(`User with id of ${dto.userId} does not exist`);
      if (!usertoKick.channelList.includes(channel.id)) 
        throw new NotFoundException(`${usertoKick.username} is not on this channel`);
      if (channel.administrators.includes(usertoKick.id) && channel.ownerId !== user.id)
        throw new ForbiddenException(`You can't kick another administrator`)
      await this.chatService.kickUserfromChannel(channel, usertoKick);
      const socketId = this.connectedUsers.get(usertoKick.id);
      if (socketId) {
        const socket = this.server.sockets.sockets.get(socketId);
        if (socket.rooms.has(channel.id.toString()))
          socket.leave(channel.id.toString());
      }
      let kickMessage = `${usertoKick.username} was kicked by ${user.username}.`;
      if (dto.reason)
        kickMessage += ` Reason: ${dto.reason}`;
      const message: MessageDto = {
        channelId: channel.id,
        type: MessageType.NOTIF,
        content: kickMessage
      }
      await this.chatService.createNotif(message);
      this.server.to(channel.id.toString()).emit('message', message);
    }
    catch(error) {
      throw new WsException(error)
    }
  }

  @SubscribeMessage('muteUser')
  async muteUser(@ConnectedSocket() client: Socket, @MessageBody() dto: MuteDto) {
    console.log("/////////////////////////////// EVENT MUTEUSER ///////////////////////////////")
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
      console.log("/////////////////////////////// EVENT MUTEUSER ///////////////////////////////")
      return ;
    }
    try {
      const channel = await this.chatService.findOne(dto.channelId);
      if (!channel)
        throw new NotFoundException(`Channel with id of ${dto.channelId} does not exist`);
      if (!channel.administrators.includes(user.id))
        throw new ForbiddenException(`You do not have the permissions on that channel to mute another user`);
      if (dto.userId === user.id)
        throw new ForbiddenException(`You can't mute yourself`);
      const usertoMute = await this.userService.findOne(dto.userId);
      if (!usertoMute)
        throw new NotFoundException(`User with id of ${dto.userId} does not exist`);
      if (!usertoMute.channelList.includes(channel.id)) 
        throw new NotFoundException(`${usertoMute.username} is not on this channel`);
      if (channel.administrators.includes(usertoMute.id) && channel.ownerId !== user.id)
        throw new ForbiddenException(`You can't mute another administrator`)
      await this.chatService.muteUser(dto, usertoMute);
      let muteNotif = `${usertoMute.username} was muted by ${user.username} for ${dto.duration}".`;
      if (dto.reason)
        muteNotif += ` Reason: ${dto.reason}`;
      const notif: MessageDto = {
        channelId: channel.id,
        type: MessageType.NOTIF,
        content: muteNotif
      }
      await this.chatService.createNotif(notif);
      this.server.to(channel.id.toString()).emit('message', notif);
    }
    catch(error) {
      throw new WsException(error)
    }
  }

  @SubscribeMessage('banUser')
  async banUser(@ConnectedSocket() client: Socket, @MessageBody() dto: AdminActionDto) {
    console.log("/////////////////////////////// EVENT BANUSER ///////////////////////////////")
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
      console.log("/////////////////////////////// EVENT BANUSER ///////////////////////////////")
      return ;
    }
    try {
      const channel = await this.chatService.findOne(dto.channelId);
      if (!channel)
        throw new NotFoundException(`Channel with id of ${dto.channelId} does not exist`);
      if (!channel.administrators.includes(user.id))
        throw new ForbiddenException(`You do not have the permissions on that channel to ban another user`);
      if (dto.userId === user.id)
        throw new ForbiddenException(`You can't ban yourself`);
      const usertoBan = await this.userService.findOne(dto.userId);
      if (!usertoBan)
        throw new NotFoundException(`User with id of ${dto.userId} does not exist`);
      if (!usertoBan.channelList.includes(channel.id)) 
        throw new NotFoundException(`${usertoBan.username} is not on this channel`);
      if (channel.administrators.includes(usertoBan.id) && channel.ownerId !== user.id)
        throw new ForbiddenException(`You can't ban another administrator`)
      await this.chatService.banUser(channel, usertoBan);
      const socketId = this.connectedUsers.get(usertoBan.id);
      if (socketId) {
        const socket = this.server.sockets.sockets.get(socketId);
        if (socket.rooms.has(channel.id.toString()))
          socket.leave(channel.id.toString());
      }
      let banNotif = `${usertoBan.username} was banned by ${user.username}.`;
      if (dto.reason)
        banNotif += ` Reason: ${dto.reason}`;
      const notif: MessageDto = {
        channelId: channel.id,
        type: MessageType.NOTIF,
        content: banNotif
      }
      await this.chatService.createNotif(notif);
      this.server.to(channel.id.toString()).emit('message', notif);
    }
    catch(error) {
      throw new WsException(error)
    }
  }

  @SubscribeMessage('makeAdmin')
  async makeAdmin(@ConnectedSocket() client: Socket, @MessageBody() dto: AdminActionDto) {
    console.log("/////////////////////////////// EVENT MAKEADMIN ///////////////////////////////")
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
      console.log("/////////////////////////////// EVENT MAKEADMIN ///////////////////////////////")
      return ;
    }
    try {
      const channel = await this.chatService.findOne(dto.channelId);
      if (!channel)
        throw new NotFoundException(`Channel with id of ${dto.channelId} does not exist`);
      if (channel.ownerId !== user.id)
        throw new ForbiddenException(`Only the owner can promote another user to admin`);
      if (dto.userId === user.id)
        throw new ForbiddenException(`You're already the owner/administrator`);
      const newAdmin = await this.userService.findOne(dto.userId);
      if (!newAdmin)
        throw new NotFoundException(`User with id of ${dto.userId} does not exist`);
      if (!newAdmin.channelList.includes(channel.id)) 
        throw new NotFoundException(`${newAdmin.username} is not on this channel`);
      if (channel.administrators.includes(newAdmin.id))
        throw new ForbiddenException(`${newAdmin.username} is already an administrator`)
      await this.chatService.makeAdmin(channel, newAdmin);
      let promoteNotif = `${newAdmin.username} was promoted to administrator by ${user.username}.`;
      const notif: MessageDto = {
        channelId: channel.id,
        type: MessageType.NOTIF,
        content: promoteNotif
      }
      await this.chatService.createNotif(notif);
      this.server.to(channel.id.toString()).emit('message', notif);
    }
    catch(error) {
      throw new WsException(error)
    }
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
