import React from 'react';
import { Heart, Code } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-4">אודות EZRA 5.0</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              מערכת מתקדמת לייצור דוחות ניהול סיכונים במערכת החינוך, 
              מבוססת על בינה מלאכותית ופרומפט מתוחכם לניתוח מסמכי תפיסה.
            </p>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-lg font-semibold mb-4">תכונות עיקריות</h3>
            <ul className="text-gray-300 text-sm space-y-2">
              <li>• ניתוח מסמכים אוטומטי</li>
              <li>• זיהוי מטרות וסיכונים</li>
              <li>• חישוב רמת חדשנות</li>
              <li>• דוחות HTML מעוצבים</li>
              <li>• ממשק רספונסיבי</li>
            </ul>
          </div>

          {/* Developer */}
          <div>
            <h3 className="text-lg font-semibold mb-4">פיתוח</h3>
            <div className="flex items-center space-x-2 space-x-reverse text-gray-300 text-sm">
              <Heart size={16} className="text-red-400" />
              <span>פותח בידי</span>
              <span className="font-medium text-white">ד"ר אסף אוזן</span>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse text-gray-300 text-sm mt-2">
              <Code size={16} className="text-blue-400" />
              <span>גרסה 5.0 - עם שיפורים מהותיים</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 EZRA 5.0. כל הזכויות שמורות. MIT License
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
