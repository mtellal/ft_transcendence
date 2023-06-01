import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { GamesService } from './games.service';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({namespace:'game'})
export class GamesGateway implements OnGatewayConnection, OnGatewayDisconnect{
  constructor(private readonly gamesService: GamesService) {}

  async handleConnection(client: Socket) {
    console.log("Connected to game socket");
  }

  async handleDisconnect(client: any) {
    console.log('Disconnect games gateway');
  }

  @SubscribeMessage('test')
  async handleTest(client: any) {
    console.log("Event received");
  }
}
