import prisma from "@/lib/prisma";

async function main() {
  await prisma.disabledTime.create({
    data: {
      barberId: "cmkfsgh1j0000c0ycy8k4sy05",
      date: "2026-01-23T11:40:00.000Z"
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
