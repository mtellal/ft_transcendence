/*
  Warnings:

  - A unique constraint covering the columns `[blockedId]` on the table `BlockedUser` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "BlockedUser_blockedId_key" ON "BlockedUser"("blockedId");
