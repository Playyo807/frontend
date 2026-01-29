"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  Calendar,
  TicketPercent,
  Coins,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

import {
  getUserNotifications,
  getUserUnreadCount,
  markUserNotificationRead,
  markAllUserNotificationsRead,
} from "@/lib/clientNotificationActions";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Prisma } from "@/prisma/generated/prisma/client";

type Notification = Prisma.NotificationGetPayload<{
  include: {
    barber: {
      select: {
        id: true;
        displayName: true;
      };
      include: {
        user: {
          select: {
            image: true;
          };
        };
      };
    };
    booking: {
      select: {
        id: true;
        date: true;
        totalPrice: true;
        barber: {
          select: {
            displayName: true;
          };
        };
      };
    };
    coupon: {
      select: {
        id: true;
        discountPercent: true;
      };
    };
    transaction: {
      select: {
        id: true;
        points: true;
        status: true;
      };
    };
  };
}>;

export default function ClientNotificationPopover() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  async function loadData() {
    const [{ notifications }, { count }] = await Promise.all([
      getUserNotifications(),
      getUserUnreadCount(),
    ]);

    setNotifications(notifications);
    setUnreadCount(count);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleMarkRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
    setUnreadCount((c) => Math.max(0, c - 1));
    try {
      await markUserNotificationRead(id);
    } catch (err) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: false } : n)),
      );
      setUnreadCount((c) => c + 1);
    }
  }

  async function handleMarkAllRead() {
    const previous = notifications;

    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);

    try {
      await markAllUserNotificationsRead();
    } catch {
      setNotifications(previous);
      setUnreadCount(previous.filter((n) => !n.read).length);
    }
  }

  function getIcon(type: string) {
    switch (type) {
      case "BOOKING_CREATED":
      case "BOOKING_UPDATED":
      case "BOOKING_CANCELLED":
        return <Calendar size={16} />;
      case "COUPON_GRANTED":
        return <TicketPercent size={16} />;
      case "POINTS_CONFIRMED":
      case "POINTS_PENDING":
        return <Coins size={16} />;
      default:
        return <Bell size={16} />;
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 min-w-5 rounded-full bg-red-500 px-1 text-xs text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-96 p-0" align="end">
        <div className="flex items-center justify-between p-3">
          <span className="text-sm font-medium">Notificações</span>

          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs gap-1"
              onClick={handleMarkAllRead}
            >
              <CheckCheck size={14} />
              Marcar todas
            </Button>
          )}
        </div>

        <Separator />

        <ScrollArea className="h-90">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              Nenhuma notificação recente
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`px-3 py-3 transition ${
                  n.read ? "bg-background" : "bg-muted/50"
                }`}
              >
                <div className="flex gap-3">
                  <div className="mt-1 text-muted-foreground">
                    {getIcon(n.type)}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between gap-2">
                      <p className="text-sm font-medium leading-tight">
                        {n.title}
                      </p>

                      {!n.read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleMarkRead(n.id)}
                        >
                          <Check size={12} />
                        </Button>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground mt-1">
                      {n.message}
                    </p>

                    {/* BARBER PROFILE */}
                    {n.barber && (
                      <div className="flex items-center gap-2 mt-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={n.barber.user.image ?? undefined} />
                          <AvatarFallback>
                            {n.barber.displayName?.[0] ?? "B"}
                          </AvatarFallback>
                        </Avatar>

                        <span className="text-xs text-muted-foreground">
                          {n.barber.displayName ?? "Barbeiro"}
                        </span>
                      </div>
                    )}

                    <p className="text-[11px] text-muted-foreground mt-2">
                      {formatDistanceToNow(new Date(n.createdAt), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
