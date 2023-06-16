-- AlterTable
CREATE SEQUENCE achievement_id_seq;
ALTER TABLE "Achievement" ALTER COLUMN "id" SET DEFAULT nextval('achievement_id_seq');
ALTER SEQUENCE achievement_id_seq OWNED BY "Achievement"."id";
