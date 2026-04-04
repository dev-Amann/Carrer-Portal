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
      const response = await api.post('/careers/compare/email', {
        career_ids: careerIds
      });
      if (response.data.success) {
        showToast('Comparison report sent to your email!', 'success');
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
      const response = await api.post('/careers/compare/download-pdf', {
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

      showToast('PDF downloaded successfully!', 'success');
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
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden border border-slate-200 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-white flex-shrink-0">
          <h2 className="text-2xl font-bold text-slate-900">
            Career Comparison <span className="text-slate-500 font-normal text-lg ml-2">({careers.length} careers)</span>
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors bg-slate-50 p-2 rounded-full hover:bg-slate-100"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-auto flex-1">
          <table className="w-full border-collapse">
            <thead className="bg-slate-50 sticky top-0 shadow-sm z-10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 bg-slate-50 w-48">
                  Criteria
                </th>
                {careers.map((career) => (
                  <th
                    key={career.id}
                    className="px-6 py-4 text-left text-sm font-bold text-slate-900 border-b border-l border-slate-200 bg-slate-50 min-w-[250px]"
                  >
                    {career.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* Match Score */}
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-5 text-sm font-semibold text-slate-700 bg-white">
                  Match Score
                </td>
                {careers.map((career) => (
                  <td
                    key={career.id}
                    className="px-6 py-5 border-l border-slate-100 bg-white"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-2xl font-bold ${career.match_score >= 80 ? 'text-emerald-600' :
                          career.match_score >= 50 ? 'text-indigo-600' : 'text-amber-500'
                        }`}>
                        {career.match_score}%
                      </span>
                      <div className="flex-1 bg-slate-100 rounded-full h-2 min-w-[100px] overflow-hidden">
                        <div
                          className={`h-full rounded-full ${career.match_score >= 80 ? 'bg-emerald-500' :
                              career.match_score >= 50 ? 'bg-indigo-500' : 'bg-amber-500'
                            }`}
                          style={{ width: `${career.match_score}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Salary Range */}
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-5 text-sm font-semibold text-slate-700 bg-white">
                  Salary Range
                </td>
                {careers.map((career) => (
                  <td
                    key={career.id}
                    className="px-6 py-5 text-sm text-slate-600 border-l border-slate-100 bg-white font-medium"
                  >
                    {career.salary_range || 'N/A'}
                  </td>
                ))}
              </tr>

              {/* Demand Level */}
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-5 text-sm font-semibold text-slate-700 bg-white">
                  Market Demand
                </td>
                {careers.map((career) => (
                  <td
                    key={career.id}
                    className="px-6 py-5 border-l border-slate-100 bg-white"
                  >
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${career.demand_level === 'very_high' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                        career.demand_level === 'high' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                          career.demand_level === 'medium' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                            'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                      {career.demand_level?.replace('_', ' ')}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Skills Match */}
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-5 text-sm font-semibold text-slate-700 bg-white">
                  Skills Match
                </td>
                {careers.map((career) => (
                  <td
                    key={career.id}
                    className="px-6 py-5 text-sm text-slate-600 border-l border-slate-100 bg-white"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{career.matched_skills}</span>
                      <span className="text-slate-400">/</span>
                      <span className="text-slate-500">{career.total_required_skills} skills matched</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Description */}
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-5 text-sm font-semibold text-slate-700 bg-white align-top">
                  Description
                </td>
                {careers.map((career) => (
                  <td
                    key={career.id}
                    className="px-6 py-5 text-sm text-slate-600 border-l border-slate-100 bg-white leading-relaxed align-top"
                  >
                    <p className="line-clamp-4">{career.description}</p>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 bg-slate-50 flex-shrink-0">
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <button
              onClick={handleEmailComparison}
              disabled={loading}
              className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm font-medium"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Email Comparison</span>
            </button>
            <button
              onClick={handleDownloadComparisonPDF}
              disabled={loading}
              className="px-5 py-2.5 bg-white text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-indigo-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm font-medium"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Download PDF</span>
            </button>
            <div className="flex-1 sm:hidden"></div> {/* Spacer for mobile */}
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-medium"
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
