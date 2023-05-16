/*
  Warnings:

  - Made the column `password` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "User_id_key";

-- AlterTable
CREATE SEQUENCE user_id_seq;
ALTER TABLE "User" ALTER COLUMN "id" SET DEFAULT nextval('user_id_seq'),
ALTER COLUMN "avatar" DROP NOT NULL,
ALTER COLUMN "password" SET NOT NULL,
ALTER COLUMN "email" DROP NOT NULL;
ALTER SEQUENCE user_id_seq OWNED BY "User"."id";
