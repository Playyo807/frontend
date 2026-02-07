import prisma from "@/lib/prisma";

async function main() {
  const barberProfileToServiceCount =
    await prisma.barberProfileToService.findMany({
      where: {
        barberProfileId: "cmkx0lrwa0000efyc3q2f1oam",
      },
    });
  const services = await prisma.service.findMany({
    where: {
      id: {
        notIn: barberProfileToServiceCount.map((b) => b.serviceId),
      },
    },
  });
  await prisma.barberProfileToService.createMany({
    data: services.map((s) => {
      return {
        barberProfileId: "cmkx0lrwa0000efyc3q2f1oam",
        serviceId: s.id,
      };
    }),
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
