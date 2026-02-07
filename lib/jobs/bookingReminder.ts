import "server-only";
import { createNotification } from "../notificationActions";

export default async function bookingReminder() {
  const now = new Date();
  const fifteenMinutesLater = new Date(now.getTime() + 15 * 60 * 1000);

  //check if notifications for bookings in the next 15 minutes already exist
  const existingNotifications = await prisma.notification.findMany({
    where: {
      type: "BOOKING_REMINDER",
      createdAt: {
        gte: now,
        lte: fifteenMinutesLater,
      },
    },
  });

  if (existingNotifications.length > 0) {
    return;
  }

  const bookings = await prisma.booking.findMany({
    where: {
      date: {
        gte: now,
        lte: fifteenMinutesLater,
      },
    },
    include: {
      user: true,
    },
  });

  for (const booking of bookings) {
    createNotification({
      userId: booking.userId,
      title: "Agendamento Próximo",
      message: `Você tem um agendamento marcado para ${booking.date.toLocaleTimeString()} às ${booking.date.toLocaleDateString()}.`,
      recipientType: "USER",
      type: "BOOKING_REMINDER",
      barberId: booking.barberId,
      url: "/client/dashboard",
    });
  }
}
