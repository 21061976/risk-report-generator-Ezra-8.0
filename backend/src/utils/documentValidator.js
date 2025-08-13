const validateDocument = async (extractedText) => {
  const validation = {
    isValid: true,
    warnings: [],
    suggestions: [],
    statistics: {
      wordCount: 0,
      paragraphCount: 0,
      hasGoals: false,
      hasTimeline: false,
      hasScope: false
    }
  };

  try {
    // Basic statistics
    const words = extractedText.trim().split(/\s+/);
    validation.statistics.wordCount = words.length;
    validation.statistics.paragraphCount = extractedText.split(/\n\s*\n/).length;

    // Check minimum length
    if (validation.statistics.wordCount < 100) {
      validation.isValid = false;
      validation.warnings.push('המסמך קצר מדי (פחות מ-100 מילים)');
    }

    // Check for key sections
    const lowercaseText = extractedText.toLowerCase();
    
    // Goals detection
    const goalKeywords = ['מטרה', 'מטרות', 'יעד', 'יעדים', 'הדף', 'חזון'];
    validation.statistics.hasGoals = goalKeywords.some(keyword => lowercaseText.includes(keyword));
    
    if (!validation.statistics.hasGoals) {
      validation.warnings.push('לא זוהו מטרות ברורות במסמך');
      validation.suggestions.push('וודא שהמסמך כולל סעיף מטרות או יעדים ברור');
    }

    // Timeline detection
    const timelineKeywords = ['לוח זמנים', 'תקופה', 'שלב', 'שלבים', 'חודש', 'שנה', 'רבעון'];
    validation.statistics.hasTimeline = timelineKeywords.some(keyword => lowercaseText.includes(keyword));
    
    if (!validation.statistics.hasTimeline) {
      validation.warnings.push('לא זוהה לוח זמנים במסמך');
      validation.suggestions.push('הוסף מידע על לוח הזמנים המתוכנן');
    }

    // Scope detection
    const scopeKeywords = ['היקף', 'תחום', 'פעילות', 'יישום', 'תלמידים', 'כיתות'];
    validation.statistics.hasScope = scopeKeywords.some(keyword => lowercaseText.includes(keyword));
    
    if (!validation.statistics.hasScope) {
      validation.warnings.push('לא זוהה היקף פרויקט ברור');
      validation.suggestions.push('הבהר את היקף הפרויקט ואוכלוסיית היעד');
    }

    // Educational context check
    const educationKeywords = ['חינוך', 'לימוד', 'הוראה', 'תלמיד', 'מורה', 'כיתה', 'בית ספר'];
    const hasEducationalContext = educationKeywords.some(keyword => lowercaseText.includes(keyword));
    
    if (!hasEducationalContext) {
      validation.warnings.push('לא זוהה הקשר חינוכי ברור במסמך');
      validation.suggestions.push('הדגש את הרלוונטיות החינוכית של הפרויקט');
    }

    // Innovation keywords check
    const innovationKeywords = ['חדשנות', 'טכנולוגיה', 'דיגיטל', 'בינה מלאכותית', 'AI'];
    const hasInnovation = innovationKeywords.some(keyword => lowercaseText.includes(keyword));
    
    if (!hasInnovation) {
      validation.suggestions.push('ציין את האספקטים החדשניים או הטכנולוגיים בפרויקט');
    }

    return validation;

  } catch (error) {
    validation.isValid = false;
    validation.warnings.push(`שגיאה בבדיקת המסמך: ${error.message}`);
    return validation;
  }
};

module.exports = {
  validateDocument
};
