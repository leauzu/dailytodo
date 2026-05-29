import { NextResponse } from "next/server";
import { hasDatabase } from "@/lib/db";
import { getProgress } from "@/lib/storage";
import { getDateRange } from "@/lib/time";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const range = url.searchParams.get("range") || "week";
  const dates = getDateRange(range);
  const items = await getProgress(dates);

  return NextResponse.json({
    ok: true,
    range,
    storageMode: hasDatabase() ? "database" : "demo",
    items
  });
}
