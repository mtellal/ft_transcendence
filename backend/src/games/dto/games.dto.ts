import { GameType } from "@prisma/client";

export class GameDto {
  roomId: number;
  gametype: GameType;
}
