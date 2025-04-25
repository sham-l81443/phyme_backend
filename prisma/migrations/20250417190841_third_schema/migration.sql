/*
  Warnings:

  - The values [PAID] on the enum `SUBSCRIPTIONTYPE` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SUBSCRIPTIONTYPE_new" AS ENUM ('FREE', 'PREMIUM');
ALTER TABLE "User" ALTER COLUMN "subscriptionType" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "subscriptionType" TYPE "SUBSCRIPTIONTYPE_new" USING ("subscriptionType"::text::"SUBSCRIPTIONTYPE_new");
ALTER TYPE "SUBSCRIPTIONTYPE" RENAME TO "SUBSCRIPTIONTYPE_old";
ALTER TYPE "SUBSCRIPTIONTYPE_new" RENAME TO "SUBSCRIPTIONTYPE";
DROP TYPE "SUBSCRIPTIONTYPE_old";
ALTER TABLE "User" ALTER COLUMN "subscriptionType" SET DEFAULT 'FREE';
COMMIT;
