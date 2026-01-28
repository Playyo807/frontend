"use client";

import { startOfDay } from "date-fns";
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import {
  Banknote,
  ChevronDown,
  CircleCheck,
  CircleQuestionMark,
  CircleX,
  Clock3,
  ClockAlert,
  Package,
  Ticket,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Prisma } from "@/prisma/generated/prisma/client";
import { getAllBookings } from "@/lib/serverActions";

type bookingData__ = Prisma.BookingGetPayload<{
  include: {
    user: true;
    barber: {
      include: {
        user: true;
      };
    };
    plan: { include: { plan: true } };
    coupon: true;
    services: {
      include: {
        service: true;
      };
    };
  };
}>;

const statusPriority = {
  ["CONFIRMED"]: 1,
  ["PENDING"]: 2,
  ["CANCELED"]: 3,
};

export default function BarberBookingViewer() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [bookings, setBookings] = useState<bookingData__[] | null>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (selectedDate) {
      fetchData();
    }
  }, [selectedDate]);

  async function fetchData() {
    if (!selectedDate) return;

    setLoading(true);
    try {
      const bookings: bookingData__[] = await getAllBookings();
      bookings.sort(
        (a, b) => statusPriority[a.status] - statusPriority[b.status],
      );
      setBookings(bookings);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Erro ao carregar horários");
    } finally {
      setLoading(false);
    }
  }

  const handlePlanBgColor = (booking: bookingData__) => {
    if (!booking || !booking.plan || !booking.plan.plan) return;
    return booking.plan.plan.keyword === "BRO"
      ? "from-amber-600 to-lime-700"
      : booking.plan.plan.keyword === "PLA"
        ? "from-gray-600 to-gray-800"
        : booking.plan.plan.keyword == "OUR"
          ? "from-amber-500 to-amber-900"
          : booking.plan.plan.keyword === "DIA"
            ? "from-black to-blue-600"
            : "from-black to-black";
  };

  const handlePlanTextColor = (booking: bookingData__) => {
    if (!booking || !booking.plan || !booking.plan.plan) return;
    return booking.plan.plan.keyword === "BRO"
      ? "text-white/80"
      : booking.plan.plan.keyword === "PLA"
        ? "text-white/80"
        : booking.plan.plan.keyword == "OUR"
          ? "text-white/80"
          : booking.plan.plan.keyword === "DIA"
            ? "text-white/80"
            : "text-white/80";
  };

  function formatTime12Hour(date: Date): string {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  }

  function addMinutes(date: Date, minutes: number): Date {
    const newDate = new Date(date);
    newDate.setMinutes(date.getMinutes() + minutes);
    return newDate;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Visualizar horários marcados</h1>

      <div className="gap-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Selecionar Data</h2>
            <Calendar
              mode="single"
              selected={selectedDate}
              className="rounded-lg border shadow-sm mx-auto md:[--cell-size:--spacing(12)]"
              onSelect={setSelectedDate}
              disabled={(date) => date < startOfDay(new Date())}
            />
          </div>

          {selectedDate && (
            <div className="p-4 bg-slate-800 rounded-lg space-y-1">
              <p className="text-sm text-gray-400">
                Veja os horários abaixo com seus respectivos clientes
              </p>
              {loading
                ? "Carregando..."
                : bookings?.map((booking) => {
                    const isPastBooking = new Date(booking.date) < new Date();
                    return (
                      <Accordion
                        key={booking.id}
                        type="single"
                        collapsible
                        className={`${booking.status == "CANCELED" || isPastBooking ? "opacity-60" : ""}`}
                      >
                        <AccordionItem value="item-1" className="border-none">
                          <div className="bg-slate-950 rounded-lg flex flex-col md:flex-row">
                            <div className="flex flex-row p-4 gap-3 items-center border-b md:border-b-0 md:border-r border-slate-800">
                              <AccordionTrigger className="hover:no-underline hover:scale-110 transition-all [&[data-state=open]>svg]:rotate-180">
                                <ChevronDown className="transition-transform duration-200" />
                              </AccordionTrigger>
                              <div className="flex flex-col">
                                <span className="font-bold text-lg">
                                  {formatTime12Hour(booking.date)}
                                </span>
                                <span className="text-gray-400 text-sm">
                                  {formatTime12Hour(
                                    addMinutes(
                                      booking.date,
                                      booking.barber.timeInterval,
                                    ),
                                  )}
                                </span>
                              </div>
                            </div>
                            <Separator
                              orientation="vertical"
                              className="hidden md:block bg-sky-600 w-1 my-3 rounded-full"
                            />
                            {/* Main Info */}
                            <div className="flex-1 p-4 space-y-3">
                              <div className="flex flex-wrap items-center gap-2">
                                <h2 className="font-semibold text-base md:text-lg">
                                  {booking.services
                                    .map((service) => service.service.name)
                                    .join(", ")}
                                </h2>
                                <span className="bg-sky-500/80 flex flex-row w-fit px-2 py-1 rounded-md items-center text-sky-200 text-xs md:text-sm">
                                  {booking.date.toLocaleDateString("pt-BR", {
                                    month: "2-digit",
                                    day: "2-digit",
                                    year: "numeric",
                                  })}
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <span
                                  className={`${
                                    isPastBooking
                                      ? "bg-gray-600/80"
                                      : booking.status == "CONFIRMED"
                                        ? "bg-emerald-500/80 text-emerald-200"
                                        : booking.status == "PENDING"
                                          ? "bg-amber-500/80 text-amber-200"
                                          : "bg-red-500/80 text-red-200"
                                  } flex flex-row w-fit px-2 py-1 rounded-md items-center text-xs md:text-sm`}
                                >
                                  {isPastBooking ? (
                                    <ClockAlert size={14} className="mr-1" />
                                  ) : booking.status == "CONFIRMED" ? (
                                    <CircleCheck size={14} className="mr-1" />
                                  ) : booking.status == "PENDING" ? (
                                    <CircleQuestionMark
                                      size={14}
                                      className="mr-1"
                                    />
                                  ) : (
                                    <CircleX size={14} className="mr-1" />
                                  )}
                                  {isPastBooking
                                    ? "Passou"
                                    : booking.status == "CONFIRMED"
                                      ? "Confirmado"
                                      : booking.status == "PENDING"
                                        ? "Aguardando"
                                        : "Cancelado"}
                                </span>
                                <span className="bg-rose-500/80 flex flex-row w-fit px-2 py-1 rounded-md items-center text-rose-200 text-xs md:text-sm">
                                  <Clock3 className="mr-1" size={14} />
                                  {booking.totalDuration > 40
                                    ? 40
                                    : booking.totalDuration}{" "}
                                  min
                                </span>
                                <span className="bg-emerald-500/80 flex flex-row w-fit px-2 py-1 rounded-md items-center text-emerald-200 text-xs md:text-sm">
                                  <Banknote className="mr-1" size={14} />
                                  {booking.totalPrice.toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                  })}
                                </span>
                                {booking.coupon && (
                                  <span className="bg-linear-to-r from-purple-500/80 to-pink-500/80 flex flex-row w-fit px-2 py-1 rounded-md items-center text-purple-100 text-xs md:text-sm border border-purple-300/30">
                                    <Ticket className="mr-1" size={14} />
                                    {booking.coupon.discountPercent}% OFF
                                  </span>
                                )}
                                {booking.plan && (
                                  <span
                                    className={`bg-linear-to-r ${handlePlanBgColor(booking)} ${handlePlanTextColor(booking)} px-2 py-1 rounded text-xs flex items-center gap-1`}
                                  >
                                    <Package size={12} />
                                    Plano
                                  </span>
                                )}
                              </div>
                              {/* User/Barber Info - Mobile */}
                              <div className="flex md:hidden flex-wrap gap-3 pt-2">
                                <div className="flex items-center gap-2">
                                  <img
                                    src={
                                      booking.user.image ?? "http://example.com"
                                    }
                                    referrerPolicy="no-referrer"
                                    className="rounded-full h-8 w-8"
                                  />
                                  <span className="font-semibold text-sm">
                                    {booking.user.name}
                                  </span>
                                </div>
                                <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                                  <img
                                    src={
                                      booking.barber.user.image ??
                                      "http://example.com"
                                    }
                                    referrerPolicy="no-referrer"
                                    className="rounded-full h-8 w-8"
                                  />
                                  <span className="font-semibold text-sm">
                                    Você
                                  </span>
                                </button>
                              </div>
                            </div>
                            {/* User/Barber Info - Desktop */}
                            <div className="hidden md:flex flex-col justify-center items-end p-4 gap-3 min-w-50">
                              <div className="flex items-center gap-2">
                                <img
                                  src={booking.user.image || ""}
                                  referrerPolicy="no-referrer"
                                  className="rounded-full h-10 w-10"
                                />
                                <span className="font-semibold">
                                  {booking.user.name}
                                </span>
                              </div>
                              <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                                <img
                                  src={
                                    booking.barber.user.image ??
                                    "http://example.com"
                                  }
                                  referrerPolicy="no-referrer"
                                  className="rounded-full h-10 w-10"
                                />
                                <span className="font-semibold">
                                  {booking.barber.displayName}
                                </span>
                              </button>
                            </div>
                          </div>
                          <AccordionContent className="bg-slate-950 rounded-b-lg mx-0 md:mx-4 p-4 border-t border-slate-800">
                            <div className="space-y-4">
                              <div>
                                <h3 className="font-semibold mb-2">
                                  Serviços:
                                </h3>
                                <ul className="space-y-2">
                                  {booking.services.map((service, idx) => (
                                    <li
                                      key={idx}
                                      className="flex justify-between items-center bg-slate-900 p-2 rounded"
                                    >
                                      <span>{service.service.name}</span>
                                      <div className="flex gap-3 text-sm text-gray-400">
                                        <span>
                                          {service.service.duration} min
                                        </span>
                                        <span>R$ {service.service.price}</span>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              {booking.coupon && (
                                <div className="bg-linear-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-lg p-4">
                                  <div className="flex items-start gap-3">
                                    <div className="bg-purple-500/20 rounded-full p-2">
                                      <Ticket
                                        className="text-purple-300"
                                        size={20}
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <h4 className="font-semibold text-purple-200 mb-1">
                                        Cupom Aplicado
                                      </h4>
                                      <p className="text-sm text-gray-300">
                                        Desconto de{" "}
                                        <span className="font-bold text-purple-300">
                                          {booking.coupon.discountPercent}%
                                        </span>{" "}
                                        aplicado neste agendamento
                                      </p>
                                      <p className="text-xs text-gray-400 mt-1">
                                        Usado em{" "}
                                        {new Date(
                                          booking.coupon.usedAt ||
                                            booking.createdAt,
                                        ).toLocaleDateString("pt-BR")}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-xs text-gray-400">
                                        Economia
                                      </p>
                                      <p className="text-lg font-bold text-emerald-400">
                                        {/* Calculate the discount amount */}
                                        {(() => {
                                          const originalPrice =
                                            booking.services.reduce(
                                              (sum, s) => {
                                                if (
                                                  s.service.keyword !== "LZ" &&
                                                  s.service.keyword !== "PLA"
                                                ) {
                                                  return sum + s.service.price;
                                                }
                                                return sum;
                                              },
                                              0,
                                            );
                                          const discount = Math.floor(
                                            (originalPrice *
                                              booking.coupon.discountPercent) /
                                              100,
                                          );
                                          return discount.toLocaleString(
                                            "pt-BR",
                                            {
                                              style: "currency",
                                              currency: "BRL",
                                            },
                                          );
                                        })()}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}
                              {booking.plan && (
                                <div
                                  className={
                                    "bg-linear-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-lg p-4"
                                  }
                                >
                                  <div className="flex items-start">
                                    <div className="bg-purple-500/20 rounded-full p-2">
                                      <Package
                                        className={`${booking.plan.plan.keyword.match}`}
                                        size={20}
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <h4 className="font-semibold text-purple-200 mb-1">
                                        {booking.plan.plan.name} Aplicado
                                      </h4>
                                      <p className="text-xs text-gray-400 mt-1">
                                        Usado em{" "}
                                        {new Date(
                                          booking.createdAt,
                                        ).toLocaleDateString("pt-BR")}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-xs text-gray-400">
                                        Economia
                                      </p>
                                      <p className="text-lg font-bold text-emerald-400">
                                        {(() => {
                                          let ogPrice: number = 0;
                                          booking.services.map(
                                            (s) => (ogPrice += s.service.price),
                                          );
                                          return ogPrice - booking.totalPrice;
                                        })().toLocaleString("pt-BR", {
                                          style: "currency",
                                          currency: "BRL",
                                        })}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    );
                  })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
