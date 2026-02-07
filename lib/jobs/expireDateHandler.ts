import "server-only";

export default async function expireDateHandler() {
  const expiredPlans = await prisma.clientPlan.updateMany({
    where: {
      expires: {
        lte: new Date(),
      },
    },
    data: {
      useAmount: 0,
    },
  });

  const expiredCoupons = await prisma.coupon.deleteMany({
    where: {
      expiresAt: {
        lte: new Date(),
      },
    },
  });

  console.log(
    `Expired plans updated: ${expiredPlans.count}, Expired coupons deleted: ${expiredCoupons.count}`,
  );
}
