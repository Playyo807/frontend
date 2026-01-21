-- CreateTable
CREATE TABLE `DisabledTime` (
    `id` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `DisabledDayId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `DisabledTime_DisabledDayId_idx`(`DisabledDayId`),
    UNIQUE INDEX `DisabledTime_DisabledDayId_date_key`(`DisabledDayId`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DisabledTime` ADD CONSTRAINT `DisabledTime_DisabledDayId_fkey` FOREIGN KEY (`DisabledDayId`) REFERENCES `DisabledDay`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
