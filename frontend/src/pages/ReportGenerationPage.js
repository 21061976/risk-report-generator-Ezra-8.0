import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Brain, Clock, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { apiService } from '../utils/apiService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const ReportGenerationPage = () => {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const { dispatch, documents, reports } = useApp();
  
  const [document, setDocument] = useState(null);
  const [report, setReport] = useState(null);
  const [generationStatus, setGenerationStatus] = useState('preparing'); // preparing, generating, completed, error
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [error, setError] = useState(null);

  // Get document from context or fetch it
  useEffect(() => {
    const existingDocument = documents.get(documentId);
    if (existingDocument) {
      setDocument(existingDocument);
    } else {
      fetchDocument();
    }
  }, [documentId, documents]);

  const fetchDocument = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const result = await apiService.getDocument(documentId);
      
      if (result.success) {
        setDocument(result.document);
        dispatch({ type: 'ADD_DOCUMENT', payload: result.document });
      } else {
        throw new Error(result.message || 'לא ניתן לטעון את המסמך');
      }
    } catch (error) {
      setError(error.message);
      toast.error('שגיאה בטעינת המסמך');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const startReportGeneration = async () => {
    try {
      setGenerationStatus('generating');
      setProgress(10);
      setCurrentStep('מתחיל ליצור דוח...');

      const result = await apiService.generateReport({
        documentId,
        projectName: document.projectName,
        organization: document.organization
      });

      if (result.success) {
        const reportId = result.reportId;
        setReport({ id: reportId, status: 'generating' });
        
        // Start polling for progress
        pollReportProgress(reportId);
        
        toast.success('יצירת הדוח החלה!');
      } else {
        throw new Error(result.message || 'שגיאה ביצירת הדוח');
      }
    } catch (error) {
      setGenerationStatus('error');
      setError(error.message);
      toast.error(error.message);
    }
  };

  const pollReportProgress = async (reportId) => {
    const pollInterval = setInterval(async () => {
      try {
        const result = await apiService.getReport(reportId);
        
        if (result.success) {
          const reportData = result.report;
          setReport(reportData);
          setProgress(reportData.progress || 0);
          setCurrentStep(getStatusMessage(reportData.status));
          
          if (reportData.status === 'completed') {
            clearInterval(pollInterval);
            setGenerationStatus('completed');
            dispatch({ type: 'ADD_REPORT', payload: reportData });
            toast.success('הדוח הושלם בהצלחה!');
            
            // Auto-navigate to report view after 2 seconds
            setTimeout(() => {
              navigate(`/report/${reportId}`);
            }, 2000);
          } else if (reportData.status === 'error') {
            clearInterval(pollInterval);
            setGenerationStatus('error');
            setError(reportData.error || 'שגיאה לא ידועה ביצירת הדוח');
          }
        }
      } catch (error) {
        console.error('Polling error:', error);
        // Continue polling unless it's a critical error
      }
    }, 2000); // Poll every 2 seconds

    // Stop polling after 5 minutes (timeout)
    setTimeout(() => {
      clearInterval(pollInterval);
      if (generationStatus === 'generating') {
        setGenerationStatus('error');
        setError('זמן ההמתנה ליצירת הדוח פג');
      }
    }, 5 * 60 * 1000);
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case 'generating':
        return 'מתחיל ניתוח...';
      case 'analyzing':
        return 'מנתח את מסמך התפיסה...';
      case 'processing_with_claude':
        return 'עובד עם Claude AI...';
      case 'parsing_response':
        return 'עובד את תוצאות הניתוח...';
      case 'generating_html':
        return 'יוצר דוח HTML...';
      case 'completed':
        return 'הדוח הושלם!';
      case 'error':
        return 'שגיאה ביצירת הדוח';
      default:
        return 'מעבד...';
    }
  };

  const renderGenerationSteps = () => {
    const steps = [
      { id: 'analyzing', label: 'ניתוח המסמך', icon: FileText },
      { id: 'processing_with_claude', label: 'עיבוד עם AI', icon: Brain },
      { id: 'parsing_response', label: 'עיבוד תוצאות', icon: Clock },
      { id: 'generating_html', label: 'יצירת דוח', icon: FileText },
      { id: 'completed', label: 'הושלם', icon: CheckCircle }
    ];

    return (
      <div className="space-y-4">
        {steps.map((step, index) => {
          const isActive = report?.status === step.id;
          const isCompleted = steps.findIndex(s => s.id === report?.status) > index;
          const Icon = step.icon;
          
          return (
            <div key={step.id} className={`flex items-center p-4 rounded-lg transition-colors ${
              isActive ? 'bg-primary-50 border border-primary-200' :
              isCompleted ? 'bg-green-50 border border-green-200' :
              'bg-gray-50 border border-gray-200'
            }`}>
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                isActive ? 'bg-primary-600 text-white' :
                isCompleted ? 'bg-green-600 text-white' :
                'bg-gray-300 text-gray-600'
              }`}>
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              <div className="mr-4">
                <div className={`font-medium ${
                  isActive ? 'text-primary-900' :
                  isCompleted ? 'text-green-900' :
                  'text-gray-600'
                }`}>
                  {step.label}
                </div>
                {isActive && (
                  <div className="text-sm text-primary-600">{currentStep}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (!document) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" message="טוען מסמך..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            יצירת דוח ניהול סיכונים
          </h1>
          <p className="text-lg text-gray-600">
            {document.projectName} | {document.organization}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Document Summary */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              סיכום המסמך
            </h2>
            
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-600">קובץ:</span>
                <p className="text-gray-900">{document.originalName}</p>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-600">אורך טקסט:</span>
                <p className="text-gray-900">{document.textLength?.toLocaleString()} תווים</p>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-600">סטטוס:</span>
                <p className="text-green-600 font-medium">מוכן לעיבוד</p>
              </div>
            </div>

            {generationStatus === 'preparing' && (
              <button
                onClick={startReportGeneration}
                className="btn-primary w-full mt-6 flex items-center justify-center"
              >
                <Brain className="w-5 h-5 ml-2" />
                התחל יצירת דוח
              </button>
            )}
          </div>

          {/* Generation Progress */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              התקדמות יצירת הדוח
            </h2>

            {generationStatus === 'preparing' && (
              <div className="text-center py-8">
                <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">לחץ "התחל יצירת דוח" כדי להתחיל</p>
              </div>
            )}

            {generationStatus === 'generating' && (
              <div>
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>התקדמות</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {renderGenerationSteps()}
              </div>
            )}

            {generationStatus === 'completed' && (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <p className="text-green-600 font-medium mb-4">הדוח הושלם בהצלחה!</p>
                <button
                  onClick={() => navigate(`/report/${report.id}`)}
                  className="btn-primary"
                >
                  צפה בדוח
                </button>
              </div>
            )}

            {generationStatus === 'error' && (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-600 font-medium mb-4">שגיאה ביצירת הדוח</p>
                <ErrorMessage message={error} />
                <div className="flex gap-4 justify-center mt-4">
                  <button
                    onClick={startReportGeneration}
                    className="btn-primary"
                  >
                    נסה שוב
                  </button>
                  <button
                    onClick={() => navigate('/upload')}
                    className="btn-secondary"
                  >
                    חזור להעלאת מסמך
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportGenerationPage;
