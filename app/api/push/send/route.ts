import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";

webpush.setVapidDetails(
  process.env.VAPID_EMAIL! || "mailto:",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
);

export async function POST(request: NextRequest) {
  try {
    const { title, body, icon, url } = await request.json();

    const subscriptions = await prisma.pushSubscription.findMany();

    const payload = JSON.stringify({
      title,
      body,
      icon: icon || "/icon-192x192.png",
      data: { url: url || "/" },
    });

    const results = await Promise.allSettled(
      subscriptions.map((sub) =>
        webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth,
            },
          },
          payload,
        ),
      ),
    );

    // Clean up failed subscriptions
    const failedSubscriptions = results
      .map((result, index) => ({ result, subscription: subscriptions[index] }))
      .filter(({ result }) => result.status === "rejected")
      .map(({ subscription }) => subscription.id);

    if (failedSubscriptions.length > 0) {
      await prisma.pushSubscription.deleteMany({
        where: { id: { in: failedSubscriptions } },
      });
    }

    console.log(
      `Sent notifications: ${results.filter((r) => r.status === "fulfilled").length}, Failed: ${failedSubscriptions.length}`,
    );

    return NextResponse.json({
      success: true,
      sent: results.filter((r) => r.status === "fulfilled").length,
      failed: failedSubscriptions.length,
    });
  } catch (error) {
    console.error("Send notification error:", error);
    return NextResponse.json(
      { error: "Failed to send notification" },
      { status: 500 },
    );
  }
}
