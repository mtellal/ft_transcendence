-- AlterTable
ALTER TABLE "Achievement" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "condition" SET DEFAULT false;
DROP SEQUENCE "Achievement_id_seq";
