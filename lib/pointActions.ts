"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function getUserPointSystem() {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Não autenticado");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      pointSystem: {
        include: {
          coupons: {
            where: {
              isUsed: false,
            },
            orderBy: {
              createdAt: "desc",
            },
          },
          pointTransactions: {
            orderBy: {
              createdAt: "desc",
            },
            take: 10,
          },
        },
      },
      plan: true,
    },
  });

  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  return {
    pointSystem: user.pointSystem,
    plan: user.plan,
  };
}

export async function createPointSystem() {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Não autenticado");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      pointSystem: true,
      plan: true,
    },
  });

  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  // Check if user already has a plan
  if (user.plan) {
    throw new Error("Você já possui um plano ativo");
  }

  // Check if user already has a point system
  if (user.pointSystem) {
    return { success: true, pointSystem: user.pointSystem };
  }

  const pointSystem = await prisma.pointSystem.create({
    data: {
      userId: user.id,
    },
  });

  revalidatePath("/client/dashboard");
  return { success: true, pointSystem };
}

export async function addPointsForBooking(bookingId: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      services: {
        include: {
          service: true,
        },
      },
      user: {
        include: {
          pointSystem: true,
        },
      },
    },
  });

  if (!booking) {
    throw new Error("Agendamento não encontrado");
  }

  if (!booking.user.pointSystem) {
    return;
  }

  const eligibleServices = booking.services.filter(
    (s) => s.service.keyword !== "LZ" && s.service.keyword !== "PLA"
  );

  const pointsToAdd =
    eligibleServices.length * booking.user.pointSystem.pointsPerService;

  if (pointsToAdd === 0) {
    return { success: true, pointsAdded: 0 };
  }

  // Update points
  const updatedPointSystem = await prisma.pointSystem.update({
    where: { id: booking.user.pointSystem.id },
    data: {
      currentPoints: {
        increment: pointsToAdd,
      },
    },
  });

  // Create transaction record
  await prisma.pointTransaction.create({
    data: {
      pointSystemId: booking.user.pointSystem.id,
      points: pointsToAdd,
      type: "EARNED",
      description: `Pontos ganhos pelo agendamento`,
      bookingId: booking.id,
    },
  });

  // Check if user earned a coupon
  if (
    updatedPointSystem.currentPoints >= updatedPointSystem.pointsNeededForReward
  ) {
    await prisma.pointSystem.update({
      where: { id: updatedPointSystem.id },
      data: {
        currentPoints: {
          decrement: updatedPointSystem.pointsNeededForReward,
        },
      },
    });

    await prisma.coupon.create({
      data: {
        pointSystemId: updatedPointSystem.id,
        discountPercent: updatedPointSystem.discountPercentage,
      },
    });

    await prisma.pointTransaction.create({
      data: {
        pointSystemId: updatedPointSystem.id,
        points: -updatedPointSystem.pointsNeededForReward,
        type: "REDEEMED",
        description: `Cupom de ${updatedPointSystem.discountPercentage}% criado`,
      },
    });

    return {
      success: true,
      pointsAdded: pointsToAdd,
      couponEarned: true,
    };
  }

  return { success: true, pointsAdded: pointsToAdd, couponEarned: false };
}

export async function getAvailableCoupons() {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Não autenticado");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      pointSystem: {
        include: {
          coupons: {
            where: {
              isUsed: false,
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      },
    },
  });

  return user?.pointSystem?.coupons || [];
}

// lib/pointActions.ts

export async function redeemPointsForCoupon() {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Não autenticado");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      pointSystem: true,
    },
  });

  if (!user?.pointSystem) {
    throw new Error("Sistema de pontos não encontrado");
  }

  // Check if user has enough points
  if (user.pointSystem.currentPoints < user.pointSystem.pointsNeededForReward) {
    throw new Error(
      `Você precisa de ${user.pointSystem.pointsNeededForReward} pontos. Você tem ${user.pointSystem.currentPoints}.`
    );
  }

  // Deduct points and create coupon in a transaction
  const result = await prisma.$transaction(async (tx) => {
    // Deduct points
    const updatedPointSystem = await tx.pointSystem.update({
      where: { id: user.pointSystem!.id },
      data: {
        currentPoints: {
          decrement: user.pointSystem!.pointsNeededForReward,
        },
      },
    });

    // Create coupon
    const coupon = await tx.coupon.create({
      data: {
        pointSystemId: user.pointSystem!.id,
        discountPercent: user.pointSystem!.discountPercentage,
      },
    });

    // Create transaction record
    await tx.pointTransaction.create({
      data: {
        pointSystemId: user.pointSystem!.id,
        points: -user.pointSystem!.pointsNeededForReward,
        type: "REDEEMED",
        description: `Cupom de ${user.pointSystem!.discountPercentage}% resgatado`,
      },
    });

    return { pointSystem: updatedPointSystem, coupon };
  });

  revalidatePath("/client/dashboard");
  return { 
    success: true, 
    message: "Cupom criado com sucesso!",
    coupon: result.coupon 
  };
}