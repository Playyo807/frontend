"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { createNotification } from "./notificationActions";

// Confirm points for a booking
export async function confirmBookingPoints(
  bookingId: string,
  barberId: string
) {
  try {
    const session = await auth();
    if (!session?.user?.email) throw new Error("Unauthorized");

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        user: { include: { pointSystem: true } },
        services: { include: { service: true } },
      },
    });

    if (!booking) throw new Error("Booking not found");
    if (booking.barberId !== barberId) throw new Error("Not authorized");

    // Get or create point system
    let pointSystem = booking.user.pointSystem;
    if (!pointSystem) {
      throw Error('User does not have point system');
    }

    const pendingTransaction = await prisma.pointTransaction.findFirst({
        where: {
            bookingId,
            type: 'EARNED',
        }
    });

    if (!pendingTransaction) {
        throw Error('No pending transaction found');
    }

    const pointsToAdd = pendingTransaction.points;

    const updatedTransaction = await prisma.pointTransaction.update({
        where: {
            id: pendingTransaction.id,
        },
        data: {
            status: 'CONFIRMED',
        }
    })

    // Update points
    const newTotal = pointSystem.currentPoints + pointsToAdd;
    await prisma.pointSystem.update({
      where: { id: pointSystem.id },
      data: { currentPoints: newTotal },
    });

    // Create notification
    await createNotification(
      barberId,
      "POINTS_CONFIRMED",
      "Pontos Confirmados",
      `${pointsToAdd} pontos confirmados para ${booking.user.name}`,
      { userId: booking.user.id, bookingId, transactionId: updatedTransaction.id }
    );

    // Mark pending notification as read
    await prisma.notification.updateMany({
      where: { bookingId, type: "POINTS_PENDING" },
      data: { read: true },
    });

    return { success: true, pointsAdded: pointsToAdd };
  } catch (error) {
    console.error("Error confirming points:", error);
    throw error;
  }
}

// Reject points
export async function rejectBookingPoints(
  bookingId: string,
  barberId: string,
  reason?: string
) {
  try {
    const session = await auth();
    if (!session?.user?.email) throw new Error("Unauthorized");

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { user: { include: { pointSystem: true } } },
    });

    if (!booking) throw new Error("Booking not found");
    if (booking.barberId !== barberId) throw new Error("Not authorized");

    if (booking.user.pointSystem) {
      await prisma.pointTransaction.create({
        data: {
          pointSystemId: booking.user.pointSystem.id,
          points: 0,
          type: "ADJUSTED",
          status: "REJECTED",
          description: reason || "Pontos rejeitados pelo barbeiro",
          bookingId,
          confirmedAt: new Date(),
          confirmedBy: barberId,
        },
      });
    }

    // Mark pending notification as read
    await prisma.notification.updateMany({
      where: { bookingId, type: "POINTS_PENDING" },
      data: { read: true },
    });

    return { success: true };
  } catch (error) {
    console.error("Error rejecting points:", error);
    throw error;
  }
}

// Manual points adjustment
export async function adjustUserPoints(
  userId: string,
  barberId: string,
  points: number,
  reason: string
) {
  try {
    const session = await auth();
    if (!session?.user?.email) throw new Error("Unauthorized");

    const pointSystem = await prisma.pointSystem.findUnique({
      where: { userId },
    });

    if (!pointSystem) {
      throw new Error("User doesn't have a point system");
    }

    await prisma.pointTransaction.create({
      data: {
        pointSystemId: pointSystem.id,
        points,
        type: "ADJUSTED",
        status: "CONFIRMED",
        description: reason,
        confirmedAt: new Date(),
        confirmedBy: barberId,
      },
    });

    await prisma.pointSystem.update({
      where: { id: pointSystem.id },
      data: { currentPoints: { increment: points } },
    });

    await createNotification(
      barberId,
      "POINTS_ADJUSTED",
      "Pontos Ajustados",
      `${points > 0 ? "+" : ""}${points} pontos para usuário`,
      { userId }
    );

    return { success: true };
  } catch (error) {
    console.error("Error adjusting points:", error);
    throw error;
  }
}

export async function getUserPointDetails(userId: string) {
  try {
    const pointSystem = await prisma.pointSystem.findUnique({
      where: { userId },
      include: {
        coupons: {
          orderBy: { createdAt: "desc" },
        },
        pointTransactions: {
          orderBy: { createdAt: "desc" },
          take: 20,
        },
      },
    });

    return { pointSystem };
  } catch (error) {
    console.error("Error getting point details:", error);
    throw error;
  }
}