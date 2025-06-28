/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Term` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Term` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Term_name_key";

-- AlterTable
ALTER TABLE "Term" ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE INDEX "Class_code_idx" ON "Class"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Term_code_key" ON "Term"("code");
