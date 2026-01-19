import "server-only";

import prisma from "@/lib/prisma";
import { Role } from "@/prisma/generated/prisma/enums";
import {
  BarberProfile,
  BarberProfileToService,
  User,
} from "@/prisma/generated/prisma/client";

export async function getUsers(role?: Role): Promise<User[]> {
  if (role) {
    return await prisma.user.findMany({
      where: { role },
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
  id: id
): Promise<BarberProfile | null> {
  return await prisma.barberProfile.findUnique({
    where: { id },
  });
}

export async function getBarberProfilesByUserId(
  userId: id
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
  barberProfileId: id
): Promise<BarberProfileToService[]> {
  return await prisma.barberProfileToService.findMany({
    where: { barberProfileId },
  });
}

export async function getBarberToServiceRelationsByServiceId(
  serviceId: id
): Promise<BarberProfileToService[]> {
  return await prisma.barberProfileToService.findMany({
    where: { serviceId },
  });
}