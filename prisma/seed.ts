import prisma from "@/lib/prisma";

async function main() {
  const services = await prisma.service.findMany();
  await prisma.barberProfileToService.createMany({
    data: services.map(s => {
      return {
        barberProfileId: "cmkx0lrwa0000efyc3q2f1oam",
        serviceId: s.id
      }
    })
  })
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
