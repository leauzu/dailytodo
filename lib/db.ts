import postgres from "postgres";

let client: postgres.Sql | null = null;

export function hasDatabase(): boolean {
  return Boolean(process.env.DATABASE_URL || process.env.POSTGRES_URL);
}

export function sql() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;

  if (!url) {
    throw new Error("DATABASE_URL or POSTGRES_URL is not set.");
  }

  if (!client) {
    client = postgres(url, {
      ssl: "require",
      max: 1
    });
  }

  return client;
}

let initialized = false;

export async function ensureSchema() {
  if (!hasDatabase()) return;

  if (initialized) return;

  const db = sql();

  await db`
    CREATE TABLE IF NOT EXISTS daily_tasks (
      id BIGSERIAL PRIMARY KEY,
      user_id TEXT NOT NULL,
      task_date DATE NOT NULL,
      task_key TEXT NOT NULL,
      is_done BOOLEAN NOT NULL DEFAULT FALSE,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(user_id, task_date, task_key)
    );
  `;

  await db`
    CREATE TABLE IF NOT EXISTS work_logs (
      id BIGSERIAL PRIMARY KEY,
      user_id TEXT NOT NULL,
      work_date DATE NOT NULL,
      action TEXT NOT NULL CHECK (action IN ('check_in', 'check_out')),
      logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  initialized = true;
}
