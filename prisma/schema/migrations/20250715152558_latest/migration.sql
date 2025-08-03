/*
  Warnings:

  - Added the required column `updatedAt` to the `StudentSubscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StudentSubscription" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
