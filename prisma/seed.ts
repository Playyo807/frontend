import prisma from "@/lib/prisma";

async function main() {
  const services = await prisma.service.findMany();
  const barberProfiles = await prisma.barberProfile.findMany();

  barberProfiles.forEach(async (profile) => {
    await prisma.barberProfileToService.createMany({
      data: services.map((service) => ({
        barberProfileId: profile.id,
        serviceId: service.id,
      })),
    });
  });
}
main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
