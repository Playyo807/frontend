import "server-only";

import ClientPage from "./ClientPage";
import { auth } from "@/auth";
import { getUserBookings } from "@/lib/bookingActions";
import { Prisma, BookingStatus } from "@/prisma/generated/prisma/client";
import { Suspense } from "react";

export type UserBookings = Prisma.BookingGetPayload<{
  include: {
    services: {
      include: {
        service: true;
      };
    };
    barber: {
      include: {
        user: true;
      };
    };
  };
}>;

const statusPriority: Record<BookingStatus, number> = {
  [BookingStatus.CONFIRMED]: 1,
  [BookingStatus.PENDING]: 2,
  [BookingStatus.CANCELED]: 3,
};

export default async function serverWrapper() {
  const session = await auth();
  const userBookings: UserBookings[] = (await getUserBookings()).bookings;
  userBookings.sort((a, b) =>
  statusPriority[a.status] - statusPriority[b.status]
);


  return (
    <Suspense>
      <ClientPage bookings={userBookings} />
    </Suspense>
  );
}
