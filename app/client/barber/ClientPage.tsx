"use client";
import { motion } from "motion/react";
import { BarberProfile } from "@/prisma/generated/prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import { decodeBookingData } from "@/lib/bookingParams";
import { useState, useTransition } from "react";
import Calendar02 from "@/components/custom/calendar";
import TimeSlotSelector from "@/components/custom/timeSlotSelector";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { createBooking } from "@/lib/bookingActions";

interface TimeSlot {
  start: string;
  end: string;
  isAvailable: boolean;
  isPast: boolean;
  isBooked: boolean;
}

export default function ClientPage({
  barbers,
  barberImages,
  disabledBarbers,
}: {
  barbers: BarberProfile[];
  barberImages: string[];
  disabledBarbers: BarberProfile[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedServices = decodeBookingData(searchParams)?.selectedServices;

  const [selectedBarber, setSelectedBarber] = useState<BarberProfile | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!selectedServices) {
    alert(
      "Um erro ocorreu durante a seleção dos serviços, por favor, escolha os serviços novamente"
    );
    router.push("/client");
  }

  const handleBooking = () => {
    if (!selectedBarber || !selectedSlot || !selectedServices) {
      alert("Por favor, selecione todos os campos necessários");
      return;
    }

    startTransition(async () => {
      try {
        const result = await createBooking(
          selectedBarber.id,
          selectedServices.map((s) => s[0]),
          selectedSlot.start,
          Intl.DateTimeFormat().resolvedOptions().timeZone
        );

        if (result.success) {
          alert("Agendamento criado com sucesso!");
          router.push("/client/dashboard?success=booked");
        }
      } catch (error) {
        console.error("Booking error:", error);
        alert(error instanceof Error ? error.message : "Erro ao criar agendamento");
      }
    });
  };

  return (
    <motion.div className="min-h-screen min-w-screen px-4 py-8">
      {!selectedBarber ? (
        <div>
          <h1 className="text-3xl font-bold text-center mb-8">
            Escolha seu Barbeiro
          </h1>
          <motion.div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 place-items-center max-w-6xl mx-auto">
            {barbers.map((barber, i) => {
              const isDisabled = disabledBarbers.includes(barber);
              return (
                <motion.div
                  key={barber.id}
                  className="flex flex-col items-center justify-center w-full"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className={`bg-slate-900 transition-all m-2 p-4 rounded-lg items-center justify-center w-full ${
                      isDisabled
                        ? "grayscale opacity-50 cursor-not-allowed"
                        : "hover:scale-105 hover:bg-slate-950"
                    }`}
                  >
                    <img
                      src={barberImages[i]}
                      alt={barber.displayName}
                      referrerPolicy="no-referrer"
                      className="h-64 w-full object-cover rounded-lg mx-auto"
                    />
                    <h2 className="font-bold text-2xl mt-3">
                      {barber.displayName}
                    </h2>
                    <p className="text-gray-300 text-sm">{barber.bio}</p>
                  </motion.div>
                  <motion.button
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    disabled={isDisabled}
                    className={`bg-sky-600 px-6 py-2 rounded-lg text-xl font-bold ${
                      !isDisabled
                        ? "hover:bg-sky-700 hover:scale-105"
                        : "grayscale opacity-50 cursor-not-allowed"
                    } transition-all`}
                    onClick={() => {
                      setSelectedBarber(barber);
                    }}
                  >
                    Escolher
                  </motion.button>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">
              Agendar com {selectedBarber.displayName}
            </h1>
            <button
              onClick={() => {
                setSelectedBarber(null);
                setSelectedDate(undefined);
                setSelectedSlot(null);
              }}
              className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg"
            >
              Voltar
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <Calendar02 
                barberId={selectedBarber.id} 
                onDateSelect={setSelectedDate}
              />
            </div>

            <div>
              <TimeSlotSelector
                barberId={selectedBarber.id}
                selectedDate={selectedDate}
                onSlotSelect={setSelectedSlot}
                selectedSlot={selectedSlot}
              />

              {selectedSlot && (
                <div className="mt-8 p-6 bg-slate-800 rounded-lg">
                  <h3 className="text-xl font-bold mb-4">Resumo do Agendamento</h3>
                  <div className="space-y-2 text-gray-300">
                    <p>
                      <strong>Barbeiro:</strong> {selectedBarber.displayName}
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
                      <strong>Serviços:</strong>
                    </p>
                    <ul className="list-disc list-inside ml-4">
                      {selectedServices?.map((service) => (
                        <li key={service[0]}>
                          {service[1]}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={handleBooking}
                    disabled={isPending}
                    className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-3 rounded-lg text-xl font-bold transition-all"
                  >
                    {isPending ? "Agendando..." : "Confirmar Agendamento"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}