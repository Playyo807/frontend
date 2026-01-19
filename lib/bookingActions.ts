// lib/booking-actions.ts
"use server";

import prisma from "@/lib/prisma";
import { startOfDay, endOfDay, addMinutes, isBefore, isAfter } from "date-fns";
import { auth } from "@/auth";

interface TimeSlot {
  start: Date;
  end: Date;
  isAvailable: boolean;
}

interface DayAvailability {
  date: string;
  status: "available" | "partial" | "full" | "past";
  availableSlots: number;
  totalSlots: number;
}

interface TimeSlotResponse {
  start: string;
  end: string;
  isAvailable: boolean;
  isPast: boolean;
  isBooked: boolean;
}

// Get monthly availability for a barber
export async function getBarberAvailability(
  barberId: string,
  month: string, // Format: YYYY-MM
  timezone: string = "America/Sao_Paulo"
): Promise<{ availability: DayAvailability[] }> {
  try {
    // Get barber profile
    const barber = await prisma.barberProfile.findUnique({
      where: { id: barberId },
      select: { timeInterval: true },
    });

    if (!barber) {
      throw new Error("Barber not found");
    }

    // Parse month and get date range
    const [year, monthNum] = month.split("-").map(Number);
    const firstDay = new Date(year, monthNum - 1, 1);
    const lastDay = new Date(year, monthNum, 0);

    // Get all bookings for this barber in the month
    const bookings = await prisma.booking.findMany({
      where: {
        barberId,
        date: {
          gte: startOfDay(firstDay),
          lte: endOfDay(lastDay),
        },
        status: {
          in: ["PENDING", "CONFIRMED"],
        },
      },
      select: {
        date: true,
        totalDuration: true,
      },
    });

    // Generate availability for each day
    const availability: DayAvailability[] = [];
    const current = new Date(firstDay);
    const now = new Date();

    while (current <= lastDay) {
      const dayStart = startOfDay(current);
      const dayEnd = endOfDay(current);

      // Check if day is in the past
      if (isBefore(dayEnd, now)) {
        availability.push({
          date: current.toISOString().split("T")[0],
          status: "past",
          availableSlots: 0,
          totalSlots: 0,
        });
        current.setDate(current.getDate() + 1);
        continue;
      }

      // Get bookings for this day
      const dayBookings = bookings.filter((booking) => {
        const bookingDate = new Date(booking.date);
        return bookingDate >= dayStart && bookingDate <= dayEnd;
      });

      // Generate time slots for the day (9 AM to 6 PM)
      const slots = generateTimeSlots(current, barber.timeInterval);

      // Mark slots as unavailable based on bookings
      const availableSlots = slots.filter((slot) => {
        // Skip past slots
        if (isBefore(slot.start, now)) {
          return false;
        }

        // Check if slot conflicts with any booking
        return !dayBookings.some((booking) => {
          const bookingStart = new Date(booking.date);
          const bookingEnd = addMinutes(bookingStart, booking.totalDuration);

          return (
            (slot.start >= bookingStart && slot.start < bookingEnd) ||
            (slot.end > bookingStart && slot.end <= bookingEnd) ||
            (slot.start <= bookingStart && slot.end >= bookingEnd)
          );
        });
      });

      const totalSlots = slots.length;
      const availableSlotsCount = availableSlots.length;

      let status: "available" | "partial" | "full" | "past";
      if (availableSlotsCount === 0) {
        status = "full";
      } else if (availableSlotsCount === totalSlots) {
        status = "available";
      } else {
        status = "partial";
      }

      availability.push({
        date: current.toISOString().split("T")[0],
        status,
        availableSlots: availableSlotsCount,
        totalSlots,
      });

      current.setDate(current.getDate() + 1);
    }

    return { availability };
  } catch (error) {
    console.error("Error fetching availability:", error);
    throw error;
  }
}

// Get available time slots for a specific day
export async function getBarberSlots(
  barberId: string,
  dateStr: string, // Format: YYYY-MM-DD
  timezone: string = "America/Sao_Paulo"
): Promise<{ slots: TimeSlotResponse[] }> {
  try {
    const date = new Date(dateStr + "T12:00:00");

    // Get barber profile
    const barber = await prisma.barberProfile.findUnique({
      where: { id: barberId },
      select: { timeInterval: true },
    });

    if (!barber) {
      throw new Error("Barber not found");
    }

    // Get bookings for this day
    const bookings = await prisma.booking.findMany({
      where: {
        barberId,
        date: {
          gte: startOfDay(date),
          lte: endOfDay(date),
        },
        status: {
          in: ["PENDING", "CONFIRMED"],
        },
      },
      select: {
        date: true,
        totalDuration: true,
      },
    });

    // Generate time slots
    const slots = generateTimeSlots(date, barber.timeInterval);
    const now = new Date();

    // Mark slots as available/unavailable
    const slotsWithAvailability: TimeSlotResponse[] = slots.map((slot) => {
      const isPast = isBefore(slot.start, now);

      const isBooked = bookings.some((booking) => {
        const bookingStart = new Date(booking.date);
        const bookingEnd = addMinutes(bookingStart, booking.totalDuration);

        return (
          (slot.start >= bookingStart && slot.start < bookingEnd) ||
          (slot.end > bookingStart && slot.end <= bookingEnd) ||
          (slot.start <= bookingStart && slot.end >= bookingEnd)
        );
      });

      return {
        start: slot.start.toISOString(),
        end: slot.end.toISOString(),
        isAvailable: !isPast && !isBooked,
        isPast,
        isBooked,
      };
    });

    return { slots: slotsWithAvailability };
  } catch (error) {
    console.error("Error fetching slots:", error);
    throw error;
  }
}

// Create a new booking
export async function createBooking(
  barberId: string,
  serviceIds: string[],
  dateTime: string, // ISO string
  timezone: string
) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      throw new Error("Unauthorized");
    }

    // Validate input
    if (!barberId || !serviceIds || serviceIds.length === 0 || !dateTime) {
      throw new Error("Missing required fields");
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Verify barber exists
    const barber = await prisma.barberProfile.findUnique({
      where: { id: barberId },
      select: { timeInterval: true },
    });

    if (!barber) {
      throw new Error("Barber not found");
    }

    // Get services and calculate total price and duration
    const services = await prisma.service.findMany({
      where: {
        id: { in: serviceIds },
      },
    });

    if (services.length !== serviceIds.length) {
      throw new Error("One or more services not found");
    }

    const totalPrice = services.reduce(
      (sum, service) => sum + service.price,
      0
    );
    const totalDuration = services.reduce(
      (sum, service) => sum + service.duration,
      0
    );

    const bookingDate = new Date(dateTime);
    const now = new Date();

    // Check if booking is in the past
    if (isBefore(bookingDate, now)) {
      throw new Error("Cannot book in the past");
    }

    // Check if slot is available
    const bookingEnd = addMinutes(bookingDate, totalDuration);

    const conflictingBookings = await prisma.booking.findMany({
      where: {
        barberId,
        status: {
          in: ["PENDING", "CONFIRMED"],
        },
        date: {
          gte: startOfDay(bookingDate),
          lte: endOfDay(bookingDate),
        },
      },
    });

    // Check for conflicts more precisely
    const hasConflict = conflictingBookings.some((booking) => {
      const existingStart = new Date(booking.date);
      const existingEnd = addMinutes(existingStart, booking.totalDuration);

      return (
        (bookingDate >= existingStart && bookingDate < existingEnd) ||
        (bookingEnd > existingStart && bookingEnd <= existingEnd) ||
        (bookingDate <= existingStart && bookingEnd >= existingEnd)
      );
    });

    if (hasConflict) {
      throw new Error("This time slot is no longer available");
    }

    // Create booking with transaction
    const booking = await prisma.$transaction(async (tx) => {
      const newBooking = await tx.booking.create({
        data: {
          date: bookingDate,
          status: "PENDING",
          userId: user.id,
          barberId,
          totalPrice,
          totalDuration,
          services: {
            create: serviceIds.map((serviceId) => ({
              serviceId,
            })),
          },
        },
        include: {
          services: {
            include: {
              service: true,
            },
          },
          barber: {
            include: {
              user: true,
            },
          },
        },
      });

      return newBooking;
    });

    return {
      success: true,
      booking,
    };
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
}

// Get user's bookings
export async function getUserBookings() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const bookings = await prisma.booking.findMany({
      where: {
        userId: user.id,
      },
      include: {
        services: {
          include: {
            service: true,
          },
        },
        barber: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    return { bookings };
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  }
}

// Helper function to generate time slots
function generateTimeSlots(date: Date, intervalMinutes: number): TimeSlot[] {
  const slots: TimeSlot[] = [];

  // Business hours: 9 AM to 6 PM
  const workStart = new Date(date);
  workStart.setHours(8, 0, 0, 0);

  const workEnd = new Date(date);
  workEnd.setHours(21, 0, 0, 0);

  let currentSlot = new Date(workStart);

  while (isBefore(currentSlot, workEnd)) {
    const slotEnd = addMinutes(currentSlot, intervalMinutes);
    const interval1 = new Date(workStart);
    interval1.setHours(11, 30, 0, 0);
    const interval2 = new Date(interval1);
    interval2.setHours(14, 0, 0, 0);

    if (isAfter(slotEnd, workEnd)) {
      break;
    }

    if (currentSlot > interval1 && currentSlot < interval2) {
      currentSlot = addMinutes(currentSlot, intervalMinutes);
      continue;
    }

    slots.push({
      start: new Date(currentSlot),
      end: slotEnd,
      isAvailable: true,
    });

    currentSlot = slotEnd;
  }

  return slots;
}
