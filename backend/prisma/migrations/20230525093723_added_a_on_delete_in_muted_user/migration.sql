-- DropForeignKey
ALTER TABLE "MutedUser" DROP CONSTRAINT "MutedUser_channelId_fkey";

-- AddForeignKey
ALTER TABLE "MutedUser" ADD CONSTRAINT "MutedUser_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
