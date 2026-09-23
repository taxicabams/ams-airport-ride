-- CreateEnum
CREATE TYPE "RideType" AS ENUM ('AIRPORT_TRANSFER', 'PRIVATE_RIDE');

-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('PERSONENAUTO', 'BUS');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('NEW', 'CONFIRMED', 'ASSIGNED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('UNPAID', 'PAID');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'CARD', 'ONLINE');

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "locale" TEXT NOT NULL,
    "rideType" "RideType" NOT NULL,
    "pickupAddress" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "passengers" INTEGER NOT NULL,
    "luggage" INTEGER NOT NULL,
    "vehicleType" "VehicleType" NOT NULL,
    "basePrice" INTEGER NOT NULL,
    "vehicleSurcharge" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "priceSource" TEXT NOT NULL,
    "distanceKm" DOUBLE PRECISION NOT NULL,
    "durationMin" INTEGER NOT NULL,
    "distanceSource" TEXT NOT NULL DEFAULT 'estimate',
    "totalPrice" INTEGER NOT NULL,
    "returnBasePrice" INTEGER,
    "returnVehicleSurcharge" INTEGER,
    "returnPrice" INTEGER,
    "returnDistanceKm" DOUBLE PRECISION,
    "returnDurationMin" INTEGER,
    "flightNumber" TEXT,
    "returnTrip" BOOLEAN NOT NULL DEFAULT false,
    "returnDate" TEXT,
    "returnTime" TEXT,
    "returnPickup" TEXT,
    "returnDestination" TEXT,
    "childSeat" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'NEW',
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'UNPAID',
    "paymentMethod" "PaymentMethod",

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Booking_createdAt_idx" ON "Booking"("createdAt");

-- CreateIndex
CREATE INDEX "Booking_rideType_idx" ON "Booking"("rideType");
