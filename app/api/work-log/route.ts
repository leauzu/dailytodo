import { NextResponse } from "next/server";
import { addWorkLog, getWorkLogsForDate } from "@/lib/storage";
import { todayJakarta } from "@/lib/time";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const action = body.action;

    if (action !== "check_in" && action !== "check_out") {
      return NextResponse.json({ ok: false, message: "Invalid action." }, { status: 400 });
    }

    const date = todayJakarta();
    const result = await addWorkLog(date, action);
    const workLogs = await getWorkLogsForDate(date);

    return NextResponse.json({
      ok: true,
      ...result,
      workLogs
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Unknown error" },
      { status: 400 }
    );
  }
}
