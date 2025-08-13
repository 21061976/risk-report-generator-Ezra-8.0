import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

const DocumentUploader = ({ onUpload, projectInfo }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      await onUpload(file, projectInfo);
      setUploadProgress(100);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      clearInterval(progressInterval);
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [onUpload, projectInfo]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    acceptedFiles,
    fileRejections
  } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'text/plain': ['.txt']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: isUploading
  });

  const getDropzoneClassName = () => {
    let baseClasses = "border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer";
    
    if (isDragAccept) {
      return `${baseClasses} border-green-400 bg-green-50`;
    }
    if (isDragReject) {
      return `${baseClasses} border-red-400 bg-red-50`;
    }
    if (isDragActive) {
      return `${baseClasses} border-primary-400 bg-primary-50`;
    }
    return `${baseClasses} border-gray-300 hover:border-primary-400 hover:bg-primary-50`;
  };

  if (isUploading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center">
          <LoadingSpinner size="lg" message="מעלה מסמך..." />
          <div className="mt-6">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="mt-2 text-sm text-gray-600">{uploadProgress}% הושלם</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <div {...getRootProps()} className={getDropzoneClassName()}>
          <input {...getInputProps()} />
          <div className="flex flex-col items-center">
            {isDragActive ? (
              <>
                <Upload className="w-12 h-12 text-primary-600 mb-4" />
                <p className="text-lg font-medium text-primary-600">
                  שחרר כדי להעלות
                </p>
              </>
            ) : (
              <>
                <FileText className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  גרור מסמך לכאן או לחץ לבחירה
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  נתמכים: PDF, Word (.docx, .doc), טקסט (.txt)
                </p>
                <p className="text-xs text-gray-400">
                  גודל מקסימלי: 10MB
                </p>
              </>
            )}
          </div>
        </div>

        {/* File Errors */}
        {fileRejections.length > 0 && (
          <div className="mt-4">
            {fileRejections.map(({ file, errors }) => (
              <div key={file.path} className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <AlertCircle className="w-5 h-5 text-red-500 ml-2" />
                  <span className="font-medium text-red-700">{file.name}</span>
                </div>
                <ul className="text-sm text-red-600 mr-7">
                  {errors.map(error => (
                    <li key={error.code}>
                      {error.code === 'file-too-large' && 'הקובץ גדול מדי (מקסימום 10MB)'}
                      {error.code === 'file-invalid-type' && 'סוג קובץ לא נתמך'}
                      {error.code === 'too-many-files' && 'ניתן להעלות קובץ אחד בלבד'}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Accepted Files */}
        {acceptedFiles.length > 0 && (
          <div className="mt-4">
            {acceptedFiles.map(file => (
              <div key={file.path} className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 ml-2" />
                  <div>
                    <p className="font-medium text-green-700">{file.name}</p>
                    <p className="text-sm text-green-600">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload Guidelines */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">הנחיות להעלאת מסמך:</h3>
          <ul className="text-sm text-blue-700 space-y-1 mr-4">
            <li>• וודא שהמסמך כולל תפיסת פרויקט ברורה</li>
            <li>• כלול מטרות, היקף ולוח זמנים</li>
            <li>• הדגש את ההיבטים החינוכיים והחדשניים</li>
            <li>• המסמך צריך להיות באורך של לפחות 100 מילים</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploader;
