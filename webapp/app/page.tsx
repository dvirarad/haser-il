"use client";

import { useState } from "react";
import RemoveForm from "@/components/RemoveForm";
import AddBrokerForm from "@/components/AddBrokerForm";
import BrokerList from "@/components/BrokerList";

type Tab = "remove" | "add";

export default function Home() {
  const [tab, setTab] = useState<Tab>("remove");

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--background)", color: "var(--foreground)" }}>
      <header className="border-b" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
        <div className="max-w-2xl mx-auto px-4 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "var(--accent)" }}>הסר.אותי</h1>
            <p className="text-sm mt-0.5" style={{ color: "var(--muted)" }}>
              הסר את עצמך ממאגרי מידע ישראלים — אוטומטית
            </p>
          </div>
          <a
            href="https://github.com/dvirarad/haser-il"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-3 py-1.5 rounded-md border transition-colors hover:opacity-80"
            style={{ borderColor: "var(--border)", color: "var(--muted)" }}
          >
            GitHub ↗
          </a>
        </div>
      </header>

      <div className="border-b" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
        <div className="max-w-2xl mx-auto px-4 flex gap-1">
          {(["remove", "add"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-4 py-3 text-sm font-medium border-b-2 transition-colors"
              style={{
                borderColor: tab === t ? "var(--accent)" : "transparent",
                color: tab === t ? "var(--accent)" : "var(--muted)",
              }}
            >
              {t === "remove" ? "הסר אותי" : "הוסף ברוקר"}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
        {tab === "remove" ? (
          <div className="space-y-8">
            <RemoveForm />
            <BrokerList />
          </div>
        ) : (
          <AddBrokerForm />
        )}
      </main>

      <footer className="border-t py-4 text-center text-xs" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
        <p>מבוסס על זכות המחיקה לפי חוק הגנת הפרטיות תיקון 13, אוגוסט 2025</p>
        <p className="mt-1">
          קוד פתוח —{" "}
          <a href="https://github.com/dvirarad/haser-il" target="_blank" rel="noopener noreferrer" className="underline">
            GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}
