import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../lib/api';
import SEO from '../components/SEO';
import Toast from '../components/Toast';

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState(1); // 1: Enter details, 2: Verify OTP
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    otp: ''
  });
  const [loading, setLoading] = useState(false);
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

  const validateStep1 = () => {
    if (!formData.name.trim()) {
      showToast('Please enter your name', 'error');
      return false;
    }

    if (!formData.email.trim()) {
      showToast('Please enter your email', 'error');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showToast('Please enter a valid email', 'error');
      return false;
    }

    if (!formData.password) {
      showToast('Please enter a password', 'error');
      return false;
    }

    if (formData.password.length < 8) {
      showToast('Password must be at least 8 characters', 'error');
      return false;
    }

    if (!/[A-Za-z]/.test(formData.password)) {
      showToast('Password must contain at least one letter', 'error');
      return false;
    }

    if (!/\d/.test(formData.password)) {
      showToast('Password must contain at least one number', 'error');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      showToast('Passwords do not match', 'error');
      return false;
    }

    return true;
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();

    if (!validateStep1()) {
      return;
    }

    try {
      setLoading(true);
      await authAPI.sendOTP({ email: formData.email, purpose: 'verification' });
      setStep(2);
      showToast('OTP sent to your email', 'success');
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to send OTP', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.otp) {
      showToast('Please enter the OTP', 'error');
      return;
    }

    if (formData.otp.length !== 6) {
      showToast('OTP must be 6 digits', 'error');
      return;
    }

    try {
      setLoading(true);
      const response = await authAPI.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        otp: formData.otp
      });

      if (response.data.success) {
        login(response.data.user, {
          access_token: response.data.access_token,
          refresh_token: response.data.refresh_token
        });
        showToast('Account created successfully!', 'success');
        setTimeout(() => navigate('/career-recommendation'), 1000);
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <SEO
        title="Create Account"
        description="Create your CarrerPortal account to get personalized career recommendations and connect with industry experts."
      />
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </p>
        </div>

        <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  1
                </div>
                <span className="ml-2 text-sm font-medium text-white">Details</span>
              </div>
              <div className={`flex-1 h-1 mx-4 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
              <div className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  2
                </div>
                <span className="ml-2 text-sm font-medium text-white">Verify</span>
              </div>
            </div>
          </div>

          {/* Step 1: Enter Details */}
          {step === 1 && (
            <form className="space-y-6" onSubmit={handleSendOTP}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                  Full Name
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                    placeholder="John Doe"
                  />
                </div>
              </div>

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

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                    placeholder="••••••••"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  At least 8 characters with letters and numbers
                </p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                  Confirm Password
                </label>
                <div className="mt-1">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-emerald-400 to-blue-500 hover:from-emerald-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending OTP...' : 'Continue'}
                </button>
              </div>
            </form>
          )}

          {/* Step 2: Verify OTP */}
          {step === 2 && (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <p className="text-sm text-gray-400 mb-4">
                  We've sent a 6-digit verification code to <strong>{formData.email}</strong>
                </p>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-300">
                  Verification Code
                </label>
                <div className="mt-1">
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    maxLength="6"
                    required
                    value={formData.otp}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm text-center text-2xl tracking-widest"
                    placeholder="000000"
                    autoFocus
                  />
                </div>
                <p className="mt-2 text-xs text-gray-400">
                  Code expires in 10 minutes
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-2 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-emerald-400 to-blue-500 hover:from-emerald-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Verifying...' : 'Create Account'}
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleSendOTP}
                  disabled={loading}
                  className="text-sm font-medium text-blue-600 hover:text-blue-500 disabled:text-gray-400"
                >
                  Resend OTP
                </button>
              </div>
            </form>
          )}

          {/* Admin and Expert Login Links */}
          {step === 1 && (
            <div className="mt-6 pt-6 border-t border-gray-700">
              <p className="text-center text-sm text-gray-400 mb-3">
                Already have special access?
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
              <div className="text-center">
                <p className="text-xs text-gray-400 mb-2">
                  Want to share your expertise?
                </p>
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
          )}
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

export default Signup;
