"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Edit, Clock, Banknote, Ticket } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { editBooking } from "@/lib/bookingEditActions";
import Calendar02 from "@/components/custom/calendar";
import TimeSlotSelector from "@/components/custom/timeSlotSelector";
import { Checkbox } from "@/components/ui/checkbox";

interface TimeSlot {
  start: string;
  end: string;
  isAvailable: boolean;
  isPast: boolean;
  isBooked: boolean;
}

export default function BookingEditDialog({
  booking,
  barberId,
  services,
}: {
  booking: any;
  barberId: string;
  services: any[];
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [selectedServices, setSelectedServices] = useState<string[]>(
    booking.services.map((s: any) => s.serviceId)
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(booking.date)
  );
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [selectedStatus, setSelectedStatus] = useState(booking.status);

  const isPastBooking = new Date(booking.date) < new Date();

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleSave = () => {
    if (selectedServices.length === 0) {
      toast.error("Selecione pelo menos um serviço");
      return;
    }

    const updates: any = {};

    // Check if services changed
    const servicesChanged =
      JSON.stringify([...selectedServices].sort()) !==
      JSON.stringify(
        booking.services.map((s: any) => s.serviceId).sort()
      );

    if (servicesChanged) {
      updates.serviceIds = selectedServices;
    }

    // Check if date changed
    if (selectedSlot) {
      const newDateTime = new Date(selectedSlot.start);
      const oldDateTime = new Date(booking.date);
      if (newDateTime.getTime() !== oldDateTime.getTime()) {
        updates.date = selectedSlot.start;
      }
    }

    // Check if status changed
    if (selectedStatus !== booking.status) {
      updates.status = selectedStatus;
    }

    if (Object.keys(updates).length === 0) {
      toast.info("Nenhuma alteração detectada");
      return;
    }

    startTransition(async () => {
      try {
        await editBooking(booking.id, barberId, updates);
        toast.success("Agendamento atualizado com sucesso!");
        setIsOpen(false);
        router.refresh();
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Erro ao atualizar agendamento"
        );
      }
    });
  };

  function handleDiscount(
    price: number,
  ): number {
    let length = selectedServices.length == 0 ? 1 : selectedServices.length;
    selectedServices.map((s) => {
      if (s[1] == "LZ") {
        length = length - 1;
      }
    });
    if (length < 1) length = 1;
    const discountRate = (length - 1) * 5;
    return price - discountRate;
  }

  const calculateTotal = () => {
    return handleDiscount(selectedServices.reduce((sum, serviceId) => {
      const service = services.find((s) => s.id === serviceId);
      return sum + (service?.price || 0);
    }, 0));
  };

  const calculateDuration = () => {
    return selectedServices.reduce((sum, serviceId) => {
      const service = services.find((s) => s.id === serviceId);
      return sum + (service?.duration || 0);
    }, 0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="bg-slate-900 rounded-lg p-4 hover:bg-slate-950 transition-colors cursor-pointer">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="font-semibold">
                  {format(new Date(booking.date), "dd/MM/yyyy 'às' HH:mm", {
                    locale: ptBR,
                  })}
                </span>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    isPastBooking
                      ? "bg-gray-600"
                      : booking.status === "CONFIRMED"
                        ? "bg-emerald-600"
                        : booking.status === "PENDING"
                          ? "bg-amber-600"
                          : "bg-red-600"
                  }`}
                >
                  {isPastBooking
                    ? "Passou"
                    : booking.status === "CONFIRMED"
                      ? "Confirmado"
                      : booking.status === "PENDING"
                        ? "Pendente"
                        : "Cancelado"}
                </span>
                {booking.coupon && (
                  <span className="bg-purple-600 px-2 py-1 rounded text-xs flex items-center gap-1">
                    <Ticket size={12} />
                    {booking.coupon.discountPercent}% OFF
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-400">
                {booking.services.map((s: any) => s.service.name).join(", ")}
              </div>
              <div className="flex gap-3 mt-2 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {booking.totalDuration} min
                </span>
                <span className="flex items-center gap-1">
                  <Banknote size={14} />
                  {handleDiscount(booking.totalPrice).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <Edit size={16} />
            </Button>
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Agendamento</DialogTitle>
          <DialogDescription>
            Edite os detalhes do agendamento do cliente
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status */}
          <div>
            <Label>Status</Label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">Pendente</SelectItem>
                <SelectItem value="CONFIRMED">Confirmado</SelectItem>
                <SelectItem value="CANCELED">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Services */}
          <div>
            <Label>Serviços</Label>
            <div className="grid grid-cols-2 gap-2 md:gap-3 mt-2">
              {services.map((service) => (
                <div
                  key={service.id}
                  className={`border rounded-lg p-1 md:p-3 cursor-pointer transition-all ${
                    selectedServices.includes(service.id)
                      ? "border-sky-500 bg-sky-500/10"
                      : "border-slate-600 hover:border-slate-500"
                  }`}
                  onClick={() => handleServiceToggle(service.id)}
                >
                  <div className="flex items-start gap-1 md:gap-3">
                    <Checkbox
                      checked={selectedServices.includes(service.id)}
                      onCheckedChange={() => handleServiceToggle(service.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <p className="font-semibold">{service.name}</p>
                      <div className="flex gap-1 text-sm text-gray-400 mt-1">
                        <span>{service.duration} min</span>
                        <span>•</span>
                        <span className="text-emerald-600">
                          {service.price.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Date & Time */}
          <div className="flex flex-col">
            <div>
              <Label>Data</Label>
              <div className="mt-2">
                <Calendar02
                  barberId={barberId}
                  onDateSelect={setSelectedDate}
                />
              </div>
            </div>
            <div>
              <Label>Horário</Label>
              <div className="mt-2">
                <TimeSlotSelector
                  barberId={barberId}
                  selectedDate={selectedDate}
                  onSlotSelect={setSelectedSlot}
                  selectedSlot={selectedSlot}
                />
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-slate-800 rounded-lg p-4">
            <h4 className="font-semibold mb-3">Resumo</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Serviços:</span>
                <span>{selectedServices.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Duração Total:</span>
                <span>{calculateDuration()} min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Data:</span>
                <span>
                  {selectedDate
                    ? format(selectedDate, "dd/MM/yyyy", { locale: ptBR })
                    : "Não selecionada"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Horário:</span>
                <span>
                  {selectedSlot
                    ? format(new Date(selectedSlot.start), "HH:mm")
                    : "Não selecionado"}
                </span>
              </div>
              <div className="border-t border-slate-700 pt-2 mt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-emerald-500">
                    {calculateTotal().toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isPending}>
              {isPending ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}