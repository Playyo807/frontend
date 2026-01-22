import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import UserDetailClient from "./ClientPage";
import { BookingStatus } from "@/prisma/generated/prisma/enums";
import { Prisma } from "@/prisma/generated/prisma/client";

type b_ = {
  barberProfile: {
        id: string;
        displayName: string;
        userId: string;
        createdAt: Date;
        bio: string | null;
        timeInterval: number;
    } | null;
} | null

export type bookings_ = Prisma.UserGetPayload<{
  include: {
      pointSystem: {
        include: {
          coupons: { orderBy: { createdAt: "desc" } },
          pointTransactions: {
            orderBy: { createdAt: "desc" },
            take: 20,
          },
        },
      },
      bookings: {
        include: {
          services: { include: { service: true } },
          coupon: true,
        },
        orderBy: { date: "desc" },
      },
    },
}>

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

  const barberUser: b_ = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { barberProfile: true },
  });

  if (!barberUser?.barberProfile) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      pointSystem: {
        include: {
          coupons: { orderBy: { createdAt: "desc" } },
          pointTransactions: {
            orderBy: { createdAt: "desc" },
            take: 20,
          },
        },
      },
      bookings: {
        where: {
          barberId: barberUser.barberProfile.id,
        },
        include: {
          services: { include: { service: true } },
          coupon: true,
        },
        orderBy: { date: "desc" },
      },
    },
  });

  user?.bookings.sort((a, b) =>
    statusPriority[a.status] - statusPriority[b.status]
  );

  if (!user) {
    redirect("/admin/barber");
  }

  const services = await prisma.service.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <UserDetailClient
      user={user}
      barberId={barberUser.barberProfile.id}
      services={services}
    />
  );
}