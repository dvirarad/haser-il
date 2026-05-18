import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import nodemailer from "nodemailer";

const BROKERS_DIR = path.join(process.cwd(), "..", "brokers");
const TEMPLATES_DIR = path.join(process.cwd(), "..", "templates");

interface Broker {
  id: string;
  name: string;
  method: string;
  contact_email?: string;
  template: string;
}

function loadBrokers(): Broker[] {
  if (!fs.existsSync(BROKERS_DIR)) return [];
  return fs.readdirSync(BROKERS_DIR)
    .filter((f) => f.endsWith(".yaml") && !f.startsWith("_"))
    .map((f) => yaml.load(fs.readFileSync(path.join(BROKERS_DIR, f), "utf8")) as Broker)
    .filter((b) => b.method === "email" && b.contact_email);
}

function renderTemplate(templateName: string, user: Record<string, string>): { subject: string; body: string } {
  const tplPath = path.join(TEMPLATES_DIR, `${templateName}.txt`);
  if (!fs.existsSync(tplPath)) {
    const fallback = path.join(TEMPLATES_DIR, "standard_removal.txt");
    if (!fs.existsSync(fallback)) return { subject: "בקשת מחיקת מידע אישי", body: "" };
    let tpl = fs.readFileSync(fallback, "utf8");
    for (const [k, v] of Object.entries(user)) tpl = tpl.replaceAll(`{{${k}}}`, v);
    const lines = tpl.split("\n");
    return { subject: lines[0].replace("Subject: ", "").trim(), body: lines.slice(2).join("\n").trim() };
  }
  let tpl = fs.readFileSync(tplPath, "utf8");
  for (const [k, v] of Object.entries(user)) tpl = tpl.replaceAll(`{{${k}}}`, v);
  const lines = tpl.split("\n");
  return { subject: lines[0].replace("Subject: ", "").trim(), body: lines.slice(2).join("\n").trim() };
}

export async function POST(req: NextRequest) {
  const { fullName, email, phone, address, dob } = await req.json();
  if (!fullName || !email || !phone || !address) {
    return NextResponse.json({ error: "חסרים שדות חובה" }, { status: 400 });
  }

  const brokers = loadBrokers();
  if (!brokers.length) {
    return NextResponse.json({ error: "לא נמצאו ברוקרים" }, { status: 500 });
  }

  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpHost || !smtpUser || !smtpPass) {
    return NextResponse.json({ error: "SMTP לא מוגדר בשרת" }, { status: 500 });
  }

  const transport = nodemailer.createTransport({
    host: smtpHost, port: 587, secure: false,
    auth: { user: smtpUser, pass: smtpPass },
  });

  const user = { full_name: fullName, email, phone, address, date_of_birth: dob || "לא סופק" };
  let sent = 0;

  for (const broker of brokers) {
    try {
      const { subject, body } = renderTemplate(broker.template, user);
      await transport.sendMail({ from: email, to: broker.contact_email!, subject, text: body });
      sent++;
    } catch {
      // continue with other brokers on failure
    }
  }

  return NextResponse.json({ sent, total: brokers.length });
}
