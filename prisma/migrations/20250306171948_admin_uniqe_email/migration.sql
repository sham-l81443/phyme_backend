/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "STANDARD" AS ENUM ('CLASS_ONE', 'CLASS_TWO', 'CLASS_THREE', 'CLASS_FOUR', 'CLASS_FIVE', 'CLASS_SIX', 'CLASS_SEVEN', 'CLASS_EIGHT', 'CLASS_NINE', 'CLASS_TEN', 'CLASS_ELEVEN', 'CLASS_TWELVE');

-- AlterTable
ALTER TABLE "Chapter" ADD COLUMN     "class" "STANDARD" NOT NULL DEFAULT 'CLASS_NINE';

-- AlterTable
ALTER TABLE "RefreshToken" ADD COLUMN     "adminId" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
