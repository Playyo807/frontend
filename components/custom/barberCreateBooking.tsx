"use client";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, Calendar as CalendarIcon, Clock, Plus } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { createBookingAsBarber, getBarberSlots } from "@/lib/bookingActions";
import { Calendar } from "@/components/ui/calendar";
import type { Service } from "@/prisma/generated/prisma/client";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  image: string | null;
}

interface BarberCreateBookingProps {
  barberId: string;
  users: User[];
  services: Service[];
}

interface TimeSlot {
  start: string;
  end: string;
  isAvailable: boolean;
  isPast: boolean;
  isBooked: boolean;
}

export default function BarberCreateBooking({
  barberId,
  users,
  services,
}: BarberCreateBookingProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState<"user" | "services" | "datetime">("user");

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone?.includes(searchQuery)
  );

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setStep("services");
  };

  const handleServiceToggle = (service: Service) => {
    setSelectedServices((prev) => {
      const exists = prev.find((s) => s.id === service.id);
      if (exists) {
        return prev.filter((s) => s.id !== service.id);
      } else {
        return [...prev, service];
      }
    });
  };

  const handleDateSelect = async (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedSlot(null);

    if (date) {
      try {
        const dateStr = format(date, "yyyy-MM-dd");
        const { slots } = await getBarberSlots(barberId, dateStr);
        setAvailableSlots(slots.filter((s) => s.isAvailable));
      } catch (error) {
        toast.error("Erro ao buscar horários disponíveis");
      }
    }
  };

  const handleCreateBooking = () => {
    if (!selectedUser || selectedServices.length === 0 || !selectedSlot) {
      toast.error("Preencha todos os campos");
      return;
    }

    startTransition(async () => {
      try {
        await createBookingAsBarber(
          selectedUser.id,
          barberId,
          selectedServices.map((s) => s.id),
          selectedSlot.start,
          Intl.DateTimeFormat().resolvedOptions().timeZone
        );

        toast.success("Agendamento criado com sucesso!");
        setOpen(false);
        resetForm();
        window.location.reload();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Erro ao criar agendamento"
        );
      }
    });
  };

  const resetForm = () => {
    setSelectedUser(null);
    setSelectedServices([]);
    setSelectedDate(undefined);
    setSelectedSlot(null);
    setAvailableSlots([]);
    setSearchQuery("");
    setStep("user");
  };

  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration, 0);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="bg-emerald-600 hover:bg-emerald-700"
      >
        <Plus className="mr-2" size={20} />
        Criar Agendamento
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Criar Novo Agendamento</DialogTitle>
          </DialogHeader>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-6">
            <div
              className={`flex-1 text-center ${step === "user" ? "text-sky-500 font-semibold" : "text-gray-400"}`}
            >
              1. Cliente
            </div>
            <div
              className={`flex-1 text-center ${step === "services" ? "text-sky-500 font-semibold" : "text-gray-400"}`}
            >
              2. Serviços
            </div>
            <div
              className={`flex-1 text-center ${step === "datetime" ? "text-sky-500 font-semibold" : "text-gray-400"}`}
            >
              3. Data/Hora
            </div>
          </div>

          {/* Step 1: Select User */}
          {step === "user" && (
            <div className="space-y-4">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <Input
                  placeholder="Buscar cliente por nome, email ou telefone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="grid grid-cols-1 gap-2 max-h-100 overflow-y-auto">
                {filteredUsers.length === 0 ? (
                  <p className="text-center text-gray-400 py-8">
                    Nenhum cliente encontrado
                  </p>
                ) : (
                  filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => handleUserSelect(user)}
                      className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg hover:bg-slate-700 cursor-pointer transition-colors"
                    >
                      <img
                        src={user.image || "https://via.placeholder.com/40"}
                        alt={user.name || "User"}
                        className="h-10 w-10 rounded-full"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1">
                        <p className="font-semibold">{user.name || "Sem nome"}</p>
                        <p className="text-sm text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Step 2: Select Services */}
          {step === "services" && selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg">
                <img
                  src={selectedUser.image || "https://via.placeholder.com/40"}
                  alt={selectedUser.name || "User"}
                  className="h-10 w-10 rounded-full"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <p className="font-semibold">{selectedUser.name}</p>
                  <p className="text-sm text-gray-400">{selectedUser.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {services.map((service) => {
                  const isSelected = selectedServices.find(
                    (s) => s.id === service.id
                  );
                  return (
                    <div
                      key={service.id}
                      onClick={() => handleServiceToggle(service)}
                      className={`p-4 rounded-lg cursor-pointer transition-all ${
                        isSelected
                          ? "bg-sky-600 border-2 border-sky-400"
                          : "bg-slate-800 hover:bg-slate-700"
                      }`}
                    >
                      <h3 className="font-semibold">{service.name}</h3>
                      <div className="flex justify-between mt-2 text-sm">
                        <span>{service.duration} min</span>
                        <span>R$ {service.price}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {selectedServices.length > 0 && (
                <div className="p-4 bg-slate-800 rounded-lg">
                  <p className="font-semibold mb-2">Resumo:</p>
                  <div className="flex justify-between">
                    <span>Total:</span>
                    <span className="font-bold">
                      {totalDuration} min • R$ {totalPrice}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep("user")}
                  className="flex-1"
                >
                  Voltar
                </Button>
                <Button
                  onClick={() => setStep("datetime")}
                  disabled={selectedServices.length === 0}
                  className="flex-1"
                >
                  Continuar
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Select Date/Time */}
          {step === "datetime" && selectedUser && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Selecione a Data</h3>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    disabled={(date) => date < new Date()}
                    className="rounded-lg border"
                  />
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Horários Disponíveis</h3>
                  {!selectedDate ? (
                    <p className="text-gray-400">
                      Selecione uma data para ver os horários
                    </p>
                  ) : availableSlots.length === 0 ? (
                    <p className="text-gray-400">
                      Nenhum horário disponível nesta data
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 max-h-75 overflow-y-auto">
                      {availableSlots.map((slot, idx) => {
                        const isSelected = selectedSlot?.start === slot.start;
                        return (
                          <Button
                            key={idx}
                            variant={isSelected ? "default" : "outline"}
                            onClick={() => setSelectedSlot(slot)}
                            className="h-auto py-2"
                          >
                            <Clock size={14} className="mr-2" />
                            {format(new Date(slot.start), "HH:mm")}
                          </Button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {selectedSlot && (
                <div className="p-4 bg-emerald-500/20 border border-emerald-500 rounded-lg">
                  <p className="font-semibold mb-2">Confirmação:</p>
                  <div className="space-y-1 text-sm">
                    <p>
                      <strong>Cliente:</strong> {selectedUser.name}
                    </p>
                    <p>
                      <strong>Serviços:</strong>{" "}
                      {selectedServices.map((s) => s.name).join(", ")}
                    </p>
                    <p>
                      <strong>Data:</strong>{" "}
                      {selectedDate &&
                        format(selectedDate, "dd 'de' MMMM 'de' yyyy", {
                          locale: ptBR,
                        })}
                    </p>
                    <p>
                      <strong>Horário:</strong>{" "}
                      {format(new Date(selectedSlot.start), "HH:mm")}
                    </p>
                    <p>
                      <strong>Duração:</strong> {totalDuration} min
                    </p>
                    <p>
                      <strong>Total:</strong> R$ {totalPrice}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep("services")}
                  className="flex-1"
                >
                  Voltar
                </Button>
                <Button
                  onClick={handleCreateBooking}
                  disabled={!selectedSlot || isPending}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                >
                  {isPending ? "Criando..." : "Criar Agendamento"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}