-- AlterTable
ALTER TABLE `PointTransaction` ADD COLUMN `confirmedAt` DATETIME(3) NULL,
    ADD COLUMN `confirmedBy` VARCHAR(191) NULL,
    ADD COLUMN `status` ENUM('PENDING', 'CONFIRMED', 'REJECTED') NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE `Notification` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('COUPON_REDEEMED', 'POINTS_PENDING', 'POINTS_CONFIRMED', 'POINTS_REJECTED', 'POINTS_ADJUSTED', 'BOOKING_CREATED', 'BOOKING_EDITED', 'BOOKING_CANCELLED') NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `read` BOOLEAN NOT NULL DEFAULT false,
    `barberId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `bookingId` VARCHAR(191) NULL,
    `couponId` VARCHAR(191) NULL,
    `transactionId` VARCHAR(191) NULL,
    `metadata` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Notification_barberId_idx`(`barberId`),
    INDEX `Notification_userId_idx`(`userId`),
    INDEX `Notification_bookingId_idx`(`bookingId`),
    INDEX `Notification_read_idx`(`read`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `Booking`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_couponId_fkey` FOREIGN KEY (`couponId`) REFERENCES `Coupon`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_transactionId_fkey` FOREIGN KEY (`transactionId`) REFERENCES `PointTransaction`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
