"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { getBarberProfiles } from "./serverActions";
import { createNotification } from "./notificationActions";

function handleDiscount(
  price: number,
  services: ({
    service: {
      name: string;
      id: string;
      price: number;
      duration: number;
      keyword: string;
      imagePath: string;
    };
  } & { bookingId: string; serviceId: string })[],
): number {
  let length = services.length == 0 ? 1 : services.length;
  services.map((s) => {
    if (s.service.keyword == "LZ") {
      length = length - 1;
    }
  });
  if (length < 1) length = 1;
  const discountRate = (length - 1) * 5;
  return price - discountRate;
}

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
      plan: {
        include: {
          barber: {
            include: {
              user: true,
            },
          },
          plan: {
            include: {
              planToService: {
                include: {
                  service: true,
                },
              },
            },
          },
        },
      },
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

export async function addPointsForBooking(bookingId: string, hasPlan: boolean) {
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
          plan: true,
        },
      },
    },
  });

  if (!booking) {
    throw new Error("Agendamento não encontrado");
  }

  if (!booking.user.pointSystem || hasPlan) {
    return;
  }

  const eligibleServices = booking.services.filter(
    (s) => s.service.keyword !== "LZ" && s.service.keyword !== "PLA",
  );

  let pointsToAdd = 0;
  let totalPrice = 0;

  eligibleServices.map((s) => {
    totalPrice += s.service.price;
  });

  pointsToAdd = handleDiscount(totalPrice, eligibleServices);

  if (pointsToAdd === 0) {
    return { success: true, pointsAdded: 0 };
  }

  // Create transaction record
  await prisma.pointTransaction.create({
    data: {
      pointSystemId: booking.user.pointSystem.id,
      points: pointsToAdd,
      type: "EARNED",
      status: "PENDING",
      description: `Pontos ganhos pelo agendamento`,
      bookingId: booking.id,
    },
  });

  return { success: true };
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

  const barbers = await getBarberProfiles();

  if (!user?.pointSystem) {
    throw new Error("Sistema de pontos não encontrado");
  }

  // Check if user has enough points
  if (user.pointSystem.currentPoints < user.pointSystem.pointsNeededForReward) {
    throw new Error(
      `Você precisa de ${user.pointSystem.pointsNeededForReward} pontos. Você tem ${user.pointSystem.currentPoints}.`,
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

    const transaction = await tx.pointTransaction.create({
      data: {
        pointSystemId: user.pointSystem!.id,
        points: -user.pointSystem!.pointsNeededForReward,
        type: "REDEEMED",
        status: "CONFIRMED",
        description: `Cupom de ${user.pointSystem!.discountPercentage}% resgatado`,
      },
    });

    barbers.map(async (b) => {
      await createNotification({
        barberId: b.id,
        type: "COUPON_REDEEMED",
        title: "Coupon Resgatado!",
        message: `${session.user?.name} resgatou um coupon de ${user.pointSystem?.discountPercentage}% de desconto!`,
        metadata: {
          userId: user.id,
          transactionId: transaction.id,
          couponId: coupon.id,
        },
        url: "/admin/barber",
      });
    });

    return { pointSystem: updatedPointSystem, coupon };
  });

  revalidatePath("/client/dashboard");
  return {
    success: true,
    message: "Cupom criado com sucesso!",
    coupon: result.coupon,
  };
}
