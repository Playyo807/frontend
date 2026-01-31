import { NextRequest, NextResponse } from "next/server";
import { sendPushToAll } from "@/lib/push"; // or wherever your function is

export async function POST(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "This endpoint is only available in development" },
      { status: 403 },
    );
  }

  try {
    const { title, body, url } = await request.json();

    const result = await sendPushToAll({
      title,
      message: body,
      url,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Send notification error:", error);
    return NextResponse.json(
      { error: "Failed to send notification" },
      { status: 500 },
    );
  }
}
