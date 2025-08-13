import React from 'react';
import { Link } from 'react-router-dom';
import { Upload, FileText, TrendingUp, Shield, Brain, Zap } from 'lucide-react';

const HomePage = () => {
  const features = [
    {
      icon: FileText,
      title: 'ניתוח מסמכים אוטומטי',
      description: 'העלה מסמך תפיסה וקבל ניתוח מלא עם זיהוי מטרות וסיכונים'
    },
    {
      icon: Brain,
      title: 'בינה מלאכותית מתקדמת',
      description: 'מבוסס על Claude AI עם פרומפט EZRA 5.0 מתוחכם'
    },
    {
      icon: TrendingUp,
      title: 'חישוב רמת חדשנות',
      description: 'ניקוד אוטומטי של רמת החדשנות על סקלה של 1-10'
    },
    {
      icon: Shield,
      title: 'התאמה רגולטורית',
      description: 'בדיקה אוטומטית של התאמה לחוזר מנכ"ל ודרישות אסדרה'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 to-secondary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              מחולל דוחות ניהול סיכונים
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 animate-fade-in">
              EZRA 5.0 - מערכת מתקדמת עם בינה מלאכותית
            </p>
            <p className="text-lg mb-12 max-w-3xl mx-auto opacity-80 animate-fade-in">
              צור דוחות ניהול סיכונים מקצועיים במערכת החינוך בתוך דקות. 
              העלה מסמך תפיסה וקבל ניתוח מלא עם המלצות קונקרטיות לוועדה.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <Link
                to="/upload"
                className="inline-flex items-center px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-200 shadow-lg"
              >
                <Upload className="w-5 h-5 ml-2" />
                התחל עכשיו - העלה מסמך
              </Link>
              <Link
                to="/reports"
                className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold text-lg hover:bg-white hover:text-primary-600 transition-colors duration-200"
              >
                <FileText className="w-5 h-5 ml-2" />
                צפה בדוחות קיימים
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              למה EZRA 5.0?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              הפתרון המתקדם ביותר לניהול סיכונים במערכת החינוך
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <feature.icon className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Process Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              איך זה עובד?
            </h2>
            <p className="text-xl text-gray-600">
              תהליך פשוט בשלושה שלבים
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center animate-fade-in">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                העלה מסמך תפיסה
              </h3>
              <p className="text-gray-600">
                העלה קובץ PDF, Word או טקסט עם תפיסת הפרויקט החינוכי שלך
              </p>
            </div>

            <div className="text-center animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                ניתוח אוטומטי
              </h3>
              <p className="text-gray-600">
                המערכת מנתחת את המסמך, מזהה מטרות וסיכונים ומחשבת רמת חדשנות
              </p>
            </div>

            <div className="text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                קבל דוח מושלם
              </h3>
              <p className="text-gray-600">
                דוח HTML מעוצב עם המלצות קונקרטיות לוועדה, ניתן לעריכה וייצוא
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="animate-fade-in">
              <div className="text-4xl font-bold mb-2">5.0</div>
              <div className="text-lg opacity-90">גרסה מתקדמת</div>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="text-4xl font-bold mb-2">AI</div>
              <div className="text-lg opacity-90">מבוסס בינה מלאכותית</div>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl font-bold mb-2">3</div>
              <div className="text-lg opacity-90">מטרות מזוהות</div>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="text-4xl font-bold mb-2">1-10</div>
              <div className="text-lg opacity-90">סקלת חדשנות</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            מוכן ליצור דוח ניהול סיכונים?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            התחל עכשיו והכן דוח מקצועי בתוך דקות
          </p>
          <Link
            to="/upload"
            className="inline-flex items-center px-8 py-4 bg-primary-600 text-white rounded-lg font-semibold text-lg hover:bg-primary-700 transition-colors duration-200 shadow-lg"
          >
            <Zap className="w-5 h-5 ml-2" />
            צור דוח עכשיו
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
