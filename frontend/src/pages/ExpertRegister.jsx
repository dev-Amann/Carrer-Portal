import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API } from '../lib/api';
import SEO from '../components/SEO';
import Step1Account from '../components/expert-register/Step1Account';
import Step2Profile from '../components/expert-register/Step2Profile';

const ExpertRegister = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // OTP State
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [timer, setTimer] = useState(0);

  // Form Data
  const [formData, setFormData] = useState({
    // Account Details
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    otp: '',

    // Professional Details
    title: '', // bio in backend
    specialization: '', // new field
    experience_years: '',
    rate_per_hour: '',

    // URLs
    resume_url: '',
    linkedin_url: '',
    github_url: '',
    portfolio_url: '',

    // Other
    bio: '' // extended bio
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const startTimer = () => {
    setTimer(60);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOTP = async () => {
    if (!formData.email) {
      return setError('Please enter your email address');
    }

    setLoading(true);
    setError('');

    try {
      await API.auth.sendOTP({
        email: formData.email,
        purpose: 'verification'
      });
      setOtpSent(true);
      setSuccessMessage('OTP sent successfully to your email');
      startTimer();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!formData.otp) {
      return setError('Please enter the OTP');
    }

    setLoading(true);
    setError('');

    try {
      await API.auth.verifyOTP({
        email: formData.email,
        otp: formData.otp,
        purpose: 'verification'
      });
      setOtpVerified(true);
      setSuccessMessage('OTP verified successfully');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterUser = async () => {
    // Validate Step 1
    if (!formData.name || !formData.email || !formData.password || !formData.otp) {
      return setError('Please fill in all fields and verify OTP');
    }
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    if (!otpVerified) {
      return setError('Please verify your email with OTP');
    }

    setLoading(true);
    setError('');

    try {
      // 1. Register User
      const registerRes = await API.auth.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        otp: formData.otp
      });

      // 2. Save Token (Auto Login)
      if (registerRes.data.access_token) {
        localStorage.setItem('accessToken', registerRes.data.access_token);
        localStorage.setItem('refreshToken', registerRes.data.refresh_token);
        localStorage.setItem('user', JSON.stringify(registerRes.data.user));

        // Move to Step 2
        setStep(2);
        setSuccessMessage('');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitExpertProfile = async (e) => {
    e.preventDefault();
    setError('');

    // Validate Step 2
    if (!formData.specialization || !formData.experience_years || !formData.rate_per_hour || !formData.resume_url || !formData.bio) {
      return setError('Please fill in all required professional details including Resume URL');
    }

    setLoading(true);

    try {
      // Prepare payload matches backend expectation
      const payload = {
        bio: formData.bio,
        resume_url: formData.resume_url,
        certificate_urls: [], // Can add field if needed later
        rate_per_hour: parseFloat(formData.rate_per_hour),
        linkedin_url: formData.linkedin_url,
        github_url: formData.github_url,
        portfolio_url: formData.portfolio_url,
        other_documents: [],
        specialization: formData.specialization,
        years_of_experience: parseInt(formData.experience_years),
        email_for_communication: formData.email, // Default to account email
        otp: formData.otp // Backend requirement check
      };

      await API.experts.register(payload);

      navigate('/expert/login', {
        state: { message: 'Application submitted! Please wait for admin approval.' }
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <SEO title="Expert Application" description="Apply to become a mentor" />

      <div className="max-w-2xl w-full bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Join as an Expert
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Share your knowledge and earn by mentoring others
          </p>

          {/* Progress Steps */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-indigo-600' : 'text-slate-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 font-bold ${step >= 1 ? 'border-indigo-600 bg-indigo-50' : 'border-slate-300'}`}>1</div>
              <span className="text-sm font-medium">Account</span>
            </div>
            <div className={`w-12 h-0.5 ${step >= 2 ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-indigo-600' : 'text-slate-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 font-bold ${step >= 2 ? 'border-indigo-600 bg-indigo-50' : 'border-slate-300'}`}>2</div>
              <span className="text-sm font-medium">Profile</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {successMessage}
          </div>
        )}

        {step === 1 ? (
          <Step1Account
            formData={formData}
            handleChange={handleChange}
            onNext={handleRegisterUser}
            loading={loading}
            otpSent={otpSent}
            otpVerified={otpVerified}
            timer={timer}
            onSendOTP={handleSendOTP}
            onVerifyOTP={handleVerifyOTP}
          />
        ) : (
          <Step2Profile
            formData={formData}
            handleChange={handleChange}
            onSubmit={handleSubmitExpertProfile}
            onBack={() => setStep(1)}
            loading={loading}
          />
        )}

        <div className="mt-8 text-center border-t border-slate-100 pt-6">
          <p className="text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/expert/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in to portal
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExpertRegister;
