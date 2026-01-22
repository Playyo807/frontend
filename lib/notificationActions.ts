"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { addMinutes } from "date-fns";

export async function getBarberNotifications(barberId: string) {
  const session = await auth();

  if (!session?.user) {
    throw Error("Not allowed");
  }

  const prismaUser = await prisma.user.findFirst({
    where: { email: session.user.email },
  });

  if (prismaUser?.role == "USER" || !prismaUser) {
    throw Error("Not allowed");
  }

  try {
    const notifications = await prisma.notification.findMany({
      where: { barberId },
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
        booking: {
          select: { id: true, date: true, totalPrice: true },
        },
        coupon: {
          select: { id: true, discountPercent: true },
        },
        transaction: {
          select: { id: true, points: true, status: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return { notifications };
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
}

// Get unread count
export async function getUnreadCount(barberId: string) {
  try {
    const count = await prisma.notification.count({
      where: { barberId, read: false },
    });
    return { count };
  } catch (error) {
    console.error("Error getting unread count:", error);
    throw error;
  }
}

// Mark as read
export async function markNotificationRead(notificationId: string) {
  try {
    await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });
    return { success: true };
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
}

// Mark all as read
export async function markAllNotificationsRead(barberId: string) {
  try {
    await prisma.notification.updateMany({
      where: { barberId, read: false },
      data: { read: true },
    });
    return { success: true };
  } catch (error) {
    console.error("Error marking all as read:", error);
    throw error;
  }
}

// Create notification
export async function createNotification(
  barberId: string,
  type: string,
  title: string,
  message: string,
  options?: {
    userId?: string;
    bookingId?: string;
    couponId?: string;
    transactionId?: string;
    metadata?: any;
  },
) {
  try {
    const notification = await prisma.notification.create({
      data: {
        barberId,
        type: type as any,
        title,
        message,
        userId: options?.userId,
        bookingId: options?.bookingId,
        couponId: options?.couponId,
        transactionId: options?.transactionId,
        metadata: options?.metadata ? JSON.stringify(options.metadata) : null,
      },
    });
    return { notification };
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
}

// Check and create pending points notifications
export async function checkPendingPointsNotifications(barberId: string) {
  try {
    const now = new Date();
    const fifteenMinutesAgo = addMinutes(now, -15);
    const oneHourAgo = addMinutes(now, -60);

    // Find completed bookings from 15 minutes ago
    const bookings = await prisma.booking.findMany({
      where: {
        barberId,
        status: "CONFIRMED",
        date: {
          lte: fifteenMinutesAgo,
          gte: oneHourAgo,
        },
      },
      include: {
        user: true,
        services: {
          include: { service: true },
        },
      },
    });

    for (const booking of bookings) {
      // Check if notification already exists
      const existingNotification = await prisma.notification.findFirst({
        where: {
          bookingId: booking.id,
          type: "POINTS_PENDING",
        },
      });

      if (!existingNotification) {
        // Check if points were already confirmed
        const pointSystem = await prisma.pointSystem.findUnique({
          where: { userId: booking.userId },
          include: {
            pointTransactions: {
              where: { bookingId: booking.id },
            },
          },
        });

        const hasConfirmedTransaction = pointSystem?.pointTransactions.some(
          (t) => t.status === "CONFIRMED",
        );

        if (!hasConfirmedTransaction) {
          await createNotification(
            barberId,
            "POINTS_PENDING",
            "Confirmar Pontos",
            `${booking.user.name} completou um agendamento. Confirme os pontos ganhos.`,
            {
              userId: booking.userId,
              bookingId: booking.id,
            },
          );
        }
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error checking pending points:", error);
    throw error;
  }
}
