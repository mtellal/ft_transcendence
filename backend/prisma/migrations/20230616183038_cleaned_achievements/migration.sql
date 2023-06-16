/*
  Warnings:

  - You are about to drop the column `condition` on the `Achievement` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Achievement` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Achievement" DROP COLUMN "condition",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "Achievement_name_key" ON "Achievement"("name");
