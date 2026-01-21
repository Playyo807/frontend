/*
  Warnings:

  - A unique constraint covering the columns `[barberId,date]` on the table `ExtraTimeDay` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `barberId` to the `ExtraTimeDay` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `ExtraTimeDay_date_key` ON `ExtraTimeDay`;

-- AlterTable
ALTER TABLE `ExtraTimeDay` ADD COLUMN `barberId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE INDEX `ExtraTimeDay_barberId_idx` ON `ExtraTimeDay`(`barberId`);

-- CreateIndex
CREATE UNIQUE INDEX `ExtraTimeDay_barberId_date_key` ON `ExtraTimeDay`(`barberId`, `date`);

-- AddForeignKey
ALTER TABLE `ExtraTimeDay` ADD CONSTRAINT `ExtraTimeDay_barberId_fkey` FOREIGN KEY (`barberId`) REFERENCES `BarberProfile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
