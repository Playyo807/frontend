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
  ArrowLeft,
  Trophy,
  BookOpen,
  UserCircle,
  Ticket,
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
import Link from "next/link";
import { createPointSystem, redeemPointsForCoupon } from "@/lib/pointActions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type BookingStatus = "ALL" | "CONFIRMED" | "PENDING" | "CANCELED" | "PAST";
type TabType = "profile" | "bookings" | "points";

export default function ClientPage({
  bookings,
  pointSystem,
  availableCoupons,
}: {
  bookings: UserBookings[];
  pointSystem: any;
  availableCoupons: any[];
}) {
  const searchParams = useSearchParams();
  const phoneUtil = new PhoneNumberUtil();
  const { data: session, update } = useSession();
  const [phoneModal, setPhoneModal] = useState(false);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [alert, setAlert] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [activeTab, setActiveTab] = useState<TabType>("bookings");

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
    const isPast = booking.date < new Date();
    const matchesStatus =
      statusFilter === "ALL" ||
      (booking.status === statusFilter && !isPast) ||
      (statusFilter === "PAST" && isPast);
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
            <Link href="/client">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-slate-800"
              >
                <ArrowLeft size={20} />
              </Button>
            </Link>
            <img
              src={session?.user?.image ?? "http://example.com"}
              referrerPolicy="no-referrer"
              className="rounded-full h-10 w-10 md:h-12 md:w-12"
            />
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
            Minha Conta
          </motion.h1>
          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6 border-b border-slate-800">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-all ${
                activeTab === "profile"
                  ? "text-sky-500 border-b-2 border-sky-500"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              <UserCircle size={20} />
              <span className="hidden sm:inline">Perfil</span>
            </button>
            <button
              onClick={() => setActiveTab("bookings")}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-all ${
                activeTab === "bookings"
                  ? "text-sky-500 border-b-2 border-sky-500"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              <BookOpen size={20} />
              <span className="hidden sm:inline">Agendamentos</span>
            </button>
            <button
              onClick={() => setActiveTab("points")}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-all ${
                activeTab === "points"
                  ? "text-sky-500 border-b-2 border-sky-500"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              <Trophy size={20} />
              <span className="hidden sm:inline">Pontos</span>
            </button>
          </div>
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex justify-center">
                <img
                  src={session?.user?.image ?? "http://example.com"}
                  referrerPolicy="no-referrer"
                  className="rounded-full h-32 w-32 border-4 border-sky-500"
                />
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-slate-800 rounded-lg">
                  <User className="text-sky-500" size={24} />
                  <div>
                    <p className="text-sm text-gray-400">Nome</p>
                    <p className="font-semibold text-lg">
                      {session?.user?.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-slate-800 rounded-lg">
                  <Mail className="text-sky-500" size={24} />
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="font-semibold break-all">
                      {session?.user?.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-slate-800 rounded-lg">
                  <Phone className="text-sky-500" size={24} />
                  <div>
                    <p className="text-sm text-gray-400">Telefone</p>
                    <p className="font-semibold">
                      {/* @ts-expect-error */}
                      {session?.user?.phone || "Não informado"}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          {/* Bookings Tab */}
          {activeTab === "bookings" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
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
                <Select
                  value={statusFilter}
                  onValueChange={(v: BookingStatus) => {
                    setStatusFilter(v);
                  }}
                >
                  <SelectTrigger>
                    <Filter /> <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todos</SelectItem>
                    <SelectItem value="CONFIRMED">Confirmado</SelectItem>
                    <SelectItem value="PENDING">Pendente</SelectItem>
                    <SelectItem value="CANCELED">Cancelado</SelectItem>
                    <SelectItem value="PAST">Passou</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Bookings List */}
              {filteredBookings.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle
                    className="mx-auto text-gray-500 mb-4"
                    size={48}
                  />
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
                                {booking.coupon && (
                                  <span className="bg-linear-to-r from-purple-500/80 to-pink-500/80 flex flex-row w-fit px-2 py-1 rounded-md items-center text-purple-100 text-xs md:text-sm border border-purple-300/30">
                                    <Ticket className="mr-1" size={14} />
                                    {booking.coupon.discountPercent}% OFF
                                  </span>
                                )}
                              </div>

                              {/* User/Barber Info - Mobile */}
                              <div className="flex md:hidden flex-wrap gap-3 pt-2">
                                <div className="flex items-center gap-2">
                                  <img
                                    src={
                                      session?.user?.image ??
                                      "http://example.com"
                                    }
                                    referrerPolicy="no-referrer"
                                    className="rounded-full h-8 w-8"
                                  />
                                  <span className="font-semibold text-sm">
                                    Você
                                  </span>
                                </div>
                                <button
                                  onClick={() =>
                                    handleBarberClick(booking.barber)
                                  }
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
                              <div className="flex items-center gap-2">
                                <img
                                  src={
                                    session?.user?.image ?? "http://example.com"
                                  }
                                  referrerPolicy="no-referrer"
                                  className="rounded-full h-10 w-10"
                                />
                                <span className="font-semibold">
                                  {session?.user?.name}
                                </span>
                              </div>
                              <button
                                onClick={() =>
                                  handleBarberClick(booking.barber)
                                }
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

                              {canCancel && (
                                <div className="flex justify-end pt-2">
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() =>
                                      handleCancelBooking(booking.id)
                                    }
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
            </motion.div>
          )}
          {/* Points Tab */}
          {activeTab === "points" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {!pointSystem ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-6">
                  <div className="bg-slate-800/50 rounded-full p-8">
                    <Trophy size={80} className="text-amber-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-300">
                    Sistema de Pontos
                  </h2>
                  <p className="text-gray-400 text-center max-w-md">
                    Ative o sistema de pontos e ganhe recompensas a cada visita!
                  </p>
                  <Button
                    onClick={async () => {
                      try {
                        await createPointSystem();
                        toast.success("Sistema de pontos ativado!");
                        window.location.reload();
                      } catch (error) {
                        toast.error("Erro ao ativar sistema de pontos");
                      }
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    Ativar Sistema de Pontos
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Points Progress */}
                  <div className="bg-slate-800 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold">Seus Pontos</h3>
                      <div className="bg-amber-500/20 rounded-full px-4 py-2">
                        <span className="text-2xl font-bold text-amber-500">
                          {pointSystem.currentPoints}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>Progresso para próximo cupom</span>
                        <span>
                          {pointSystem.currentPoints} /{" "}
                          {pointSystem.pointsNeededForReward}
                        </span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-3">
                        <div
                          className="bg-linear-to-r from-amber-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(
                              (pointSystem.currentPoints /
                                pointSystem.pointsNeededForReward) *
                                100,
                              100,
                            )}%`,
                          }}
                        />
                      </div>
                      <p className="text-sm text-gray-400">
                        Faltam{" "}
                        {Math.max(
                          0,
                          pointSystem.pointsNeededForReward -
                            pointSystem.currentPoints,
                        )}{" "}
                        pontos para ganhar um cupom de{" "}
                        {pointSystem.discountPercentage}% de desconto!
                      </p>
                    </div>
                  </div>
                  {/* In the Points Tab - Add this after the progress bar */}
                  {pointSystem.currentPoints >=
                    pointSystem.pointsNeededForReward && (
                    <Button
                      onClick={async () => {
                        startTransition(async () => {
                          try {
                            await redeemPointsForCoupon();
                            toast.success("Cupom resgatado com sucesso!");
                            window.location.reload();
                          } catch (error) {
                            toast.error(
                              error instanceof Error
                                ? error.message
                                : "Erro ao resgatar cupom",
                            );
                          }
                        });
                      }}
                      disabled={isPending}
                      className="w-full bg-linear-to-r from-amber-500 to-emerald-500 hover:from-amber-600 hover:to-emerald-600"
                    >
                      <Trophy className="mr-2" size={20} />
                      {isPending ? "Resgatando..." : "Resgatar Cupom Agora!"}
                    </Button>
                  )}
                  {availableCoupons.length > 0 && (
                    <div className="bg-slate-800 rounded-lg p-6">
                      <h3 className="text-xl font-bold mb-4">
                        Cupons Disponíveis
                      </h3>
                      <div className="grid gap-3">
                        {availableCoupons.map((coupon) => (
                          <div
                            key={coupon.id}
                            className="bg-linear-to-r from-emerald-600 to-emerald-700 rounded-lg p-4 flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <div className="bg-white/20 rounded-full p-2">
                                <Trophy className="text-white" size={24} />
                              </div>
                              <div>
                                <p className="font-bold text-white text-lg">
                                  {coupon.discountPercent}% OFF
                                </p>
                                <p className="text-emerald-100 text-sm">
                                  Use em seu próximo agendamento
                                </p>
                              </div>
                            </div>
                            <CheckCircle2 className="text-white" size={24} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="bg-slate-800 rounded-lg p-6">
                    <h3 className="font-semibold mb-4">Como Funciona</h3>
                    <ul className="space-y-3 text-gray-300">
                      <li className="flex items-center gap-3">
                        <CheckCircle2 className="text-emerald-500" size={20} />
                        <span>
                          Ganhe pontos de acordo com o valor total do(s)
                          serviço(s)
                        </span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle2 className="text-emerald-500" size={20} />
                        <span>
                          Acumule {pointSystem.pointsNeededForReward} pontos
                          para ganhar um cupom
                        </span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle2 className="text-emerald-500" size={20} />
                        <span>
                          Cupons dão {pointSystem.discountPercentage}% de
                          desconto
                        </span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle2 className="text-emerald-500" size={20} />
                        <span className="flex flex-col justify-baseline items-start">
                          <span>Use cupons em qualquer agendamento* </span>
                          <span className="text-xs text-gray-400">Exceto no serviço de luzes e platinado</span>
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </motion.div>
          )}{" "}
        </div>
      </main>
    </div>
  );
}
