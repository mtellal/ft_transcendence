-- CreateEnum
CREATE TYPE "GameType" AS ENUM ('CLASSIC', 'SPEEDUP', 'HARDMODE');

-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "gametype" "GameType" NOT NULL DEFAULT 'CLASSIC';
