/*
  Warnings:

  - Added the required column `planId` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Booking` ADD COLUMN `planId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_planId_fkey` FOREIGN KEY (`planId`) REFERENCES `ClientPlan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClientPlan` ADD CONSTRAINT `ClientPlan_barberId_fkey` FOREIGN KEY (`barberId`) REFERENCES `BarberProfile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClientPlan` ADD CONSTRAINT `ClientPlan_planId_fkey` FOREIGN KEY (`planId`) REFERENCES `Plan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `Booking` RENAME INDEX `Booking_barberId_fkey` TO `Booking_barberId_idx`;

-- RenameIndex
ALTER TABLE `Booking` RENAME INDEX `Booking_userId_fkey2_2` TO `Booking_userId_idx`;
