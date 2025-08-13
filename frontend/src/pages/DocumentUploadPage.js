import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import DocumentUploader from '../components/document/DocumentUploader';
import DocumentPreview from '../components/document/DocumentPreview';
import ProjectInfoForm from '../components/document/ProjectInfoForm';
import { apiService } from '../utils/apiService';

const DocumentUploadPage = () => {
  const navigate = useNavigate();
  const { dispatch } = useApp();
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedDocument, setUploadedDocument] = useState(null);
  const [projectInfo, setProjectInfo] = useState({
    projectName: '',
    organization: '',
    description: ''
  });

  const steps = [
    { number: 1, title: 'העלאת מסמך', icon: Upload },
    { number: 2, title: 'פרטי פרויקט', icon: FileText },
    { number: 3, title: 'סיכום ואישור', icon: CheckCircle }
  ];

  const handleDocumentUpload = async (file, additionalData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const result = await apiService.uploadDocument(file, additionalData);
      
      if (result.success) {
        setUploadedDocument(result.document);
        dispatch({ type: 'ADD_DOCUMENT', payload: result.document });
        toast.success('המסמך הועלה בהצלחה!');
        setCurrentStep(2);
      } else {
        throw new Error(result.message || 'שגיאה בהעלאת המסמך');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.message || 'שגיאה בהעלאת המסמך');
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const handleProjectInfoSubmit = (info) => {
    setProjectInfo(info);
    setCurrentStep(3);
  };

  const handleFinalSubmit = () => {
    navigate(`/generate/${uploadedDocument.id}`);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
            currentStep >= step.number
              ? 'bg-primary-600 border-primary-600 text-white'
              : 'border-gray-300 text-gray-500'
          }`}>
            {currentStep > step.number ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <step.icon className="w-5 h-5" />
            )}
          </div>
          <div className="mr-3 text-right">
            <div className={`text-sm font-medium ${
              currentStep >= step.number ? 'text-primary-600' : 'text-gray-500'
            }`}>
              שלב {step.number}
            </div>
            <div className="text-xs text-gray-500">{step.title}</div>
          </div>
          {index < steps.length - 1 && (
            <div className={`w-12 h-0.5 mx-4 ${
              currentStep > step.number ? 'bg-primary-600' : 'bg-gray-300'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <DocumentUploader
            onUpload={handleDocumentUpload}
            projectInfo={projectInfo}
          />
        );
      case 2:
        return (
          <ProjectInfoForm
            initialData={projectInfo}
            onSubmit={handleProjectInfoSubmit}
            onBack={() => setCurrentStep(1)}
          />
        );
      case 3:
        return (
          <div className="max-w-4xl mx-auto">
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                סיכום ואישור
              </h2>
              
              {uploadedDocument && (
                <DocumentPreview
                  document={uploadedDocument}
                  projectInfo={projectInfo}
                />
              )}
              
              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="btn-secondary"
                >
                  חזור לעריכה
                </button>
                <button
                  onClick={handleFinalSubmit}
                  className="btn-primary"
                >
                  המשך ליצירת דוח
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            יצירת דוח ניהול סיכונים חדש
          </h1>
          <p className="text-lg text-gray-600">
            העלה מסמך תפיסה ויצר דוח מקצועי עם בינה מלאכותית
          </p>
        </div>

        {renderStepIndicator()}
        {renderCurrentStep()}
      </div>
    </div>
  );
};

export default DocumentUploadPage;
