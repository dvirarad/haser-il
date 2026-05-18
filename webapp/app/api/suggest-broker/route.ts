import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  const { name, website, contactEmail, method, category, notes } = await req.json();
  if (!name || !website) {
    return NextResponse.json({ error: "שם ואתר הם שדות חובה" }, { status: 400 });
  }

  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const adminEmail = process.env.ADMIN_EMAIL || smtpUser;

  if (!smtpHost || !smtpUser || !smtpPass) {
    return NextResponse.json({ error: "SMTP לא מוגדר בשרת" }, { status: 500 });
  }

  const transport = nodemailer.createTransport({
    host: smtpHost, port: 587, secure: false,
    auth: { user: smtpUser, pass: smtpPass },
  });

  const body = `הצעת ברוקר חדש ל-haser-il:

שם: ${name}
אתר: ${website}
אימייל לפנייה: ${contactEmail || "לא סופק"}
שיטת הסרה: ${method}
קטגוריה: ${category || "לא סופק"}
הערות: ${notes || "אין"}

---
נשלח מ-haser-il webapp
`;

  await transport.sendMail({
    from: smtpUser,
    to: adminEmail!,
    subject: `[haser-il] הצעת ברוקר חדש: ${name}`,
    text: body,
  });

  return NextResponse.json({ ok: true });
}
