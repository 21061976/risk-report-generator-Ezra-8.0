const buildEZRAPrompt = (documentText, options = {}) => {
  const { projectName, organization, customInstructions } = options;

  // טען את הפרומפט EZRA 5.0 המלא
  const ezraPrompt = `
אתה מומחה לניהול סיכונים במערכת החינוך. אני מעלה אליך מסמך תפיסה ואתה צריך ליצור דוח ניהול סיכונים מקצועי ומפורט בדיוק כמו הדוגמה שקיבלת.

🎯 המשימה שלך:
1. נתח את מסמך התפיסה לעומק
2. זהה בדיוק 3 מטרות מרכזיות
3. גזור מהמטרות 4-5 סיכונים עיקריים (כל סיכון מקושר למטרה)
4. צור דוח JSON מובנה לפי התבנית המדויקת

⚠️ הוראות מדויקות לביצוע - חובה לקרוא!:

🔄 זרימה לוגית חובה:
1. זהה 3 מטרות מרכזיות מהמסמך (לא יותר!)
2. לכל מטרה - גזור סיכונים ישירים וציין בכל סיכון "(נגזר ממטרה X: שם המטרה)"
3. המלצות סוף הדוח חייבות לתת מענה קונקרטי וישיר לכל אחת מ-3 המטרות

📚 דגשים פדגוגיים חובה:
- התמקד בהיבטים חינוכיים ופדגוגיים בלבד
- אסור להזכיר נתונים כלכליים מספריים (תקציבים, עלויות וכו')
- התייחס לסיכונים פדגוגיים: איכות הוראה, השפעה על תלמידים, פערים לימודיים
- כל ניתוח חייב להתמקד בהשפעה על התהליך החינוכי

📋 התייחסות רגולטורית:
- ציין התייחסות לחוזר מנכ"ל לאסדרת חדשנות
- הצג אפשרויות להפחתה רגולטורית בתנאים המתאימים
- בדוק התאמה מלאה לדרישות האסדרה החינוכית

💡 המלצות קונקרטיות לוועדה:
- כל המלצה חייבת להיות ספציפית לפרויקט הזה בלבד
- המלצות מעשיות וישימות לוועדה (לא אסטרטגיות כלליות)
- כל המלצה נותנת מענה ישיר למטרה ספציפית מתוך ה-3
- ניסוח קונקרטי: "מומלץ לאשר את הפרויקט בתנאי ש..." / "יש לדרוש מהמפעיל..."

📊 חישוב רמת חדשנות (ציון 1-10):
- השפעה פדגוגית: עמקות השינוי בהוראה-למידה
- מורכבות טכנולוגית: רמת הטכנולוגיה החדשה
- שינוי ארגוני: עומק השינוי במבנה הארגון  
- סיכון טכנולוגי: רמת אי הוודאות הטכנולוגית
ציון סופי = ממוצע של 4 הרכיבים

⚠️ דרישות סיכונים:
- זהה 4-5 סיכונים מרכזיים (כל אחד מקושר למטרה)
- חשב חומרה: הסתברות (1-10) × נזק (1-10)
- רמות: גבוהה מאוד (81-100), גבוהה (49-80), בינונית (25-48), נמוכה (1-24)
- כל סיכון חייב: קישור למטרה + תיאור + השלכות + הזדמנויות

📤 פורמט התגובה:
השב אך ורק בפורמט JSON תקין הבא (אל תוסיף טקסט נוסף):

{
  "projectName": "${projectName || 'שם הפרויקט'}",
  "organization": "${organization || 'שם הארגון'}",
  "projectManager": "שם מנהל הפרויקט מהמסמך",
  "projectScope": "תיאור היקף הפרויקט",
  "timeline": "לוח זמנים של הפרויקט",
  "projectType": "סוג הפרויקט",
  "regulatoryPartners": "שותפים רגולטוריים",
  
  "goals": [
    {
      "id": 1,
      "title": "מטרה 1: כותרת קצרה",
      "description": "תיאור מפורט של המטרה"
    },
    {
      "id": 2,
      "title": "מטרה 2: כותרת קצרה", 
      "description": "תיאור מפורט של המטרה"
    },
    {
      "id": 3,
      "title": "מטרה 3: כותרת קצרה",
      "description": "תיאור מפורט של המטרה"
    }
  ],
  
  "deliverables": [
    "תוצר 1",
    "תוצר 2",
    "תוצר 3",
    "תוצר 4"
  ],
  
  "risks": [
    {
      "id": 1,
      "title": "שם הסיכון",
      "linkedGoal": 1,
      "linkedGoalTitle": "שם המטרה המקושרת",
      "probability": 8,
      "impact": 9,
      "severity": 72,
      "severityLevel": "גבוהה",
      "description": "תיאור מפורט של הסיכון (נגזר ממטרה X: שם המטרה)",
      "impacts": [
        "השלכה 1",
        "השלכה 2",
        "השלכה 3"
      ],
      "opportunities": [
        "הזדמנות 1",
        "הזדמנות 2"
      ]
    }
  ],
  
  "strategies": [
    {
      "id": 1,
      "title": "אסטרטגיה 1",
      "description": "תיאור האסטרטגיה",
      "objectives": "מטרות האסטרטגיה",
      "methods": "אמצעים וכלים",
      "timeline": "לוח זמנים",
      "successMetrics": "מדדי הצלחה"
    }
  ],
  
  "innovationLevel": {
    "totalScore": 8.0,
    "pedagogicalImpact": 8.5,
    "technologicalComplexity": 7.5,
    "organizationalChange": 8.0,
    "technologicalRisk": 8.0
  },
  
  "innovationDescription": "תיאור החדשנות בפרויקט",
  "innovationDefinition": "הגדרת רמת החדשנות",
  "committeeRecommendation": "המלצה לאסדרת חדשנות",
  
  "regulatoryCompliance": [
    {
      "requirement": "דרישת אסדרה",
      "description": "תיאור הדרישה",
      "status": "התאמה מלאה/דרישה לתיאום",
      "actions": "פעולות נדרשות"
    }
  ],
  
  "executiveSummary": "סיכום מנהלים מפורט",
  
  "recommendations": [
    {
      "id": 1,
      "title": "המלצה 1",
      "description": "תיאור מפורט של ההמלצה הקונקרטית לוועדה",
      "linkedGoal": 1
    }
  ],
  
  "riskCounts": {
    "veryHigh": 1,
    "high": 2,
    "medium": 1,
    "low": 1
  }
}

${customInstructions ? `\n🔧 הוראות נוספות מהמשתמש:\n${customInstructions}\n` : ''}

📄 מסמך התפיסה לניתוח:

${documentText}

זכור: השב אך ורק בפורמט JSON תקין ללא טקסט נוסף!
`;

  return ezraPrompt;
};

module.exports = {
  buildEZRAPrompt
};
