"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// ==================== PLAN TEMPLATE ACTIONS ====================

export async function createPlanTemplate(
  name: string,
  price: number,
  serviceIds: string[],
  description?: string,
  keyword?: string
) {
  try {
    const session = await auth();
    if (!session?.user?.email) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { barberProfile: true },
    });

    if (!user?.barberProfile) throw new Error("Not a barber");

    const plan = await prisma.plan.create({
      data: {
        barberId: user.barberProfile.id,
        name,
        price,
        keyword: keyword || "PLAN",
        description,
        planToService: {
          create: serviceIds.map((serviceId) => ({
            serviceId,
          })),
        },
      },
      include: {
        planToService: {
          include: { service: true },
        },
      },
    });

    revalidatePath("/admin/barber");
    return { success: true, plan };
  } catch (error) {
    console.error("Error creating plan template:", error);
    throw error;
  }
}

export async function updatePlanTemplate(
  planId: string,
  data: {
    name?: string;
    price?: number;
    description?: string;
    serviceIds?: string[];
  }
) {
  try {
    const session = await auth();
    if (!session?.user?.email) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { barberProfile: true },
    });

    if (!user?.barberProfile) throw new Error("Not a barber");

    // Verify ownership
    const plan = await prisma.plan.findUnique({
      where: { id: planId },
    });

    if (plan?.barberId !== user.barberProfile.id && user.role !== "ADMIN") {
      throw new Error("Not authorized");
    }

    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.description !== undefined) updateData.description = data.description;

    // Update services if provided
    if (data.serviceIds) {
      await prisma.planToService.deleteMany({
        where: { planId },
      });
      updateData.planToService = {
        create: data.serviceIds.map((serviceId) => ({
          serviceId,
        })),
      };
    }

    const updatedPlan = await prisma.plan.update({
      where: { id: planId },
      data: updateData,
      include: {
        planToService: {
          include: { service: true },
        },
      },
    });

    revalidatePath("/admin/barber");
    return { success: true, plan: updatedPlan };
  } catch (error) {
    console.error("Error updating plan template:", error);
    throw error;
  }
}

export async function deletePlanTemplate(planId: string) {
  try {
    const session = await auth();
    if (!session?.user?.email) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { barberProfile: true },
    });

    if (!user?.barberProfile) throw new Error("Not a barber");

    const plan = await prisma.plan.findUnique({
      where: { id: planId },
      include: { clientPlans: true },
    });

    if (!plan) {
        throw new Error("No plan found");
    }

    if (plan.barberId !== user.barberProfile.id && user.role !== "ADMIN") {
      throw new Error("Not authorized");
    }

    if (plan.clientPlans.length > 0) {
      throw new Error("Cannot delete plan with active clients");
    }

    await prisma.plan.delete({
      where: { id: planId },
    });

    revalidatePath("/admin/barber");
    return { success: true };
  } catch (error) {
    console.error("Error deleting plan template:", error);
    throw error;
  }
}

export async function getBarberPlans() {
  try {
    const session = await auth();
    if (!session?.user?.email) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { barberProfile: true },
    });

    if (!user?.barberProfile) throw new Error("Not a barber");

    const plans = await prisma.plan.findMany({
      where: { barberId: user.barberProfile.id },
      include: {
        planToService: {
          include: { service: true },
        },
        clientPlans: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { plans };
  } catch (error) {
    console.error("Error fetching barber plans:", error);
    throw error;
  }
}

// ==================== CLIENT PLAN ACTIONS ====================

export async function createClientPlan(
  userId: string,
  planId: string,
  useAmount: number,
  startDate: Date,
  expiryDate: Date
) {
  try {
    const session = await auth();
    if (!session?.user?.email) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { barberProfile: true },
    });

    if (!user?.barberProfile) throw new Error("Not a barber");

    // Check if plan belongs to barber
    const plan = await prisma.plan.findUnique({
      where: { id: planId },
    });

    if (plan?.barberId !== user.barberProfile.id && user.role !== "ADMIN") {
      throw new Error("Not authorized");
    }

    // Check if client already has a plan with this barber
    const existingPlan = await prisma.clientPlan.findUnique({
      where: {
        userId_barberId: {
          userId,
          barberId: user.barberProfile.id,
        },
      },
    });

    if (existingPlan) {
      throw new Error("Client already has an active plan with you");
    }

    const clientPlan = await prisma.clientPlan.create({
      data: {
        userId,
        barberId: user.barberProfile.id,
        planId,
        useAmount,
        starts: startDate,
        expires: expiryDate,
      },
      include: {
        plan: {
          include: {
            planToService: {
              include: { service: true },
            },
          },
        },
        user: true,
      },
    });

    revalidatePath("/admin/barber");
    revalidatePath("/client/dashboard");
    return { success: true, clientPlan };
  } catch (error) {
    console.error("Error creating client plan:", error);
    throw error;
  }
}

export async function updateClientPlan(
  clientPlanId: string,
  data: {
    planId?: string
    useAmount?: number;
    expires?: Date;
  }
) {
  try {
    const session = await auth();
    if (!session?.user?.email) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { barberProfile: true },
    });

    if (!user?.barberProfile) throw new Error("Not a barber");

    const clientPlan = await prisma.clientPlan.findUnique({
      where: { id: clientPlanId },
    });

    if (clientPlan?.barberId !== user.barberProfile.id && user.role !== "ADMIN") {
      throw new Error("Not authorized");
    }

    const updatedPlan = await prisma.clientPlan.update({
      where: { id: clientPlanId },
      data,
      include: {
        plan: {
          include: {
            planToService: {
              include: { service: true },
            },
          },
        },
        user: true,
      },
    });

    revalidatePath("/admin/barber");
    revalidatePath("/client/dashboard");
    return { success: true, clientPlan: updatedPlan };
  } catch (error) {
    console.error("Error updating client plan:", error);
    throw error;
  }
}

export async function deleteClientPlan(clientPlanId: string) {
  try {
    const session = await auth();
    if (!session?.user?.email) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { barberProfile: true },
    });

    if (!user?.barberProfile) throw new Error("Not a barber");

    const clientPlan = await prisma.clientPlan.findUnique({
      where: { id: clientPlanId },
    });

    if (clientPlan?.barberId !== user.barberProfile.id && user.role !== "ADMIN") {
      throw new Error("Not authorized");
    }

    await prisma.clientPlan.delete({
      where: { id: clientPlanId },
    });

    revalidatePath("/admin/barber");
    revalidatePath("/client/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error deleting client plan:", error);
    throw error;
  }
}

export async function decrementPlanUse(userId: string, barberId: string) {
  try {
    const clientPlan = await prisma.clientPlan.findUnique({
      where: {
        userId_barberId: {
          userId,
          barberId,
        },
      },
    });

    if (!clientPlan) return { success: false, message: "No active plan" };
    if (clientPlan.useAmount <= 0) {
      return { success: false, message: "No uses remaining" };
    }
    if (clientPlan.expires < new Date()) {
      return { success: false, message: "Plan expired" };
    }

    await prisma.clientPlan.update({
      where: { id: clientPlan.id },
      data: { useAmount: clientPlan.useAmount - 1 },
    });

    revalidatePath("/client/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error decrementing plan use:", error);
    throw error;
  }
}

export async function getClientActivePlan(userId?: string) {
  try {
    const session = await auth();
    if (!session?.user?.email) throw new Error("Unauthorized");

    const targetUserId = userId || (await prisma.user.findUnique({
      where: { email: session.user.email },
    }))?.id;

    if (!targetUserId) throw new Error("User not found");

    const clientPlan = await prisma.clientPlan.findFirst({
      where: {
        userId: targetUserId,
        expires: { gte: new Date() },
      },
      include: {
        plan: {
          include: {
            planToService: {
              include: { service: true },
            },
          },
        },
        barber: {
          include: { user: true },
        },
      },
    });

    return { clientPlan };
  } catch (error) {
    console.error("Error fetching client plan:", error);
    throw error;
  }
}

// ==================== EXPIRY CHECK (FOR CRON JOB) ====================

export async function checkAndExpirePlans() {
  try {
    const now = new Date();

    // Find all expired plans
    const expiredPlans = await prisma.clientPlan.findMany({
      where: {
        expires: { lt: now },
        useAmount: { gt: 0 }, // Only reset if they still have uses
      },
    });

    // Reset use amounts to 0
    const updates = expiredPlans.map((plan) =>
      prisma.clientPlan.update({
        where: { id: plan.id },
        data: { useAmount: 0 },
      })
    );

    await Promise.all(updates);

    revalidatePath("/client/dashboard");
    return { 
      success: true, 
      expiredCount: expiredPlans.length 
    };
  } catch (error) {
    console.error("Error checking plan expiry:", error);
    throw error;
  }
}