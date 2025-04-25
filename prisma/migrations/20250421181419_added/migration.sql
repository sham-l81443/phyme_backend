/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Syllabus` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[googleId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Syllabus` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "OTP_user_id_type_key";

-- AlterTable
ALTER TABLE "Syllabus" ADD COLUMN     "code" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "googleId" TEXT,
ADD COLUMN     "isParentConsent" BOOLEAN DEFAULT false,
ADD COLUMN     "isParentVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isUnderAged" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "parentEmail" TEXT,
ALTER COLUMN "name" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "OTP_user_id_expiry_idx" ON "OTP"("user_id", "expiry");

-- CreateIndex
CREATE UNIQUE INDEX "Syllabus_code_key" ON "Syllabus"("code");

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");

-- CreateIndex
CREATE INDEX "User_id_idx" ON "User"("id");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_googleId_idx" ON "User"("googleId");
