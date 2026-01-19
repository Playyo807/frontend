import "server-only";
import prisma from "@/lib/prisma";
import type { BarberProfile, User } from "@/prisma/generated/prisma/client";
import { redirect } from "next/navigation";
import { getBarberProfiles, getUsers } from "@/lib/serverFunctions";
import ClientPage from "./ClientPage";
import { decodeBookingData } from "@/lib/bookingParams";

export default async function serverWrapper({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const selectedServices = decodeBookingData(params).selectedServices;

  if (!selectedServices || selectedServices.length === 0) {
    redirect("/client?error=no-services-selected");
  }

  // Get all barber profiles
  const barbersProfiles: BarberProfile[] = await getBarberProfiles();
  const barbersUsers: User[] = await getUsers("BARBER");

  // Extract just the service IDs from the tuples
  const selectedServiceIds = selectedServices.map(([id, _name]) => id);

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

  return (
    <ClientPage
      barbers={barbersProfiles}
      barberImages={barbersImages}
      disabledBarbers={disabledBarbers}
    />
  );
}
