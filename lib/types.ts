export type TaskKey =
  | "pray_morning"
  | "me_time"
  | "book"
  | "recall_today"
  | "pray_night"
  | "daily_challenge";

export type Task = {
  key: TaskKey;
  label: string;
  minutes: number;
  icon: string;
  isDone?: boolean;
};

export type Challenge = {
  title: string;
  text: string;
  trait: string;
};

export type ProgressItem = {
  date: string;
  percent: number;
  done: number;
  total: number;
};

export type WorkLog = {
  action: "check_in" | "check_out";
  loggedAt: string;
};
