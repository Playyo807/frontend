/*
  Warnings:

  - You are about to alter the column `useAmount` on the `ClientPlan` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - A unique constraint covering the columns `[userId,barberId]` on the table `ClientPlan` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `ClientPlan` DROP FOREIGN KEY `ClientPlan_barberId_fkey`;

-- DropForeignKey
ALTER TABLE `ClientPlan` DROP FOREIGN KEY `ClientPlan_planId_fkey`;

-- DropIndex
DROP INDEX `ClientPlan_barberId_key` ON `ClientPlan`;

-- DropIndex
DROP INDEX `ClientPlan_planId_key` ON `ClientPlan`;

-- AlterTable
ALTER TABLE `ClientPlan` ALTER COLUMN `expires` DROP DEFAULT,
    MODIFY `useAmount` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Plan` ADD COLUMN `barberId` VARCHAR(191) NOT NULL DEFAULT 'cmkfsgh1j0000c0ycy8k4sy05',
    ADD COLUMN `description` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `ClientPlan_userId_barberId_key` ON `ClientPlan`(`userId`, `barberId`);

-- CreateIndex
CREATE INDEX `Plan_barberId_idx` ON `Plan`(`barberId`);

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_userId_fkey2_2` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DisabledDay` ADD CONSTRAINT `DisabledDay_barberId_fkey_2` FOREIGN KEY (`barberId`) REFERENCES `BarberProfile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Plan` ADD CONSTRAINT `Plan_barberId_fkey` FOREIGN KEY (`barberId`) REFERENCES `BarberProfile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
