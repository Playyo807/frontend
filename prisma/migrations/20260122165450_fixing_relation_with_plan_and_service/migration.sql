/*
  Warnings:

  - You are about to drop the column `useAmount` on the `Plan` table. All the data in the column will be lost.
  - You are about to drop the `_PlanToService` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `useAmount` to the `ClientPlan` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_PlanToService` DROP FOREIGN KEY `_PlanToService_A_fkey`;

-- DropForeignKey
ALTER TABLE `_PlanToService` DROP FOREIGN KEY `_PlanToService_B_fkey`;

-- AlterTable
ALTER TABLE `ClientPlan` ADD COLUMN `useAmount` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Plan` DROP COLUMN `useAmount`;

-- DropTable
DROP TABLE `_PlanToService`;

-- CreateTable
CREATE TABLE `PlanToService` (
    `planId` VARCHAR(191) NOT NULL,
    `serviceId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`planId`, `serviceId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PlanToService` ADD CONSTRAINT `PlanToService_planId_fkey` FOREIGN KEY (`planId`) REFERENCES `Plan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PlanToService` ADD CONSTRAINT `PlanToService_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
