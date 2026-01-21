// app/barber/dashboard/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import BarberDashboard from "./ClientPage";

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

  // Get all services
  const services = await prisma.service.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <BarberDashboard
      barberId={user.barberProfile.id}
      users={users}
      services={services}
    />
  );
}