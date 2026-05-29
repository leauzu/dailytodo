import type { Challenge, Task } from "./types";

export const USER_ID = "default-user";

export const TASKS: Task[] = [
  { key: "pray_morning", label: "Pray morning", minutes: 5, icon: "☀️" },
  { key: "me_time", label: "Me time", minutes: 30, icon: "🧘" },
  { key: "book", label: "Read book", minutes: 15, icon: "📖" },
  { key: "recall_today", label: "Recall today", minutes: 10, icon: "📝" },
  { key: "pray_night", label: "Pray night", minutes: 5, icon: "🌙" },
  { key: "daily_challenge", label: "Daily challenge", minutes: 20, icon: "🔥" }
];

const CHALLENGES: Challenge[] = [
  {
    title: "Anti-overthinking sprint",
    text: "Pick one task you delayed. Work on it for 20 minutes before researching more.",
    trait: "Turns analysis into execution."
  },
  {
    title: "Visible output challenge",
    text: "Create one visible result today: a post, design, code commit, sales message, or report.",
    trait: "Strengthens action, visibility, and confidence."
  },
  {
    title: "Comparison detox",
    text: "Do not compare yourself to anyone today. Compare only today's action with yesterday's action.",
    trait: "Builds internal standards instead of status anxiety."
  },
  {
    title: "One clear KPI",
    text: "Choose one measurable target today: leads, code commit, pages read, calls, calories, or revenue.",
    trait: "Turns scattered ideas into practical structure."
  },
  {
    title: "Finish small",
    text: "Complete one small task fully, even if it feels boring. Done is stronger than perfect.",
    trait: "Builds consistency and discipline."
  },
  {
    title: "Ask directly",
    text: "Instead of guessing what someone means, ask one clear question today.",
    trait: "Improves communication and reduces mental loops."
  },
  {
    title: "Money clarity",
    text: "Write one practical idea to improve sales, save cost, or increase conversion.",
    trait: "Connects creativity with wealth logic."
  },
  {
    title: "System upgrade",
    text: "Automate, template, or simplify one repeated task today.",
    trait: "Uses your technical mind productively."
  },
  {
    title: "Brave contact",
    text: "Send one useful message to a client, mentor, friend, or opportunity contact.",
    trait: "Builds social courage without drama."
  },
  {
    title: "10-minute reset",
    text: "When your mind feels noisy, breathe slowly and write only the next 3 actions.",
    trait: "Turns overthinking into calm direction."
  }
];

const QUOTES = [
  "Small proof beats big imagination.",
  "Do the work before your mood votes against you.",
  "Your future is built by repeated boring wins.",
  "Think clearly, act simply, repeat daily.",
  "Confidence comes from evidence, not fantasy.",
  "A finished small task is stronger than a perfect plan.",
  "You do not need a new life. You need consistent execution.",
  "Today, build proof that tomorrow can trust.",
  "Less noise, more output.",
  "Make your ambition measurable.",
  "Consistency is quiet, but its result is loud.",
  "Your system must be stronger than your mood."
];

function seedFromText(text: string): number {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function challengeForDate(date: string): Challenge {
  return CHALLENGES[seedFromText(date) % CHALLENGES.length];
}

export function quoteForDate(date: string): string {
  return QUOTES[seedFromText(`quote-${date}`) % QUOTES.length];
}
