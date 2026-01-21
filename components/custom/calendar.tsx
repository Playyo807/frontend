"use client";
import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { getBarberAvailability } from "@/lib/bookingActions";

interface DayAvailability {
  date: string;
  status: "available" | "partial" | "full" | "past";
  availableSlots: number;
  totalSlots: number;
}

interface Calendar02Props {
  barberId: string | null;
  onDateSelect?: (date: Date | undefined) => void;
}

export default function Calendar02({
  barberId,
  onDateSelect,
}: Calendar02Props) {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = React.useState<Date>(new Date());
  const [timeZone, setTimeZone] = React.useState<string | undefined>(undefined);
  const [availability, setAvailability] = React.useState<
    Map<string, DayAvailability>
  >(new Map());

  React.useEffect(() => {
    setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  // Fetch availability when month changes or barber changes
  React.useEffect(() => {
    if (!barberId || !timeZone) return;

    const fetchAvailability = async () => {
      setLoading(true);
      try {
        const monthStr = format(currentMonth, "yyyy-MM");
        const data = await getBarberAvailability(barberId, monthStr, timeZone);

        const availabilityMap = new Map<string, DayAvailability>();

        data.availability.forEach((day: DayAvailability) => {
          availabilityMap.set(day.date, day);
        });

        setAvailability(availabilityMap);
      } catch (error) {
        console.error("Error fetching availability:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [barberId, currentMonth, timeZone]);

  // Prepare modifiers for calendar
  const someBookedDays: Date[] = [];
  const fullBookedDays: Date[] = [];
  const disabledDays: Date[] = [];
  const manuallyDisabledDays: Date[] = [];
  const enabledSundays: Date[] = [];

  availability.forEach((day, dateStr) => {
    const dayDate = new Date(dateStr + "T12:00:00"); // Use noon to avoid timezone issues
    const dayOfWeek = dayDate.getDay();
    const isSunday = dayOfWeek === 0;
    let enabledSunday = false;

    if (day.status === "past") {
      disabledDays.push(dayDate);
    } else if (day.status === "partial") {
      someBookedDays.push(dayDate);
      // If it's a Sunday with available slots, it means it's enabled
      if (isSunday) {
        enabledSundays.push(dayDate);
        enabledSunday = true;
      }
    } else if (day.status === "available") {
      // If it's a Sunday that's available, it's been enabled
      if (isSunday) {
        enabledSundays.push(dayDate);
        enabledSunday = true;
      }
    } else if (day.status === "full") {
      // Check if it's manually disabled or a Sunday
      if (day.totalSlots === 0) {
        if (isSunday && !enabledSunday) {
          // Sunday with 0 slots means it's closed (default state)
          disabledDays.push(dayDate);
        } else {
          // Regular day with 0 slots means manually disabled
          manuallyDisabledDays.push(dayDate);
          disabledDays.push(dayDate);
        }
      } else {
        // Has slots but all booked
        fullBookedDays.push(dayDate);
        disabledDays.push(dayDate);
      }
    }
  });

  const handleMonthChange = (newMonth: Date) => {
    setCurrentMonth(newMonth);
  };

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    if (onDateSelect) {
      onDateSelect(newDate);
    }
  };

  return (
    <div className="mt-8">
      {!loading && barberId ? (
        <div className="space-y-4">
          <Calendar
            mode="single"
            month={currentMonth}
            onMonthChange={handleMonthChange}
            numberOfMonths={1}
            selected={date}
            onSelect={handleDateSelect}
            disabled={disabledDays}
            className="rounded-lg border shadow-sm mx-auto [--cell-size:--spacing(12)] md:[--cell-size:--spacing(13)]"
            timeZone={timeZone}
            modifiers={{
              someBooked: someBookedDays,
              fullBooked: fullBookedDays,
              manuallyDisabled: manuallyDisabledDays,
              disabledDays: disabledDays,
              enabledSundays: enabledSundays,
            }}
            modifiersClassNames={{
              someBooked: "rounded-lg bg-emerald-700 hover:bg-green-800",
              fullBooked:
                "rounded-lg bg-red-500 cursor-not-allowed hover:bg-red-500 text-gray-300",
              manuallyDisabled:
                "rounded-lg bg-orange-600 cursor-not-allowed hover:bg-orange-600 text-gray-300",
              disabledDays:
                "rounded-lg bg-gray-600 cursor-not-allowed hover:bg-gray-600 text-gray-400",
              enabledSundays: "rounded-lg bg-blue-600 hover:bg-blue-800",
            }}
          />

          {/* Legend */}
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-emerald-700"></div>
              <span>Parcialmente disponível</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-500"></div>
              <span>Lotado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-orange-600"></div>
              <span>Indisponível</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-600"></div>
              <span>Domingo aberto</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center justify-center items-center">
          <h1 className="text-xl font-semibold">Carregando...</h1>
        </div>
      )}
    </div>
  );
}
