-- CreateIndex
CREATE INDEX `Booking_barberId_userId_status_idx` ON `Booking`(`barberId`, `userId`, `status`);
