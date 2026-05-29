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

export function addDays(date: string, amount: number): string {
  const d = new Date(`${date}T00:00:00+07:00`);
  d.setDate(d.getDate() + amount);
  return d.toISOString().slice(0, 10);
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
