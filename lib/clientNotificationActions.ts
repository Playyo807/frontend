"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function getUserNotifications() {
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error("Not allowed");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    throw new Error("Not allowed");
  }

  const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
  const fromDate = new Date(Date.now() - THIRTY_DAYS);

  const notifications = await prisma.notification.findMany({
    where: {
      userId: user.id,
      recipientType: "USER",
      createdAt: {
        gte: fromDate,
      },
    },
    include: {
      barber: {
        select: {
          id: true,
          displayName: true,
          user: {
            select: {
              image: true,
            },
          },
        },
      },
      booking: {
        select: {
          id: true,
          date: true,
          totalPrice: true,
          barber: {
            select: {
              displayName: true,
            },
          },
        },
      },
      coupon: {
        select: {
          id: true,
          discountPercent: true,
        },
      },
      transaction: {
        select: {
          id: true,
          points: true,
          status: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return { notifications };
}

export async function getUserUnreadCount() {
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error("Not allowed");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    throw new Error("Not allowed");
  }

  const count = await prisma.notification.count({
    where: {
      userId: user.id,
      recipientType: "USER",
      read: false,
    },
  });

  return { count };
}
export async function markUserNotificationRead(notificationId: string) {
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error("Not allowed");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    throw new Error("Not allowed");
  }

  await prisma.notification.updateMany({
    where: {
      id: notificationId,
      userId: user.id,
      recipientType: "USER",
    },
    data: {
      read: true,
    },
  });

  return { success: true };
}
export async function markAllUserNotificationsRead() {
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error("Not allowed");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    throw new Error("Not allowed");
  }

  await prisma.notification.updateMany({
    where: {
      userId: user.id,
      recipientType: "USER",
      read: false,
    },
    data: {
      read: true,
    },
  });

  return { success: true };
}
