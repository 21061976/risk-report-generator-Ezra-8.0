import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 1 minute timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    
    if (error.response?.status === 429) {
      throw new Error('יותר מדי בקשות, נסה שוב מאוחר יותר');
    } else if (error.response?.status === 401) {
      throw new Error('אין הרשאה לבצע פעולה זו');
    } else if (error.response?.status >= 500) {
      throw new Error('שגיאה בשרת, נסה שוב מאוחר יותר');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('זמן ההמתנה פג, נסה שוב');
    }
    
    return Promise.reject(error);
  }
);

export const apiService = {
  // Document endpoints
  uploadDocument: async (file, additionalData = {}) => {
    try {
      const formData = new FormData();
      formData.append('document', file);
      
      // Add additional data to form
      Object.keys(additionalData).forEach(key => {
        if (additionalData[key]) {
          formData.append(key, additionalData[key]);
        }
      });

      const response = await api.post('/api/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Upload progress: ${progress}%`);
        }
      });
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'שגיאה בהעלאת המסמך');
    }
  },

  getDocument: async (documentId) => {
    try {
      const response = await api.get(`/api/documents/${documentId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'שגיאה בטעינת המסמך');
    }
  },

  processDocument: async (documentId) => {
    try {
      const response = await api.post(`/api/documents/process/${documentId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'שגיאה בעיבוד המסמך');
    }
  },

  // Report endpoints
  generateReport: async (reportData) => {
    try {
      const response = await api.post('/api/reports/generate', reportData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'שגיאה ביצירת הדוח');
    }
  },

  getReport: async (reportId) => {
    try {
      const response = await api.get(`/api/reports/${reportId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'שגיאה בטעינת הדוח');
    }
  },

  updateReport: async (reportId, updateData) => {
    try {
      const response = await api.put(`/api/reports/${reportId}`, updateData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'שגיאה בעדכון הדוח');
    }
  },

  exportReport: async (reportId, format) => {
    try {
      const response = await api.post(`/api/reports/${reportId}/export`, { format }, {
        responseType: format === 'html' ? 'text' : 'blob'
      });
      
      if (format === 'html') {
        return { success: true, content: response.data };
      } else {
        // Handle binary formats (PDF, DOCX) when implemented
        return { success: true, blob: response.data };
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'שגיאה בייצוא הדוח');
    }
  },

  listReports: async (page = 1, limit = 10) => {
    try {
      const response = await api.get('/api/reports', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'שגיאה בטעינת רשימת הדוחות');
    }
  },

  // Health endpoints
  getHealth: async () => {
    try {
      const response = await api.get('/api/health');
      return response.data;
    } catch (error) {
      throw new Error('שגיאה בבדיקת מצב המערכת');
    }
  }
};
