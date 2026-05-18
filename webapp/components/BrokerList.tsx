const BROKERS = [
  { name: "מדלן", category: "people-search, real-estate", method: "email" },
  { name: "בזק 144 / דפי זהב", category: "people-search, telecom", method: "form" },
  { name: "BDI", category: "credit, people-search", method: "email" },
  { name: "יד2", category: "people-search, marketing", method: "email" },
  { name: "D&B ישראל", category: "credit, people-search", method: "email" },
  { name: "שיווק ישיר ישראל", category: "direct-mail", method: "email" },
];

export default function BrokerList() {
  return (
    <section>
      <h2 className="text-base font-semibold mb-3" style={{ color: "var(--muted)" }}>
        ברוקרים נתמכים ({BROKERS.length})
      </h2>
      <div className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--border)" }}>
        {BROKERS.map((b, i) => (
          <div
            key={b.name}
            className="flex items-center justify-between px-4 py-3 text-sm"
            style={{
              background: i % 2 === 0 ? "var(--surface)" : "transparent",
              borderBottom: i < BROKERS.length - 1 ? `1px solid var(--border)` : "none",
            }}
          >
            <span className="font-medium">{b.name}</span>
            <span className="text-xs" style={{ color: "var(--muted)" }}>{b.category}</span>
          </div>
        ))}
      </div>
      <p className="text-xs mt-2" style={{ color: "var(--muted)" }}>
        רשימה מלאה ומנוהלת על ידי הקהילה ב-{" "}
        <a
          href="https://github.com/dvirarad/haser-il/tree/main/brokers"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          GitHub
        </a>
      </p>
    </section>
  );
}
