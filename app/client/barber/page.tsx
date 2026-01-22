import "server-only";
import prisma from "@/lib/prisma";
import type { BarberProfile, User } from "@/prisma/generated/prisma/client";
import { redirect } from "next/navigation";
import { getBarberProfiles, getUsers } from "@/lib/serverFunctions";
import ClientPage from "./ClientPage";
import { decodeBookingData } from "@/lib/bookingParams";
import { auth } from "@/auth";

export default async function serverWrapper({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await auth();
  const params = await searchParams;
  const selectedServices = decodeBookingData(params).selectedServices;

  if (!selectedServices || selectedServices.length === 0) {
    redirect("/client?error=no-services-selected");
  }

  // Get all barber profiles
  const barbersProfiles: BarberProfile[] = await getBarberProfiles();
  const barbersUsers: User[] = await getUsers(true);

  // Extract just the service IDs from the tuples
  const selectedServiceIds = selectedServices.map(([id, _name]) => id);
  const services = await prisma.service.findMany();
  const wantedServices  = services.filter(s => selectedServiceIds.includes(s.id));
  let servicePrices = wantedServices.map(s => {
    return s.price;
  })

  // Get barber-to-service relations for the selected services
  const barberServiceRelations = await prisma.barberProfileToService.findMany({
    where: {
      serviceId: {
        in: selectedServiceIds,
      },
    },
    select: {
      barberProfileId: true,
    },
  });

  // Count how many of the selected services each barber offers
  const barberServiceCount = new Map<string, number>();

  barberServiceRelations.forEach((rel) => {
    barberServiceCount.set(
      rel.barberProfileId,
      (barberServiceCount.get(rel.barberProfileId) || 0) + 1
    );
  });

  // Filter barbers that DON'T have ALL selected services
  const disabledBarbers: BarberProfile[] = barbersProfiles.filter(
    (barber) =>
      (barberServiceCount.get(barber.id) || 0) < selectedServiceIds.length
  );

  const barbersImages: string[] = barbersProfiles.map((b) => {
    const user = barbersUsers.find((v) => v.id == b.userId);
    const image = user?.image ?? "";
    return image;
  });

  // Get user's available coupons
  let availableCoupons: any[] = [];
  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        pointSystem: {
          include: {
            coupons: {
              where: {
                isUsed: false,
                OR: [
                  { expiresAt: null },
                  { expiresAt: { gt: new Date() } }
                ]
              },
              orderBy: {
                createdAt: "desc",
              },
            },
          },
        },
      },
    });

    availableCoupons = user?.pointSystem?.coupons || [];
  }

  return (
    <ClientPage
      barbers={barbersProfiles}
      barberImages={barbersImages}
      servicesPrices={servicePrices}
      disabledBarbers={disabledBarbers}
      availableCoupons={availableCoupons}
    />
  );
}