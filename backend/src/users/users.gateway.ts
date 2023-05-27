import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { User } from '@prisma/client';
import { Socket, Server } from 'socket.io';
import { UsersService } from './users.service';

@WebSocketGateway({cors: {origin: '*'}})
export class UsersGateway implements OnGatewayConnection, OnGatewayDisconnect{

  @WebSocketServer()
  server: Server;

  constructor(private jwtService: JwtService, private userService: UsersService){}

  private connectedUsers = new Map<number, string>();

  async handleConnection(client: Socket) {
    console.log("/////////////////////////////// EVENT HANDLECONNECTION: UsersGateway ///////////////////////////////")

    console.log(this.server.engine.clientsCount);
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
      console.log("/////////////////////////////// EVENT HANDLECONNECTION: UsersGateway ///////////////////////////////")
      return ;
    }
    this.connectedUsers.set(user.id, client.id);
    console.log(this.connectedUsers);
    console.log("New client connected");
    console.log("/////////////////////////////// EVENT HANDLECONNECTION: UsersGateway ///////////////////////////////")
  }

  async handleDisconnect(client: any) {
    console.log('Disconnect');
  }

  getSocketId(userId: number) {
    return this.connectedUsers.get(userId);
  }
}
