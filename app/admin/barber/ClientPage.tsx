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
  ClipboardPen,
  Package,
} from "lucide-react";
import DisabledDaysManager from "@/components/custom/disabledDaysManager";
import DisabledTimeManager from "@/components/custom/disabledTimeManager";
import ExtraTimeManager from "@/components/custom/extraTimeManager";
import UsersManagement from "@/components/custom/userManagement";
import BarberCreateBooking from "@/components/custom/barberCreateBooking";
import NotificationCenter from "@/components/custom/notificationCenter";
import type {
  BarberProfile,
  Prisma,
  Service,
} from "@/prisma/generated/prisma/client";
import ServiceManagement from "@/components/custom/serviceManagement";
import NotificationCenterPopover from "@/components/custom/notificationCenterPopover";
import PlanManagement from "@/components/custom/planManagement";
import * as types from "@/lib/types";
import BarberBookingViewer from "@/components/custom/barberBookingViewer";
import BarberProfileSettings from "@/components/custom/barberSettings";
import { profile } from "console";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import Image from "next/image";

type user_ = Prisma.UserGetPayload<{
  include: {
    barberProfile: true;
  };
}>;

type BarberProfile_ = Prisma.BarberProfileGetPayload<{
  include: {
    user: true;
  };
}>;
interface BarberDashboardProps {
  barberId: string;
  barberProfile: user_;
  barberProfiles?: BarberProfile_[];
  isAdmin?: boolean;
  users: types.User[];
  services: Service[];
  plans: types.Plan[];
}

export default function BarberDashboard({
  barberId,
  barberProfile,
  barberProfiles,
  isAdmin,
  users,
  services,
  plans,
}: BarberDashboardProps) {
  const [activeBarberId, setActiveBarberId] = useState(barberId);
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div className="min-h-screen bg-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">
            Painel do Barbeiro
          </h1>
          <div className="flex items-center gap-3">
            {isAdmin && barberProfiles && (
              <Select value={activeBarberId} onValueChange={setActiveBarberId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {barberProfiles.map((pro) => {
                    return (
                      <SelectItem key={pro.id} value={pro.id}>
                        <Image
                          src={pro.user.image ?? ""}
                          alt={pro.displayName}
                          referrerPolicy="no-referrer"
                          className="w-4 z-50"
                          width={100}
                          height={100}
                        />
                        {pro.displayName}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            )}
            <NotificationCenter barberId={barberId} />
            <NotificationCenterPopover barberId={barberId} />
            <BarberCreateBooking
              barberId={barberId}
              users={users}
              services={services}
            />
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6 h-fit"
        >
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 bg-slate-800 h-fit">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users size={18} />
              <span className="hidden md:inline">Clientes</span>
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <Calendar size={18} />
              <span className="hidden md:inline">Agendamentos</span>
            </TabsTrigger>

            {isAdmin && (
              <TabsTrigger
                value="disabled-days"
                className="flex items-center gap-2"
              >
                <CalendarX size={18} />
                <span className="hidden md:inline">Dias</span>
              </TabsTrigger>
            )}

            {isAdmin && (
              <TabsTrigger
                value="disabled-times"
                className="flex items-center gap-2"
              >
                <Clock size={18} />
                <span className="hidden md:inline">Horários</span>
              </TabsTrigger>
            )}

            {isAdmin && (
              <TabsTrigger
                value="extra-time"
                className="flex items-center gap-2"
              >
                <CalendarPlus size={18} />
                <span className="hidden md:inline">Tempo Extra</span>
              </TabsTrigger>
            )}

            {isAdmin && (
              <TabsTrigger value="services" className="flex items-center gap-2">
                <ClipboardPen size={18} />
                <span className="hidden md:inline">Serviços</span>
              </TabsTrigger>
            )}

            {isAdmin && (
              <TabsTrigger value="plans" className="flex items-center gap-2">
                <Package size={18} />
                <span className="hidden md:inline">Planos</span>
              </TabsTrigger>
            )}
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings size={18} />
              <span className="hidden md:inline">Configurações</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <UsersManagement users={users} barberId={activeBarberId} />
          </TabsContent>

          <TabsContent value="bookings" className="space-y-4">
            <BarberBookingViewer />
          </TabsContent>

          <TabsContent value="disabled-days" className="space-y-4">
            <DisabledDaysManager barberId={activeBarberId} />
          </TabsContent>

          <TabsContent value="disabled-times" className="space-y-4">
            <DisabledTimeManager barberId={activeBarberId} />
          </TabsContent>

          <TabsContent value="extra-time" className="space-y-4">
            <ExtraTimeManager barberId={activeBarberId} />
          </TabsContent>

          <TabsContent value="services" className="space-y-4">
            <ServiceManagement services={services} barberId={activeBarberId} />
          </TabsContent>

          <TabsContent value="plans" className="space-y-4">
            <PlanManagement users={users} services={services} plans={plans} />
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <BarberProfileSettings user={barberProfile} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
