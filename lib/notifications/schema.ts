import {
  NotificationRecipient,
  NotificationType,
} from "@/prisma/generated/prisma/enums";
import { z } from "zod";

export const CreateNotificationSchema = z.object({
  type: z.enum(NotificationType),
  recipientType: z.enum(NotificationRecipient),

  title: z.string().min(1),
  message: z.string().min(1),

  barberId: z.cuid().optional(),
  userId: z.cuid().optional(),

  bookingId: z.cuid().optional(),
  couponId: z.cuid().optional(),
  transactionId: z.cuid().optional(),

  url: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});
