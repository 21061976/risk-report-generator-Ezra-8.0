import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  Download, 
  Edit3, 
  Save, 
  X, 
  ExternalLink, 
  ArrowLeft,
  FileText,
  Eye,
  Code
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { apiService } from '../utils/apiService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const ReportViewPage = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const { dispatch, reports } = useApp();
  const iframeRef = useRef(null);
  
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('preview'); // preview, edit, source
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const existingReport = reports.get(reportId);
    if (existingReport && existingReport.status === 'completed') {
      setReport(existingReport);
      setLoading(false);
    } else {
      fetchReport();
    }
  }, [reportId, reports]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const result = await apiService.getReport(reportId);
      
      if (result.success && result.report.status === 'completed') {
        setReport(result.report);
        dispatch({ type: 'ADD_REPORT', payload: result.report });
      } else if (result.report.status === 'error') {
        setError(result.report.error || 'שגיאה ביצירת הדוח');
      } else {
        setError('הדוח עדיין לא הושלם');
      }
    } catch (error) {
      setError(error.message);
      toast.error('שגיאה בטעינת הדוח');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format) => {
    try {
      setIsExporting(true);
      const result = await apiService.exportReport(reportId, format);
      
      if (result.success) {
        if (format === 'html') {
          // Download HTML file
          const blob = new Blob([result.content], { type: 'text/html' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `risk-report-${reportId}.html`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          
          toast.success('הדוח יוצא בהצלחה!');
        }
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsExporting(false);
    }
  };

  const renderReportPreview = () => {
    if (!report?.htmlContent) {
      return (
        <div className="text-center py-8">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">אין תוכן HTML להצגה</p>
        </div>
      );
    }

    return (
      <div className="border rounded-lg overflow-hidden">
        <iframe
          ref={iframeRef}
          srcDoc={report.htmlContent}
          className="w-full"
          style={{ height: '800px' }}
          title="תצוגה מקדימה של הדוח"
        />
      </div>
    );
  };

  const renderReportSource = () => {
    if (!report?.htmlContent) return null;

    return (
      <div className="border rounded-lg overflow-hidden">
        <pre className="bg-gray-900 text-green-400 p-4 overflow-auto text-sm" style={{ height: '800px' }}>
          <code>{report.htmlContent}</code>
        </pre>
      </div>
    );
  };

  const renderReportData = () => {
    if (!report?.content) return null;

    return (
      <div className="space-y-6">
        {/* Project Info */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">פרטי הפרויקט</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">שם הפרויקט</label>
              <p className="text-gray-900">{report.content.projectName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">ארגון</label>
              <p className="text-gray-900">{report.content.organization}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">מנהל פרויקט</label>
              <p className="text-gray-900">{report.content.projectManager}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">סוג פרויקט</label>
              <p className="text-gray-900">{report.content.projectType}</p>
            </div>
          </div>
        </div>

        {/* Goals */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">מטרות הפרויקט</h3>
          <div className="space-y-3">
            {report.content.goals?.map((goal) => (
              <div key={goal.id} className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900">{goal.title}</h4>
                <p className="text-blue-700 mt-1">{goal.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Risks */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">סיכונים מזוהים</h3>
          <div className="space-y-4">
            {report.content.risks?.map((risk) => (
              <div key={risk.id} className={`risk-card ${getRiskClass(risk.severity)}`}>
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-medium">{risk.title}</h4>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityBadgeClass(risk.severity)}`}>
                    {getSeverityLabel(risk.severity)}
                  </span>
                </div>
                <p className="text-gray-700 mb-3">{risk.description}</p>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">הסתברות:</span> {risk.probability}
                  </div>
                  <div>
                    <span className="font-medium">נזק:</span> {risk.impact}
                  </div>
                  <div>
                    <span className="font-medium">חומרה:</span> {risk.severity}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Innovation Score */}
        {report.content.innovationLevel && (
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">רמת חדשנות</h3>
            <div className="text-center mb-4">
              <div className="text-4xl font-bold text-primary-600">
                {report.content.innovationLevel.totalScore}
              </div>
              <div className="text-gray-600">רמת החדשנות הכוללת</div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {report.content.innovationLevel.pedagogicalImpact}
                </div>
                <div className="text-sm text-gray-600">השפעה פדגוגית</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {report.content.innovationLevel.technologicalComplexity}
                </div>
                <div className="text-sm text-gray-600">מורכבות טכנולוגית</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {report.content.innovationLevel.organizationalChange}
                </div>
                <div className="text-sm text-gray-600">שינוי ארגוני</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {report.content.innovationLevel.technologicalRisk}
                </div>
                <div className="text-sm text-gray-600">סיכון טכנולוגי</div>
              </div>
            </div>
          </div>
        )}

        {/* Recommendations */}
        {report.content.recommendations && (
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">המלצות לוועדה</h3>
            <div className="space-y-3">
              {report.content.recommendations.map((rec) => (
                <div key={rec.id} className="p-4 bg-green-50 rounded-lg border-r-4 border-green-500">
                  <h4 className="font-medium text-green-900">{rec.title}</h4>
                  <p className="text-green-700 mt-1">{rec.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const getRiskClass = (severity) => {
    if (severity >= 81) return 'risk-very-high';
    if (severity >= 49) return 'risk-high';
    if (severity >= 25) return 'risk-medium';
    return 'risk-low';
  };

  const getSeverityLabel = (severity) => {
    if (severity >= 81) return 'גבוהה מאוד';
    if (severity >= 49) return 'גבוהה';
    if (severity >= 25) return 'בינונית';
    return 'נמוכה';
  };

  const getSeverityBadgeClass = (severity) => {
    if (severity >= 81) return 'bg-red-100 text-red-800';
    if (severity >= 49) return 'bg-orange-100 text-orange-800';
    if (severity >= 25) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" message="טוען דוח..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ErrorMessage message={error} />
          <div className="text-center mt-6">
            <button
              onClick={() => navigate('/reports')}
              className="btn-primary"
            >
              חזור לרשימת דוחות
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4 space-x-reverse">
              <button
                onClick={() => navigate('/reports')}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5 ml-2" />
                חזור לדוחות
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {report?.content?.projectName || 'דוח ניהול סיכונים'}
                </h1>
                <p className="text-sm text-gray-600">
                  {report?.content?.organization}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 space-x-reverse">
              {/* View Mode Selector */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('preview')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    viewMode === 'preview'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Eye className="w-4 h-4 inline ml-1" />
                  תצוגה
                </button>
                <button
                  onClick={() => setViewMode('edit')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    viewMode === 'edit'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Edit3 className="w-4 h-4 inline ml-1" />
                  עריכה
                </button>
                <button
                  onClick={() => setViewMode('source')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    viewMode === 'source'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Code className="w-4 h-4 inline ml-1" />
                  קוד מקור
                </button>
              </div>

              {/* Export Button */}
              <button
                onClick={() => handleExport('html')}
                disabled={isExporting}
                className="btn-primary flex items-center disabled:opacity-50"
              >
                <Download className="w-4 h-4 ml-2" />
                {isExporting ? 'מייצא...' : 'ייצא HTML'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {viewMode === 'preview' && renderReportPreview()}
        {viewMode === 'edit' && renderReportData()}
        {viewMode === 'source' && renderReportSource()}
      </div>
    </div>
  );
};

export default ReportViewPage;
