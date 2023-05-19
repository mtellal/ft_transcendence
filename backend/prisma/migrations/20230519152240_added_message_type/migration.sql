-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('MESSAGE', 'INVITE', 'NOTIF');

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "type" "MessageType" NOT NULL DEFAULT 'MESSAGE',
ALTER COLUMN "sendBy" DROP NOT NULL;
