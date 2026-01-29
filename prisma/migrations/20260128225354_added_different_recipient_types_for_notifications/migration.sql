-- AlterTable
ALTER TABLE `Notification` ADD COLUMN `recipientType` ENUM('BARBER', 'USER') NOT NULL DEFAULT 'BARBER';
