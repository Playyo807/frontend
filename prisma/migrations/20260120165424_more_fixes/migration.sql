/*
  Warnings:

  - You are about to drop the column `DisabledDayId` on the `DisabledTime` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[barberId,date]` on the table `DisabledTime` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `barberId` to the `DisabledTime` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `DisabledTime` DROP FOREIGN KEY `DisabledTime_DisabledDayId_fkey`;

-- DropIndex
DROP INDEX `DisabledTime_DisabledDayId_date_key` ON `DisabledTime`;

-- DropIndex
DROP INDEX `DisabledTime_DisabledDayId_idx` ON `DisabledTime`;

-- AlterTable
ALTER TABLE `DisabledTime` DROP COLUMN `DisabledDayId`,
    ADD COLUMN `barberId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE INDEX `DisabledTime_barberId_idx` ON `DisabledTime`(`barberId`);

-- CreateIndex
CREATE UNIQUE INDEX `DisabledTime_barberId_date_key` ON `DisabledTime`(`barberId`, `date`);

-- AddForeignKey
ALTER TABLE `DisabledTime` ADD CONSTRAINT `DisabledTime_barberId_fkey` FOREIGN KEY (`barberId`) REFERENCES `BarberProfile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
