import { TASKS, USER_ID } from "./daily-data";
import { ensureSchema, hasDatabase, sql } from "./db";
import type { ProgressItem, Task, TaskKey, WorkLog } from "./types";

export async function getTasksForDate(date: string): Promise<Task[]> {
  if (!hasDatabase()) {
    return TASKS.map((task) => ({ ...task, isDone: false }));
  }

  await ensureSchema();
  const db = sql();

  const rows = await db<{ task_key: TaskKey; is_done: boolean }[]>`
    SELECT task_key, is_done
    FROM daily_tasks
    WHERE user_id = ${USER_ID}
    AND task_date = ${date}
  `;

  const status = new Map(rows.map((row) => [row.task_key, row.is_done]));

  return TASKS.map((task) => ({
    ...task,
    isDone: status.get(task.key) ?? false
  }));
}

export async function saveTaskStatus(date: string, taskKey: TaskKey, isDone: boolean) {
  if (!TASKS.some((task) => task.key === taskKey)) {
    throw new Error("Invalid task key.");
  }

  if (!hasDatabase()) {
    return { stored: false, mode: "demo" as const };
  }

  await ensureSchema();
  const db = sql();

  await db`
    INSERT INTO daily_tasks (user_id, task_date, task_key, is_done, updated_at)
    VALUES (${USER_ID}, ${date}, ${taskKey}, ${isDone}, NOW())
    ON CONFLICT (user_id, task_date, task_key)
    DO UPDATE SET is_done = EXCLUDED.is_done, updated_at = NOW()
  `;

  return { stored: true, mode: "database" as const };
}

export async function addWorkLog(date: string, action: "check_in" | "check_out") {
  if (!hasDatabase()) {
    return { stored: false, mode: "demo" as const };
  }

  await ensureSchema();
  const db = sql();

  await db`
    INSERT INTO work_logs (user_id, work_date, action, logged_at)
    VALUES (${USER_ID}, ${date}, ${action}, NOW())
  `;

  return { stored: true, mode: "database" as const };
}

export async function getWorkLogsForDate(date: string): Promise<WorkLog[]> {
  if (!hasDatabase()) return [];

  await ensureSchema();
  const db = sql();

  const rows = await db<{ action: "check_in" | "check_out"; logged_at: string }[]>`
    SELECT action, logged_at
    FROM work_logs
    WHERE user_id = ${USER_ID}
    AND work_date = ${date}
    ORDER BY logged_at ASC
  `;

  return rows.map((row) => ({
    action: row.action,
    loggedAt: new Date(row.logged_at).toISOString()
  }));
}

export async function getProgress(dates: string[]): Promise<ProgressItem[]> {
  const total = TASKS.length;
  const empty = dates.map((date) => ({
    date,
    percent: 0,
    done: 0,
    total
  }));

  if (!hasDatabase()) return empty;

  await ensureSchema();
  const db = sql();

  const start = dates[0];
  const end = dates[dates.length - 1];

  const rows = await db<{ task_date: string; done_count: number }[]>`
    SELECT task_date::text AS task_date,
           COUNT(*) FILTER (WHERE is_done = TRUE)::int AS done_count
    FROM daily_tasks
    WHERE user_id = ${USER_ID}
    AND task_date BETWEEN ${start} AND ${end}
    GROUP BY task_date
  `;

  const doneByDate = new Map(rows.map((row) => [row.task_date, Number(row.done_count)]));

  return empty.map((item) => {
    const done = doneByDate.get(item.date) ?? 0;
    return {
      ...item,
      done,
      percent: Math.round((done / total) * 100)
    };
  });
}
