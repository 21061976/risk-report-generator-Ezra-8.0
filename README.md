# 🤖 מחולל דוחות ניהול סיכונים - EZRA 5.0

מערכת מתקדמת לייצור דוחות ניהול סיכונים מקצועיים במערכת החינוך, מבוססת על בינה מלאכותית ופרומפט מתוחכם.

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org)
[![Claude API](https://img.shields.io/badge/Claude-API-purple.svg)](https://anthropic.com)

## ✨ תכונות עיקריות

- 📄 **ניתוח מסמכי תפיסה אוטומטי** - העלאת קבצים ועיבוד אינטליגנטי
- 🎯 **זיהוי מטרות וסיכונים** - חילוץ אוטומטי של 3 מטרות מרכזיות ו-4-5 סיכונים
- 📊 **ניקוד חדשנות מתקדם** - חישוב אוטומטי של רמת החדשנות (1-10)
- 🎨 **דוחות HTML מעוצבים** - תבניות מקצועיות עם אפשרות עריכה
- 📱 **ממשק רספונסיבי** - תמיכה מלאה במובייל ושולחן עבודה

## 🏗️ ארכיטקטורה

risk-report-generator/
├── frontend/              # React אפליקציה
├── backend/               # Node.js API שרת
├── .env.example          # דוגמת משתני סביבה
└── README.md             # התיעוד הזה

## 🚀 התקנה מהירה

### דרישות מערכת
- **Node.js 18+** - [הורד כאן](https://nodejs.org)
- **Claude API Key** - [הירשם לAnthropic](https://anthropic.com)

### התקנה
```bash
# 1. שכפל הפרויקט
git clone <repository-url>
cd risk-report-generator

# 2. התקן תלויות Backend
cd backend
npm install

# 3. התקן תלויות Frontend
cd ../frontend
npm install

# 4. הגדר משתני סביבה
cd ..
cp .env.example .env
הגדרת Claude API Key

לך ל-console.anthropic.com
הירשם / התחבר לחשבון
לך ל-"API Keys"
צור מפתח חדש
ערוך קובץ .env ושים את המפתח:

bashANTHROPIC_API_KEY=sk-your-claude-api-key-here
הרצה
bash# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm start
האתר יפתח ב-http://localhost:3000
📖 שימוש
יצירת דוח חדש

העלאת מסמך - העלה PDF, Word או טקסט עם תפיסת הפרויקט
פרטי פרויקט - הוסף שם פרויקט, ארגון ותיאור
יצירת דוח - המתן לניתוח האוטומטי עם Claude AI
צפייה ועריכה - צפה בדוח, ערוך ויצא

תכונות מתקדמות

עריכת דוח - ערוך תוכן ישירות בממשק
ייצוא HTML - הורד דוח מעוצב
ניהול דוחות - רשימת כל הדוחות עם חיפוש

🎯 פתרון בעיות
שגיאת Claude API

וודא שה-API Key תקין
בדוק חיבור לאינטרנט
בדוק מכסת API ב-Anthropic Console

בעיות העלאת קבצים

וודא שהקובץ קטן מ-10MB
בדוק שסוג הקובץ נתמך (PDF, Word, TXT)

בעיות ביצועים

בדוק שפורטים 3000 ו-3001 פנויים
הגדל זיכרון Node.js אם צריך

📦 מבנה API
bash# Documents
POST   /api/documents/upload     # העלאת מסמך
GET    /api/documents/:id        # קבלת מסמך

# Reports  
POST   /api/reports/generate     # יצירת דוח
GET    /api/reports/:id          # קבלת דוח
GET    /api/reports              # רשימת דוחות
POST   /api/reports/:id/export   # ייצוא דוח

# Health
GET    /api/health               # בדיקת בריאות
👨‍💻 מפתח
ד"ר אסף אוזן - מומחה לחדשנות חינוכית ופיתוח מערכות
🙏 תודות

Anthropic על Claude API
React על הפריימוורק
Node.js על פלטפורמת השרת
Tailwind CSS על העיצוב


🔥 גרסה 5.0 - עם שיפורים מהותיים בניתוח והפקת דוחות
⭐ אם הפרויקט עזר לך, אנא תן כוכב ב-GitHub!
נוצר בידי ד"ר אסף אוזן עם ❤️ למערכת החינוך
