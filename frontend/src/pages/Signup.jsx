import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import SEO from '../components/SEO';

const Signup = () => {
  const navigate = useNavigate();
  const { signup, sendOTP } = useAuth();

  // Steps: 'details' -> 'otp'
  const [step, setStep] = useState('details');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    otp: ''
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

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    if (formData.password.length < 8) {
      return setError('Password must be at least 8 characters');
    }

    if (!/[A-Za-z]/.test(formData.password)) {
      return setError('Password must contain at least one letter');
    }

    if (!/\d/.test(formData.password)) {
      return setError('Password must contain at least one number');
    }

    setLoading(true);

    try {
      // Send OTP to email
      await sendOTP(formData.email, 'verification');
      setStep('otp');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP code. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Call register with OTP
      await signup(formData.name, formData.email, formData.password, formData.otp);
      navigate('/dashboard');
    } catch (err) {
      // If error is "Email already registered" (409), user might want to go back or login
      if (err.response?.status === 409) {
        setError("Email is already registered. Please login.");
      } else {
        setError(err.response?.data?.error || 'Failed to verify OTP and create account.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <SEO title="Sign Up" description="Create your CareerPortal account" />

      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-indigo-100 rounded-xl flex items-center justify-center">
            <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-slate-900">
            {step === 'details' ? 'Create an account' : 'Verify Email'}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            {step === 'details' ? (
              <>
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Sign in here
                </Link>
              </>
            ) : (
              <>
                Please enter the verification code sent to <br />
                <span className="font-medium text-slate-900">{formData.email}</span>
              </>
            )}
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

        {step === 'details' ? (
          <form className="mt-8 space-y-6" onSubmit={handleVerifyEmail}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-400 text-slate-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-400 text-slate-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-400 text-slate-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Create a password"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-400 text-slate-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-slate-600">
                I agree to the <Link to="/terms" className="text-indigo-600 hover:text-indigo-500">Terms</Link> and <Link to="/privacy" className="text-indigo-600 hover:text-indigo-500">Privacy Policy</Link>
              </label>
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full justify-center bg-indigo-600 hover:bg-indigo-700"
            >
              Continue to Verification
            </Button>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleRegister}>
            <div className="space-y-4">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-slate-700 mb-1">
                  Enter Verification Code
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  maxLength="6"
                  value={formData.otp}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-400 text-slate-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm tracking-widest text-center text-lg" // Center align and larger text for OTP
                  placeholder="000000"
                />
                <p className="mt-2 text-xs text-center text-slate-500">
                  Did not receive code? <button type="button" onClick={() => handleVerifyEmail({ preventDefault: () => { } })} className="text-indigo-600 hover:text-indigo-500 font-medium">Resend</button>
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                type="submit"
                loading={loading}
                className="w-full justify-center bg-indigo-600 hover:bg-indigo-700"
              >
                Create Account
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={() => setStep('details')}
                className="w-full justify-center"
              >
                Back to Details
              </Button>
            </div>
          </form>
        )}

        {step === 'details' && (
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
              Want to become a mentor?{' '}
              <Link to="/expert/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                Apply as Expert
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;
