import { NextResponse } from "next/server";
import { challengeForDate, quoteForDate } from "@/lib/daily-data";
import { hasDatabase } from "@/lib/db";
import { getTasksForDate, getWorkLogsForDate } from "@/lib/storage";
import { niceDateJakarta, todayJakarta } from "@/lib/time";

export const dynamic = "force-dynamic";

export async function GET() {
  const date = todayJakarta();
  const tasks = await getTasksForDate(date);
  const workLogs = await getWorkLogsForDate(date);

  return NextResponse.json({
    date,
    niceDate: niceDateJakarta(),
    storageMode: hasDatabase() ? "database" : "demo",
    tasks,
    quote: quoteForDate(date),
    challenge: challengeForDate(date),
    workLogs
  });
}
