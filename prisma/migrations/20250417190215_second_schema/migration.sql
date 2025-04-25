/*
  Warnings:

  - You are about to drop the column `userType` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "SUBSCRIPTIONTYPE" AS ENUM ('FREE', 'PAID');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "userType",
ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "badges" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "classId" INTEGER,
ADD COLUMN     "hasAcceptedTerms" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isBlocked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isProfileComplete" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "parent_email" TEXT,
ADD COLUMN     "region" TEXT,
ADD COLUMN     "streak" INTEGER DEFAULT 0,
ADD COLUMN     "subscriptionType" "SUBSCRIPTIONTYPE" NOT NULL DEFAULT 'FREE',
ADD COLUMN     "syllabusId" INTEGER;

-- DropEnum
DROP TYPE "USERTYPE";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_syllabusId_fkey" FOREIGN KEY ("syllabusId") REFERENCES "Syllabus"("id") ON DELETE SET NULL ON UPDATE CASCADE;
