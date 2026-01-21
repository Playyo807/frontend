"use client";

import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { PhoneNumberUtil } from "google-libphonenumber";
import "../css/PhoneInput.css";
import { useEffect, useState, useTransition } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Banknote,
  Calendar,
  CheckCircle2,
  ChevronDown,
  CircleCheck,
  CircleQuestionMark,
  CircleX,
  Clock3,
  LogOut,
  Mail,
  User,
  Phone,
  MapPin,
  X,
  Filter,
  Search,
  Scissors,
  AlertCircle,
  ClockAlert,
} from "lucide-react";
import { UserBookings } from "./page";
import { Separator } from "@radix-ui/react-separator";
import {
  AccordionContent,
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { cancelBooking } from "@/lib/bookingActions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Service } from "@/prisma/generated/prisma/client";

type BookingStatus = "ALL" | "CONFIRMED" | "PENDING" | "CANCELED";

export default function ClientPage({ bookings }: { bookings: UserBookings[] }) {
  const searchParams = useSearchParams();
  const phoneUtil = new PhoneNumberUtil();
  const { data: session, update } = useSession();
  const [phoneModal, setPhoneModal] = useState(false);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [alert, setAlert] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [userProfileOpen, setUserProfileOpen] = useState(false);

  const [barberProfileOpen, setBarberProfileOpen] = useState(false);
  const [selectedBarber, setSelectedBarber] = useState<
    UserBookings["barber"] | null
  >(null);

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<BookingStatus>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    //@ts-ignore
    if (session && !session.user?.phone) {
      setPhoneModal(true);
    }
  }, [session]);

  const success = searchParams.get("success");

  useEffect(() => {
    if (success === "booked") {
      toast.success("Horário agendado com sucesso!");
    }
  }, [success]);

  function handleDiscount(
    price: number,
    services: ({
      service: {
        name: string;
        id: string;
        price: number;
        duration: number;
        keyword: string;
        imagePath: string;
      };
    } & { bookingId: string; serviceId: string })[],
  ): number {
    let length = services.length == 0 ? 1 : services.length;
    services.map((s) => {
      if (s.service.keyword == "LZ") {
        length = length - 1;
      }
    });
    if (length < 1) length = 1;
    const discountRate = (length - 1) * 5;
    return price - discountRate;
  }

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

  const validatePhoneNumber = (number: string, iso2: string) => {
    try {
      const parsedNumber = phoneUtil.parse("+" + number, iso2.toUpperCase());
      const isValid = phoneUtil.isValidNumber(parsedNumber);
      if (!isValid) {
        setPhoneError("Número inválido para " + iso2.toUpperCase());
        setIsPhoneValid(false);
      } else {
        setPhoneError("");
        setIsPhoneValid(true);
      }
    } catch (err) {
      setPhoneError("Número inválido para " + iso2.toUpperCase());
      setIsPhoneValid(false);
    }
  };

  const handlePhoneChange = (value: string, country: any) => {
    setPhone(value);
    validatePhoneNumber(value, country.countryCode);
  };

  const handlePhoneSubmit = async () => {
    if (isPhoneValid) {
      update({
        phone: phone,
      });
      setPhoneModal(false);
      setAlert(true);
      const timeout = setTimeout(() => {
        setAlert(false);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  };

  const handleCancelBooking = (bookingId: string) => {
    setBookingToCancel(bookingId);
    setCancelDialogOpen(true);
  };

  const confirmCancelBooking = () => {
    if (!bookingToCancel) return;

    startTransition(async () => {
      try {
        await cancelBooking(bookingToCancel);
        toast.success("Agendamento cancelado com sucesso!");
        setCancelDialogOpen(false);
        setBookingToCancel(null);
        window.location.reload();
      } catch (error) {
        toast.error("Erro ao cancelar agendamento");
        console.error(error);
      }
    });
  };

  const handleBarberClick = (barber: UserBookings["barber"]) => {
    setSelectedBarber(barber);
    setBarberProfileOpen(true);
  };

  // Filter bookings
  const filteredBookings = bookings.filter((booking) => {
    const matchesStatus =
      statusFilter === "ALL" || booking.status === statusFilter;
    const matchesSearch =
      searchQuery === "" ||
      booking.barber.displayName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      booking.services.some((s) =>
        s.service.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-900">
      <AnimatePresence>
        {alert && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3, type: "spring", bounce: 0.3 }}
            className="fixed top-4 right-4 z-50 w-full max-w-md"
          >
            <Alert className="bg-emerald-500">
              <CheckCircle2 />
              <AlertTitle>Success! Autenticação completa!</AlertTitle>
              <AlertDescription className="text-gray-200">
                Conta criada com sucesso! Aproveite nossos serviços
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phone Input Dialog */}
      <Dialog open={phoneModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Coloque seu número de telefone</DialogTitle>
            <div className="bg-gray-800/30 rounded">
              <PhoneInput
                countryCodeEditable={false}
                country="br"
                value={phone}
                onChange={handlePhoneChange}
                containerStyle={{
                  border: "1px solid #6b7280",
                  borderRadius: "0.375rem",
                }}
                inputStyle={{
                  width: "100%",
                  opacity: 1,
                  background: "transparent",
                  border: "1px solid #374151",
                  color: "#fff",
                  paddingRight: "0.75rem",
                  paddingTop: "0.5rem",
                  paddingBottom: "0.5rem",
                }}
                buttonClass="custom-phone-button"
                dropdownStyle={{
                  backgroundColor: "#1f2937",
                  color: "#fff",
                  borderRadius: "0.375rem",
                }}
                searchStyle={{
                  backgroundColor: "#1f2937",
                  color: "#fff",
                  opacity: 0.3,
                }}
              />
              {phoneError && (
                <p className="text-red-400 text-sm mt-1">{phoneError}</p>
              )}
            </div>
            <div>
              <motion.button
                onClick={handlePhoneSubmit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="bg-sky-600 rounded-lg py-2 px-6 text-white cursor-pointer"
              >
                Confirmar
              </motion.button>
            </div>
            <DialogDescription>
              O número de telefone é necessário para concluir a criação da conta
              e permitir agendamentos.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* User Profile Dialog */}
      <Dialog open={userProfileOpen} onOpenChange={setUserProfileOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Meu Perfil</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-center">
              <img
                src={session?.user?.image ?? "http://example.com"}
                referrerPolicy="no-referrer"
                className="rounded-full h-24 w-24 border-4 border-sky-500"
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg">
                <User className="text-sky-500" size={20} />
                <div>
                  <p className="text-sm text-gray-400">Nome</p>
                  <p className="font-semibold">{session?.user?.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg">
                <Mail className="text-sky-500" size={20} />
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="font-semibold text-sm">
                    {session?.user?.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg">
                <Phone className="text-sky-500" size={20} />
                <div>
                  <p className="text-sm text-gray-400">Telefone</p>
                  <p className="font-semibold">
                    {/* @ts-expect-error */}
                    {session?.user?.phone || "Não informado"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Barber Profile Dialog */}
      <Dialog open={barberProfileOpen} onOpenChange={setBarberProfileOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Perfil do Barbeiro</DialogTitle>
          </DialogHeader>
          {selectedBarber && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <img
                  src={selectedBarber.user.image ?? "http://example.com"}
                  referrerPolicy="no-referrer"
                  className="rounded-full h-24 w-24 border-4 border-emerald-500"
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg">
                  <Scissors className="text-emerald-500" size={20} />
                  <div>
                    <p className="text-sm text-gray-400">Nome</p>
                    <p className="font-semibold">
                      {selectedBarber.displayName}
                    </p>
                  </div>
                </div>
                {selectedBarber.bio && (
                  <div className="flex items-start gap-3 p-3 bg-slate-800 rounded-lg">
                    <User className="text-emerald-500 mt-1" size={20} />
                    <div>
                      <p className="text-sm text-gray-400">Bio</p>
                      <p className="text-sm">{selectedBarber.bio}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg">
                  <Clock3 className="text-emerald-500" size={20} />
                  <div>
                    <p className="text-sm text-gray-400">Intervalo de tempo</p>
                    <p className="font-semibold">
                      {selectedBarber.timeInterval} minutos
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Cancel Booking Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cancelar Agendamento</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja cancelar este agendamento? Esta ação não
              pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
              disabled={isPending}
            >
              Não, voltar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmCancelBooking}
              disabled={isPending}
            >
              {isPending ? "Cancelando..." : "Sim, cancelar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <main className="font-poppins">
        {/* Header */}
        <header className="bg-black w-full p-4 flex flex-row align-middle justify-between sticky top-0 z-40">
          <div className="flex flex-row align-middle items-center gap-2">
            <button onClick={() => setUserProfileOpen(true)}>
              <img
                src={session?.user?.image ?? "http://example.com"}
                referrerPolicy="no-referrer"
                className="rounded-full h-10 w-10 md:h-12 md:w-12 hover:ring-2 hover:ring-sky-500 transition-all cursor-pointer"
              />
            </button>
            <h1 className="text-lg md:text-xl font-semibold hidden sm:block">
              {session?.user?.name}
            </h1>
          </div>
          <div className="flex flex-row align-middle items-center">
            <a
              className="flex flex-row align-middle items-center gap-2 hover:text-red-400 transition-colors"
              href="/api/auth/signout"
            >
              <span className="hidden sm:inline text-md">Sair</span>
              <LogOut size={20} />
            </a>
          </div>
        </header>

        <div className="container mx-auto px-4 py-6 md:py-8">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl text-white font-bold mb-6"
          >
            Seus agendamentos
          </motion.h1>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <Input
                placeholder="Buscar por barbeiro ou serviço..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-700"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter size={16} />
                  <span className="hidden sm:inline">Filtrar:</span>
                  {statusFilter === "ALL"
                    ? "Todos"
                    : statusFilter === "CONFIRMED"
                      ? "Confirmados"
                      : statusFilter === "PENDING"
                        ? "Pendentes"
                        : "Cancelados"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter("ALL")}>
                  Todos
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("CONFIRMED")}>
                  Confirmados
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("PENDING")}>
                  Pendentes
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("CANCELED")}>
                  Cancelados
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Bookings List */}
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="mx-auto text-gray-500 mb-4" size={48} />
              <p className="text-gray-400 text-lg">
                Nenhum agendamento encontrado
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => {
                const isPastBooking = new Date(booking.date) < new Date();
                const canCancel =
                  booking.status !== "CANCELED" && !isPastBooking;

                return (
                  <Accordion
                    key={booking.id}
                    type="single"
                    collapsible
                    className={`${booking.status == "CANCELED" || isPastBooking ? "opacity-60" : ""}`}
                  >
                    <AccordionItem value="item-1" className="border-none">
                      <div className="bg-slate-950 rounded-lg flex flex-col md:flex-row">
                        {/* Time Section */}
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
                                addMinutes(booking.date, booking.barber.timeInterval),
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
                              <Calendar className="mr-1" size={14} />
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
                              {handleDiscount(
                                booking.totalPrice,
                                booking.services,
                              ).toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              })}
                            </span>
                          </div>

                          {/* User/Barber Info - Mobile */}
                          <div className="flex md:hidden flex-wrap gap-3 pt-2">
                            <button
                              onClick={() => setUserProfileOpen(true)}
                              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                            >
                              <img
                                src={
                                  session?.user?.image ?? "http://example.com"
                                }
                                referrerPolicy="no-referrer"
                                className="rounded-full h-8 w-8"
                              />
                              <span className="font-semibold text-sm">
                                Você
                              </span>
                            </button>
                            <button
                              onClick={() => handleBarberClick(booking.barber)}
                              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                            >
                              <img
                                src={
                                  booking.barber.user.image ??
                                  "http://example.com"
                                }
                                referrerPolicy="no-referrer"
                                className="rounded-full h-8 w-8"
                              />
                              <span className="font-semibold text-sm">
                                {booking.barber.displayName}
                              </span>
                            </button>
                          </div>
                        </div>

                        {/* User/Barber Info - Desktop */}
                        <div className="hidden md:flex flex-col justify-center items-end p-4 gap-3 min-w-50">
                          <button
                            onClick={() => setUserProfileOpen(true)}
                            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                          >
                            <img
                              src={session?.user?.image ?? "http://example.com"}
                              referrerPolicy="no-referrer"
                              className="rounded-full h-10 w-10"
                            />
                            <span className="font-semibold">
                              {session?.user?.name}
                            </span>
                          </button>
                          <button
                            onClick={() => handleBarberClick(booking.barber)}
                            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                          >
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

                      <AccordionContent className="bg-slate-950 rounded-b-lg mx-2 md:mx-4 p-4 border-t border-slate-800">
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-semibold mb-2">Serviços:</h3>
                            <ul className="space-y-2">
                              {booking.services.map((service, idx) => (
                                <li
                                  key={idx}
                                  className="flex justify-between items-center bg-slate-900 p-2 rounded"
                                >
                                  <span>{service.service.name}</span>
                                  <div className="flex gap-3 text-sm text-gray-400">
                                    <span>{service.service.duration} min</span>
                                    <span>R$ {service.service.price}</span>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {canCancel && (
                            <div className="flex justify-end pt-2">
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleCancelBooking(booking.id)}
                                disabled={isPending}
                              >
                                Cancelar Agendamento
                              </Button>
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
      </main>
    </div>
  );
}
