/*
  Warnings:

  - You are about to drop the column `syllabusId` on the `Term` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Term" DROP CONSTRAINT "Term_syllabusId_fkey";

-- AlterTable
ALTER TABLE "Term" DROP COLUMN "syllabusId",
ADD COLUMN     "classId" TEXT;

-- AddForeignKey
ALTER TABLE "Term" ADD CONSTRAINT "Term_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE SET NULL ON UPDATE CASCADE;
