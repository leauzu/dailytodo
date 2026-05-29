"use client";

import { useEffect, useMemo, useState } from "react";
import AreaChart from "./AreaChart";
import type { Challenge, ProgressItem, Task, WorkLog } from "@/lib/types";

type TodayData = {
  date: string;
  niceDate: string;
  storageMode: "database" | "demo";
  tasks: Task[];
  quote: string;
  challenge: Challenge;
  workLogs: WorkLog[];
};

const emptyChallenge: Challenge = {
  title: "Loading challenge",
  text: "Preparing today's challenge...",
  trait: "Loading"
};

export default function DailyApp() {
  const [today, setToday] = useState<TodayData | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [workLogs, setWorkLogs] = useState<WorkLog[]>([]);
  const [range, setRange] = useState("week");
  const [progress, setProgress] = useState<ProgressItem[]>([]);
  const [toast, setToast] = useState("");

  const doneCount = useMemo(() => tasks.filter((task) => task.isDone).length, [tasks]);
  const percent = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0;

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 1600);
  }

  async function loadToday() {
    const res = await fetch("/api/today", { cache: "no-store" });
    const data = (await res.json()) as TodayData;
    setToday(data);

    // In demo mode, keep button state in the phone/browser.
    // In database mode, the server is source of truth.
    if (data.storageMode === "demo") {
      const saved = JSON.parse(localStorage.getItem(`daily-growth-${data.date}`) || "{}") as Record<string, boolean>;
      setTasks(data.tasks.map((task) => ({ ...task, isDone: saved[task.key] ?? task.isDone })));
      const localWorkLogs = JSON.parse(localStorage.getItem(`work-log-${data.date}`) || "[]") as WorkLog[];
      setWorkLogs(localWorkLogs);
    } else {
      setTasks(data.tasks);
      setWorkLogs(data.workLogs);
    }
  }

  async function loadProgress(nextRange = range) {
    const res = await fetch(`/api/progress?range=${nextRange}`, { cache: "no-store" });
    const data = await res.json();

    let items = data.items as ProgressItem[];

    // Demo mode chart reads localStorage so you can test without DB.
    if (data.storageMode === "demo" && today?.date) {
      const total = tasks.length || 6;
      items = items.map((item) => {
        const saved = JSON.parse(localStorage.getItem(`daily-growth-${item.date}`) || "{}") as Record<string, boolean>;
        const done = Object.values(saved).filter(Boolean).length;
        return {
          ...item,
          done,
          total,
          percent: Math.round((done / total) * 100)
        };
      });
    }

    setProgress(items);
  }

  useEffect(() => {
    loadToday();
  }, []);

  useEffect(() => {
    loadProgress(range);
  }, [range, today?.date, doneCount]);

  async function toggleTask(task: Task) {
    const newValue = !task.isDone;

    setTasks((current) =>
      current.map((item) =>
        item.key === task.key ? { ...item, isDone: newValue } : item
      )
    );

    if (today?.storageMode === "demo" && today.date) {
      const key = `daily-growth-${today.date}`;
      const saved = JSON.parse(localStorage.getItem(key) || "{}") as Record<string, boolean>;
      saved[task.key] = newValue;
      localStorage.setItem(key, JSON.stringify(saved));
    }

    await fetch("/api/task", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: today?.date,
        taskKey: task.key,
        isDone: newValue
      })
    });

    showToast(newValue ? "Done. Build proof." : "Unchecked.");
  }

  async function logWork(action: "check_in" | "check_out") {
    const localLog: WorkLog = {
      action,
      loggedAt: new Date().toISOString()
    };

    if (today?.storageMode === "demo" && today.date) {
      const key = `work-log-${today.date}`;
      const saved = JSON.parse(localStorage.getItem(key) || "[]") as WorkLog[];
      const next = [...saved, localLog];
      localStorage.setItem(key, JSON.stringify(next));
      setWorkLogs(next);
    }

    const res = await fetch("/api/work-log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action })
    });

    const data = await res.json();

    if (today?.storageMode === "database" && data.workLogs) {
      setWorkLogs(data.workLogs);
    }

    showToast(action === "check_in" ? "Checked in. Focus mode." : "Checked out. Review your proof.");
  }

  const storageMode = today?.storageMode || "demo";
  const challenge = today?.challenge || emptyChallenge;

  return (
    <>
      <main className="app">
        <header className="hero">
          <div className="hero-card">
            <div className="topline">
              <div className="pill">{today?.niceDate || "Loading..."}</div>
              <div className="pill">
                <span className={`status-dot ${storageMode === "database" ? "connected" : ""}`} />
                {storageMode === "database" ? "DB connected" : "Demo mode"}
              </div>
            </div>

            <h1>Daily Growth</h1>
            <p className="subtitle">
              Server-side logic for your BaZi pattern: less overthinking, more visible proof, stronger consistency.
            </p>

            <div className="progress-wrap">
              <div className="progress-meta">
                <span>Today consistency</span>
                <strong>{percent}%</strong>
              </div>
              <div className="bar">
                <span style={{ width: `${percent}%` }} />
              </div>
            </div>
          </div>
        </header>

        <section className="grid" id="today">
          <article className="card">
            <div className="section-title">
              <h2>Quote today</h2>
              <small>English motivation</small>
            </div>
            <div className="quote">
              “{today?.quote || "Loading quote..."}”
              <span>Build calm proof, not noisy plans.</span>
            </div>
          </article>

          <article className="card">
            <div className="section-title">
              <h2>Daily list</h2>
              <small>Tap to finish</small>
            </div>

            <div className="task-list">
              {tasks.length === 0 ? (
                <p className="loading">Loading tasks...</p>
              ) : (
                tasks.map((task) => (
                  <button
                    key={task.key}
                    type="button"
                    className={`task ${task.isDone ? "done" : ""}`}
                    onClick={() => toggleTask(task)}
                  >
                    <div className="icon">{task.icon}</div>
                    <div style={{ textAlign: "left" }}>
                      <strong>{task.label}</strong>
                      <span>{task.minutes} minutes</span>
                    </div>
                    <div className="check">✓</div>
                  </button>
                ))
              )}
            </div>
          </article>

          <article className="card challenge">
            <div className="section-title">
              <h2>BaZi challenge</h2>
              <small>Weakness → strength</small>
            </div>
            <h3>{challenge.title}</h3>
            <p>{challenge.text}</p>
            <div className="tag">🔥 {challenge.trait}</div>
          </article>
        </section>

        <section className="grid" id="work" style={{ marginTop: 14 }}>
          <article className="card">
            <div className="section-title">
              <h2>Work check</h2>
              <small>Server log</small>
            </div>

            <div className="work-actions">
              <button className="action-btn in" type="button" onClick={() => logWork("check_in")}>
                Check In
              </button>
              <button className="action-btn out" type="button" onClick={() => logWork("check_out")}>
                Check Out
              </button>
            </div>

            <div className="work-log">
              {workLogs.length === 0 ? (
                "No work log yet today."
              ) : (
                workLogs.map((log, index) => (
                  <div key={`${log.loggedAt}-${index}`}>
                    <strong>{log.action === "check_in" ? "Check in" : "Check out"}</strong>
                    {" — "}
                    {new Date(log.loggedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                ))
              )}
            </div>
          </article>
        </section>

        <section className="grid" id="chart" style={{ marginTop: 14 }}>
          <article className="card">
            <div className="section-title">
              <h2>Consistency</h2>
              <small>Server calculated</small>
            </div>

            <div className="tabs">
              {["week", "month", "ytd", "year", "max"].map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`tab ${range === item ? "active" : ""}`}
                  onClick={() => setRange(item)}
                >
                  {item.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="chart-card">
              <AreaChart data={progress} range={range} />
            </div>
          </article>
        </section>
      </main>

      <nav className="bottom-nav">
        <a href="#today">☀️<span>Today</span></a>
        <a href="#work">💼<span>Work</span></a>
        <a href="#chart">📈<span>Chart</span></a>
      </nav>

      <div className={`toast ${toast ? "show" : ""}`}>{toast}</div>
    </>
  );
}
