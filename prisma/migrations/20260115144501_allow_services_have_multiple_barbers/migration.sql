/*
  Warnings:

  - You are about to drop the column `barberId` on the `Service` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Service` DROP FOREIGN KEY `Service_barberId_fkey`;

-- DropIndex
DROP INDEX `Service_barberId_fkey` ON `Service`;

-- AlterTable
ALTER TABLE `Service` DROP COLUMN `barberId`;

-- CreateTable
CREATE TABLE `_BarberProfileToService` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_BarberProfileToService_AB_unique`(`A`, `B`),
    INDEX `_BarberProfileToService_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_BarberProfileToService` ADD CONSTRAINT `_BarberProfileToService_A_fkey` FOREIGN KEY (`A`) REFERENCES `BarberProfile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_BarberProfileToService` ADD CONSTRAINT `_BarberProfileToService_B_fkey` FOREIGN KEY (`B`) REFERENCES `Service`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
