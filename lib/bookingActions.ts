// lib/booking-actions.ts
"use server";

import prisma from "@/lib/prisma";
import {
  startOfDay,
  endOfDay,
  addMinutes,
  isBefore,
  isAfter,
  isWeekend,
} from "date-fns";
import { auth } from "@/auth"; // Auth.js v5
import {
  Prisma,
  DisabledDay,
  ExtraTimeDay,
  DisabledTime,
} from "@/prisma/generated/prisma/client";
import { addPointsForBooking } from "./pointActions";

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

export type BookingWithRelations = Prisma.BookingGetPayload<{
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
    coupon: true;
  };
}>;

// Get monthly availability for a barber
export async function getBarberAvailability(
  barberId: string,
  month: string, // Format: YYYY-MM
  timezone: string = "America/Sao_Paulo",
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

    // Get manually disabled days for this barber in the month
    const disabledDays = await prisma.disabledDay.findMany({
      where: {
        barberId,
        date: {
          gte: startOfDay(firstDay),
          lte: endOfDay(lastDay),
        },
      },
      select: {
        date: true,
      },
    });

    // Create a Set of disabled dates for quick lookup
    const disabledDatesSet = new Set(
      disabledDays.map((d) => startOfDay(new Date(d.date)).getTime()),
    );

    // Generate availability for each day
    const availability: DayAvailability[] = [];
    const current = new Date(firstDay);
    const now = new Date();

    while (current <= lastDay) {
      const dayStart = startOfDay(current);
      const dayEnd = endOfDay(current);

      // Check if it's a Sunday (0)
      const dayOfWeek = current.getDay();
      const isWeekend = dayOfWeek === 0;
      const isManuallyDisabled = disabledDatesSet.has(dayStart.getTime());

      if (isWeekend && !isManuallyDisabled) {
        availability.push({
          date: current.toISOString().split("T")[0],
          status: "full",
          availableSlots: 0,
          totalSlots: 0,
        });
        current.setDate(current.getDate() + 1);
        continue;
      }

      // Check if day is manually disabled

      if (isManuallyDisabled && !isWeekend) {
        availability.push({
          date: current.toISOString().split("T")[0],
          status: "full",
          availableSlots: 0,
          totalSlots: 0,
        });
        current.setDate(current.getDate() + 1);
        continue;
      }

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

      const slots = await generateTimeSlots(
        current,
        barberId,
        barber.timeInterval,
      );

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

export async function getBarberSlots(
  barberId: string,
  dateStr: string, // Format: YYYY-MM-DD
  timezone: string = "America/Sao_Paulo",
): Promise<{ slots: TimeSlotResponse[] }> {
  try {
    const date = new Date(dateStr + "T12:00:00");
    const dayOfWeek = date.getDay();
    const isSunday = dayOfWeek === 0;

    // Get barber profile
    const barber = await prisma.barberProfile.findUnique({
      where: { id: barberId },
      select: { timeInterval: true },
    });

    if (!barber) {
      throw new Error("Barber not found");
    }

    // Check if day is manually disabled
    const dayStart = startOfDay(date);
    const isDisabled = await prisma.disabledDay.findFirst({
      where: {
        barberId,
        date: dayStart,
      },
    });

    // For Sundays: reversed logic (need to be ENABLED via disabledDays table)
    if (isSunday) {
      // If Sunday is NOT in table, it's disabled by default
      if (!isDisabled) {
        return { slots: [] };
      }
      // If Sunday IS in table, it's enabled, continue to show slots
    }

    // For non-Sundays: normal logic (in table = disabled)
    if (!isSunday && isDisabled) {
      return { slots: [] };
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

    // Generate time slots - THIS IS THE KEY FIX
    const slots = await generateTimeSlots(date, barberId, barber.timeInterval);
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
  dateTime: string,
  timezone: string,
  couponId?: string,
): Promise<{
  success: boolean;
  booking: BookingWithRelations;
}> {
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

    let coupon = null;
    if (couponId) {
      coupon = await prisma.coupon.findUnique({
        where: { id: couponId },
        include: {
          pointSystem: true,
        },
      });

      if (!coupon || coupon.isUsed) {
        throw new Error("Cupom inválido ou já utilizado");
      }

      if (coupon.pointSystem.userId !== user.id) {
        throw new Error("Este cupom não pertence a você");
      }

      // Check if coupon is expired
      if (coupon.expiresAt && coupon.expiresAt < new Date()) {
        throw new Error("Cupom expirado");
      }
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

    let totalPrice = services.reduce((sum, service) => sum + service.price, 0);
    const totalDuration = services.reduce(
      (sum, service) => sum + service.duration,
      0,
    );

    if (coupon) {
      // Check if services are eligible for discount (exclude LZ and PLA)
      const eligibleServices = services.filter(
        (s) => s.keyword !== "LZ" && s.keyword !== "PLA",
      );

      if (eligibleServices.length === 0) {
        throw new Error(
          "Nenhum serviço elegível para desconto neste agendamento",
        );
      }

      const eligiblePrice = eligibleServices.reduce(
        (sum, service) => sum + service.price,
        0,
      );
      const discount = Math.floor(
        (eligiblePrice * coupon.discountPercent) / 100,
      );
      totalPrice = totalPrice - discount;
    }

    const bookingDate = new Date(dateTime);
    const now = new Date();

    // Check if booking is in the past
    if (isBefore(bookingDate, now)) {
      throw new Error("Cannot book in the past");
    }

    // Check if slot is available
    const bookingEnd = addMinutes(bookingDate, totalDuration > 40 ? 40 : totalDuration);

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
          status: "CONFIRMED",
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
          coupon: true,
        },
      });

      return newBooking;
    });

    if (coupon) {
      await prisma.coupon.update({
        where: { id: couponId },
        data: {
          isUsed: true,
          usedAt: new Date(),
          bookingId: booking.id,
        },
      });
    }

    addPointsForBooking(booking.id);

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
export async function getUserBookings(): Promise<{
  bookings: BookingWithRelations[];
}> {
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
        coupon: true,
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

async function generateTimeSlots(
  date: Date,
  barberId: string,
  intervalMinutes: number,
): Promise<TimeSlot[]> {
  const slots: TimeSlot[] = [];

  // Get extra time for this day
  const extraTimeDay = await getExtraTimeDay(date, barberId);
  console.log("🔍 Extra Time Day:", extraTimeDay); // DEBUG

  // Get disabled times
  const disabledTimes = await getDisabledTimes(barberId);
  const disabledDates = disabledTimes.map((d) => d.date);

  const workStart = new Date(date);
  const workEnd = new Date(date);

  const isWeekend_ = workStart.getDay() == 0 || workStart.getDay() == 6;

  if (isWeekend_) {
    workStart.setHours(8, 0, 0, 0);
    workEnd.setHours(19, 0, 0, 0);
  } else {
    workStart.setHours(8, 0, 0, 0);
    workEnd.setHours(21, 0, 0, 0);
  }

  console.log("⏰ Work End BEFORE extra time:", workEnd); // DEBUG

  if (extraTimeDay) {
    const extraMinutes = intervalMinutes * extraTimeDay.amount;
    workEnd.setMinutes(workEnd.getMinutes() + extraMinutes);
    console.log("➕ Adding extra minutes:", extraMinutes); // DEBUG
    console.log("⏰ Work End AFTER extra time:", workEnd); // DEBUG
  }

  let currentSlot = new Date(workStart);
  let slotCount = 0;

  while (isBefore(currentSlot, workEnd)) {
    const slotEnd = addMinutes(currentSlot, intervalMinutes);
    const interval1 = new Date(workStart);
    interval1.setHours(11, 20, 0, 0);
    const interval2 = new Date(workStart);
    interval2.setHours(12, 30, 0, 0);

    const currentSlotDisabled = disabledDates.some(
      (d) => d.getTime() === currentSlot.getTime(),
    );

    if (isAfter(slotEnd, workEnd)) {
      break;
    }

    if (currentSlotDisabled) {
      console.log("🚫 Skipping disabled slot:", currentSlot);
      currentSlot = slotEnd;
      continue;
    }

    // Lunch break logic
    if (currentSlot > interval1 && currentSlot < interval2) {
      if (isWeekend_) {
        currentSlot.setHours(13, 0, 0, 0);
      } else {
        currentSlot.setHours(14, 0, 0, 0);
      }
      continue;
    }

    slots.push({
      start: new Date(currentSlot),
      end: slotEnd,
      isAvailable: true,
    });

    slotCount++;
    currentSlot = slotEnd;
  }

  console.log("✅ Total slots generated:", slotCount); // DEBUG
  console.log("📊 Last slot end time:", slots[slots.length - 1]?.end); // DEBUG

  return slots;
}

export async function getExtraTimeDay(
  date: Date,
  barberId: string,
): Promise<ExtraTimeDay | null> {
  const dayStart = startOfDay(date);

  const extraTimeDay = await prisma.extraTimeDay.findFirst({
    where: {
      date: dayStart,
      barberId,
    },
  });

  console.log("🔎 Searching for extra time:", { date: dayStart, barberId }); // DEBUG
  console.log("🔎 Found:", extraTimeDay); // DEBUG

  return extraTimeDay;
}

// Disable a day for a barber
export async function disableDay(
  barberId: string,
  date: Date,
  reason?: string,
) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      throw new Error("Unauthorized");
    }

    // Verify user is the barber or admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        barberProfile: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Check if user is authorized (is the barber or admin)
    const isAuthorized =
      user.barberProfile?.id === barberId ||
      user.role === "ADMIN" ||
      user.role === "SUPERADMIN";

    if (!isAuthorized) {
      throw new Error("Not authorized to disable days for this barber");
    }

    const dayStart = startOfDay(date);

    // Check if day is in the past
    if (isBefore(dayStart, startOfDay(new Date()))) {
      throw new Error("Cannot disable past days");
    }

    // Create or update disabled day
    const disabledDay = await prisma.disabledDay.upsert({
      where: {
        barberId_date: {
          barberId,
          date: dayStart,
        },
      },
      create: {
        barberId,
        date: dayStart,
        reason: reason || "Indisponível",
      },
      update: {
        reason: reason || "Indisponível",
      },
    });

    return { success: true, disabledDay };
  } catch (error) {
    console.error("Error disabling day:", error);
    throw error;
  }
}

// Enable a previously disabled day
export async function enableDay(barberId: string, date: Date) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      throw new Error("Unauthorized");
    }

    // Verify user is the barber or admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        barberProfile: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Check if user is authorized
    const isAuthorized =
      user.barberProfile?.id === barberId ||
      user.role === "ADMIN" ||
      user.role === "SUPERADMIN";

    if (!isAuthorized) {
      throw new Error("Not authorized to enable days for this barber");
    }

    const dayStart = startOfDay(date);

    await prisma.disabledDay.delete({
      where: {
        barberId_date: {
          barberId,
          date: dayStart,
        },
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error enabling day:", error);
    throw error;
  }
}

// Get all disabled days for a barber
export async function getDisabledDays(
  barberId: string,
  startDate?: Date,
  endDate?: Date,
): Promise<{
  disabledDays: DisabledDay[];
}> {
  try {
    const where: {
      barberId: string;
      date?: {
        gte?: Date;
        lte?: Date;
      };
    } = { barberId };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = startOfDay(startDate);
      if (endDate) where.date.lte = endOfDay(endDate);
    }

    const disabledDays = await prisma.disabledDay.findMany({
      where,
      orderBy: {
        date: "asc",
      },
    });

    return { disabledDays };
  } catch (error) {
    console.error("Error fetching disabled days:", error);
    throw error;
  }
}

export async function getDisabledTimes(
  barberId: string,
): Promise<DisabledTime[]> {
  const disabledTimes = await prisma.disabledTime.findMany({
    where: { barberId },
  });
  return disabledTimes;
}

// Disable a specific time slot
export async function disableTimeSlot(
  barberId: string,
  dateTime: Date,
): Promise<{ success: boolean; disabledTime: DisabledTime }> {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { barberProfile: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const isAuthorized =
      user.barberProfile?.id === barberId ||
      user.role === "ADMIN" ||
      user.role === "SUPERADMIN";

    if (!isAuthorized) {
      throw new Error("Not authorized");
    }

    if (isBefore(dateTime, new Date())) {
      throw new Error("Cannot disable past time slots");
    }

    const disabledTime = await prisma.disabledTime.create({
      data: {
        barberId,
        date: dateTime,
      },
    });

    return { success: true, disabledTime };
  } catch (error) {
    console.error("Error disabling time slot:", error);
    throw error;
  }
}

// Enable a specific time slot
export async function enableTimeSlot(
  disabledTimeId: string,
): Promise<{ success: boolean }> {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      throw new Error("Unauthorized");
    }

    await prisma.disabledTime.delete({
      where: { id: disabledTimeId },
    });

    return { success: true };
  } catch (error) {
    console.error("Error enabling time slot:", error);
    throw error;
  }
}

// Get disabled times for a specific day
export async function getDisabledTimesForDay(
  barberId: string,
  dateStr: string,
): Promise<DisabledTime[]> {
  try {
    const date = new Date(dateStr + "T00:00:00");
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);

    const disabledTimes = await prisma.disabledTime.findMany({
      where: {
        barberId,
        date: {
          gte: dayStart,
          lte: dayEnd,
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    return disabledTimes;
  } catch (error) {
    console.error("Error fetching disabled times:", error);
    throw error;
  }
}

// Add extra time to a specific day
export async function addExtraTime(
  barberId: string,
  date: Date,
  amount: number,
): Promise<{ success: boolean; extraTimeDay: ExtraTimeDay }> {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { barberProfile: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const isAuthorized =
      user.barberProfile?.id === barberId ||
      user.role === "ADMIN" ||
      user.role === "SUPERADMIN";

    if (!isAuthorized) {
      throw new Error("Not authorized");
    }

    const dayStart = startOfDay(date);

    if (isBefore(dayStart, startOfDay(new Date()))) {
      throw new Error("Cannot add extra time to past days");
    }

    if (amount < 1 || amount > 20) {
      throw new Error("Amount must be between 1 and 20");
    }

    const extraTimeDay = await prisma.extraTimeDay.upsert({
      where: {
        barberId_date: {
          barberId,
          date: dayStart,
        },
      },
      create: {
        barberId,
        date: dayStart,
        amount,
      },
      update: {
        amount,
      },
    });

    return { success: true, extraTimeDay };
  } catch (error) {
    console.error("Error adding extra time:", error);
    throw error;
  }
}

// Remove extra time from a day
export async function removeExtraTime(
  extraTimeId: string,
): Promise<{ success: boolean }> {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      throw new Error("Unauthorized");
    }

    await prisma.extraTimeDay.delete({
      where: { id: extraTimeId },
    });

    return { success: true };
  } catch (error) {
    console.error("Error removing extra time:", error);
    throw error;
  }
}

// Get all extra time days for a barber
export async function getExtraTimeDays(
  barberId: string,
): Promise<ExtraTimeDay[]> {
  try {
    const extraTimeDays = await prisma.extraTimeDay.findMany({
      where: { barberId },
      orderBy: { date: "asc" },
    });

    return extraTimeDays;
  } catch (error) {
    console.error("Error fetching extra time days:", error);
    throw error;
  }
}

// Get all users with booking count (for barber dashboard)
export async function getAllUsers(): Promise<any[]> {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { barberProfile: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const isAuthorized =
      user.barberProfile || user.role === "ADMIN" || user.role === "SUPERADMIN";

    if (!isAuthorized) {
      throw new Error("Not authorized");
    }

    const users = await prisma.user.findMany({
      where: {
        role: "USER",
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        createdAt: true,
        role: true,
        _count: {
          select: {
            bookings: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

export async function createBookingAsBarber(
  userId: string,
  barberId: string,
  serviceIds: string[],
  dateTime: string,
  timezone: string,
): Promise<{
  success: boolean;
  booking: BookingWithRelations;
}> {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      throw new Error("Unauthorized");
    }

    const barber = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { barberProfile: true },
    });

    if (!barber) {
      throw new Error("Barber not found");
    }

    const isAuthorized =
      barber.barberProfile?.id === barberId ||
      barber.role === "ADMIN" ||
      barber.role === "SUPERADMIN";

    if (!isAuthorized) {
      throw new Error("Not authorized");
    }

    // Validate input
    if (
      !userId ||
      !barberId ||
      !serviceIds ||
      serviceIds.length === 0 ||
      !dateTime
    ) {
      throw new Error("Missing required fields");
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Get barber profile
    const barberProfile = await prisma.barberProfile.findUnique({
      where: { id: barberId },
      select: { timeInterval: true },
    });

    if (!barberProfile) {
      throw new Error("Barber profile not found");
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
      0,
    );
    const totalDuration = services.reduce(
      (sum, service) => sum + service.duration,
      0,
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

    // Check for conflicts
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

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        date: bookingDate,
        status: "CONFIRMED",
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
        coupon: true,
      },
    });

    return {
      success: true,
      booking,
    };
  } catch (error) {
    console.error("Error creating booking as barber:", error);
    throw error;
  }
}

// Update existing cancelBooking function
export async function cancelBooking(bookingId: string): Promise<{
  success: boolean;
}> {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      throw new Error("Unauthorized");
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Get booking to verify ownership
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: {
        userId: true,
        status: true,
        date: true,
      },
    });

    if (!booking) {
      throw new Error("Booking not found");
    }

    // Check if user owns this booking
    if (booking.userId !== user.id) {
      throw new Error("Not authorized to cancel this booking");
    }

    // Check if booking is already canceled
    if (booking.status === "CANCELED") {
      throw new Error("Booking is already canceled");
    }

    // Check if booking is in the past
    if (new Date(booking.date) < new Date()) {
      throw new Error("Cannot cancel past bookings");
    }

    // Update booking status to CANCELED
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "CANCELED" },
    });

    return { success: true };
  } catch (error) {
    console.error("Error canceling booking:", error);
    throw error;
  }
}
