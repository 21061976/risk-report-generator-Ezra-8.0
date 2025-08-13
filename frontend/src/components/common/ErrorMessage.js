import React from 'react';
import { AlertCircle, X } from 'lucide-react';

const ErrorMessage = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 animate-fade-in">
      <div className="flex items-start">
        <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 ml-3" />
        <div className="flex-1">
          <p className="text-sm text-red-700">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-red-400 hover:text-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
