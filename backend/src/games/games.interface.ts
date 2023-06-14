export enum Status {
  ONGOING,
  PAUSED,
  CANCELLED,
  FORFEIT,
  P1WIN,
  P2WIN
}

export enum Gametype {
  CLASSIC,
  SPEEDUP,
  HARDMODE
}

export class GameState {
  width: number;
  height: number;
  status: Status;
  gametype: Gametype;

  player1: {
    id?: number;
    x: number;
    y: number;
    speed: number;
    width: number;
    height: number;
  };
  player2: {
    id?: number;
    x: number;
    y: number;
    speed: number;
    width: number;
    height: number;
  };
  ball: {
    x: number;
    y: number;
    radius: number;
    velX: number;
    velY: number;
    speed: number;
  };
  score: {
    player1Score: number;
    player2Score: number;
    winScore: number;
  };
}

export const defaultGameState: GameState = {
  width: 1600,
  height: 800,
  status: Status.ONGOING,
  gametype: Gametype.CLASSIC,
  player1: {x: 0, y: 0, speed: 1, width: 10, height: 100},
  player2: {x: 0, y: 0, speed: 1, width: 10, height: 100},
  ball: {x: 0, y: 0, radius: 10, velX: 0, velY: 0, speed: 1},
  score: {player1Score: 0, player2Score: 0, winScore: 10},
}
