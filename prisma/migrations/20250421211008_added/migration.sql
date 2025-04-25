/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Class` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Class` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Class" ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "description" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Class_code_key" ON "Class"("code");

-- CreateIndex
CREATE INDEX "Class_code_idx" ON "Class"("code");

-- CreateIndex
CREATE INDEX "Class_id_idx" ON "Class"("id");

-- CreateIndex
CREATE INDEX "Syllabus_code_idx" ON "Syllabus"("code");

-- CreateIndex
CREATE INDEX "Syllabus_id_idx" ON "Syllabus"("id");
