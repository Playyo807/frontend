"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function updateBarberProfile(
  barberProfileId: string,
  data: {
    displayName?: string;
    bio?: string | null;
    timeInterval?: number;
    imagePath?: string;
  }
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      throw new Error("Unauthorized");
    }

    // Get user and verify they own this barber profile
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { barberProfile: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Check authorization
    const isAuthorized =
      user.barberProfile?.id === barberProfileId ||
      user.role === "ADMIN" ||
      user.role === "SUPERADMIN";

    if (!isAuthorized) {
      throw new Error("Not authorized to update this profile");
    }

    // Validate data
    if (data.displayName !== undefined && !data.displayName.trim()) {
      throw new Error("Display name cannot be empty");
    }

    if (data.timeInterval !== undefined) {
      if (data.timeInterval < 10 || data.timeInterval > 120) {
        throw new Error("Time interval must be between 10 and 120 minutes");
      }
    }

    // Build update object
    const updateData: any = {};
    if (data.displayName !== undefined) updateData.displayName = data.displayName;
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.timeInterval !== undefined) updateData.timeInterval = data.timeInterval;

    // Update barber profile
    const updatedProfile = await prisma.barberProfile.update({
      where: { id: barberProfileId },
      data: updateData,
      include: {
        user: true,
      },
    });

    // If image is being updated, update the user's image
    if (data.imagePath !== undefined) {
      await prisma.user.update({
        where: { id: user.id },
        data: { image: data.imagePath },
      });
    }

    revalidatePath("/admin/barber");
    revalidatePath("/client");
    return { success: true, profile: updatedProfile };
  } catch (error) {
    console.error("Error updating barber profile:", error);
    throw error;
  }
}

export async function getBarberProfile(barberProfileId?: string) {
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

    // If specific ID is provided, fetch that profile (for admins)
    const profileId = barberProfileId || user.barberProfile?.id;

    if (!profileId) {
      throw new Error("Barber profile not found");
    }

    const barberProfile = await prisma.barberProfile.findUnique({
      where: { id: profileId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
            role: true,
          },
        },
        services: {
          include: {
            service: true,
          },
        },
        _count: {
          select: {
            bookings: true,
            clientPlans: true,
          },
        },
      },
    });

    if (!barberProfile) {
      throw new Error("Barber profile not found");
    }

    // Check authorization if accessing someone else's profile
    if (
      barberProfileId &&
      barberProfileId !== user.barberProfile?.id &&
      user.role !== "ADMIN" &&
      user.role !== "SUPERADMIN"
    ) {
      throw new Error("Not authorized to view this profile");
    }

    return { barberProfile };
  } catch (error) {
    console.error("Error fetching barber profile:", error);
    throw error;
  }
}