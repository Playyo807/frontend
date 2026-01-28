/*
  Warnings:

  - A unique constraint covering the columns `[barberId]` on the table `ClientPlan` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `barberId` to the `ClientPlan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ClientPlan` ADD COLUMN `barberId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `ClientPlan_barberId_key` ON `ClientPlan`(`barberId`);

-- AddForeignKey
ALTER TABLE `ClientPlan` ADD CONSTRAINT `ClientPlan_barberId_fkey` FOREIGN KEY (`barberId`) REFERENCES `BarberProfile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
