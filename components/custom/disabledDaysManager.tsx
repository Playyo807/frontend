"use client";
import { useState, useEffect, useTransition } from "react";
import { Calendar } from "@/components/ui/calendar";
import { format, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { disableDay, enableDay, getDisabledDays } from "@/lib/bookingActions";
import type { DisabledDay } from "@/prisma/generated/prisma/client";

interface DisabledDaysManagerProps {
  barberId: string;
}

export default function DisabledDaysManager({
  barberId,
}: DisabledDaysManagerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [disabledDays, setDisabledDays] = useState<DisabledDay[]>([]);
  const [reason, setReason] = useState("");
  const [isPending, startTransition] = useTransition();
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Fetch disabled days
  useEffect(() => {
    const fetchDisabledDays = async () => {
      try {
        const { disabledDays: days } = await getDisabledDays(barberId);
        setDisabledDays(days);
      } catch (error) {
        console.error("Error fetching disabled days:", error);
      }
    };

    fetchDisabledDays();
  }, [barberId]);

  const disabledDates = disabledDays.map((d) => startOfDay(new Date(d.date)));

  const handleDisableDay = () => {
    if (!selectedDate) {
      alert("Por favor, selecione uma data");
      return;
    }

    const isSunday = selectedDate.getDay() === 0;

    startTransition(async () => {
      try {
        await disableDay(barberId, selectedDate, reason || undefined);

        // Refresh disabled days
        const { disabledDays: days } = await getDisabledDays(barberId);
        setDisabledDays(days);

        setReason("");
        if (isSunday) {
          alert("Domingo habilitado com sucesso!");
        } else {
          alert("Dia desabilitado com sucesso!");
        }
      } catch (error) {
        console.error("Error modifying day:", error);
        alert(error instanceof Error ? error.message : "Erro ao modificar dia");
      }
    });
  };

  const handleEnableDay = (date: Date) => {
    const isSunday = date.getDay() === 0;

    startTransition(async () => {
      try {
        await enableDay(barberId, date);

        // Refresh disabled days
        const { disabledDays: days } = await getDisabledDays(barberId);
        setDisabledDays(days);

        if (isSunday) {
          alert("Domingo desabilitado (fechado) com sucesso!");
        } else {
          alert("Dia habilitado com sucesso!");
        }
      } catch (error) {
        console.error("Error modifying day:", error);
        alert(error instanceof Error ? error.message : "Erro ao modificar dia");
      }
    });
  };

  const isDateDisabled = (date: Date) => {
    const isSunday = date.getDay() === 0;
    const isInTable = disabledDates.some(
      (d) => d.getTime() === startOfDay(date).getTime(),
    );

    // For Sundays: in table = enabled, not in table = disabled
    // For other days: in table = disabled, not in table = enabled
    return isSunday ? !isInTable : isInTable;
  };

  const isDateEnabled = (date: Date) => {
    const isSunday = date.getDay() === 0;
    const isInTable = disabledDates.some(
      (d) => d.getTime() === startOfDay(date).getTime(),
    );

    // For Sundays: in table = enabled
    // For other days: not in table = enabled
    return isSunday ? isInTable : !isInTable;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">
        Gerenciar Disponibilidade de Dias
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Desabilitar Dia</h2>
            <Calendar
              mode="single"
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => {
                const isPast = date < startOfDay(new Date());
                return isPast;
              }}
              className="rounded-lg border shadow-sm mx-auto [--cell-size:--spacing(12)] md:[--cell-size:--spacing(13)]"
              modifiers={{
                disabled: disabledDates,
              }}
              modifiersClassNames={{
                disabled:
                  "rounded-lg bg-gray-600 cursor-not-allowed hover:bg-gray-600 text-gray-400",
              }}
            />
          </div>

          {selectedDate && (
            <div className="p-4 bg-slate-800 rounded-lg space-y-4">
              <div>
                <p className="font-semibold mb-2">
                  Data selecionada:{" "}
                  {format(selectedDate, "dd 'de' MMMM 'de' yyyy", {
                    locale: ptBR,
                  })}
                </p>

                {selectedDate.getDay() === 0 ? (
                  // Sunday logic (reversed)
                  <div className="space-y-3">
                    {isDateEnabled(selectedDate) ? (
                      <>
                        <p className="text-emerald-400">
                          Este domingo está habilitado (aberto)
                        </p>
                        <button
                          onClick={() => handleEnableDay(selectedDate)}
                          disabled={isPending}
                          className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 px-4 py-2 rounded-lg font-medium"
                        >
                          {isPending
                            ? "Desabilitando..."
                            : "Desabilitar Domingo (Fechar)"}
                        </button>
                      </>
                    ) : (
                      <>
                        <p className="text-gray-400">
                          Este domingo está fechado (padrão)
                        </p>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Motivo (opcional)
                          </label>
                          <input
                            type="text"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Ex: Plantão especial"
                            className="w-full px-3 py-2 bg-slate-700 rounded-lg border border-slate-600 focus:border-sky-500 focus:outline-none"
                          />
                        </div>
                        <button
                          onClick={handleDisableDay}
                          disabled={isPending}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 px-4 py-2 rounded-lg font-medium"
                        >
                          {isPending
                            ? "Habilitando..."
                            : "Habilitar Domingo (Abrir)"}
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  // Regular day logic (normal)
                  <div className="space-y-3">
                    {isDateDisabled(selectedDate) ? (
                      <>
                        <p className="text-red-400">
                          Este dia está desabilitado
                        </p>
                        <button
                          onClick={() => handleEnableDay(selectedDate)}
                          disabled={isPending}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 px-4 py-2 rounded-lg font-medium"
                        >
                          {isPending ? "Habilitando..." : "Habilitar Dia"}
                        </button>
                      </>
                    ) : (
                      <>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Motivo (opcional)
                          </label>
                          <input
                            type="text"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Ex: Férias, Feriado, etc."
                            className="w-full px-3 py-2 bg-slate-700 rounded-lg border border-slate-600 focus:border-sky-500 focus:outline-none"
                          />
                        </div>
                        <button
                          onClick={handleDisableDay}
                          disabled={isPending}
                          className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 px-4 py-2 rounded-lg font-medium"
                        >
                          {isPending ? "Desabilitando..." : "Desabilitar Dia"}
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Dias Modificados</h2>

          {disabledDays.length === 0 ? (
            <p className="text-gray-400">
              Nenhum dia modificado (domingos fechados por padrão)
            </p>
          ) : (
            <div className="space-y-3 max-h-125 overflow-y-auto">
              {disabledDays
                .sort(
                  (a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime(),
                )
                .map((day) => {
                  const dayDate = new Date(day.date);
                  const isSunday = dayDate.getDay() === 0;

                  return (
                    <div
                      key={day.id}
                      className="p-4 bg-slate-800 rounded-lg flex justify-between items-center"
                    >
                      <div>
                        <p className="font-semibold">
                          {format(dayDate, "dd 'de' MMMM 'de' yyyy", {
                            locale: ptBR,
                          })}
                        </p>
                        {day.reason && (
                          <p className="text-sm text-gray-400">{day.reason}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          {isSunday
                            ? "Domingo habilitado (aberto)"
                            : "Dia desabilitado (fechado)"}
                        </p>
                      </div>
                      <button
                        onClick={() => handleEnableDay(dayDate)}
                        disabled={isPending}
                        className={`${
                          isSunday
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-emerald-600 hover:bg-emerald-700"
                        } disabled:bg-gray-600 px-4 py-2 rounded-lg text-sm font-medium`}
                      >
                        {isSunday ? "Fechar" : "Habilitar"}
                      </button>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
