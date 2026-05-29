const TIME_ZONE = "Asia/Jakarta";

export function todayJakarta(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date());
}

export function niceDateJakarta(): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date());
}

function parseDateOnly(date: string): Date {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function formatDateOnly(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addDays(date: string, amount: number): string {
  const d = parseDateOnly(date);
  d.setUTCDate(d.getUTCDate() + amount);
  return formatDateOnly(d);
}

export function getDateRange(range: string): string[] {
  const today = todayJakarta();
  const year = today.slice(0, 4);

  let start: string;

  if (range === "week") start = addDays(today, -6);
  else if (range === "month") start = addDays(today, -29);
  else if (range === "ytd") start = `${year}-01-01`;
  else if (range === "year") start = addDays(today, -364);
  else start = addDays(today, -729);

  const dates: string[] = [];
  let current = start;

  while (current <= today) {
    dates.push(current);
    current = addDays(current, 1);
  }

  return dates;
}
