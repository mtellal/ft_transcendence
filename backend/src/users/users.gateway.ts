import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Game, User } from '@prisma/client';
import { Socket, Server, Namespace } from 'socket.io';
import { UsersService } from './users.service';

@WebSocketGateway({ namespace: 'users' })
export class UsersGateway implements OnGatewayConnection, OnGatewayDisconnect{

  @WebSocketServer()
  io: Namespace;

  constructor(private jwtService: JwtService, private userService: UsersService){}

  private connectedUsers = new Map<number, string>();

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
        this.io.to(client.id).emit('alreadyConnected', user.id);
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

  async handleDisconnect(client: Socket) {
    this.removeSocketId(client.id);
    client.disconnect();
  }

  async emitGame(userId: number, joinedGame: Game) {
    this.io.to(this.getSocketId(userId)).emit('acceptedInvite', joinedGame);
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
