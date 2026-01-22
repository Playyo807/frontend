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
import { Checkbox } from "@/components/ui/checkbox";
import { Ticket, AlertCircle, Banknote } from "lucide-react";
import { Separator } from "@radix-ui/react-separator";

interface TimeSlot {
  start: string;
  end: string;
  isAvailable: boolean;
  isPast: boolean;
  isBooked: boolean;
}

interface Coupon {
  id: string;
  discountPercent: number;
  createdAt: Date;
  expiresAt: Date | null;
}

export default function ClientPage({
  barbers,
  barberImages,
  disabledBarbers,
  availableCoupons,
  servicesPrices,
}: {
  barbers: BarberProfile[];
  barberImages: string[];
  disabledBarbers: BarberProfile[];
  availableCoupons: Coupon[];
  servicesPrices: number[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedServices = decodeBookingData(searchParams)?.selectedServices;

  const [selectedBarber, setSelectedBarber] = useState<BarberProfile | null>(
    null,
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [selectedCoupon, setSelectedCoupon] = useState<string | null>(null); // Add this
  const [isPending, startTransition] = useTransition();
  const totalPrice = servicesPrices.reduce((sum, price) => {
    return sum + price;
  }, 0);

  console.log(servicesPrices);

  if (!selectedServices) {
    alert(
      "Um erro ocorreu durante a seleção dos serviços, por favor, escolha os serviços novamente",
    );
    router.push("/client");
  }

  // Check if any service is eligible for discount (not LZ or PLA)
  const hasEligibleServices = selectedServices?.some((service) => {
    // You'll need to pass service keywords or check this properly
    // For now, assuming you have access to full service data
    return true; // Replace with actual check
  });

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

  // Calculate discount amount
  const calculateDiscount = () => {
    if (!selectedCoupon || !selectedServices) return 0;

    const coupon = availableCoupons.find((c) => c.id === selectedCoupon);
    if (!coupon) return 0;

    return Math.floor((totalPrice * coupon.discountPercent) / 100);
  };

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
          Intl.DateTimeFormat().resolvedOptions().timeZone,
          selectedCoupon || undefined, // Pass the coupon ID if selected
        );

        if (result.success) {
          alert("Agendamento criado com sucesso!");
          router.push("/client/dashboard?success=booked");
        }
      } catch (error) {
        console.error("Booking error:", error);
        alert(
          error instanceof Error ? error.message : "Erro ao criar agendamento",
        );
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
                setSelectedCoupon(null);
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
                <div className="mt-8 p-6 bg-slate-800 rounded-lg space-y-4">
                  <h3 className="text-xl font-bold mb-4">
                    Resumo do Agendamento
                  </h3>
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
                        <li key={service[0]}>{service[1]}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Coupon Selection */}
                  {availableCoupons.length > 0 && (
                    <div className="border-t border-slate-700 pt-4 mt-4">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Ticket className="text-emerald-500" size={20} />
                        Cupons Disponíveis
                      </h4>

                      <div className="space-y-3">
                        {availableCoupons.map((coupon) => (
                          <div
                            key={coupon.id}
                            className={`border rounded-lg p-3 cursor-pointer transition-all ${
                              selectedCoupon === coupon.id
                                ? "border-emerald-500 bg-emerald-500/10"
                                : "border-slate-600 hover:border-slate-500"
                            }`}
                            onClick={() => {
                              setSelectedCoupon(
                                selectedCoupon === coupon.id ? null : coupon.id,
                              );
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Checkbox
                                  checked={selectedCoupon === coupon.id}
                                  onCheckedChange={(checked: boolean) => {
                                    setSelectedCoupon(
                                      checked ? coupon.id : null,
                                    );
                                  }}
                                />
                                <div>
                                  <p className="font-bold text-emerald-400">
                                    {coupon.discountPercent}% de Desconto
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    Criado em{" "}
                                    {format(
                                      new Date(coupon.createdAt),
                                      "dd/MM/yyyy",
                                    )}
                                  </p>
                                </div>
                              </div>
                              {selectedCoupon === coupon.id && (
                                <div className="text-emerald-400 font-semibold">
                                  Aplicado!
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {selectedCoupon && (
                        <div className="mt-3 p-3 bg-emerald-500/20 border border-emerald-500/50 rounded-lg">
                          <p className="text-emerald-300 text-sm flex items-center gap-2">
                            <AlertCircle size={16} />
                            Cupom será usado neste agendamento
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="border-t border-slate-700 pt-4 mt-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Banknote className="text-emerald-500" size={20} />
                      Total:{" "}
                      {(handleDiscount(totalPrice) - calculateDiscount()).toLocaleString(
                        "pt-BR",
                        {
                          style: "currency",
                          currency: "BRL",
                        },
                      )}
                    </h4>
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
