"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  Check,
  X,
  Trophy,
  Calendar,
  AlertCircle,
  CheckCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  getBarberNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
  checkPendingPointsNotifications,
} from "@/lib/notificationActions";
import {
  confirmBookingPoints,
  rejectBookingPoints,
} from "@/lib/pointManagementActions";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Prisma } from "@/prisma/generated/prisma/client";

export type Notification = Prisma.NotificationGetPayload<{
  include: {
    user: {
      select: { id: true; name: true; image: true };
    };
    booking: {
      select: { id: true; date: true; totalPrice: true };
    };
    coupon: {
      select: { id: true; discountPercent: true };
    };
    transaction: {
      select: { id: true; points: true; status: true };
    };
  };
}>;

export default function NotificationCenterPopover({
  barberId,
}: {
  barberId: string;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    loadNotifications();
    loadUnreadCount();
    checkPendingPointsNotifications(barberId).catch(console.error);

    const interval = setInterval(() => {
      loadNotifications();
      loadUnreadCount();
      checkPendingPointsNotifications(barberId).catch(console.error);
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [barberId]);

  const loadNotifications = async () => {
    try {
      const { notifications: data } = await getBarberNotifications(barberId);
      setNotifications(data);
    } catch (error) {
      console.error("Error loading notifications:", error);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const { count } = await getUnreadCount(barberId);
      setUnreadCount(count);
    } catch (error) {
      console.error("Error loading unread count:", error);
    }
  };

  const handleMarkRead = async (notificationId: string) => {
    try {
      await markNotificationRead(notificationId);
      setNotifications(
        notifications.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (error) {
      toast.error("Erro ao marcar como lida");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead(barberId);
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
      toast.success("Todas marcadas como lidas");
    } catch (error) {
      toast.error("Erro ao marcar todas como lidas");
    }
  };

  const handleConfirmPoints = async (
    bookingId: string,
    notificationId: string
  ) => {
    setLoading(notificationId);
    try {
      const result = await confirmBookingPoints(bookingId, barberId);
      toast.success(`${result.pointsAdded} pontos confirmados!`);
      await handleMarkRead(notificationId);
      await loadNotifications();
    } catch (error) {
      toast.error("Erro ao confirmar pontos");
    } finally {
      setLoading(null);
    }
  };

  const handleRejectPoints = async (
    bookingId: string,
    notificationId: string
  ) => {
    setLoading(notificationId);
    try {
      await rejectBookingPoints(bookingId, barberId, "Rejeitado pelo barbeiro");
      toast.success("Pontos rejeitados");
      await handleMarkRead(notificationId);
      await loadNotifications();
    } catch (error) {
      toast.error("Erro ao rejeitar pontos");
    } finally {
      setLoading(null);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "COUPON_REDEEMED":
        return <Trophy className="text-purple-400 shrink-0" size={18} />;
      case "POINTS_PENDING":
      case "POINTS_CONFIRMED":
      case "POINTS_REJECTED":
        return <Trophy className="text-amber-400 shrink-0" size={18} />;
      case "BOOKING_CREATED":
      case "BOOKING_EDITED":
      case "BOOKING_CANCELLED":
        return <Calendar className="text-sky-400 shrink-0" size={18} />;
      default:
        return <AlertCircle className="text-gray-400 shrink-0" size={18} />;
    }
  };

  const getNotificationMessage = (notification: Notification) => {
    const userName = notification.user?.name || "Um cliente";
    
    switch (notification.type) {
      case "POINTS_PENDING":
        return `${userName} completou um agendamento. Confirme os pontos.`;
      case "POINTS_CONFIRMED":
        return `Pontos de ${userName} foram confirmados.`;
      case "POINTS_REJECTED":
        return `Pontos de ${userName} foram rejeitados.`;
      case "COUPON_REDEEMED":
        return `${userName} resgatou um cupom de ${notification.coupon?.discountPercent}%.`;
      case "BOOKING_CREATED":
        return `Novo agendamento de ${userName}.`;
      case "BOOKING_EDITED":
        return `Agendamento de ${userName} foi editado.`;
      case "BOOKING_CANCELLED":
        return `${userName} cancelou um agendamento.`;
      default:
        return notification.message;
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-slate-800"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[90vw] sm:w-96 p-0" align="end">
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Notificações</h3>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllRead}
                className="h-8 text-xs"
              >
                <CheckCheck size={14} className="mr-1" />
                Marcar todas
              </Button>
            )}
          </div>
        </div>

        <ScrollArea className="h-[60vh] sm:h-96">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-gray-400">
              <Bell size={40} className="mb-3 opacity-50" />
              <p className="text-sm text-center">Nenhuma notificação</p>
            </div>
          ) : (
            <div className="">
              {notifications.map((notification, index) => (
                <div
                  key={notification.id}
                  className={`p-3 m-2 transition-colors rounded-lg ${
                    notification.read
                      ? "bg-slate-950"
                      : "bg-slate-800 hover:bg-slate-800/80"
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-sm font-medium leading-tight">
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 shrink-0"
                            onClick={() => handleMarkRead(notification.id)}
                          >
                            <Check size={12} />
                          </Button>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        {getNotificationMessage(notification)}
                      </p>
                      {notification.user && (
                        <div className="flex items-center gap-2 mt-2">
                          <img
                            src={notification.user.image || ""}
                            alt={notification.user.name || "User"}
                            className="h-5 w-5 rounded-full"
                          />
                          <span className="text-xs text-gray-500">
                            {notification.user.name}
                          </span>
                        </div>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </p>

                      {/* Points Confirmation Actions */}
                      {notification.type === "POINTS_PENDING" &&
                        !notification.read &&
                        notification.booking && (
                          <div className="flex gap-2 mt-3">
                            <Button
                              size="sm"
                              className="flex-1 h-8 text-xs"
                              onClick={() =>
                                handleConfirmPoints(
                                  notification.booking!.id,
                                  notification.id
                                )
                              }
                              disabled={loading === notification.id}
                            >
                              {loading === notification.id ? (
                                "..."
                              ) : (
                                <>
                                  <Check size={12} className="mr-1" />
                                  Confirmar
                                </>
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="flex-1 h-8 text-xs"
                              onClick={() =>
                                handleRejectPoints(
                                  notification.booking!.id,
                                  notification.id
                                )
                              }
                              disabled={loading === notification.id}
                            >
                              {loading === notification.id ? (
                                "..."
                              ) : (
                                <>
                                  <X size={12} className="mr-1" />
                                  Rejeitar
                                </>
                              )}
                            </Button>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}