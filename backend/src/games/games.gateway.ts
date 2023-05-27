import { WebSocketGateway } from '@nestjs/websockets';
import { GamesService } from './games.service';
import { Socket, Server } from 'socket.io';

@WebSocketGateway()
export class GamesGateway {
  constructor(private readonly gamesService: GamesService) {}
}
