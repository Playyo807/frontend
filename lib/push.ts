import webpush from "web-push";
import prisma from "@/lib/prisma";

webpush.setVapidDetails(
  process.env.VAPID_EMAIL || "mailto:admin@yourapp.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
);

type PushPayload = {
  title: string;
  message: string;
  url?: string;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
};

type SendResult = {
  success: boolean;
  sent: number;
  failed: number;
};

export async function sendPushToUser(
  userId: string,
  payload: PushPayload,
): Promise<SendResult> {
  const subs = await prisma.pushSubscription.findMany({
    where: { userId },
  });

  if (subs.length === 0) {
    return { success: true, sent: 0, failed: 0 };
  }

  // Log each subscription endpoint
  subs.forEach((sub, i) => {
    console.log(`Subscription ${i + 1}:`, {
      id: sub.id,
      endpoint: sub.endpoint.substring(0, 50) + "...",
    });
  });

  const notificationPayload = JSON.stringify({
    title: payload.title,
    body: payload.message,
    icon: payload.icon || "/icon-192x192.png",
    badge: payload.badge || "/badge-72x72.png",
    data: {
      url: payload.url || "/",
    },
    tag: payload.tag || "default",
    requireInteraction: payload.requireInteraction || false,
  });

  const results = await Promise.allSettled(
    subs.map(async (sub) => {
      try {
        const result = await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth,
            },
          },
          notificationPayload,
          {
            TTL: 60,
            urgency: "high",
          },
        );
        return { success: true };
      } catch (err: any) {
        console.error(`❌ Failed to send to subscription ${sub.id}:`, err);
        console.error("Error details:", {
          statusCode: err.statusCode,
          body: err.body,
          message: err.message,
        });

        if (err.statusCode === 410 || err.statusCode === 404) {
          await prisma.pushSubscription
            .delete({
              where: { id: sub.id },
            })
            .catch(console.error);
        }

        return { success: false };
      }
    }),
  );

  const successful = results.filter(
    (r) => r.status === "fulfilled" && r.value.success,
  ).length;
  const failed = results.length - successful;

  return {
    success: successful > 0,
    sent: successful,
    failed,
  };
}

export async function sendPushToAll(payload: PushPayload): Promise<SendResult> {
  const subs = await prisma.pushSubscription.findMany();

  if (subs.length === 0) {
    return { success: true, sent: 0, failed: 0 };
  }

  const notificationPayload = JSON.stringify({
    title: payload.title,
    body: payload.message,
    icon: payload.icon || "/icon-192x192.png",
    badge: payload.badge || "/badge-72x72.png",
    data: { url: payload.url || "/" },
    tag: payload.tag || "default",
    requireInteraction: payload.requireInteraction || false,
  });

  const results = await Promise.allSettled(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth,
            },
          },
          notificationPayload,
          {
            TTL: 60,
            urgency: "high",
          },
        );
        return { success: true };
      } catch (err: any) {
        if (err.statusCode === 410 || err.statusCode === 404) {
          await prisma.pushSubscription
            .delete({
              where: { id: sub.id },
            })
            .catch(console.error);
        }
        return { success: false };
      }
    }),
  );

  const successful = results.filter(
    (r) => r.status === "fulfilled" && r.value.success,
  ).length;
  const failed = results.length - successful;

  return {
    success: successful > 0,
    sent: successful,
    failed,
  };
}
