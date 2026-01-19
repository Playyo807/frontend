import prisma from "@/lib/prisma";

async function main() {
  await prisma.barberProfileToService.create({
    data: {
      barberProfileId: 'cmkfsgh1j0000c0ycy8k4sy05',
      serviceId: 'cmkfo0i0d0000bsyc0ffv1avb'
    }
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
