# haser-il 🗑️

**הסר את עצמך ממאגרי מידע ישראלים — אוטומטית.**

פרויקט קוד פתוח לשליחת בקשות מחיקה אוטומטיות לברוקרי מידע ישראלים, בהסתמך על זכות המחיקה לפי חוק הגנת הפרטיות (תיקון 13, אוגוסט 2025).

---

## איך זה עובד

1. אתה נותן את השם, טלפון, אימייל וכתובת שלך
2. המערכת שולחת בקשות הסרה לכל הברוקרים הישראלים הידועים
3. עוקבת מי ענה, מי לא, ומזכירה לחזור אחרי X חודשים

```bash
cd engine
npm install
node index.js run \
  --name "ישראל ישראלי" \
  --email "me@example.com" \
  --phone "050-0000000" \
  --address "רחוב הרצל 1, תל אביב" \
  --dry-run
```

---

## מבנה הפרויקט

```
/brokers/       ← קובץ YAML לכל ברוקר (community-maintained)
/templates/     ← תבניות מכתבי הסרה בעברית
/engine/        ← הקוד שמריץ את השליחות
/webapp/        ← ממשק ווב (בפיתוח)
```

---

## הוספת ברוקר חדש

צור קובץ `brokers/<broker-id>.yaml`:

```yaml
name: שם הברוקר
id: broker-id
website: example.co.il
method: email          # email | form | api
contact_email: privacy@example.co.il
template: standard_removal
category: [people-search]
last_verified: 2026-05
maintainer: "@yourgithub"
```

פתח Pull Request — תרומות מתקבלות בברכה.

---

## ברוקרים נתמכים

| שם | קטגוריה | שיטה |
|----|---------|------|
| מדלן | people-search, real-estate | email |
| בזק 144 / דפי זהב | people-search, telecom | form |
| BDI | credit, people-search | email |
| יד2 | people-search, marketing | email |
| D&B ישראל | credit, people-search | email |
| שיווק ישיר ישראל | direct-mail | email |

---

## בסיס חוקי

תיקון 13 לחוק הגנת הפרטיות (נכנס לתוקף 14.8.2025):
- זכות מחיקה מוחלטת ממאגרי מידע
- חובת DPO לברוקרים עם מעל 10,000 רשומות
- קנס 15,000 ₪ לכל הפרה
- חובת מענה תוך 30 יום

---

## רישיון

MIT
