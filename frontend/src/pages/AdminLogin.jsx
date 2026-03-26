import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { API } from '../lib/api';
import Button from '../components/ui/Button';
import SEO from '../components/SEO';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await API.auth.login({
        email: formData.email,
        password: formData.password
      });

      if (response.data.success) {
        if (!response.data.user.is_admin) {
          setError('Access Denied: You are not an administrator.');
          setLoading(false);
          return;
        }
        login(response.data.user, response.data);
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Access Denied. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <SEO title="Admin Portal" description="Restricted Access" />

      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-md border-t-4 border-slate-800">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center border-2 border-slate-200">
            <svg className="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="mt-6 text-2xl font-bold text-slate-800 tracking-tight">
            Administrative Access
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Secure entry only
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Admin ID
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-400 text-slate-900 rounded bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent sm:text-sm transition-all"
                placeholder="admin@careerportal.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Security Key
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-400 text-slate-900 rounded bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent sm:text-sm transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <Button
            type="submit"
            loading={loading}
            className="w-full justify-center bg-slate-800 hover:bg-slate-900 text-white shadow-lg"
          >
            Authenticate
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button onClick={() => navigate('/login')} className="text-xs text-slate-400 hover:text-slate-600">
            Return to Main Site
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
