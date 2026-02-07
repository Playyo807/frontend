import { NextResponse } from "next/server";
import bookingReminder from "@/lib/jobs/bookingReminder";
import checkOldData from "@/lib/jobs/checkOldData";
import expireDateHandler from "@/lib/jobs/expireDateHandler";
import weeklyMaintenance from "@/lib/jobs/weeklyMaintenance";

export async function POST(request: Request, { params }: { params: any }) {
  try {
    // Verify authorization
    const authHeader = request.headers.get("authorization");
    const expectedToken = process.env.CRON_JOB_SECRET || "secret-key";

    if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { jobType } = params;

    let result;
    switch (jobType) {
      case "booking-reminder":
        result = await bookingReminder();
        break;
      case "cleanup-old-data":
        result = await checkOldData();
        break;
      case "expiry-check":
        result = await expireDateHandler();
        break;
      case "weekly-maintenance":
        result = await weeklyMaintenance();
        break;
      default:
        return NextResponse.json(
          { error: "Unknown job type" },
          { status: 400 },
        );
    }

    return NextResponse.json({
      success: true,
      message: `Job ${jobType} executed successfully`,
      result,
    });
  } catch (error: Error | any) {
    console.error(`Error executing job:`, error);
    return NextResponse.json(
      {
        error: "Job execution failed",
        details: error.message,
      },
      { status: 500 },
    );
  }
}

// Handle GET requests
export async function GET(request: Request, { params }: { params: any }) {
  const { jobType } = params;
  return NextResponse.json(
    { error: `GET not allowed for job ${jobType}` },
    { status: 405 },
  );
}
