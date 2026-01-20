import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../lib/api';
import SEO from '../components/SEO';
import Toast from '../components/Toast';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

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
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" style={{ opacity: 0.05, pointerEvents: 'none' }}></div>
      <SEO
        title="Sign In"
        description="Sign in to your CarrerPortal account to access personalized career recommendations and expert consultations."
      />

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-500 mb-2">
            Welcome Back
          </h1>
          <p className="text-sm text-gray-400">
            Sign in to access your dashboard
          </p>
        </div>

        <div className="glass-card p-8 animate-fade-in-up">
          {/* Login Method Toggle */}
          <div className="flex p-1 mb-6 bg-black/20 rounded-lg border border-white/5">
            <button
              type="button"
              onClick={() => {
                setLoginMethod('password');
                setOtpSent(false);
                setFormData({ ...formData, otp: '' });
              }}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${loginMethod === 'password'
                  ? 'bg-gradient-to-r from-teal-500 to-indigo-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
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
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${loginMethod === 'otp'
                  ? 'bg-gradient-to-r from-teal-500 to-indigo-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
                }`}
            >
              OTP
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <Input
              label="Email address"
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />

            {/* Password Field */}
            {loginMethod === 'password' && (
              <Input
                label="Password"
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            )}

            {/* OTP Field */}
            {loginMethod === 'otp' && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-300">
                    OTP Code
                  </label>
                  {!otpSent && (
                    <button
                      type="button"
                      onClick={handleSendOTP}
                      disabled={loading || !formData.email}
                      className="text-xs font-medium text-teal-400 hover:text-teal-300 disabled:text-gray-500 transition-colors"
                    >
                      Send OTP
                    </button>
                  )}
                </div>
                <Input
                  id="otp"
                  name="otp"
                  type="text"
                  maxLength="6"
                  value={formData.otp}
                  onChange={handleChange}
                  disabled={!otpSent}
                  placeholder="Enter 6-digit OTP"
                  className="text-center tracking-widest text-lg"
                  required
                />
                {otpSent && (
                  <p className="mt-2 text-xs text-green-400 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    OTP sent to your email
                  </p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading || (loginMethod === 'otp' && !otpSent)}
              className="w-full"
              isLoading={loading}
            >
              Sign in
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-teal-400 hover:text-teal-300 transition-colors">
                Create one now
              </Link>
            </p>
          </div>
        </div>

        {/* Special Access Links */}
        <div className="mt-8 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/admin/login"
              className="flex items-center justify-center px-4 py-3 border border-white/10 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all bg-[#0a0a0f]/50 backdrop-blur-sm"
            >
              <span className="mr-2">🔒</span> Admin
            </Link>
            <Link
              to="/expert/login"
              className="flex items-center justify-center px-4 py-3 border border-white/10 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all bg-[#0a0a0f]/50 backdrop-blur-sm"
            >
              <span className="mr-2">🎓</span> Expert
            </Link>
          </div>

          <Link
            to="/expert/register"
            className="flex items-center justify-center px-4 py-3 border border-indigo-500/30 rounded-xl text-sm font-medium text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 hover:text-indigo-300 transition-all backdrop-blur-sm"
          >
            <span>Join as an Expert</span>
            <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
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
