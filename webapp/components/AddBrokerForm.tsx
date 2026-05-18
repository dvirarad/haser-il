"use client";

import { useState } from "react";

interface BrokerFormData {
  name: string;
  website: string;
  contactEmail: string;
  method: string;
  category: string;
  notes: string;
}

type Status = "idle" | "loading" | "success" | "error";

export default function AddBrokerForm() {
  const [form, setForm] = useState<BrokerFormData>({
    name: "", website: "", contactEmail: "", method: "email", category: "", notes: "",
  });
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/suggest-broker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage("תודה! ההצעה נשלחה לבדיקה.");
        setForm({ name: "", website: "", contactEmail: "", method: "email", category: "", notes: "" });
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
      <h2 className="text-lg font-semibold mb-1">הוסף ברוקר חדש</h2>
      <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
        מצאת מאגר מידע ישראלי שלא מופיע ברשימה? הצע להוסיף אותו.
        כל הצעה תיבדק ותתווסף לקובץ ה-YAML ב-GitHub.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">
            שם הברוקר <span style={{ color: "var(--accent)" }}>*</span>
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="מדלן, BDI, ..."
            required
            className="w-full px-3 py-2.5 rounded-lg text-sm border outline-none"
            style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--foreground)" }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            אתר <span style={{ color: "var(--accent)" }}>*</span>
          </label>
          <input
            type="text"
            name="website"
            value={form.website}
            onChange={handleChange}
            placeholder="example.co.il"
            required
            dir="ltr"
            className="w-full px-3 py-2.5 rounded-lg text-sm border outline-none"
            style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--foreground)" }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">אימייל לפנייה</label>
          <input
            type="email"
            name="contactEmail"
            value={form.contactEmail}
            onChange={handleChange}
            placeholder="privacy@example.co.il"
            dir="ltr"
            className="w-full px-3 py-2.5 rounded-lg text-sm border outline-none"
            style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--foreground)" }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">שיטת הסרה</label>
          <select
            name="method"
            value={form.method}
            onChange={handleChange}
            className="w-full px-3 py-2.5 rounded-lg text-sm border outline-none"
            style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--foreground)" }}
          >
            <option value="email">אימייל</option>
            <option value="form">טופס באתר</option>
            <option value="api">API</option>
            <option value="written">פנייה כתובה</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">קטגוריה</label>
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="people-search, direct-mail, credit, ..."
            className="w-full px-3 py-2.5 rounded-lg text-sm border outline-none"
            style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--foreground)" }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">הערות</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="מידע נוסף על הברוקר, קישור לדף הפרטיות, ..."
            rows={3}
            className="w-full px-3 py-2.5 rounded-lg text-sm border outline-none resize-none"
            style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--foreground)" }}
          />
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full py-3 rounded-lg font-medium text-sm transition-opacity disabled:opacity-60"
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          {status === "loading" ? "שולח..." : "הצע ברוקר"}
        </button>

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
