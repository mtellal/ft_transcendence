import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { GamesService } from './games.service';
import { Socket, Server } from 'socket.io';
import { User } from '@prisma/client';
import { UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({namespace:'game'})
export class GamesGateway implements OnGatewayConnection, OnGatewayDisconnect{
  constructor(private readonly gamesService: GamesService, private readonly userService: UsersService, private readonly jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    console.log("Connected to game socket");
  }

  async handleDisconnect(client: any) {
    console.log('Disconnect games gateway');
  }

  @SubscribeMessage('up')
  async handleUp(client:any) {

  }

  @SubscribeMessage('down')
  async handleDown(client: any) {

  }

  @SubscribeMessage('joinGame')
  async handleTest(client: any) {
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
    console.log("Event received");
    const pendingGame = await this.gamesService.findPendingGame();
    if (pendingGame) {
      console.log(pendingGame);
      console.log('Looking for a player!');
      //Don't forget to check here if a dumbass tries to join his own game on a second client
    }
    else {
      console.log ('Need to create a match !')
      const game = await this.gamesService.createGame(user);
      console.log(game);
    }
    // Need to create a game if no games are found
    // If a game is found join as player two
    // Need a func to check for pending game
  }
}
