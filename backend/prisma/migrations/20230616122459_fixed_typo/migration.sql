/*
  Warnings:

  - You are about to drop the column `lossStream` on the `Stats` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Stats" DROP COLUMN "lossStream",
ADD COLUMN     "lossStreak" INTEGER NOT NULL DEFAULT 0;
