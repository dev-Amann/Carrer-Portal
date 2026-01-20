import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../lib/api';
import SEO from '../components/SEO';
import Toast from '../components/Toast';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

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
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" style={{ opacity: 0.05, pointerEvents: 'none' }}></div>
      <SEO
        title="Create Account"
        description="Create your CarrerPortal account to get personalized career recommendations and connect with industry experts."
      />

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-500 mb-2">
            Join Today
          </h1>
          <p className="text-sm text-gray-400">
            Start your journey to a better career
          </p>
        </div>

        <div className="glass-card p-8 animate-fade-in-up">
          {/* Progress Indicator */}
          <div className="mb-8 px-4">
            <div className="flex items-center justify-between relative">
              {/* Connecting Line */}
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-white/10 rounded-full z-0"></div>
              <div
                className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-gradient-to-r from-teal-400 to-indigo-500 rounded-full z-0 transition-all duration-500"
                style={{ width: step === 1 ? '50%' : '100%' }}
              ></div>

              <div className="relative z-10 flex flex-col items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 ${step >= 1 ? 'bg-[#0a0a0f] border-teal-400 text-teal-400 shadow-[0_0_10px_rgba(45,212,191,0.5)]' : 'bg-[#0a0a0f] border-gray-600 text-gray-600'
                  }`}>
                  1
                </div>
                <span className={`mt-2 text-xs font-medium transition-colors duration-300 ${step >= 1 ? 'text-teal-400' : 'text-gray-600'
                  }`}>Details</span>
              </div>

              <div className="relative z-10 flex flex-col items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 ${step >= 2 ? 'bg-[#0a0a0f] border-indigo-500 text-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-[#0a0a0f] border-gray-600 text-gray-600'
                  }`}>
                  2
                </div>
                <span className={`mt-2 text-xs font-medium transition-colors duration-300 ${step >= 2 ? 'text-indigo-500' : 'text-gray-600'
                  }`}>Verify</span>
              </div>
            </div>
          </div>

          {/* Step 1: Enter Details */}
          {step === 1 && (
            <form className="space-y-5 animate-fade-in" onSubmit={handleSendOTP}>
              <Input
                label="Full Name"
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />

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

              <div>
                <Input
                  label="Password"
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
                <p className="mt-1 text-xs text-gray-400">
                  At least 8 characters with letters and numbers
                </p>
              </div>

              <Input
                label="Confirm Password"
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />

              <Button
                type="submit"
                disabled={loading}
                className="w-full"
                isLoading={loading}
                loadingText="Sending OTP..."
              >
                Continue
              </Button>
            </form>
          )}

          {/* Step 2: Verify OTP */}
          {step === 2 && (
            <form className="space-y-6 animate-fade-in" onSubmit={handleSubmit}>
              <div className="text-center">
                <p className="text-sm text-gray-400 mb-6 bg-white/5 p-4 rounded-lg border border-white/10">
                  We've sent a 6-digit verification code to <br />
                  <strong className="text-white block mt-1">{formData.email}</strong>
                </p>

                <Input
                  label="Verification Code"
                  id="otp"
                  name="otp"
                  type="text"
                  maxLength="6"
                  value={formData.otp}
                  onChange={handleChange}
                  placeholder="000000"
                  className="text-center text-2xl tracking-[0.5em] font-mono h-14"
                  autoFocus
                  required
                />

                <p className="mt-2 text-xs text-gray-500">
                  Code expires in 10 minutes
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  isLoading={loading}
                  loadingText="Creating..."
                  className="flex-1"
                >
                  Create Account
                </Button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleSendOTP}
                  disabled={loading}
                  className="text-xs font-medium text-teal-400 hover:text-teal-300 disabled:text-gray-600 transition-colors"
                >
                  Resend OTP
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-teal-400 hover:text-teal-300 transition-colors">
                Sign in
              </Link>
            </p>
          </div>

          {/* Admin and Expert Login Links */}
          {step === 1 && (
            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-center text-xs text-gray-500 mb-4 uppercase tracking-wider font-semibold">
                Special Access
              </p>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <Link
                  to="/admin/login"
                  className="flex items-center justify-center px-4 py-2 border border-white/10 rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all bg-[#0a0a0f]/30"
                >
                  <span className="mr-1.5">🔒</span> Admin
                </Link>
                <Link
                  to="/expert/login"
                  className="flex items-center justify-center px-4 py-2 border border-white/10 rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all bg-[#0a0a0f]/30"
                >
                  <span className="mr-1.5">🎓</span> Expert
                </Link>
              </div>

              {/* Expert Registration CTA */}
              <Link
                to="/expert/register"
                className="flex items-center justify-center w-full px-4 py-2.5 border border-indigo-500/30 rounded-lg text-xs font-semibold text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 hover:text-indigo-300 transition-all"
              >
                Become an Expert - Register Now
              </Link>
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
