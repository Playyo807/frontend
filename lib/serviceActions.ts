"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function updateService(
  serviceId: string,
  updates: {
    name?: string;
    price?: number;
    duration?: number;
    keyword?: string;
    imagePath?: string;
  }
) {
  try {
    const session = await auth();
    if (!session?.user?.email) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { barberProfile: true },
    });

    if (!user?.barberProfile && user?.role !== "ADMIN" && user?.role !== "SUPERADMIN") {
      throw new Error("Not authorized");
    }

    // Check if keyword is being changed and if it already exists
    if (updates.keyword) {
      const existingService = await prisma.service.findFirst({
        where: {
          keyword: updates.keyword,
          id: { not: serviceId },
        },
      });

      if (existingService) {
        throw new Error("Palavra-chave já está em uso");
      }
    }

    const service = await prisma.service.update({
      where: { id: serviceId },
      data: updates,
    });

    revalidatePath("/barber/dashboard");
    return { success: true, service };
  } catch (error) {
    console.error("Error updating service:", error);
    throw error;
  }
}

export async function createService(data: {
  name: string;
  price: number;
  duration: number;
  keyword: string;
  imagePath: string;
}) {
  try {
    const session = await auth();
    if (!session?.user?.email) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { barberProfile: true },
    });

    if (!user?.barberProfile && user?.role !== "ADMIN" && user?.role !== "SUPERADMIN") {
      throw new Error("Not authorized");
    }

    // Check if keyword already exists
    const existingService = await prisma.service.findUnique({
      where: { keyword: data.keyword },
    });

    if (existingService) {
      throw new Error("Palavra-chave já está em uso");
    }

    const service = await prisma.service.create({
      data,
    });

    revalidatePath("/barber/dashboard");
    return { success: true, service };
  } catch (error) {
    console.error("Error creating service:", error);
    throw error;
  }
}

export async function deleteService(serviceId: string) {
  try {
    const session = await auth();
    if (!session?.user?.email) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { barberProfile: true },
    });

    if (!user?.barberProfile && user?.role !== "ADMIN" && user?.role !== "SUPERADMIN") {
      throw new Error("Not authorized");
    }

    // Check if service is being used in any bookings
    const bookingsWithService = await prisma.bookingService.findFirst({
      where: { serviceId },
    });

    if (bookingsWithService) {
      throw new Error(
        "Este serviço não pode ser deletado pois está em uso em agendamentos"
      );
    }

    await prisma.service.delete({
      where: { id: serviceId },
    });

    revalidatePath("/barber/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error deleting service:", error);
    throw error;
  }
}

export async function getAllServices() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { name: "asc" },
    });

    return { services };
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
}