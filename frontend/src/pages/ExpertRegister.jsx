import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../contexts/AuthContext';
import { API } from '../lib/api';
import Toast from '../components/Toast';
import SEO from '../components/SEO';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const ExpertRegister = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(user ? 1 : 0); // 0: Account, 1: Basic, 2: Docs, 3: Verify
  const [otpSent, setOtpSent] = useState(false);

  // Helper to show toast
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const formik = useFormik({
    initialValues: {
      // Account
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      // Expert
      bio: '',
      rate_per_hour: '',
      resume_url: '',
      linkedin_url: '',
      github_url: '',
      portfolio_url: '',
      certificate_urls: [''],
      other_documents: [''],
      specialization: '',
      years_of_experience: '',
      email_for_communication: user?.email || '',
      otp: '',
    },
    validationSchema: Yup.object({
      // Step 0: Account
      name: step === 0 ? Yup.string().required('Name is required') : Yup.string(),
      email: step === 0 ? Yup.string().email('Invalid email').required('Email is required') : Yup.string(),
      password: step === 0 ? Yup.string()
        .min(8, 'Min 8 chars')
        .matches(/[A-Za-z]/, 'Needs a letter')
        .matches(/\d/, 'Needs a number')
        .required('Required') : Yup.string(),
      confirmPassword: step === 0 ? Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Required') : Yup.string(),

      // Step 1: Basic Info
      bio: step === 1 ? Yup.string()
        .min(100, 'Min 100 chars')
        .max(1000, 'Max 1000 chars')
        .required('Bio is required') : Yup.string(),
      rate_per_hour: step === 1 ? Yup.number()
        .min(100, 'Min ₹100')
        .max(10000, 'Max ₹10,000')
        .required('Rate is required') : Yup.number(),
      specialization: step === 1 ? Yup.string().required('Required') : Yup.string(),
      years_of_experience: step === 1 ? Yup.number()
        .min(0, 'Invalid')
        .max(50, 'Max 50 years')
        .required('Required') : Yup.number(),

      // Step 2: Documents
      resume_url: step === 2 ? Yup.string().url('Invalid URL').required('Resume URL is required') : Yup.string(),
      linkedin_url: Yup.string().url('Invalid URL'),
      github_url: Yup.string().url('Invalid URL'),
      portfolio_url: Yup.string().url('Invalid URL'),

      // Step 3: Verify
      email_for_communication: step === 3 ? Yup.string()
        .email('Invalid email')
        .required('Required') : Yup.string(),
      otp: step === 3 ? Yup.string()
        .length(6, 'Must be 6 digits')
        .required('Required') : Yup.string(),
    }),
    onSubmit: async (values) => {
      if (step < 3) return;

      setIsLoading(true);
      try {
        // 1. Create Account if needed
        if (!user) {
          try {
            const regRes = await API.auth.register({
              name: values.name,
              email: values.email,
              password: values.password,
              otp: values.otp // Assuming backend handles this or we skip OTP for this specific flow? 
              // Wait, the original code didn't actually verify OTP for account creation in this flow, 
              // it just registered correctly. Let's assume standard register endpoint works.
              // Actually, looking at original code: it passed `values.otp`. 
              // But `values.otp` is collected in step 3. 
              // If we are step 0, we don't have OTP.
              // The original code Logic: 
              // onSubmit handles everything AT THE END (step 3).
              // So `values.otp` IS available from Step 3 input.
            });

            if (regRes.data.success) {
              login(regRes.data.user, {
                access_token: regRes.data.access_token,
                refresh_token: regRes.data.refresh_token
              });
            }
          } catch (error) {
            showToast(error.response?.data?.error || 'Account creation failed', 'error');
            setIsLoading(false);
            return;
          }
        }

        // 2. Register Expert
        const certs = values.certificate_urls.filter(u => u.trim());
        const docs = values.other_documents.filter(u => u.trim());

        const expertData = {
          bio: values.bio,
          rate_per_hour: parseFloat(values.rate_per_hour),
          resume_url: values.resume_url,
          certificate_urls: certs,
          linkedin_url: values.linkedin_url || null,
          github_url: values.github_url || null,
          portfolio_url: values.portfolio_url || null,
          other_documents: docs,
          specialization: values.specialization,
          years_of_experience: parseInt(values.years_of_experience),
          email_for_communication: values.email_for_communication,
          otp: values.otp,
        };

        const response = await API.experts.register(expertData);

        if (response.data.success) {
          showToast('Application submitted! Awaiting approval.', 'success');
          setTimeout(() => navigate('/dashboard'), 2000);
        }
      } catch (error) {
        showToast(error.response?.data?.error || 'Registration failed', 'error');
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleSendOTP = async () => {
    try {
      setIsLoading(true);
      await API.auth.sendOTP({
        email: formik.values.email_for_communication,
        purpose: 'expert_verification'
      });
      setOtpSent(true);
      showToast('OTP sent to your email', 'success');
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to send OTP', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    const errors = await formik.validateForm();
    let stepErrors = {};

    if (step === 0) {
      if (errors.name) stepErrors.name = errors.name;
      if (errors.email) stepErrors.email = errors.email;
      if (errors.password) stepErrors.password = errors.password;
      if (errors.confirmPassword) stepErrors.confirmPassword = errors.confirmPassword;
      // sync email_for_communication
      if (!Object.keys(stepErrors).length) {
        formik.setFieldValue('email_for_communication', formik.values.email);
      }
    } else if (step === 1) {
      if (errors.bio) stepErrors.bio = errors.bio;
      if (errors.rate_per_hour) stepErrors.rate_per_hour = errors.rate_per_hour;
      if (errors.specialization) stepErrors.specialization = errors.specialization;
      if (errors.years_of_experience) stepErrors.years_of_experience = errors.years_of_experience;
    } else if (step === 2) {
      if (errors.resume_url) stepErrors.resume_url = errors.resume_url;
      // Optional fields don't block next unless invalid URL
      if (errors.linkedin_url) stepErrors.linkedin_url = errors.linkedin_url;
      if (errors.github_url) stepErrors.github_url = errors.github_url;
      if (errors.portfolio_url) stepErrors.portfolio_url = errors.portfolio_url;
    }

    if (Object.keys(stepErrors).length > 0) {
      formik.setTouched(stepErrors);
      showToast('Please fix the errors before proceeding', 'error');
      return;
    }

    setStep(s => s + 1);
  };

  const handleBack = () => {
    if (step > (user ? 1 : 0)) {
      setStep(s => s - 1);
    }
  };

  // Dynamic Field Helpers
  const addField = (field) => {
    formik.setFieldValue(field, [...formik.values[field], '']);
  };
  const removeField = (field, index) => {
    const newArr = formik.values[field].filter((_, i) => i !== index);
    formik.setFieldValue(field, newArr);
  };

  const steps = [
    { title: 'Account', icon: '👤' },
    { title: 'Profile', icon: '📝' },
    { title: 'Docs', icon: '📁' },
    { title: 'Verify', icon: '✅' }
  ];

  // Adjust steps display if user is already logged in (skip step 0 visually or purely via index)
  // Let's keep 4 steps in UI but if user is logged in, start at 1.
  // Actually simpler to just show the relevant steps.
  // If user is logged in, they are effectively at step 1 (Basic Info).
  // Visual Step Index = step - (user ? 1 : 0) ? No, let's just keep strict index.

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" style={{ opacity: 0.05, pointerEvents: 'none' }}></div>
      <SEO title="Expert Registration" description="Join as an expert to offer career consultations." />

      <div className="max-w-3xl w-full relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-500 mb-2">
            Join our Expert Network
          </h1>
          <p className="text-sm text-gray-400">
            Monetize your expertise and mentor the next generation
          </p>
        </div>

        {/* Fancy Stepper */}
        <div className="mb-10 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/10 rounded-full z-0"></div>
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-teal-400 to-indigo-500 rounded-full z-0 transition-all duration-500"
            style={{ width: `${(step / (steps.length - 1)) * 100}%` }}
          ></div>

          <div className="relative z-10 flex justify-between">
            {steps.map((s, i) => {
              // If user is logged in, Step 0 (Account) is skipped or auto-completed.
              // Let's just grey it out if we started past it? No, just show active.
              const isActive = i <= step;
              const isCurrent = i === step;

              return (
                <div key={i} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isActive
                      ? 'bg-[#0a0a0f] border-teal-400 text-teal-400 shadow-[0_0_15px_rgba(45,212,191,0.5)]'
                      : 'bg-[#0a0a0f] border-gray-700 text-gray-700'
                    }`}>
                    <span className="text-lg">{s.icon}</span>
                  </div>
                  <span className={`mt-2 text-xs font-medium transition-colors ${isActive ? 'text-teal-400' : 'text-gray-600'}`}>
                    {s.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass-card p-8 animate-fade-in-up">
          <form className="space-y-6" onSubmit={formik.handleSubmit}>

            {/* Step 0: Account */}
            {step === 0 && !user && (
              <div className="space-y-5 animate-fade-in">
                <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 mb-6">
                  <p className="text-sm text-indigo-300 flex items-center">
                    <span className="mr-2">💡</span> Create an account to manage your expert profile.
                  </p>
                </div>
                <Input
                  label="Full Name"
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  {...formik.getFieldProps('name')}
                  error={formik.touched.name && formik.errors.name}
                />
                <Input
                  label="Email Address"
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  {...formik.getFieldProps('email')}
                  error={formik.touched.email && formik.errors.email}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Password"
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    {...formik.getFieldProps('password')}
                    error={formik.touched.password && formik.errors.password}
                  />
                  <Input
                    label="Confirm Password"
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    {...formik.getFieldProps('confirmPassword')}
                    error={formik.touched.confirmPassword && formik.errors.confirmPassword}
                  />
                </div>
                <div className="text-center pt-2">
                  <p className="text-sm text-gray-400">
                    Already have an account? <Link to="/login" className="text-teal-400 hover:text-teal-300">Login here</Link>
                  </p>
                </div>
              </div>
            )}

            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Professional Bio <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    rows="5"
                    className={`w-full bg-black/20 border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all ${formik.touched.bio && formik.errors.bio ? 'border-red-500/50' : 'border-white/10'
                      }`}
                    placeholder="Tell us about your experience..."
                    {...formik.getFieldProps('bio')}
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-red-400">{formik.touched.bio && formik.errors.bio}</span>
                    <span className="text-xs text-gray-500">{formik.values.bio.length}/1000</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Specialization"
                    id="specialization"
                    placeholder="e.g. AI Engineer"
                    {...formik.getFieldProps('specialization')}
                    error={formik.touched.specialization && formik.errors.specialization}
                  />
                  <Input
                    label="Years of Exp."
                    id="years_of_experience"
                    type="number"
                    placeholder="5"
                    {...formik.getFieldProps('years_of_experience')}
                    error={formik.touched.years_of_experience && formik.errors.years_of_experience}
                  />
                </div>

                <Input
                  label="Hourly Rate (₹)"
                  id="rate_per_hour"
                  type="number"
                  placeholder="1000"
                  {...formik.getFieldProps('rate_per_hour')}
                  error={formik.touched.rate_per_hour && formik.errors.rate_per_hour}
                />
              </div>
            )}

            {/* Step 2: Documents */}
            {step === 2 && (
              <div className="space-y-5 animate-fade-in">
                <Input
                  label="Resume URL (Google Drive/Dropbox)"
                  id="resume_url"
                  placeholder="https://..."
                  {...formik.getFieldProps('resume_url')}
                  error={formik.touched.resume_url && formik.errors.resume_url}
                />

                {/* Dynamic Certificates */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Certificates</label>
                  {formik.values.certificate_urls.map((cert, idx) => (
                    <div key={idx} className="flex gap-2 mb-2">
                      <Input
                        containerClassName="flex-1"
                        placeholder="Certificate URL"
                        value={cert}
                        onChange={(e) => {
                          const newCerts = [...formik.values.certificate_urls];
                          newCerts[idx] = e.target.value;
                          formik.setFieldValue('certificate_urls', newCerts);
                        }}
                      />
                      {formik.values.certificate_urls.length > 1 && (
                        <button type="button" onClick={() => removeField('certificate_urls', idx)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg">✕</button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={() => addField('certificate_urls')} className="text-sm text-teal-400 hover:text-teal-300">+ Add another</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="LinkedIn (Optional)"
                    placeholder="https://linkedin.com/in/..."
                    {...formik.getFieldProps('linkedin_url')}
                    error={formik.touched.linkedin_url && formik.errors.linkedin_url}
                  />
                  <Input
                    label="GitHub (Optional)"
                    placeholder="https://github.com/..."
                    {...formik.getFieldProps('github_url')}
                    error={formik.touched.github_url && formik.errors.github_url}
                  />
                </div>
                <Input
                  label="Portfolio (Optional)"
                  placeholder="https://..."
                  {...formik.getFieldProps('portfolio_url')}
                  error={formik.touched.portfolio_url && formik.errors.portfolio_url}
                />
              </div>
            )}

            {/* Step 3: Verify */}
            {step === 3 && (
              <div className="space-y-6 animate-fade-in text-center">
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                  <p className="text-gray-300 mb-4">
                    Please verify your communication email: <br />
                    <span className="text-white font-semibold">{formik.values.email_for_communication}</span>
                  </p>

                  <div className="flex justify-center mb-4">
                    <Input
                      id="otp"
                      name="otp"
                      maxLength="6"
                      placeholder="000000"
                      className="text-center text-2xl tracking-[0.5em] font-mono w-48 mx-auto"
                      {...formik.getFieldProps('otp')}
                      disabled={!otpSent}
                    />
                  </div>

                  {!otpSent ? (
                    <Button type="button" onClick={handleSendOTP} isLoading={isLoading}>Send Verification Code</Button>
                  ) : (
                    <button type="button" onClick={handleSendOTP} className="text-sm text-teal-400 hover:text-teal-300">Resend Code</button>
                  )}

                  {formik.touched.otp && formik.errors.otp && (
                    <p className="text-red-400 text-sm mt-2">{formik.errors.otp}</p>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Actions */}
            <div className="flex gap-4 pt-4 border-t border-white/10">
              {step > (user ? 1 : 0) && (
                <Button type="button" variant="outline" onClick={handleBack} className="flex-1">Back</Button>
              )}

              {step < 3 ? (
                <Button type="button" onClick={handleNext} className="flex-1">Next Step</Button>
              ) : (
                <Button
                  type="submit"
                  isLoading={isLoading}
                  disabled={!otpSent || isLoading}
                  className="flex-1 bg-gradient-to-r from-teal-500 to-indigo-600"
                >
                  Submit Application
                </Button>
              )}
            </div>

          </form>
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

export default ExpertRegister;
