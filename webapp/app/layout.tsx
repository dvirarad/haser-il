import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "הסר.אותי — הסר עצמך ממאגרי מידע ישראלים",
  description: "שירות קוד פתוח לשליחת בקשות מחיקה אוטומטיות לברוקרי מידע ישראלים לפי חוק הגנת הפרטיות",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className="h-full">
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
