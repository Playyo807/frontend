-- CreateTable
CREATE TABLE `DisabledDay` (
    `id` VARCHAR(191) NOT NULL,
    `barberId` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `reason` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `DisabledDay_barberId_idx`(`barberId`),
    UNIQUE INDEX `DisabledDay_barberId_date_key`(`barberId`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DisabledDay` ADD CONSTRAINT `DisabledDay_barberId_fkey` FOREIGN KEY (`barberId`) REFERENCES `BarberProfile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
