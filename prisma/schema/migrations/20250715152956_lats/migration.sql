/*
  Warnings:

  - A unique constraint covering the columns `[id,syllabusId]` on the table `Class` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Class_name_syllabusId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Class_id_syllabusId_key" ON "Class"("id", "syllabusId");
