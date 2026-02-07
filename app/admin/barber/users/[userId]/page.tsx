import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import UserDetailClient from "./ClientPage";
import { BookingStatus } from "@/prisma/generated/prisma/enums";
import * as type from "@/lib/types";

const statusPriority: Record<BookingStatus, number> = {
  [BookingStatus.CONFIRMED]: 1,
  [BookingStatus.PENDING]: 2,
  [BookingStatus.CANCELED]: 3,
};

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const session = await auth();
  const { userId } = await params;

  if (!session?.user?.email) {
    redirect("/login");
  }

  const barberUser: type.barberUser_ = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { barberProfile: true },
  });

  if (!barberUser?.barberProfile) {
    redirect("/");
  }

  const user: type.bookings_ | null = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      pointSystem: {
        include: {
          coupons: { orderBy: { createdAt: "desc" } },
          pointTransactions: {
            orderBy: { createdAt: "desc" },
            take: 5,
          },
        },
      },
      bookings: {
        include: {
          services: { include: { service: true } },
          coupon: true,
          plan: {
            include: {
              plan: true,
            },
          },
        },
        orderBy: { date: "desc" },
      },
    },
  });

  user?.bookings.sort(
    (a, b) => statusPriority[a.status] - statusPriority[b.status],
  );

  if (!user) {
    redirect("/admin/barber");
  }

  const services = await prisma.service.findMany({
    orderBy: { name: "asc" },
  });

  let isAdmin = false;

  if (barberUser?.role === "ADMIN" || barberUser?.role === "SUPERADMIN") {
    isAdmin = true;
  }

  const barberProfiles = await prisma.barberProfile.findMany({
    include: {
      user: true,
    },
  });

  return (
    <UserDetailClient
      user={user}
      barberId={barberUser.barberProfile.id}
      services={services}
      isAdmin={isAdmin}
      barberProfiles={barberProfiles}
    />
  );
}
