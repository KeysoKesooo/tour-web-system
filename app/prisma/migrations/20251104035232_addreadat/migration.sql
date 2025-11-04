-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "readAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Trip" ALTER COLUMN "capacity" DROP DEFAULT;
