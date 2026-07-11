-- CreateEnum
CREATE TYPE "RentalStatus" AS ENUM ('PENDING', 'APPROVED', 'RETURNED');

-- CreateTable
CREATE TABLE "rentalOrder" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "rentalDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "RentalStatus" NOT NULL DEFAULT 'PENDING',
    "gearItemId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,

    CONSTRAINT "rentalOrder_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "rentalOrder" ADD CONSTRAINT "rentalOrder_gearItemId_fkey" FOREIGN KEY ("gearItemId") REFERENCES "gearItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rentalOrder" ADD CONSTRAINT "rentalOrder_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
