import "server-only";

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
  const deletedBookings = await prisma.notification.deleteMany({
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
}
