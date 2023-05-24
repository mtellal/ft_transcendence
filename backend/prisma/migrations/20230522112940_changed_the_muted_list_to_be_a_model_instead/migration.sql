/*
  Warnings:

  - You are about to drop the column `muteList` on the `Channel` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Channel" DROP COLUMN "muteList";

-- CreateTable
CREATE TABLE "MutedUser" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "duration" TIMESTAMP(3) NOT NULL,
    "channelId" INTEGER,

    CONSTRAINT "MutedUser_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MutedUser" ADD CONSTRAINT "MutedUser_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
