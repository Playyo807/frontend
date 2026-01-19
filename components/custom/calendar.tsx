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

export default function Calendar02({
  barberId,
  onDateSelect,
}: {
  barberId: string | null;
  onDateSelect?: (date: Date | undefined) => void;
}) {
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

  availability.forEach((day, dateStr) => {
    const dayDate = new Date(dateStr + "T12:00:00"); // Use noon to avoid timezone issues

    if (day.status === "past" || day.status === "full") {
      disabledDays.push(dayDate);
      if (day.status === "full") {
        fullBookedDays.push(dayDate);
      }
    } else if (day.status === "partial") {
      someBookedDays.push(dayDate);
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
          }}
          modifiersClassNames={{
            someBooked: "rounded-lg bg-emerald-700 hover:bg-green-800",
            fullBooked:
              "rounded-lg bg-red-500 cursor-not-allowed hover:bg-red-500 text-gray-300",
          }}
        />
      ) : (
        <div className="text-center justify-center items-center">
          <h1 className="text-xl font-semibold">Carregando...</h1>
        </div>
      )}
    </div>
  );
}
