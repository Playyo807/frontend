"use client";
import * as React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getBarberSlots } from "@/lib/bookingActions";

interface TimeSlot {
  start: string;
  end: string;
  isAvailable: boolean;
  isPast: boolean;
  isBooked: boolean;
}

interface TimeSlotSelectorProps {
  barberId: string;
  selectedDate: Date | undefined;
  onSlotSelect: (slot: TimeSlot) => void;
  selectedSlot?: TimeSlot | null;
}

export default function TimeSlotSelector({
  barberId,
  selectedDate,
  onSlotSelect,
  selectedSlot,
}: TimeSlotSelectorProps) {
  const [loading, setLoading] = React.useState(false);
  const [slots, setSlots] = React.useState<TimeSlot[]>([]);
  const [timeZone, setTimeZone] = React.useState<string>("");

  React.useEffect(() => {
    setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  React.useEffect(() => {
    if (!selectedDate || !barberId || !timeZone) {
      setSlots([]);
      return;
    }

    const fetchSlots = async () => {
      setLoading(true);
      try {
        const dateStr = format(selectedDate, "yyyy-MM-dd");
        const data = await getBarberSlots(barberId, dateStr, timeZone);
        setSlots(data.slots);
      } catch (error) {
        console.error("Error fetching slots:", error);
        setSlots([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [barberId, selectedDate, timeZone]);

  if (!selectedDate) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-400">
          Selecione uma data para ver os horários disponíveis
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-400">Carregando horários...</p>
      </div>
    );
  }

  const availableSlots = slots.filter((slot) => slot.isAvailable);

  if (availableSlots.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-400">
          Nenhum horário disponível para esta data
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4">
        Horários disponíveis para{" "}
        {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
      </h3>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {availableSlots.map((slot, index) => {
          const startTime = format(new Date(slot.start), "HH:mm");
          const isSelected = selectedSlot?.start === slot.start;

          return (
            <button
              key={index}
              onClick={() => onSlotSelect(slot)}
              className={`
                px-4 py-3 rounded-lg font-medium transition-all
                ${
                  isSelected
                    ? "bg-sky-600 text-white scale-105"
                    : "bg-slate-800 hover:bg-slate-700 text-gray-200"
                }
              `}
            >
              {startTime}
            </button>
          );
        })}
      </div>
    </div>
  );
}
