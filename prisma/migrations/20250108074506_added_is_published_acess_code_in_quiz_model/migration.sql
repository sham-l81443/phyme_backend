-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "accessCode" TEXT,
ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT false;
