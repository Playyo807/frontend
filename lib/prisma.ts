import { PrismaClient } from '../prisma/generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const adapter = new PrismaMariaDb(process.env.DATABASE_URL as string);
const prisma = new PrismaClient({ adapter });

export default prisma;

export async function checkSlotAvailability(
  barberId: string,
  startTime: Date,
  duration: number
): Promise<boolean> {
  const endTime = new Date(startTime.getTime() + duration * 60000);

  const conflictingBookings = await prisma.booking.findMany({
    where: {
      barberId,
      status: {
        in: ['PENDING', 'CONFIRMED']
      }
    }
  });

  const hasConflict = conflictingBookings.some(booking => {
    const existingStart = new Date(booking.date);
    const existingEnd = new Date(existingStart.getTime() + booking.totalDuration * 60000);

    return (
      (startTime >= existingStart && startTime < existingEnd) ||
      (endTime > existingStart && endTime <= existingEnd) ||
      (startTime <= existingStart && endTime >= existingEnd)
    );
  });

  return !hasConflict;
}

export async function getBarberBookingsForDay(
  barberId: string,
  date: Date
): Promise<any[]> {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return await prisma.booking.findMany({
    where: {
      barberId,
      date: {
        gte: startOfDay,
        lte: endOfDay
      },
      status: {
        in: ['PENDING', 'CONFIRMED']
      }
    },
    include: {
      services: {
        include: {
          service: true
        }
      },
      user: {
        select: {
          name: true,
          email: true,
          phone: true
        }
      }
    },
    orderBy: {
      date: 'asc'
    }
  });
}