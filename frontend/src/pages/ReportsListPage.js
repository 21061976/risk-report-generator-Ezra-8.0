import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  FileText, 
  Calendar, 
  Building, 
  Eye, 
  Trash2, 
  Plus,
  Search,
  Filter
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { apiService } from '../utils/apiService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const ReportsListPage = () => {
  const { dispatch } = useApp();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchReports();
  }, [currentPage]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const result = await apiService.listReports(currentPage, 10);
      
      if (result.success) {
        setReports(result.reports);
        setTotalPages(Math.ceil(result.pagination.total / result.pagination.limit));
      } else {
        throw new Error(result.message || 'שגיאה בטעינת הדוחות');
      }
    } catch (error) {
      setError(error.message);
      toast.error('שגיאה בטעינת רשימת הדוחות');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <FileText className="w-5 h-5 text-green-500" />;
      case 'generating':
        return <FileText className="w-5 h-5 text-blue-500 animate-pulse" />;
      case 'error':
        return <FileText className="w-5 h-5 text-red-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'הושלם';
      case 'generating':
        return 'בהכנה';
      case 'error':
        return 'שגיאה';
      default:
        return 'לא ידוע';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'generating':
        return 'bg-blue-100 text-blue-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.organization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || report.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading && reports.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" message="טוען דוחות..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">דוחות ניהול סיכונים</h1>
              <p className="text-lg text-gray-600 mt-2">
                כל הדוחות שנוצרו במערכת
              </p>
            </div>
            <Link
              to="/upload"
              className="btn-primary flex items-center"
            >
              <Plus className="w-5 h-5 ml-2" />
              דוח חדש
            </Link>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="חפש לפי שם פרויקט או ארגון..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pr-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input-field"
              >
                <option value="all">כל הסטטוסים</option>
                <option value="completed">הושלם</option>
                <option value="generating">בהכנה</option>
                <option value="error">שגיאה</option>
              </select>
            </div>
          </div>
        </div>

        {error && <ErrorMessage message={error} onClose={() => setError(null)} />}

        {/* Reports Grid */}
        {filteredReports.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || filterStatus !== 'all' ? 'לא נמצאו דוחות' : 'אין דוחות עדיין'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterStatus !== 'all' 
                ? 'נסה לשנות את הפילטרים או החיפוש' 
                : 'התחל ביצירת הדוח הראשון שלך'}
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <Link to="/upload" className="btn-primary">
                צור דוח חדש
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report) => (
              <div key={report.id} className="card hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  {getStatusIcon(report.status)}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(report.status)}`}>
                    {getStatusText(report.status)}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {report.projectName}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Building className="w-4 h-4 ml-2" />
                    {report.organization}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 ml-2" />
                    {new Date(report.createdAt).toLocaleDateString('he-IL')}
                  </div>
                </div>

                {report.progress !== undefined && report.status === 'generating' && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>התקדמות</span>
                      <span>{report.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${report.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="flex space-x-2 space-x-reverse">
                    {report.status === 'completed' && (
                      <Link
                        to={`/report/${report.id}`}
                        className="flex items-center px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                      >
                        <Eye className="w-4 h-4 ml-1" />
                        צפה
                      </Link>
                    )}
                    {report.status === 'generating' && (
                      <span className="text-sm text-blue-600 font-medium">
                        בהכנה...
                      </span>
                    )}
                    {report.status === 'error' && (
                      <span className="text-sm text-red-600 font-medium">
                        שגיאה ביצירה
                      </span>
                    )}
                  </div>

                  <button className="text-gray-400 hover:text-red-600 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2 space-x-reverse">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsListPage;
