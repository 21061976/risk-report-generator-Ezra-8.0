import React, { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const ProjectInfoForm = ({ initialData, onSubmit, onBack }) => {
  const [formData, setFormData] = useState({
    projectName: initialData?.projectName || '',
    organization: initialData?.organization || '',
    description: initialData?.description || '',
    customInstructions: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.projectName.trim()) {
      newErrors.projectName = 'שם הפרויקט נדרש';
    }
    
    if (!formData.organization.trim()) {
      newErrors.organization = 'שם הארגון נדרש';
    }

    if (formData.projectName.length > 100) {
      newErrors.projectName = 'שם הפרויקט ארוך מדי (מקסימום 100 תווים)';
    }

    if (formData.organization.length > 100) {
      newErrors.organization = 'שם הארגון ארוך מדי (מקסימום 100 תווים)';
    }

    if (formData.description.length > 500) {
      newErrors.description = 'התיאור ארוך מדי (מקסימום 500 תווים)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          פרטי הפרויקט
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Name */}
          <div>
            <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-2">
              שם הפרויקט *
            </label>
            <input
              type="text"
              id="projectName"
              name="projectName"
              value={formData.projectName}
              onChange={handleChange}
              className={`input-field ${errors.projectName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
              placeholder="הזן את שם הפרויקט"
              maxLength={100}
            />
            {errors.projectName && (
              <p className="mt-1 text-sm text-red-600">{errors.projectName}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {formData.projectName.length}/100 תווים
            </p>
          </div>

          {/* Organization */}
          <div>
            <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-2">
              ארגון / מוסד חינוך *
            </label>
            <input
              type="text"
              id="organization"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              className={`input-field ${errors.organization ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
              placeholder="שם בית הספר / הארגון"
              maxLength={100}
            />
            {errors.organization && (
              <p className="mt-1 text-sm text-red-600">{errors.organization}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {formData.organization.length}/100 תווים
            </p>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              תיאור נוסף (אופציונלי)
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className={`input-field ${errors.description ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
              placeholder="הוסף מידע נוסף על הפרויקט..."
              maxLength={500}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {formData.description.length}/500 תווים
            </p>
          </div>

          {/* Custom Instructions */}
          <div>
            <label htmlFor="customInstructions" className="block text-sm font-medium text-gray-700 mb-2">
              הוראות מיוחדות לניתוח (אופציונלי)
            </label>
            <textarea
              id="customInstructions"
              name="customInstructions"
              rows={3}
              value={formData.customInstructions}
              onChange={handleChange}
              className="input-field"
              placeholder="הוסף הוראות מיוחדות למערכת הניתוח..."
            />
            <p className="mt-1 text-xs text-gray-500">
              למשל: התמקד בהיבטים טכנולוגיים, שים דגש על בטיחות, וכו'
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex justify-between pt-6">
            <button
              type="button"
              onClick={onBack}
              className="btn-secondary flex items-center"
            >
              <ArrowRight className="w-4 h-4 ml-2" />
              חזור
            </button>
            <button
              type="submit"
              className="btn-primary flex items-center"
            >
              המשך
              <ArrowLeft className="w-4 h-4 mr-2" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectInfoForm;
