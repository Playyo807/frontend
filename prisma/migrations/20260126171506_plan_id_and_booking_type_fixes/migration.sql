-- DropForeignKey
ALTER TABLE `Booking` DROP FOREIGN KEY `Booking_planId_fkey`;

-- DropIndex
DROP INDEX `Booking_planId_fkey` ON `Booking`;

-- AlterTable
ALTER TABLE `Booking` MODIFY `planId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_planId_fkey` FOREIGN KEY (`planId`) REFERENCES `ClientPlan`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
