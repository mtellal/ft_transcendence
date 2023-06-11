export enum Status {
  ONGOING,
  PAUSED,
  CANCELLED,
  FORFEIT,
  P1WIN,
  P2WIN
}

export class GameState {
  player1: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  player2: {
    x: number;
    y: number;
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
  width: number;
  height: number;
  status: Status
}

export const defaultGameState: GameState = {
  player1: {x: 0, y: 0, width: 100, height: 100},
  player2: {x: 0, y: 0, width: 100, height: 100},
  ball: {x: 0, y: 0, radius: 10, velX: 0, velY: 0, speed: 1},
  score: {player1Score: 0, player2Score: 0, winScore: 10},
  width: 1600,
  height: 800,
  status: Status.PAUSED
}
