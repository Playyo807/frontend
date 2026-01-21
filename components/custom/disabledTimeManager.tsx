"use client";
import { useState, useEffect, useTransition } from "react";
import { Calendar } from "@/components/ui/calendar";
import { format, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  disableTimeSlot,
  enableTimeSlot,
  getDisabledTimesForDay,
  getBarberSlots,
} from "@/lib/bookingActions";
import type { DisabledTime } from "@/prisma/generated/prisma/client";
import { Button } from "@/components/ui/button";
import { Clock, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface DisabledTimeManagerProps {
  barberId: string;
}

interface TimeSlot {
  start: string;
  end: string;
  isAvailable: boolean;
  isPast: boolean;
  isBooked: boolean;
}

export default function DisabledTimeManager({
  barberId,
}: DisabledTimeManagerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [disabledTimes, setDisabledTimes] = useState<DisabledTime[]>([]);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedDate) {
      fetchData();
    }
  }, [selectedDate]);

  const fetchData = async () => {
    if (!selectedDate) return;

    setLoading(true);
    try {
      const dateStr = format(selectedDate, "yyyy-MM-dd");

      // Fetch disabled times
      const times = await getDisabledTimesForDay(barberId, dateStr);
      setDisabledTimes(times);

      // Fetch all slots for this day (including already disabled ones)
      const { slots } = await getBarberSlots(barberId, dateStr);

      // Filter out past slots and show all others
      const futureSlots = slots.filter((slot) => !slot.isPast);
      setAvailableSlots(futureSlots);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Erro ao carregar horários");
    } finally {
      setLoading(false);
    }
  };

  const isSlotDisabled = (slotStart: string): boolean => {
    return disabledTimes.some(
      (time) => new Date(time.date).getTime() === new Date(slotStart).getTime(),
    );
  };

  const handleToggleSlot = (slot: TimeSlot) => {
    const disabled = isSlotDisabled(slot.start);

    if (disabled) {
      // Find the disabled time and enable it
      const disabledTime = disabledTimes.find(
        (time) =>
          new Date(time.date).getTime() === new Date(slot.start).getTime(),
      );

      if (disabledTime) {
        handleEnableTime(disabledTime.id);
      }
    } else {
      // Disable the slot
      handleDisableTime(slot.start);
    }
  };

  const handleDisableTime = (slotStart: string) => {
    const timeSlot = new Date(slotStart);

    startTransition(async () => {
      try {
        await disableTimeSlot(barberId, timeSlot);
        await fetchData();
        toast.success("Horário desabilitado com sucesso!");
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Erro ao desabilitar horário",
        );
      }
    });
  };

  const handleEnableTime = (timeId: string) => {
    startTransition(async () => {
      try {
        await enableTimeSlot(timeId);
        await fetchData();
        toast.success("Horário habilitado com sucesso!");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Erro ao habilitar horário",
        );
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">
        Gerenciar Horários Indisponíveis
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Selecionar Data</h2>
            <Calendar
              mode="single"
              selected={selectedDate}
              className="rounded-lg border shadow-sm mx-auto [--cell-size:--spacing(12)] md:[--cell-size:--spacing(13)]"
              onSelect={setSelectedDate}
              disabled={(date) => date < startOfDay(new Date())}
            />
          </div>

          {selectedDate && (
            <div className="p-4 bg-slate-800 rounded-lg">
              <p className="text-sm text-gray-400">
                Clique nos horários abaixo para habilitar/desabilitar.
                <br />
                Horários desabilitados aparecem em vermelho.
              </p>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">
            Horários Disponíveis
            {selectedDate && ` - ${format(selectedDate, "dd/MM/yyyy")}`}
          </h2>

          {!selectedDate ? (
            <p className="text-gray-400">
              Selecione uma data para ver os horários
            </p>
          ) : loading ? (
            <p className="text-gray-400">Carregando horários...</p>
          ) : availableSlots.length === 0 ? (
            <p className="text-gray-400">
              Nenhum horário disponível nesta data
            </p>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-125 overflow-y-auto">
                {availableSlots.map((slot, idx) => {
                  const disabled = isSlotDisabled(slot.start);
                  const booked = slot.isBooked;

                  return (
                    <Button
                      key={idx}
                      variant="outline"
                      onClick={() => !booked && handleToggleSlot(slot)}
                      disabled={isPending || booked}
                      className={`h-auto py-3 flex flex-col items-center gap-1 ${
                        disabled
                          ? "bg-red-500/20 border-red-500 text-red-400 hover:bg-red-500/30"
                          : booked
                            ? "bg-gray-700/50 border-gray-600 text-gray-500 cursor-not-allowed"
                            : "hover:bg-emerald-500/20 hover:border-emerald-500"
                      }`}
                    >
                      <Clock size={16} />
                      <span className="font-semibold">
                        {format(new Date(slot.start), "HH:mm")}
                      </span>
                      {disabled && (
                        <span className="text-xs">Desabilitado</span>
                      )}
                      {booked && <span className="text-xs">Reservado</span>}
                    </Button>
                  );
                })}
              </div>

              <div className="flex gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-emerald-500/20 border border-emerald-500"></div>
                  <span>Disponível</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-red-500/20 border border-red-500"></div>
                  <span>Desabilitado</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-gray-700/50 border border-gray-600"></div>
                  <span>Reservado</span>
                </div>
              </div>

              {disabledTimes.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-3">
                    Horários desabilitados ({disabledTimes.length})
                  </h3>
                  <div className="space-y-2">
                    {disabledTimes
                      .sort(
                        (a, b) =>
                          new Date(a.date).getTime() -
                          new Date(b.date).getTime(),
                      )
                      .map((time) => {
                        const timeDate = new Date(time.date);
                        return (
                          <div
                            key={time.id}
                            className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
                          >
                            <div className="flex items-center gap-2">
                              <Clock size={18} className="text-red-500" />
                              <span className="font-semibold">
                                {format(timeDate, "HH:mm")}
                              </span>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEnableTime(time.id)}
                              disabled={isPending}
                              className="text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10"
                            >
                              Habilitar
                            </Button>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
