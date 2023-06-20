/*
  Warnings:

  - You are about to drop the `Achievement` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Achievement" DROP CONSTRAINT "Achievement_userId_fkey";

-- DropTable
DROP TABLE "Achievement";

-- CreateTable
CREATE TABLE "Achievements" (
    "userId" INTEGER NOT NULL,
    "Novice" BOOLEAN NOT NULL DEFAULT false,
    "Intermediate" BOOLEAN NOT NULL DEFAULT false,
    "Expert" BOOLEAN NOT NULL DEFAULT false,
    "Master" BOOLEAN NOT NULL DEFAULT false,
    "OnFire" BOOLEAN NOT NULL DEFAULT false,
    "Tenacious" BOOLEAN NOT NULL DEFAULT false,
    "Godlike" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Achievements_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "Achievements" ADD CONSTRAINT "Achievements_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
