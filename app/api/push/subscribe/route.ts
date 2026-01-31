import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(request: NextRequest) {
  try {
    const subscription = await request.json();

    // Try to get session (might be null if not logged in)
    let session;
    try {
      session = await auth();
    } catch (error) {
      console.log("No session found");
      session = null;
    }

    console.log("Session user ID:", session?.user?.id);

    // Prepare the data object
    const subscriptionData = {
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
    };

    let userIdToSave: string | null = null;

    if (session?.user?.email) {
      const userExists = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
      });

      if (userExists) {
        userIdToSave = userExists.id;
      } else {
        console.warn("Session has email but user does not exist in database");
      }
    }

    console.log("Saving subscription with userId:", userIdToSave);

    await prisma.pushSubscription.upsert({
      where: { endpoint: subscription.endpoint },
      update: {
        ...subscriptionData,
        ...(userIdToSave && { userId: userIdToSave }),
      },
      create: {
        endpoint: subscription.endpoint,
        ...subscriptionData,
        ...(userIdToSave && { userId: userIdToSave }),
      },
    });

    console.log("Subscription saved successfully!");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json(
      {
        error: "Failed to subscribe",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
