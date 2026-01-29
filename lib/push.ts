import webpush from "web-push";
import prisma from "@/lib/prisma";

webpush.setVapidDetails(
  "mailto:admin@yourapp.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
);

export async function sendPushToUser(
  userId: string,
  payload: {
    title: string;
    message: string;
    url?: string;
  },
) {
  const subs = await prisma.pushSubscription.findMany({
    where: { userId },
  });

  await Promise.all(
    subs.map(async (sub) => {
      console.log("Trying to send msg: ", sub);
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth,
            },
          },
          JSON.stringify({
            title: payload.title,
            message: payload.message,
            meta: { url: payload.url },
          }),
        );
      } catch (err: any) {
        console.log(err);
        // Auto-clean dead subscriptions
        if (err.statusCode === 410 || err.statusCode === 404) {
          await prisma.pushSubscription.delete({
            where: { id: sub.id },
          });
        }
      }
    }),
  );
}
