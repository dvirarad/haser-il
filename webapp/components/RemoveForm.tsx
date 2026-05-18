"use client";

import { useState } from "react";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  dob: string;
}

type Status = "idle" | "loading" | "success" | "error";

export default function RemoveForm() {
  const [form, setForm] = useState<FormData>({ fullName: "", email: "", phone: "", address: "", dob: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/request-removal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage(`נשלחו ${data.sent} בקשות הסרה בהצלחה.`);
      } else {
        setStatus("error");
        setMessage(data.error || "שגיאה בשליחה");
      }
    } catch {
      setStatus("error");
      setMessage("שגיאת רשת — נסה שוב");
    }
  };

  return (
    <section>
      <h2 className="text-lg font-semibold mb-1">הסר את המידע שלך</h2>
      <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
        מלא את הפרטים שלך ואנחנו נשלח בקשות מחיקה לכל מאגרי המידע הישראלים הידועים.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { name: "fullName", label: "שם מלא", placeholder: "ישראל ישראלי", required: true },
          { name: "email", label: "אימייל", placeholder: "me@example.com", required: true, type: "email" },
          { name: "phone", label: "טלפון", placeholder: "050-0000000", required: true },
          { name: "address", label: "כתובת", placeholder: "רחוב הרצל 1, תל אביב", required: true },
          { name: "dob", label: "תאריך לידה", placeholder: "DD/MM/YYYY", required: false },
        ].map(({ name, label, placeholder, required, type = "text" }) => (
          <div key={name}>
            <label className="block text-sm font-medium mb-1.5">
              {label}
              {required && <span className="mr-1" style={{ color: "var(--accent)" }}>*</span>}
            </label>
            <input
              type={type}
              name={name}
              value={form[name as keyof FormData]}
              onChange={handleChange}
              placeholder={placeholder}
              required={required}
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-colors border focus:ring-1"
              style={{
                background: "var(--surface)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
              dir={name === "email" ? "ltr" : "rtl"}
            />
          </div>
        ))}

        <div className="pt-2">
          <p className="text-xs mb-4" style={{ color: "var(--muted)" }}>
            הפרטים משמשים לכתיבת בקשות ההסרה בלבד ואינם נשמרים בשרת.
          </p>
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full py-3 rounded-lg font-medium text-sm transition-opacity disabled:opacity-60"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            {status === "loading" ? "שולח בקשות..." : "שלח בקשות מחיקה"}
          </button>
        </div>

        {status === "success" && (
          <div className="p-3 rounded-lg text-sm" style={{ background: "#16a34a22", color: "#4ade80" }}>
            ✓ {message}
          </div>
        )}
        {status === "error" && (
          <div className="p-3 rounded-lg text-sm" style={{ background: "#dc262622", color: "#f87171" }}>
            ✗ {message}
          </div>
        )}
      </form>
    </section>
  );
}
