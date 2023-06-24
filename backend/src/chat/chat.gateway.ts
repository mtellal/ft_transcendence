import { BadRequestException, ForbiddenException, NotAcceptableException, NotFoundException, Request, UnauthorizedException, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket, WsException } from '@nestjs/websockets';
import { Server, Socket, Namespace } from 'socket.io'
import { User, MessageType, ChannelType } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { AddUserDto, AdminActionDto, CreateChannelDto, InviteDto, JoinChannelDto, LeaveChannelDto, MessageDto, MuteDto, UpdateChannelDto } from './dto/channel.dto';
import { ChatService } from './chat.service';
import { GamesService } from 'src/games/games.service';
import { UsersGateway } from 'src/users/users.gateway';

@WebSocketGateway({namespace: 'chat'})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  io: Namespace;

  private connectedUsers = new Map<number, string>();

  constructor(private jwtService: JwtService, private userService: UsersService, private chatService: ChatService, private gamesService: GamesService, private readonly usersGateway: UsersGateway ){}

  @SubscribeMessage('message')
  @UsePipes(new ValidationPipe())
  async handleMessage(@MessageBody() messageDto: MessageDto, @ConnectedSocket() client: Socket) {
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
      return ;
    }
    try {
      const channel = await this.chatService.findOne(messageDto.channelId);
      if (!channel) {
        throw new NotFoundException('Channel not found');
      }
      if (!client.rooms.has(channel.id.toString())) {
        throw new ForbiddenException('User not on that channel');
      }
      if (await this.chatService.checkMute(channel, user)) {
        throw new ForbiddenException('You have been muted');
      }
      const message = await this.chatService.createMessage(messageDto, user);
      this.io.to(channel.id.toString()).emit('message', message);
    }
    catch (error) {
      throw new WsException(error)
    }
    //this.io.emit('message', message.content);
  }

  @SubscribeMessage('sendInvite')
  @UsePipes(new ValidationPipe())
  async sendInvite(@ConnectedSocket() client: Socket, @MessageBody() dto: InviteDto) {
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
      return ;
    }
    try {
      //Need a create game invite
      //Need to check if channel exist too
      //Need to check if the user is already in game, if an invite has already been sent
      //Once a game is created, emit the message with the game id as content?
      const channel = await this.chatService.findOne(dto.channelId);
      if (!channel) {
        throw new NotFoundException('Channel not found');
      }
      if (!client.rooms.has(channel.id.toString())) {
        throw new ForbiddenException('User not on that channel');
      }
      if (await this.chatService.checkMute(channel, user)) {
        throw new ForbiddenException('You have been muted');
      }
      if (await this.gamesService.isUserinGame(user.id)) {
        throw new ForbiddenException(`User ${user.username} cannot send an invite (in game/matchmaking or pending invite)`);
      }
      const newGame = await this.gamesService.createInvite(user.id, dto);
      const invite = await this.chatService.createInvite({
        channelId: channel.id,
        userId: user.id,
        gametype: dto.gametype,
        content: newGame.id.toString(),
      })
      this.io.to(channel.id.toString()).emit('message', invite);
    }
    catch(e) {
      throw new WsException(e);
    }
  }


  @SubscribeMessage('acceptInvite')
  async acceptInvite(@ConnectedSocket() client: Socket, @MessageBody() messageId: number) {
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
      return ;
    }
    try {
      const invite = await this.chatService.findMessage(messageId);
      if (!invite) {
        throw new NotFoundException(`Message with ${messageId} does not exist`)
      }
      if (invite.type !== MessageType.INVITE) {
        throw new ForbiddenException(`Message with ${messageId} is not a valid invite`)
      }
      if (invite.acceptedBy) {
        throw new ForbiddenException(`Invite was already accepted by another user`);
      }
      if (user.id === invite.sendBy) {
        throw new ForbiddenException(`You cannot accept your own invite`);
      }
      if (await this.gamesService.isUserinGame(user.id)) {
        throw new ForbiddenException(`You already are in a game or a pending game (matchmaking or invite)`);
      }
      const gameId = parseInt(invite.content);
      const game = await this.gamesService.findOne(gameId);
      if (!game) {
        throw new NotFoundException(`Game with id of ${gameId} doesn't exist`);
      }
      const joinedGame = await this.gamesService.acceptInvite(user.id, gameId);
      //Might need to tweak this, check with front
      const updatedInvite = await this.chatService.acceptInvite(messageId, user.id);
      //Remove both players pending invite
      await this.gamesService.removePendingInvite(user.id);
      await this.gamesService.removePendingInvite(joinedGame.player1Id);
      //Remove both players pending invite message
      const invitesP1 = await this.chatService.invalidInvite(joinedGame.player1Id);
      for (const inviteP1 of invitesP1) {
        this.io.to(invite.channelId.toString()).emit('updatedInvite', inviteP1);
      }
      const invitesP2 = await this.chatService.invalidInvite(joinedGame.player2Id);
      for (const inviteP2 of invitesP2) {
        this.io.to(invite.channelId.toString()).emit('updatedInvite', inviteP2);
      }
      this.io.to(updatedInvite.channelId.toString()).emit('updatedInvite', updatedInvite);
      this.usersGateway.emitGame(joinedGame.player1Id, joinedGame);
      this.usersGateway.emitGame(joinedGame.player2Id, joinedGame);
      /* this.io.to(this.getSocketId(joinedGame.player1Id)).emit('acceptedInvite', joinedGame);
      this.io.to(this.getSocketId(joinedGame.player2Id)).emit('acceptedInvite', joinedGame); */
    }
    catch(e) {
      throw new WsException(e);
    }
  }

  @SubscribeMessage('joinChannel')
  @UsePipes(new ValidationPipe())
  async joinChannel(@ConnectedSocket() client: Socket, @MessageBody() dto: JoinChannelDto) {

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
    catch (error) {
      console.error(error);
      client.disconnect();
      return ;
    }
    try {
      const channel = await this.chatService.findOne(dto.channelId);
      if (!channel)
        throw new NotFoundException('Channel not found');
      if (channel.banList.includes(user.id)) {
        throw new ForbiddenException('User was banned from this channel');
      }
      if (client.rooms.has(channel.id.toString()))
        throw new NotAcceptableException('Client is already in the room');
      /* If it's the User first time joining the channel */
      if (!user.channelList.includes(channel.id)) {
		if (channel.type === ChannelType.WHISPER && channel.members.length === 2) {
			throw new ForbiddenException('A Whisper channel can only have two users');
		}
        const updatedChannel = await this.chatService.join(dto, channel, user);
        //First time someone joins a channel
        const notif: MessageDto = {
          channelId: channel.id,
          type: MessageType.NOTIF,
          content: `${user.username} joined the channel`
        }
        const message = await this.chatService.createNotif(notif);
        this.io.to(channel.id.toString()).emit('message', message);
        this.io.to(channel.id.toString()).emit('joinedChannel', {
          channelId: channel.id,
          userId: user.id
        })
      }
      client.join(channel.id.toString());
      const messages = await this.chatService.getMessage(channel.id);
      client.emit('message', messages);
    }
    catch (error) {
      throw new WsException(error);
    }
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
    }
    catch (error) {
      console.error(error);
      client.disconnect();
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
	  if (channel.type === ChannelType.WHISPER && channel.members.length === 2) {
		throw new ForbiddenException('A Whisper channel can only have two users');
	  }
      if (await this.userService.checkifUserblocked(usertoAdd.id, user.id)) {
        throw new ForbiddenException(`User has blocked you`);
      }
      if (channel.banList.includes(usertoAdd.id)) {
        throw new ForbiddenException(`User was banned from this channel`);
      }
      const updatedChannel = await this.chatService.addUsertoChannel(channel, usertoAdd);
      const socketId = this.connectedUsers.get(usertoAdd.id);
      if (socketId) {
        //Might need to send an event to notify the user that he has been added? So that the list of channel can be updated on the front end side?
        this.io.to(socketId).emit('addedtoChannel', {
          channelId: channel.id,
          userId: usertoAdd.id
        });
      }
      const notif: MessageDto = {
        channelId: channel.id,
        type: MessageType.NOTIF,
        content: `${usertoAdd.username} was added to the channel by ${user.username}`
      }
      const message = await this.chatService.createNotif(notif);
      this.io.to(channel.id.toString()).emit('message', message);
      this.io.to(channel.id.toString()).emit('addedtoChannel', {
        channelId: channel.id,
        userId: usertoAdd.id
      });
    }
    catch(error) {
      throw new WsException(error);
    }
  }

  @SubscribeMessage('leaveChannel')
  @UsePipes(new ValidationPipe())
  async leaveChannel(@ConnectedSocket() client: Socket, @MessageBody() dto: LeaveChannelDto) {

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
    catch (error) {
      console.error(error);
      client.disconnect();
      return ;
    }
    try {
      const channel = await this.chatService.findOne(dto.channelId);
      if (!channel)
        throw new NotFoundException('Channel not found');
      if (!user.channelList.includes(channel.id))
        throw new BadRequestException('User is not on the channel');
      const updatedChannel = await this.chatService.leave(channel, user);
      client.leave(channel.id.toString());
      let leaveMessage = `${user.username} left the channel.`
      if (channel.ownerId === user.id && updatedChannel) {
        const newOwner = await this.userService.findOne(updatedChannel.ownerId)
        leaveMessage += ` ${(await newOwner).username} is now the owner of the channel`
      }
      if (updatedChannel) {
        const leaveNotif: MessageDto = {
          channelId: updatedChannel.id,
          type: MessageType.NOTIF,
          content: leaveMessage
        }
        const message = await this.chatService.createNotif(leaveNotif);
        this.io.to(updatedChannel.id.toString()).emit('message', message);
        this.io.to(updatedChannel.id.toString()).emit('leftChannel', {
          channelId: channel.id,
          userId: user.id
        });
        if (channel.ownerId !== updatedChannel.ownerId) {
          this.io.to(updatedChannel.id.toString()).emit('ownerChanged', {
            channelId: channel.id,
            userId: updatedChannel.ownerId
          })
        }
      }
    }
    catch(error) {
      throw new WsException(error);
    }
  }

  @SubscribeMessage('kickUser')
  async kickfromChannel(@ConnectedSocket() client: Socket, @MessageBody() dto: AdminActionDto) {

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
    }
    catch(error) {
      console.error("error => ", error);
      client.disconnect();
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
      const updatedChannel = await this.chatService.kickUserfromChannel(channel, usertoKick);
      this.io.to(channel.id.toString()).emit('kickedUser', {
        channelId: channel.id,
        userId: dto.userId
      });
      const socketId = this.connectedUsers.get(usertoKick.id);
      if (socketId) {
        const socket = this.io.sockets.get(socketId);
        if (socket.rooms.has(channel.id.toString()))
          socket.leave(channel.id.toString());
      }
      let kickMessage = `${usertoKick.username} was kicked by ${user.username}.`;
      if (dto.reason)
        kickMessage += ` Reason: ${dto.reason}`;
      const kickNotif: MessageDto = {
        channelId: channel.id,
        type: MessageType.NOTIF,
        content: kickMessage
      }
      const message = await this.chatService.createNotif(kickNotif);
      this.io.to(channel.id.toString()).emit('message', message);
    }
    catch(error) {
      throw new WsException(error)
    }
  }

  @SubscribeMessage('muteUser')
  @UsePipes(new ValidationPipe())
  async muteUser(@ConnectedSocket() client: Socket, @MessageBody() dto: MuteDto) {
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
    }
    catch(error) {
      console.error("error => ", error);
      client.disconnect();
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
      if (await this.chatService.checkMute(channel, usertoMute))
        throw new ForbiddenException(`${usertoMute.username} is already muted`)
      const newMute = await this.chatService.muteUser(dto, usertoMute);
      let muteNotif = `${usertoMute.username} was muted by ${user.username} for ${dto.duration}\".`;
      if (dto.reason)
        muteNotif += ` Reason: ${dto.reason}`;
      const notif: MessageDto = {
        channelId: channel.id,
        type: MessageType.NOTIF,
        content: muteNotif
      }
      const message = await this.chatService.createNotif(notif);
      this.io.to(channel.id.toString()).emit('message', message);
      this.io.to(channel.id.toString()).emit('mutedUser', {
        channelId: channel.id,
        userId: usertoMute.id,
        mute: newMute
      });
    }
    catch(error) {
      throw new WsException(error)
    }
  }

  @SubscribeMessage('unmuteUser')
  async unmuteUser(@ConnectedSocket() client: Socket, @MessageBody() dto: AdminActionDto) {
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
    }
    catch(error) {
      console.error("error => ", error);
      client.disconnect();
      return ;
    }
    const channel = await this.chatService.findOne(dto.channelId);
    if (!channel)
      throw new NotFoundException(`Channel with id of ${dto.channelId} does not exist`);
    if (!channel.administrators.includes(user.id))
      throw new ForbiddenException(`You do not have the permissions on that channel to mute another user`);
    if (dto.userId === user.id)
      throw new ForbiddenException(`You can't mute yourself`);
    const usertoUnmute = await this.userService.findOne(dto.userId);
    if (!usertoUnmute)
      throw new NotFoundException(`User with id of ${dto.userId} does not exist`);
    if (!usertoUnmute.channelList.includes(channel.id))
      throw new NotFoundException(`${usertoUnmute.username} is not on this channel`);
    if (channel.administrators.includes(usertoUnmute.id) && channel.ownerId !== user.id)
      throw new ForbiddenException(`Only the owner can unmute another administrator`);
    if (!await this.chatService.checkMute(channel, usertoUnmute))
      throw new ForbiddenException(`${usertoUnmute.username} is not muted`);
    await this.chatService.unmuteUser(dto, usertoUnmute);
    let unmuteNotif = `${usertoUnmute.username} mute was lifted by ${user.username}.`;
    const notif: MessageDto = {
      channelId: channel.id,
      type: MessageType.NOTIF,
      content: unmuteNotif
    }
    const message = await this.chatService.createNotif(notif);
    this.io.to(channel.id.toString()).emit('message', message);
    this.io.to(channel.id.toString()).emit('unmutedUser', {
      channelId: channel.id,
      userId: usertoUnmute.id
    });
  }

  @SubscribeMessage('banUser')
  async banUser(@ConnectedSocket() client: Socket, @MessageBody() dto: AdminActionDto) {
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
    }
    catch(error) {
      console.error("error => ", error);
      client.disconnect();
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
      const updatedChannel = await this.chatService.banUser(channel, usertoBan);
      this.io.to(channel.id.toString()).emit('bannedUser', {
        channelId: channel.id,
        userId: usertoBan.id
      });
      const socketId = this.connectedUsers.get(usertoBan.id);
      if (socketId) {
        const socket = this.io.sockets.get(socketId);
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
      const message = await this.chatService.createNotif(notif);
      this.io.to(channel.id.toString()).emit('message', message);
    }
    catch(error) {
      throw new WsException(error)
    }
  }

  @SubscribeMessage('unbanUser')
  async unbanUser(@ConnectedSocket() client: Socket, @MessageBody() dto: AdminActionDto) {
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
    }
    catch(error) {
      console.error("error => ", error);
      client.disconnect();
      return ;
    }
    try {
      const channel = await this.chatService.findOne(dto.channelId);
      if (!channel)
        throw new NotFoundException(`Channel with id of ${dto.channelId} does not exist`);
      if (!channel.administrators.includes(user.id))
        throw new ForbiddenException(`You do not have the permissions on that channel to unban another user`);
      if (dto.userId === user.id)
        throw new ForbiddenException(`You can't unban yourself`);
      const usertoUnban = await this.userService.findOne(dto.userId);
      if (!usertoUnban)
        throw new NotFoundException(`User with id of ${dto.userId} does not exist`);
      if (!channel.banList.includes(usertoUnban.id)) 
        throw new NotFoundException(`${usertoUnban.username} is not banned on this channel`);
      const updatedChannel = await this.chatService.unbanUser(channel, usertoUnban);
      this.io.to(channel.id.toString()).emit('unbannedUser', {
        channelId: channel.id,
        userId: usertoUnban.id
      });
      const socketId = this.connectedUsers.get(usertoUnban.id);
      if (socketId) {
        this.io.to(socketId).emit('unbannedUser', {
          channelId: channel.id,
          userId: usertoUnban.id
        });
      }
      let unbanNotif = `${usertoUnban.username}'s ban was lifted by ${user.username}.`;
      const notif: MessageDto = {
        channelId: channel.id,
        type: MessageType.NOTIF,
        content: unbanNotif
      }
      const message = await this.chatService.createNotif(notif);
      this.io.to(channel.id.toString()).emit('message', message);
    }
    catch(error) {
      throw new WsException(error)
    }
  }

  @SubscribeMessage('makeAdmin')
  async makeAdmin(@ConnectedSocket() client: Socket, @MessageBody() dto: AdminActionDto) {
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
    }
    catch(error) {
      console.error("error => ", error);
      client.disconnect();
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
      const updatedChannel = await this.chatService.makeAdmin(channel, newAdmin);
      this.io.to(channel.id.toString()).emit('madeAdmin', {
        channelId: channel.id,
        userId: newAdmin.id
      })
      let promoteNotif = `${newAdmin.username} was promoted to administrator by ${user.username}.`;
      const notif: MessageDto = {
        channelId: channel.id,
        type: MessageType.NOTIF,
        content: promoteNotif
      }
      const message = await this.chatService.createNotif(notif);
      this.io.to(channel.id.toString()).emit('message', message);
    }
    catch(error) {
      throw new WsException(error)
    }
  }

  @SubscribeMessage('removeAdmin')
  async removeAdmin(@ConnectedSocket() client: Socket, @MessageBody() dto: AdminActionDto) {
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
    }
    catch(error) {
      console.error("error => ", error);
      client.disconnect();
      return ;
    }
    try {
      const channel = await this.chatService.findOne(dto.channelId);
      if (!channel)
        throw new NotFoundException(`Channel with id of ${dto.channelId} does not exist`);
      if (channel.ownerId !== user.id)
        throw new ForbiddenException(`Only the owner can demote another user`);
      if (dto.userId === user.id)
        throw new ForbiddenException(`You are the owner`);
      const removedAdmin = await this.userService.findOne(dto.userId);
      if (!removedAdmin)
        throw new NotFoundException(`User with id of ${dto.userId} does not exist`);
      if (!removedAdmin.channelList.includes(channel.id)) 
        throw new NotFoundException(`${removedAdmin.username} is not on this channel`);
      if (!channel.administrators.includes(removedAdmin.id))
        throw new ForbiddenException(`${removedAdmin.username} is not an administrator`)
      const updatedChannel = await this.chatService.removeAdmin(channel, removedAdmin);
      this.io.to(channel.id.toString()).emit('removedAdmin', {
        channelId: channel.id,
        userId: removedAdmin.id
      })
      let demoteNotif = `${removedAdmin.username} was removed from administrator by ${user.username}.`;
      const notif: MessageDto = {
        channelId: channel.id,
        type: MessageType.NOTIF,
        content: demoteNotif
      }
      const message = await this.chatService.createNotif(notif);
      this.io.to(channel.id.toString()).emit('message', message);
    }
    catch(error) {
      throw new WsException(error)
    }
  }


  //Change name to add
  @SubscribeMessage('updateChannel')
  async updateChannel(@ConnectedSocket() client: Socket, @MessageBody() dto: UpdateChannelDto) {
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
    }
    catch(error) {
      console.error("error => ", error);
      client.disconnect();
      return ;
    }
    const channel = await this.chatService.findOne(dto.channelId);
    if (!channel)
      throw new NotFoundException(`Channel with id of ${dto.channelId} does not exist`);
    if (channel.ownerId !== user.id)
      throw new ForbiddenException(`Only the owner can change the password and/or channel type`);
    const updatedChannel = await this.chatService.updateChannel(dto, channel);
    this.io.to(channel.id.toString()).emit('updatedChannel', updatedChannel);
    let updateNotif = `${user.username} updated the channel:`;
    if (dto.name)
      updateNotif += ` ${channel.name} is now named ${updatedChannel.name}`
    if (dto.password)
      updateNotif += ` ${updatedChannel.name} is now protected by a password.`
    if (dto.type && !dto.password)
      updateNotif += ` ${updatedChannel.name} is now ${dto.type.toLowerCase()}.`
    const notif: MessageDto = {
      channelId: channel.id,
      type: MessageType.NOTIF,
      content: updateNotif
    }
    const message = await this.chatService.createNotif(notif);
    this.io.to(channel.id.toString()).emit('message', message);
  }

  async handleConnection(client: Socket) {
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
      if (this.connectedUsers.has(user.id)) {
        const socketId = this.connectedUsers.get(user.id);
		if (socketId) {
			const socket = this.io.sockets.get(socketId);
			socket.disconnect();
		}
      }
    }
    catch(error) {
      console.error("error => ", error);
      client.disconnect();
      return ;
    }
    this.connectedUsers.set(user.id, client.id);
  }

  handleDisconnect(client: Socket) {
    this.removeSocketId(client.id);
    client.disconnect();
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
