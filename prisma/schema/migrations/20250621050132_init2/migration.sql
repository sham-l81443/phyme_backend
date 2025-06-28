/*
  Warnings:

  - The primary key for the `Chapter` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `description` on the `Chapter` table. All the data in the column will be lost.
  - You are about to drop the column `term` on the `Chapter` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Chapter` table. All the data in the column will be lost.
  - The primary key for the `Class` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `code` on the `Class` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Class` table. All the data in the column will be lost.
  - You are about to drop the column `section` on the `Class` table. All the data in the column will be lost.
  - You are about to drop the column `importance` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the column `adminId` on the `RefreshToken` table. All the data in the column will be lost.
  - The primary key for the `Subject` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `code` on the `Subject` table. All the data in the column will be lost.
  - You are about to drop the column `teacherName` on the `Subject` table. All the data in the column will be lost.
  - The primary key for the `Syllabus` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `year` on the `Syllabus` table. All the data in the column will be lost.
  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Question` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QuestionOption` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Quiz` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name,subjectId]` on the table `Chapter` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,syllabusId]` on the table `Class` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,classId,termId]` on the table `Subject` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Chapter` table without a default value. This is not possible if the table is not empty.
  - Made the column `subjectId` on table `Chapter` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `termId` to the `Subject` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Chapter" DROP CONSTRAINT "Chapter_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_syllabusId_fkey";

-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_chapterId_fkey";

-- DropForeignKey
ALTER TABLE "OTP" DROP CONSTRAINT "OTP_email_fkey";

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_quiz_id_fkey";

-- DropForeignKey
ALTER TABLE "QuestionOption" DROP CONSTRAINT "QuestionOption_question_id_fkey";

-- DropForeignKey
ALTER TABLE "RefreshToken" DROP CONSTRAINT "RefreshToken_adminId_fkey";

-- DropForeignKey
ALTER TABLE "RefreshToken" DROP CONSTRAINT "RefreshToken_userId_fkey";

-- DropForeignKey
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_classId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_classId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_syllabusId_fkey";

-- DropIndex
DROP INDEX "Class_code_idx";

-- DropIndex
DROP INDEX "Class_code_key";

-- DropIndex
DROP INDEX "Subject_code_idx";

-- DropIndex
DROP INDEX "Subject_code_key";

-- DropIndex
DROP INDEX "Subject_id_idx";

-- DropIndex
DROP INDEX "Syllabus_code_idx";

-- AlterTable
ALTER TABLE "Chapter" DROP CONSTRAINT "Chapter_pkey",
DROP COLUMN "description",
DROP COLUMN "term",
DROP COLUMN "title",
ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "subjectId" SET NOT NULL,
ALTER COLUMN "subjectId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Chapter_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Chapter_id_seq";

-- AlterTable
ALTER TABLE "Class" DROP CONSTRAINT "Class_pkey",
DROP COLUMN "code",
DROP COLUMN "description",
DROP COLUMN "section",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "syllabusId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Class_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Class_id_seq";

-- AlterTable
ALTER TABLE "Note" DROP COLUMN "importance",
ALTER COLUMN "chapterId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "RefreshToken" DROP COLUMN "adminId";

-- AlterTable
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_pkey",
DROP COLUMN "code",
DROP COLUMN "teacherName",
ADD COLUMN     "termId" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "classId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Subject_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Subject_id_seq";

-- AlterTable
ALTER TABLE "Syllabus" DROP CONSTRAINT "Syllabus_pkey",
DROP COLUMN "year",
ADD COLUMN     "academicYear" TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Syllabus_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Syllabus_id_seq";

-- DropTable
DROP TABLE "Admin";

-- DropTable
DROP TABLE "Question";

-- DropTable
DROP TABLE "QuestionOption";

-- DropTable
DROP TABLE "Quiz";

-- DropTable
DROP TABLE "User";

-- DropEnum
DROP TYPE "IMPORTANCE";

-- DropEnum
DROP TYPE "STANDARD";

-- DropEnum
DROP TYPE "STATUSTYPE";

-- DropEnum
DROP TYPE "SUBSCRIPTIONTYPE";

-- CreateTable
CREATE TABLE "Term" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "syllabusId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Term_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "googleId" TEXT,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "phone" TEXT,
    "password" TEXT,
    "hasAcceptedTerms" BOOLEAN NOT NULL DEFAULT false,
    "role" "ROLE" NOT NULL DEFAULT 'STUDENT',
    "classId" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "registrationType" "REGISTRATIONTYPE" NOT NULL,
    "syllabusId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Term_name_key" ON "Term"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_googleId_key" ON "users"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_googleId_idx" ON "users"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "Chapter_name_subjectId_key" ON "Chapter"("name", "subjectId");

-- CreateIndex
CREATE UNIQUE INDEX "Class_name_syllabusId_key" ON "Class"("name", "syllabusId");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_name_classId_termId_key" ON "Subject"("name", "classId", "termId");

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_syllabusId_fkey" FOREIGN KEY ("syllabusId") REFERENCES "Syllabus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OTP" ADD CONSTRAINT "OTP_email_fkey" FOREIGN KEY ("email") REFERENCES "users"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_termId_fkey" FOREIGN KEY ("termId") REFERENCES "Term"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Term" ADD CONSTRAINT "Term_syllabusId_fkey" FOREIGN KEY ("syllabusId") REFERENCES "Syllabus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_syllabusId_fkey" FOREIGN KEY ("syllabusId") REFERENCES "Syllabus"("id") ON DELETE SET NULL ON UPDATE CASCADE;
