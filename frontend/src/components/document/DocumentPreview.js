import React from 'react';
import { FileText, Calendar, Building, User, CheckCircle, AlertTriangle } from 'lucide-react';

const DocumentPreview = ({ document, projectInfo }) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'processed':
        return 'עובד בהצלחה';
      case 'error':
        return 'שגיאה בעיבוד';
      case 'processing':
        return 'בעיבוד...';
      default:
        return 'הועלה';
    }
  };

  return (
    <div className="space-y-6">
      {/* Document Info */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FileText className="w-5 h-5 ml-2" />
          פרטי המסמך
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-sm font-medium text-gray-600">שם הקובץ:</span>
            <p className="text-gray-900">{document.originalName}</p>
          </div>
          
          <div>
            <span className="text-sm font-medium text-gray-600">גודל:</span>
            <p className="text-gray-900">{formatFileSize(document.size)}</p>
          </div>
          
          <div>
            <span className="text-sm font-medium text-gray-600">סטטוס:</span>
            <div className="flex items-center space-x-2 space-x-reverse">
              {getStatusIcon(document.status)}
              <span className="text-gray-900">{getStatusText(document.status)}</span>
            </div>
          </div>
          
          <div>
            <span className="text-sm font-medium text-gray-600">הועלה:</span>
            <p className="text-gray-900">
              {new Date(document.uploadTime).toLocaleDateString('he-IL')}
            </p>
          </div>
        </div>

        {document.textLength && (
          <div className="mt-4">
            <span className="text-sm font-medium text-gray-600">אורך טקסט:</span>
            <p className="text-gray-900">{document.textLength.toLocaleString()} תווים</p>
          </div>
        )}

        {document.textPreview && (
          <div className="mt-4">
            <span className="text-sm font-medium text-gray-600">תצוגה מקדימה:</span>
            <div className="mt-2 p-3 bg-white rounded border text-sm text-gray-700 leading-relaxed">
              {document.textPreview}
            </div>
          </div>
        )}
      </div>

      {/* Project Info */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Building className="w-5 h-5 ml-2" />
          פרטי הפרויקט
        </h3>
        
        <div className="space-y-3">
          <div>
            <span className="text-sm font-medium text-blue-700">שם הפרויקט:</span>
            <p className="text-gray-900 font-medium">{projectInfo.projectName}</p>
          </div>
          
          <div>
            <span className="text-sm font-medium text-blue-700">ארגון:</span>
            <p className="text-gray-900">{projectInfo.organization}</p>
          </div>
          
          {projectInfo.description && (
            <div>
              <span className="text-sm font-medium text-blue-700">תיאור:</span>
              <p className="text-gray-900">{projectInfo.description}</p>
            </div>
          )}

          {projectInfo.customInstructions && (
            <div>
              <span className="text-sm font-medium text-blue-700">הוראות מיוחדות:</span>
              <p className="text-gray-900">{projectInfo.customInstructions}</p>
            </div>
          )}
        </div>
      </div>

      {/* Validation Results */}
      {document.validation && (
        <div className="bg-yellow-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 ml-2" />
            תוצאות בדיקה
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">מילים במסמך:</span>
              <span className="text-gray-900">{document.validation.statistics?.wordCount}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">פסקאות:</span>
              <span className="text-gray-900">{document.validation.statistics?.paragraphCount}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">זוהו מטרות:</span>
              <span className={`text-sm font-medium ${
                document.validation.statistics?.hasGoals ? 'text-green-600' : 'text-red-600'
              }`}>
                {document.validation.statistics?.hasGoals ? 'כן' : 'לא'}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">זוהה לוח זמנים:</span>
              <span className={`text-sm font-medium ${
                document.validation.statistics?.hasTimeline ? 'text-green-600' : 'text-red-600'
              }`}>
                {document.validation.statistics?.hasTimeline ? 'כן' : 'לא'}
              </span>
            </div>
          </div>

          {document.validation.warnings?.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-orange-700 mb-2">אזהרות:</h4>
              <ul className="space-y-1">
                {document.validation.warnings.map((warning, index) => (
                  <li key={index} className="text-sm text-orange-600 flex items-start">
                    <AlertTriangle className="w-4 h-4 mt-0.5 ml-1 flex-shrink-0" />
                    {warning}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {document.validation.suggestions?.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-blue-700 mb-2">הצעות לשיפור:</h4>
              <ul className="space-y-1">
                {document.validation.suggestions.map((suggestion, index) => (
                  <li key={index} className="text-sm text-blue-600">
                    • {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentPreview;
