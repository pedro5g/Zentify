/*
  Warnings:

  - The values [EMAIL_VERIFY] on the enum `verification_type` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `verification_codes` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "verification_type_new" AS ENUM ('FORGET_PASSWORD');
ALTER TABLE "verification_codes" ALTER COLUMN "type" TYPE "verification_type_new" USING ("type"::text::"verification_type_new");
ALTER TYPE "verification_type" RENAME TO "verification_type_old";
ALTER TYPE "verification_type_new" RENAME TO "verification_type";
DROP TYPE "verification_type_old";
COMMIT;

-- AlterTable
ALTER TABLE "verification_codes" DROP CONSTRAINT "verification_codes_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "verification_codes_pkey" PRIMARY KEY ("id");
