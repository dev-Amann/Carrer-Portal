import { useEffect, useState } from 'react';
import api from '../lib/api';
import Toast from './Toast';

const CareerComparisonModal = ({ careers, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const handleEmailComparison = async () => {
    try {
      setLoading(true);
      const careerIds = careers.map(c => c.id);
      const response = await api.post('/careers/email-comparison', {
        career_ids: careerIds
      });
      if (response.data.success) {
        showToast('📧 Comparison report sent to your email!', 'success');
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to send email', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadComparisonPDF = async () => {
    try {
      setLoading(true);
      const careerIds = careers.map(c => c.id);
      const response = await api.post('/careers/download-comparison-pdf', {
        career_ids: careerIds
      }, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'career_comparison_report.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      showToast('📄 PDF downloaded successfully!', 'success');
    } catch (error) {
      showToast('Failed to download PDF', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-gray-800 rounded-lg shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">
            Career Comparison ({careers.length} careers)
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-x-auto overflow-y-auto max-h-[calc(90vh-80px)]">
          <table className="w-full">
            <thead className="bg-gray-700 sticky top-0">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white border-r border-gray-600">
                  Criteria
                </th>
                {careers.map((career) => (
                  <th
                    key={career.id}
                    className="px-6 py-4 text-left text-sm font-semibold text-white border-r border-gray-600 min-w-[200px]"
                  >
                    {career.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {/* Match Score */}
              <tr className="hover:bg-gray-700/50">
                <td className="px-6 py-4 text-sm font-medium text-white border-r border-gray-600">
                  Match Score
                </td>
                {careers.map((career) => (
                  <td
                    key={career.id}
                    className="px-6 py-4 border-r border-gray-600"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-blue-400">
                        {career.match_score}%
                      </span>
                      <div className="flex-1 bg-gray-600 rounded-full h-2">
                        <div
                          className="bg-blue-400 h-2 rounded-full"
                          style={{ width: `${career.match_score}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Salary Range */}
              <tr className="hover:bg-gray-700/50">
                <td className="px-6 py-4 text-sm font-medium text-white border-r border-gray-600">
                  Salary Range
                </td>
                {careers.map((career) => (
                  <td
                    key={career.id}
                    className="px-6 py-4 text-sm text-gray-300 border-r border-gray-600"
                  >
                    {career.salary_range || 'N/A'}
                  </td>
                ))}
              </tr>

              {/* Demand Level */}
              <tr className="hover:bg-gray-700/50">
                <td className="px-6 py-4 text-sm font-medium text-white border-r border-gray-600">
                  Market Demand
                </td>
                {careers.map((career) => (
                  <td
                    key={career.id}
                    className="px-6 py-4 border-r border-gray-600"
                  >
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      career.demand_level === 'very_high' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      career.demand_level === 'high' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                      career.demand_level === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}>
                      {career.demand_level?.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Skills Match */}
              <tr className="hover:bg-gray-700/50">
                <td className="px-6 py-4 text-sm font-medium text-white border-r border-gray-600">
                  Skills Match
                </td>
                {careers.map((career) => (
                  <td
                    key={career.id}
                    className="px-6 py-4 text-sm text-gray-300 border-r border-gray-600"
                  >
                    {career.matched_skills} / {career.total_required_skills} skills
                  </td>
                ))}
              </tr>

              {/* Description */}
              <tr className="hover:bg-gray-700/50">
                <td className="px-6 py-4 text-sm font-medium text-white border-r border-gray-600">
                  Description
                </td>
                {careers.map((career) => (
                  <td
                    key={career.id}
                    className="px-6 py-4 text-sm text-gray-300 border-r border-gray-600"
                  >
                    <p className="line-clamp-3">{career.description}</p>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700 bg-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              onClick={handleEmailComparison}
              disabled={loading}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>📧</span>
              <span>Email Comparison</span>
            </button>
            <button
              onClick={handleDownloadComparisonPDF}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>📄</span>
              <span>Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
};

export default CareerComparisonModal;
