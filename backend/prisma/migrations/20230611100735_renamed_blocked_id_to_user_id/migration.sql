/*
  Warnings:

  - You are about to drop the column `blockedId` on the `BlockedUser` table. All the data in the column will be lost.
  - Added the required column `blockedBy` to the `BlockedUser` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BlockedUser" DROP CONSTRAINT "BlockedUser_userId_fkey";

-- AlterTable
ALTER TABLE "BlockedUser" DROP COLUMN "blockedId",
ADD COLUMN     "blockedBy" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "BlockedUser" ADD CONSTRAINT "BlockedUser_blockedBy_fkey" FOREIGN KEY ("blockedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
