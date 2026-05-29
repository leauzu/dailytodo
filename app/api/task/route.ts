import { NextResponse } from "next/server";
import { saveTaskStatus } from "@/lib/storage";
import { todayJakarta } from "@/lib/time";
import type { TaskKey } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const date = typeof body.date === "string" ? body.date : todayJakarta();
    const taskKey = body.taskKey as TaskKey;
    const isDone = Boolean(body.isDone);

    const result = await saveTaskStatus(date, taskKey, isDone);

    return NextResponse.json({
      ok: true,
      ...result
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Unknown error" },
      { status: 400 }
    );
  }
}
