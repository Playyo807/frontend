"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { addMinutes, isBefore, startOfDay, endOfDay } from "date-fns";
import { createNotification } from "./notificationActions";

export async function getUserBookingsForBarber(
  userId: string,
  barberId: string,
) {
  try {
    const session = await auth();
    if (!session?.user?.email) throw new Error("Unauthorized");

    const bookings = await prisma.booking.findMany({
      where: {
        userId,
        barberId,
      },
      include: {
        services: {
          include: { service: true },
        },
        coupon: true,
      },
      orderBy: { date: "desc" },
    });

    return { bookings };
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    throw error;
  }
}

// Edit booking
export async function editBooking(
  bookingId: string,
  barberId: string,
  updates: {
    date?: string;
    serviceIds?: string[];
    status?: string;
  },
) {
  try {
    const session = await auth();
    if (!session?.user?.email) throw new Error("Unauthorized");

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        user: true,
        services: { include: { service: true } },
      },
    });

    if (!booking) throw new Error("Booking not found");
    if (booking.barberId !== barberId) throw new Error("Not authorized");

    let totalPrice = booking.totalPrice;
    let totalDuration = booking.totalDuration;

    // If services changed, recalculate
    if (updates.serviceIds) {
      const services = await prisma.service.findMany({
        where: { id: { in: updates.serviceIds } },
      });

      totalPrice = services.reduce((sum, s) => sum + s.price, 0);
      totalDuration = services.reduce((sum, s) => sum + s.duration, 0);

      // Delete old services
      await prisma.bookingService.deleteMany({
        where: { bookingId },
      });
    }

    // Check availability if date changed
    if (updates.date) {
      const newDate = new Date(updates.date);
      if (isBefore(newDate, new Date())) {
        throw new Error("Cannot book in the past");
      }

      const bookingEnd = addMinutes(newDate, totalDuration);
      const conflicts = await prisma.booking.findMany({
        where: {
          barberId,
          id: { not: bookingId },
          status: { in: ["PENDING", "CONFIRMED"] },
          date: {
            gte: startOfDay(newDate),
            lte: endOfDay(newDate),
          },
        },
      });

      const hasConflict = conflicts.some((b) => {
        const existingStart = new Date(b.date);
        const existingEnd = addMinutes(existingStart, b.totalDuration);
        return (
          (newDate >= existingStart && newDate < existingEnd) ||
          (bookingEnd > existingStart && bookingEnd <= existingEnd) ||
          (newDate <= existingStart && bookingEnd >= existingEnd)
        );
      });

      if (hasConflict) {
        throw new Error("Time slot not available");
      }
    }

    // Update booking
    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        ...(updates.date && { date: new Date(updates.date) }),
        ...(updates.status && { status: updates.status as any }),
        ...(updates.serviceIds && {
          totalPrice,
          totalDuration,
          services: {
            create: updates.serviceIds.map((serviceId) => ({ serviceId })),
          },
        }),
      },
      include: {
        services: { include: { service: true } },
        user: true,
      },
    });

    // Create notification
    await createNotification({
      barberId,
      type: "BOOKING_EDITED",
      title: "Agendamento Editado",
      message: `Agendamento de ${booking.user.name} foi editado`,
      userId: booking.userId,
      recipientType: "BARBER",
      bookingId,
      url: "/admin/barber",
    });

    return { success: true, booking: updated };
  } catch (error) {
    console.error("Error editing booking:", error);
    throw error;
  }
}
