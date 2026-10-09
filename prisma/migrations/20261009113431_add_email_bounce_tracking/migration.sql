-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "emailBounceReason" TEXT,
ADD COLUMN     "emailBounced" BOOLEAN NOT NULL DEFAULT false;
