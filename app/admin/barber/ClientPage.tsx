"use client";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Clock,
  Users,
  Settings,
  CalendarPlus,
  CalendarX,
} from "lucide-react";
import DisabledDaysManager from "@/components/custom/disabledDaysManager";
import DisabledTimeManager from "@/components/custom/disabledTimeManager";
import ExtraTimeManager from "@/components/custom/extraTimeManager";
import UsersManagement from "@/components/custom/userManagement";
import BarberCreateBooking from "@/components/custom/barberCreateBooking";
import type { Service } from "@/prisma/generated/prisma/client";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  image: string | null;
  createdAt: Date;
  role: string;
  _count: {
    bookings: number;
  };
}

interface BarberDashboardProps {
  barberId: string;
  users: User[];
  services: Service[];
}

export default function BarberDashboard({
  barberId,
  users,
  services,
}: BarberDashboardProps) {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div className="min-h-screen bg-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">
            Painel do Barbeiro
          </h1>
          <BarberCreateBooking
            barberId={barberId}
            users={users}
            services={services}
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 bg-slate-800">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users size={18} />
              <span className="hidden md:inline">Clientes</span>
            </TabsTrigger>
            <TabsTrigger value="disabled-days" className="flex items-center gap-2">
              <CalendarX size={18} />
              <span className="hidden md:inline">Dias</span>
            </TabsTrigger>
            <TabsTrigger value="disabled-times" className="flex items-center gap-2">
              <Clock size={18} />
              <span className="hidden md:inline">Horários</span>
            </TabsTrigger>
            <TabsTrigger value="extra-time" className="flex items-center gap-2">
              <CalendarPlus size={18} />
              <span className="hidden md:inline">Tempo Extra</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings size={18} />
              <span className="hidden md:inline">Configurações</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <UsersManagement users={users} />
          </TabsContent>

          <TabsContent value="disabled-days" className="space-y-4">
            <DisabledDaysManager barberId={barberId} />
          </TabsContent>

          <TabsContent value="disabled-times" className="space-y-4">
            <DisabledTimeManager barberId={barberId} />
          </TabsContent>

          <TabsContent value="extra-time" className="space-y-4">
            <ExtraTimeManager barberId={barberId} />
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <div className="bg-slate-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Configurações do Perfil</h2>
              <p className="text-gray-400">
                Configurações do perfil em desenvolvimento...
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}