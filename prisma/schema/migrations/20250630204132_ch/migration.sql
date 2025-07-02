/*
  Warnings:

  - You are about to drop the column `termId` on the `Subject` table. All the data in the column will be lost.
  - You are about to drop the column `academicYear` on the `Syllabus` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `Chapter` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code,subjectId,termId]` on the table `Chapter` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,classId]` on the table `Subject` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Chapter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `termId` to the `Chapter` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_termId_fkey";

-- DropIndex
DROP INDEX "Chapter_name_subjectId_key";

-- DropIndex
DROP INDEX "Subject_name_classId_termId_key";

-- AlterTable
ALTER TABLE "Chapter" ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "termId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Subject" DROP COLUMN "termId";

-- AlterTable
ALTER TABLE "Syllabus" DROP COLUMN "academicYear";

-- CreateIndex
CREATE UNIQUE INDEX "Chapter_code_key" ON "Chapter"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Chapter_code_subjectId_termId_key" ON "Chapter"("code", "subjectId", "termId");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_name_classId_key" ON "Subject"("name", "classId");

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_termId_fkey" FOREIGN KEY ("termId") REFERENCES "Term"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
