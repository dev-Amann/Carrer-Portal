import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../lib/api';
import SEO from '../components/SEO';
import Toast from '../components/Toast';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loginMethod, setLoginMethod] = useState('password'); // 'password' or 'otp'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    otp: ''
  });
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    if (!formData.email) {
      showToast('Please enter your email', 'error');
      return;
    }

    try {
      setLoading(true);
      await authAPI.sendOTP({ email: formData.email, purpose: 'login' });
      setOtpSent(true);
      showToast('OTP sent to your email', 'success');
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to send OTP', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email) {
      showToast('Please enter your email', 'error');
      return;
    }

    if (loginMethod === 'password' && !formData.password) {
      showToast('Please enter your password', 'error');
      return;
    }

    if (loginMethod === 'otp' && !formData.otp) {
      showToast('Please enter the OTP', 'error');
      return;
    }

    try {
      setLoading(true);
      const loginData = {
        email: formData.email,
        ...(loginMethod === 'password' ? { password: formData.password } : { otp: formData.otp })
      };

      const response = await authAPI.login(loginData);
      
      if (response.data.success) {
        login(response.data.user, {
          access_token: response.data.access_token,
          refresh_token: response.data.refresh_token
        });
        showToast('Login successful!', 'success');
        setTimeout(() => navigate('/career-recommendation'), 1000);
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <SEO
        title="Sign In"
        description="Sign in to your CarrerPortal account to access personalized career recommendations and expert consultations."
      />
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Or{' '}
            <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
              create a new account
            </Link>
          </p>
        </div>

        <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Login Method Toggle */}
          <div className="flex rounded-lg bg-gray-700 p-1 mb-6">
            <button
              type="button"
              onClick={() => {
                setLoginMethod('password');
                setOtpSent(false);
                setFormData({ ...formData, otp: '' });
              }}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                loginMethod === 'password'
                  ? 'bg-white dark:bg-gray-600 text-white shadow'
                  : 'text-gray-300'
              }`}
            >
              Password
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginMethod('otp');
                setFormData({ ...formData, password: '' });
              }}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                loginMethod === 'otp'
                  ? 'bg-white dark:bg-gray-600 text-white shadow'
                  : 'text-gray-300'
              }`}
            >
              OTP
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password Field */}
            {loginMethod === 'password' && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            {/* OTP Field */}
            {loginMethod === 'otp' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-300">
                    OTP Code
                  </label>
                  {!otpSent && (
                    <button
                      type="button"
                      onClick={handleSendOTP}
                      disabled={loading || !formData.email}
                      className="text-sm font-medium text-blue-600 hover:text-blue-500 disabled:text-gray-400"
                    >
                      Send OTP
                    </button>
                  )}
                </div>
                <div className="mt-1">
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    maxLength="6"
                    required
                    value={formData.otp}
                    onChange={handleChange}
                    disabled={!otpSent}
                    className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm disabled:bg-gray-100 dark:disabled:bg-gray-800"
                    placeholder="Enter 6-digit OTP"
                  />
                </div>
                {otpSent && (
                  <p className="mt-2 text-sm text-gray-400">
                    OTP sent to your email. Check your inbox.
                  </p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading || (loginMethod === 'otp' && !otpSent)}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-emerald-400 to-blue-500 hover:from-emerald-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Please wait...' : 'Sign in'}
              </button>
            </div>
          </form>

          {/* Admin and Expert Login Links */}
          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-center text-sm text-gray-400 mb-3">
              Special Access
            </p>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <Link
                to="/admin/login"
                className="flex items-center justify-center px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Admin Login
              </Link>
              <Link
                to="/expert/login"
                className="flex items-center justify-center px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Expert Login
              </Link>
            </div>
            
            {/* Expert Registration CTA */}
            <Link
              to="/expert/register"
              className="flex items-center justify-center w-full px-4 py-3 border-2 border-accent rounded-md shadow-sm text-sm font-semibold text-accent bg-accent/10 hover:bg-accent/20 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              Become an Expert - Register Now
            </Link>
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

export default Login;
