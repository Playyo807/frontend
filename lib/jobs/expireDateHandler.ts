import "server-only";

export default async function expireDateHandler() {
  const expiredPlans = await prisma.clientPlan.updateMany({
    where: {
      expires: {
        gte: new Date(),
      },
    },
    data: {
      useAmount: 0,
    },
  });
}
