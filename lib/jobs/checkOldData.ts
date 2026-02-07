import "server-only";
import prisma from "../prisma";

export default async function checkOldData() {
  const twoYearsAgo = new Date();
  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

  const deletedNotifications = await prisma.notification.deleteMany({
    where: {
      createdAt: {
        lte: twoYearsAgo,
      },
    },
  });
  const deletedBookings = await prisma.booking.deleteMany({
    where: {
      createdAt: {
        lte: twoYearsAgo,
      },
    },
  });
  const deletedPointTransactions = await prisma.pointTransaction.deleteMany({
    where: {
      createdAt: {
        lte: twoYearsAgo,
      },
    },
  });

  console.log(
    `Old data cleanup completed. Deleted notifications: ${deletedNotifications.count}, Deleted bookings: ${deletedBookings.count}, Deleted point transactions: ${deletedPointTransactions.count}`,
  );
}
