"use server";

import prisma from "@/lib/prisma";
import {
  BarberProfile,
  BarberProfileToService,
  User,
} from "@/prisma/generated/prisma/client";
import { id } from "./types";

export async function getUsers(role?: boolean): Promise<User[]> {
  if (role) {
    return await prisma.user.findMany({
      where: {
        role: {
          in: ["BARBER", "ADMIN"],
        },
      },
    });
  }

  return await prisma.user.findMany();
}

export async function getUserById(id: id): Promise<User | null> {
  return await prisma.user.findUnique({ where: { id } });
}

export async function getBarberProfiles(): Promise<BarberProfile[]> {
  return await prisma.barberProfile.findMany();
}

export async function getBarberProfilesById(
  id: id,
): Promise<BarberProfile | null> {
  return await prisma.barberProfile.findUnique({
    where: { id },
  });
}

export async function getBarberProfilesByUserId(
  userId: id,
): Promise<BarberProfile | null> {
  return await prisma.barberProfile.findUnique({
    where: { userId },
  });
}

export async function getBarberToServiceRelations(): Promise<
  BarberProfileToService[]
> {
  return await prisma.barberProfileToService.findMany();
}

export async function getBarberToServiceRelationsByBarberId(
  barberProfileId: id,
): Promise<BarberProfileToService[]> {
  return await prisma.barberProfileToService.findMany({
    where: { barberProfileId },
  });
}

export async function getBarberToServiceRelationsByServiceId(
  serviceId: id,
): Promise<BarberProfileToService[]> {
  return await prisma.barberProfileToService.findMany({
    where: { serviceId },
  });
}

export async function getAllBookings() {
  return await prisma.booking.findMany({
    include: {
      user: true,
      barber: {
        include: {
          user: true,
        },
      },
      plan: { include: { plan: true } },
      coupon: true,
      services: {
        include: {
          service: true,
        },
      },
    },
  });
}
