"use client";
import { useState, useEffect, useTransition } from "react";
import { Calendar } from "@/components/ui/calendar";
import { format, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  addExtraTime,
  removeExtraTime,
  getExtraTimeDays,
} from "@/lib/bookingActions";
import type { ExtraTimeDay } from "@/prisma/generated/prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, Plus, Minus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface ExtraTimeManagerProps {
  barberId: string;
}

export default function ExtraTimeManager({ barberId }: ExtraTimeManagerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [extraTimeDays, setExtraTimeDays] = useState<ExtraTimeDay[]>([]);
  const [isPending, startTransition] = useTransition();
  const [extraSlots, setExtraSlots] = useState<number>(1);

  useEffect(() => {
    fetchExtraTimeDays();
  }, []);

  const fetchExtraTimeDays = async () => {
    try {
      const days = await getExtraTimeDays(barberId);
      setExtraTimeDays(days);
    } catch (error) {
      console.error("Error fetching extra time days:", error);
    }
  };

  const handleAddExtraTime = () => {
    if (!selectedDate) {
      toast.error("Selecione uma data primeiro");
      return;
    }

    if (extraSlots < 1 || extraSlots > 20) {
      toast.error("Número de slots deve estar entre 1 e 20");
      return;
    }

    startTransition(async () => {
      try {
        await addExtraTime(barberId, selectedDate, extraSlots);
        await fetchExtraTimeDays();
        toast.success("Tempo extra adicionado com sucesso!");
        setSelectedDate(undefined);
        setExtraSlots(1);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Erro ao adicionar tempo extra",
        );
      }
    });
  };

  const handleRemoveExtraTime = (extraTimeId: string) => {
    startTransition(async () => {
      try {
        await removeExtraTime(extraTimeId);
        await fetchExtraTimeDays();
        toast.success("Tempo extra removido com sucesso!");
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Erro ao remover tempo extra",
        );
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Gerenciar Tempo Extra</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Adicionar Tempo Extra
            </h2>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => date < startOfDay(new Date())}
              className="rounded-lg border shadow-sm mx-auto md:[--cell-size:--spacing(12)]"
            />
          </div>

          {selectedDate && (
            <div className="p-4 bg-slate-800 rounded-lg space-y-4">
              <h3 className="font-semibold">
                {format(selectedDate, "dd 'de' MMMM 'de' yyyy", {
                  locale: ptBR,
                })}
              </h3>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Número de slots extras
                </label>
                <div className="flex items-center gap-3">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() =>
                      setExtraSlots((prev) => Math.max(1, prev - 1))
                    }
                    disabled={extraSlots <= 1}
                  >
                    <Minus size={16} />
                  </Button>
                  <Input
                    type="number"
                    value={extraSlots}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (val >= 1 && val <= 20) setExtraSlots(val);
                    }}
                    className="text-center w-20"
                    min={1}
                    max={20}
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() =>
                      setExtraSlots((prev) => Math.min(20, prev + 1))
                    }
                    disabled={extraSlots >= 20}
                  >
                    <Plus size={16} />
                  </Button>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  Cada slot adiciona o intervalo de tempo configurado no seu
                  perfil
                </p>
              </div>

              <Button
                onClick={handleAddExtraTime}
                disabled={isPending}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                {isPending ? "Adicionando..." : "Adicionar Tempo Extra"}
              </Button>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Dias com Tempo Extra</h2>

          {extraTimeDays.length === 0 ? (
            <p className="text-gray-400">
              Nenhum dia com tempo extra configurado
            </p>
          ) : (
            <div className="space-y-3 max-h-125 overflow-y-auto">
              {extraTimeDays
                .sort(
                  (a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime(),
                )
                .map((day) => {
                  const dayDate = new Date(day.date);
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
                        <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                          <Clock size={14} />
                          <span>{day.amount} slots extras</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRemoveExtraTime(day.id)}
                        disabled={isPending}
                      >
                        <Trash2 size={16} />
                      </Button>
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
