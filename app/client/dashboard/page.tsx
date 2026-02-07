export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import ClientPage from "./ClientPage";
import { auth } from "@/auth";
import { getUserBookings } from "@/lib/bookingActions";
import { BookingStatus } from "@/prisma/generated/prisma/client";
import { Suspense } from "react";
import { getAvailableCoupons, getUserPointSystem } from "@/lib/pointActions";

import * as types from "@/lib/types";

const statusPriority: Record<BookingStatus, number> = {
  [BookingStatus.CONFIRMED]: 1,
  [BookingStatus.PENDING]: 2,
  [BookingStatus.CANCELED]: 3,
};

export default async function serverWrapper() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Not authenticated");
  }
  const userBookings: types.UserBookings[] = (await getUserBookings()).bookings;
  userBookings.sort(
    (a, b) => statusPriority[a.status] - statusPriority[b.status],
  );

  const { pointSystem, plan } = await getUserPointSystem();
  const availableCoupons = await getAvailableCoupons();

  return (
    <Suspense>
      <ClientPage
        bookings={userBookings}
        pointSystem={pointSystem}
        plan={plan}
        availableCoupons={availableCoupons}
      />
    </Suspense>
  );
}
