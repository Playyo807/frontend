import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import BarberDashboard from "./ClientPage";
import { Prisma } from "@/prisma/generated/prisma/client";

type BarberProfile_ = Prisma.BarberProfileGetPayload<{
  include: {
    user: true
  }
}>

export default async function BarberDashboardPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  // Get user and barber profile
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      barberProfile: true,
    },
  });

  let barberProfiles: BarberProfile_[] = [];

  if (!user?.barberProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Acesso Negado</h1>
          <p className="text-gray-400">
            Você precisa ser um barbeiro para acessar esta página.
          </p>
        </div>
      </div>
    );
  }

  // Get all users (clients)
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

  const services = await prisma.service.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const plans = await prisma.plan.findMany({
    include: {
      planToService: {
        include: {
          service: true
        }
      },
      clientPlans: {
        include: {
          user: true
        }
      }
    }
  });

  if (user.role === "ADMIN") {
    barberProfiles = await prisma.barberProfile.findMany({
      include: {
        user: true,
      }
    });
  }

  return (
    <BarberDashboard
      barberId={user.barberProfile.id}
      barberProfile={user}
      barberProfiles={barberProfiles}
      users={users}
      isAdmin={user.role === "ADMIN" || user.role === "SUPERADMIN"}
      services={services}
      plans={plans}
    />
  );
}
