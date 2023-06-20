/*
  Warnings:

  - Added the required column `status` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('MATCHMAKING', 'INVITE', 'ONGOING', 'FINISHED');

-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "player1Id" INTEGER,
ADD COLUMN     "player1Score" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "player2Id" INTEGER,
ADD COLUMN     "player2Score" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "status" "GameStatus" NOT NULL,
ADD COLUMN     "wonBy" INTEGER;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_player1Id_fkey" FOREIGN KEY ("player1Id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_player2Id_fkey" FOREIGN KEY ("player2Id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
