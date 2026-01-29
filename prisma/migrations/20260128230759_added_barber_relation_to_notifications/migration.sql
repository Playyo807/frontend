-- AlterTable
ALTER TABLE `Notification` MODIFY `barberId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_barberId_fkey` FOREIGN KEY (`barberId`) REFERENCES `BarberProfile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
