/*
  Warnings:

  - The values [SUSPENDED] on the enum `ActiveStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [RETURNED] on the enum `RentalStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ActiveStatus_new" AS ENUM ('ACTIVE', 'SUSPEND', 'BLOCKED');
ALTER TABLE "public"."users" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "status" TYPE "ActiveStatus_new" USING ("status"::text::"ActiveStatus_new");
ALTER TYPE "ActiveStatus" RENAME TO "ActiveStatus_old";
ALTER TYPE "ActiveStatus_new" RENAME TO "ActiveStatus";
DROP TYPE "public"."ActiveStatus_old";
ALTER TABLE "users" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "RentalStatus_new" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
ALTER TABLE "public"."rentalOrder" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "rentalOrder" ALTER COLUMN "status" TYPE "RentalStatus_new" USING ("status"::text::"RentalStatus_new");
ALTER TYPE "RentalStatus" RENAME TO "RentalStatus_old";
ALTER TYPE "RentalStatus_new" RENAME TO "RentalStatus";
DROP TYPE "public"."RentalStatus_old";
ALTER TABLE "rentalOrder" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- DropEnum
DROP TYPE "OrderStatus";

-- DropEnum
DROP TYPE "PaymentMethod";

-- DropEnum
DROP TYPE "PaymentStatus";
