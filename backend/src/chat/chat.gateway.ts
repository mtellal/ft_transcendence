import { Request, UseGuards } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { User } from '@prisma/client';

@WebSocketGateway({cors: {origin: 'https://hoppscotch.io'}})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  handleMessage(client: any): string {
    console.log(client.handshake.auth);
    /* const user: User = req.user;
    console.log(user); */
    return "Message received";
  }

  async handleConnection(client: Socket) {
    this.server.emit('message', 'Hello!');
    console.log("New client connected");
  }

  handleDisconnect(client: any) {
    console.log("Client disconnected");
  }
}
