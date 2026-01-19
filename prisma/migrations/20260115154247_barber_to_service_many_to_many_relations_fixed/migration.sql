/*
  Warnings:

  - You are about to drop the `_BarberProfileToService` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_BarberProfileToService` DROP FOREIGN KEY `_BarberProfileToService_A_fkey`;

-- DropForeignKey
ALTER TABLE `_BarberProfileToService` DROP FOREIGN KEY `_BarberProfileToService_B_fkey`;

-- DropTable
DROP TABLE `_BarberProfileToService`;

-- CreateTable
CREATE TABLE `BarberProfileToService` (
    `barberProfileId` VARCHAR(191) NOT NULL,
    `serviceId` VARCHAR(191) NOT NULL,

    INDEX `BarberProfileToService_serviceId_idx`(`serviceId`),
    PRIMARY KEY (`barberProfileId`, `serviceId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BarberProfileToService` ADD CONSTRAINT `BarberProfileToService_barberProfileId_fkey` FOREIGN KEY (`barberProfileId`) REFERENCES `BarberProfile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BarberProfileToService` ADD CONSTRAINT `BarberProfileToService_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
