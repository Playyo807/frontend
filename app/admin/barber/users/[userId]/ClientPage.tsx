"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Trophy,
  Edit,
  Plus,
  Minus,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { adjustUserPoints } from "@/lib/pointManagementActions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import BookingEditDialog from "@/components/custom/bookingEditDialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Service } from "@/prisma/generated/prisma/client";
import * as types from "@/lib/types"

export default function UserDetailClient({
  user,
  barberId,
  services,
}: {
  user: types.bookings_;
  barberId: string;
  services: Service[];
}) {
  const router: AppRouterInstance = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pointsDialogOpen, setPointsDialogOpen] = useState<boolean>(false);
  const [pointsAmount, setPointsAmount] = useState<string>("");
  const [pointsReason, setPointsReason] = useState<string>("");
  const [filter, setFilter] = useState<string>("ALL");
  const [bookings, setBookings] = useState<types.bookings_['bookings']>();

  useEffect(() => {
    setBookings(
      user.bookings.filter((b) => {
        const isPast = b.date < new Date();
        if (filter == "ALL") return true;
        if (filter == "PAST" && isPast) return true;
        if (!isPast) {
          return b.status == filter;
        }
      }),
    );
  }, [filter]);

  const handleAdjustPoints = () => {
    const points = parseInt(pointsAmount);
    if (isNaN(points) || points === 0) {
      toast.error("Insira um valor válido");
      return;
    }

    if (!pointsReason.trim()) {
      toast.error("Insira um motivo");
      return;
    }

    startTransition(async () => {
      try {
        await adjustUserPoints(user.id, barberId, points, pointsReason);
        toast.success("Pontos ajustados com sucesso!");
        setPointsDialogOpen(false);
        setPointsAmount("");
        setPointsReason("");
        router.refresh();
      } catch (error) {
        toast.error("Erro ao ajustar pontos");
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/barber">
            <Button variant="ghost" size="icon">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">Perfil do Cliente</h1>
          </div>
        </div>

        {/* User Info */}
        <div className="bg-slate-800 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-4">
            <img
              src={user.image || ""}
              alt={user.name || "User"}
              className="h-20 w-20 rounded-full"
            />
            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-gray-400">{user.email}</p>
              <p className="text-gray-400">{user.phone}</p>
            </div>
          </div>
        </div>

        {/* Points System */}
        {user.pointSystem && (
          <div className="bg-slate-800 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Trophy className="text-amber-500" size={24} />
                Sistema de Pontos
              </h3>
              <Dialog
                open={pointsDialogOpen}
                onOpenChange={setPointsDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Edit size={16} className="mr-2" />
                    Ajustar Pontos
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Ajustar Pontos</DialogTitle>
                    <DialogDescription>
                      Adicione ou remova pontos do cliente
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Quantidade de Pontos</Label>
                      <div className="flex gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            setPointsAmount((prev) =>
                              prev === "" ? "-5" : String(parseInt(prev) - 5),
                            )
                          }
                        >
                          <Minus size={16} />
                        </Button>
                        <Input
                          type="number"
                          value={pointsAmount}
                          onChange={(e) => setPointsAmount(e.target.value)}
                          placeholder="Ex: 50 ou -50"
                          className="text-center"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            setPointsAmount((prev) =>
                              prev === "" ? "5" : String(parseInt(prev) + 5),
                            )
                          }
                        >
                          <Plus size={16} />
                        </Button>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Use valores negativos para remover pontos
                      </p>
                    </div>
                    <div>
                      <Label>Motivo</Label>
                      <Textarea
                        value={pointsReason}
                        onChange={(e) => setPointsReason(e.target.value)}
                        placeholder="Ex: Compensação por problema no serviço"
                        className="mt-2"
                      />
                    </div>
                    <Button
                      onClick={handleAdjustPoints}
                      disabled={isPending}
                      className="w-full"
                    >
                      {isPending ? "Ajustando..." : "Confirmar Ajuste"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-900 rounded-lg p-4 text-center">
                <p className="text-gray-400 text-sm">Pontos Atuais</p>
                <p className="text-3xl font-bold text-amber-500">
                  {user.pointSystem.currentPoints}
                </p>
              </div>
              <div className="bg-slate-900 rounded-lg p-4 text-center">
                <p className="text-gray-400 text-sm">Cupons Disponíveis</p>
                <p className="text-3xl font-bold text-emerald-500">
                  {
                    user.pointSystem.coupons.filter((c: any) => !c.isUsed)
                      .length
                  }
                </p>
              </div>
            </div>

            {/* Recent Transactions */}
            <div>
              <h4 className="font-semibold mb-3">Transações Recentes</h4>
              <div className="space-y-2">
                {user.pointSystem.pointTransactions
                  .slice(0, 5)
                  .map((transaction: any) => (
                    <div
                      key={transaction.id}
                      className="bg-slate-900 rounded p-3 flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm">{transaction.description}</p>
                        <p className="text-xs text-gray-400">
                          {format(
                            new Date(transaction.createdAt),
                            "dd/MM/yyyy 'às' HH:mm",
                            { locale: ptBR },
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-bold ${
                            transaction.points > 0
                              ? "text-emerald-500"
                              : "text-red-500"
                          }`}
                        >
                          {transaction.points > 0 ? "+" : ""}
                          {transaction.points}
                        </p>
                        <p className="text-xs text-gray-400">
                          {transaction.status == "REJECTED"
                            ? "Rejeitado"
                            : transaction.status == "PENDING"
                              ? "Pendente"
                              : "Confirmado"}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Bookings */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4 flex justify-between items-center gap-2">
            <span className="flex items-center gap-2">
              <Calendar className="text-sky-500" size={24} />
              Agendamentos
            </span>
            <div>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="mt-2">
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
          </h3>
          {!bookings || user.bookings.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              Nenhum agendamento encontrado
            </p>
          ) : (
            <div className="space-y-3">
              {bookings.map((booking: any) => (
                <BookingEditDialog
                  key={booking.id}
                  booking={booking}
                  barberId={barberId}
                  services={services}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
