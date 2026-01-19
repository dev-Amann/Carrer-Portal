import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useAuth } from '../contexts/AuthContext'
import { API } from '../lib/api'
import Toast from '../components/Toast'
import SEO from '../components/SEO'

const ExpertRegister = () => {
  const navigate = useNavigate()
  const { user, login } = useAuth()
  const [toast, setToast] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(user ? 1 : 0) // 0: Account Creation, 1: Basic Info, 2: Documents, 3: Verification
  const [otpSent, setOtpSent] = useState(false)

  const formik = useFormik({
    initialValues: {
      // Account creation fields (for non-logged-in users)
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      // Expert profile fields
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
      // Account creation validation (only for step 0)
      name: step === 0 ? Yup.string().required('Name is required') : Yup.string(),
      email: step === 0 ? Yup.string().email('Invalid email').required('Email is required') : Yup.string(),
      password: step === 0 ? Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(/[A-Za-z]/, 'Password must contain at least one letter')
        .matches(/\d/, 'Password must contain at least one number')
        .required('Password is required') : Yup.string(),
      confirmPassword: step === 0 ? Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Confirm password is required') : Yup.string(),
      // Expert profile validation
      bio: Yup.string()
        .min(100, 'Bio must be at least 100 characters')
        .max(1000, 'Bio must not exceed 1000 characters')
        .required('Bio is required'),
      rate_per_hour: Yup.number()
        .min(100, 'Rate must be at least ₹100')
        .max(10000, 'Rate must not exceed ₹10,000')
        .required('Hourly rate is required'),
      resume_url: Yup.string()
        .url('Must be a valid URL')
        .required('Resume URL is required'),
      linkedin_url: Yup.string().url('Must be a valid URL'),
      github_url: Yup.string().url('Must be a valid URL'),
      portfolio_url: Yup.string().url('Must be a valid URL'),
      specialization: Yup.string().required('Specialization is required'),
      years_of_experience: Yup.number()
        .min(0, 'Experience cannot be negative')
        .max(50, 'Experience seems too high')
        .required('Years of experience is required'),
      email_for_communication: Yup.string()
        .email('Invalid email')
        .required('Communication email is required'),
      otp: step === 3 ? Yup.string()
        .length(6, 'OTP must be 6 digits')
        .required('OTP is required') : Yup.string(),
    }),
    onSubmit: async (values) => {
      if (step < 3) {
        return
      }

      setIsLoading(true)
      try {
        // If user is not logged in, create account first
        if (!user) {
          try {
            const registerResponse = await API.auth.register({
              name: values.name,
              email: values.email,
              password: values.password,
              otp: values.otp
            })

            if (registerResponse.data.success) {
              // Log the user in
              login(registerResponse.data.user, {
                access_token: registerResponse.data.access_token,
                refresh_token: registerResponse.data.refresh_token
              })
            }
          } catch (error) {
            setToast({
              type: 'error',
              message: error.response?.data?.error || 'Failed to create account. Please try again.',
            })
            setIsLoading(false)
            return
          }
        }

        // Now register as expert
        const certificate_urls = values.certificate_urls.filter(url => url.trim() !== '')
        const other_documents = values.other_documents.filter(url => url.trim() !== '')

        const expertData = {
          bio: values.bio,
          rate_per_hour: parseFloat(values.rate_per_hour),
          resume_url: values.resume_url,
          certificate_urls: certificate_urls,
          linkedin_url: values.linkedin_url || null,
          github_url: values.github_url || null,
          portfolio_url: values.portfolio_url || null,
          other_documents: other_documents,
          specialization: values.specialization,
          years_of_experience: parseInt(values.years_of_experience),
          email_for_communication: values.email_for_communication,
          otp: values.otp,
        }

        const response = await API.experts.register(expertData)

        if (response.data.success) {
          setToast({
            type: 'success',
            message: 'Expert registration submitted! Awaiting admin approval.',
          })
          setTimeout(() => {
            navigate('/dashboard')
          }, 2000)
        }
      } catch (error) {
        console.error('Expert registration error:', error)
        setToast({
          type: 'error',
          message: error.response?.data?.error || 'Registration failed. Please try again.',
        })
      } finally {
        setIsLoading(false)
      }
    },
  })

  const handleSendOTP = async () => {
    try {
      setIsLoading(true)
      await API.auth.sendOTP({
        email: formik.values.email_for_communication,
        purpose: 'expert_verification'
      })
      setOtpSent(true)
      setToast({
        type: 'success',
        message: 'OTP sent to your email',
      })
    } catch (error) {
      setToast({
        type: 'error',
        message: error.response?.data?.error || 'Failed to send OTP',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addCertificateField = () => {
    formik.setFieldValue('certificate_urls', [...formik.values.certificate_urls, ''])
  }

  const removeCertificateField = (index) => {
    const newCertificates = formik.values.certificate_urls.filter((_, i) => i !== index)
    formik.setFieldValue('certificate_urls', newCertificates)
  }

  const addDocumentField = () => {
    formik.setFieldValue('other_documents', [...formik.values.other_documents, ''])
  }

  const removeDocumentField = (index) => {
    const newDocuments = formik.values.other_documents.filter((_, i) => i !== index)
    formik.setFieldValue('other_documents', newDocuments)
  }

  const handleNext = () => {
    if (step === 0) {
      // Validate account creation fields
      const errors = {}
      if (!formik.values.name) errors.name = true
      if (!formik.values.email) errors.email = true
      if (!formik.values.password) errors.password = true
      if (!formik.values.confirmPassword) errors.confirmPassword = true
      if (formik.values.password !== formik.values.confirmPassword) {
        setToast({
          type: 'error',
          message: 'Passwords do not match',
        })
        return
      }

      if (Object.keys(errors).length > 0) {
        setToast({
          type: 'error',
          message: 'Please fill in all required fields',
        })
        return
      }
      // Set email_for_communication to the email they're registering with
      formik.setFieldValue('email_for_communication', formik.values.email)
      setStep(1)
    } else if (step === 1) {
      // Validate basic info fields
      const errors = {}
      if (!formik.values.bio) errors.bio = true
      if (!formik.values.rate_per_hour) errors.rate_per_hour = true
      if (!formik.values.specialization) errors.specialization = true
      if (!formik.values.years_of_experience) errors.years_of_experience = true

      if (Object.keys(errors).length > 0) {
        setToast({
          type: 'error',
          message: 'Please fill in all required fields',
        })
        return
      }
      setStep(2)
    } else if (step === 2) {
      // Validate document fields
      if (!formik.values.resume_url) {
        setToast({
          type: 'error',
          message: 'Resume URL is required',
        })
        return
      }
      setStep(3)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <SEO
        title="Register as Expert"
        description="Register as an expert on CarrerPortal to offer consultation services"
      />
      
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-white">
            Register as an Expert
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Share your expertise and help others in their career journey
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {!user && (
              <>
                <div className="flex items-center flex-1">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    step >= 0 ? 'bg-accent text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    1
                  </div>
                  <span className="ml-2 text-sm font-medium text-white">
                    Account
                  </span>
                </div>
                <div className={`flex-1 h-1 mx-4 ${step >= 1 ? 'bg-accent' : 'bg-gray-300'}`}></div>
              </>
            )}
            <div className="flex items-center flex-1">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step >= 1 ? 'bg-accent text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                {user ? '1' : '2'}
              </div>
              <span className="ml-2 text-sm font-medium text-white">
                Basic Info
              </span>
            </div>
            <div className={`flex-1 h-1 mx-4 ${step >= 2 ? 'bg-accent' : 'bg-gray-300'}`}></div>
            <div className="flex items-center flex-1">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step >= 2 ? 'bg-accent text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                {user ? '2' : '3'}
              </div>
              <span className="ml-2 text-sm font-medium text-white">
                Documents
              </span>
            </div>
            <div className={`flex-1 h-1 mx-4 ${step >= 3 ? 'bg-accent' : 'bg-gray-300'}`}></div>
            <div className="flex items-center flex-1">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step >= 3 ? 'bg-accent text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                {user ? '3' : '4'}
              </div>
              <span className="ml-2 text-sm font-medium text-white">
                Verify
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 shadow rounded-lg p-6">
          <form onSubmit={formik.handleSubmit}>
            {/* Step 0: Account Creation (for non-logged-in users) */}
            {step === 0 && !user && (
              <div className="space-y-6">
                <div className="bg-blue-900/20 border border-blue-800 rounded-md p-4 mb-6">
                  <p className="text-sm text-blue-400">
                    First, let's create your account. You'll use this to access your expert dashboard after approval.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                    placeholder="John Doe"
                    {...formik.getFieldProps('name')}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                    placeholder="john@example.com"
                    {...formik.getFieldProps('email')}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    This will be your login email and communication email
                  </p>
                  {formik.touched.email && formik.errors.email && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                    placeholder="••••••••"
                    {...formik.getFieldProps('password')}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    At least 8 characters with letters and numbers
                  </p>
                  {formik.touched.password && formik.errors.password && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.password}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                    placeholder="••••••••"
                    {...formik.getFieldProps('confirmPassword')}
                  />
                  {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.confirmPassword}</p>
                  )}
                </div>

                <div className="bg-gray-700/50 rounded-md p-4">
                  <p className="text-sm text-gray-300">
                    Already have an account?{' '}
                    <a href="/login" className="text-accent hover:underline">
                      Login here
                    </a>
                  </p>
                </div>
              </div>
            )}

            {/* Step 1: Basic Information */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Professional Bio *
                  </label>
                  <textarea
                    name="bio"
                    rows="6"
                    className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                    placeholder="Tell us about your expertise, experience, and what you can offer..."
                    {...formik.getFieldProps('bio')}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {formik.values.bio.length}/1000 characters (minimum 100)
                  </p>
                  {formik.touched.bio && formik.errors.bio && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.bio}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Specialization *
                    </label>
                    <input
                      type="text"
                      name="specialization"
                      className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                      placeholder="e.g., Software Development, Data Science"
                      {...formik.getFieldProps('specialization')}
                    />
                    {formik.touched.specialization && formik.errors.specialization && (
                      <p className="mt-1 text-sm text-red-600">{formik.errors.specialization}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Years of Experience *
                    </label>
                    <input
                      type="number"
                      name="years_of_experience"
                      className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                      placeholder="5"
                      {...formik.getFieldProps('years_of_experience')}
                    />
                    {formik.touched.years_of_experience && formik.errors.years_of_experience && (
                      <p className="mt-1 text-sm text-red-600">{formik.errors.years_of_experience}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Hourly Rate (₹) *
                  </label>
                  <input
                    type="number"
                    name="rate_per_hour"
                    className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                    placeholder="1000"
                    {...formik.getFieldProps('rate_per_hour')}
                  />
                  {formik.touched.rate_per_hour && formik.errors.rate_per_hour && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.rate_per_hour}</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Documents and Links */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Resume URL *
                  </label>
                  <input
                    type="url"
                    name="resume_url"
                    className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                    placeholder="https://drive.google.com/your-resume"
                    {...formik.getFieldProps('resume_url')}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Upload your resume to Google Drive, Dropbox, or similar and paste the shareable link
                  </p>
                  {formik.touched.resume_url && formik.errors.resume_url && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.resume_url}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Certificates
                  </label>
                  {formik.values.certificate_urls.map((cert, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="url"
                        value={cert}
                        onChange={(e) => {
                          const newCerts = [...formik.values.certificate_urls]
                          newCerts[index] = e.target.value
                          formik.setFieldValue('certificate_urls', newCerts)
                        }}
                        className="flex-1 px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                        placeholder="https://certificate-url.com"
                      />
                      {formik.values.certificate_urls.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeCertificateField(index)}
                          className="px-3 py-2 text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addCertificateField}
                    className="text-sm text-accent hover:text-accent-dark"
                  >
                    + Add Another Certificate
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Other Documents
                  </label>
                  {formik.values.other_documents.map((doc, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="url"
                        value={doc}
                        onChange={(e) => {
                          const newDocs = [...formik.values.other_documents]
                          newDocs[index] = e.target.value
                          formik.setFieldValue('other_documents', newDocs)
                        }}
                        className="flex-1 px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                        placeholder="https://document-url.com"
                      />
                      {formik.values.other_documents.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeDocumentField(index)}
                          className="px-3 py-2 text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addDocumentField}
                    className="text-sm text-accent hover:text-accent-dark"
                  >
                    + Add Another Document
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      LinkedIn Profile
                    </label>
                    <input
                      type="url"
                      name="linkedin_url"
                      className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                      placeholder="https://linkedin.com/in/yourprofile"
                      {...formik.getFieldProps('linkedin_url')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      GitHub Profile
                    </label>
                    <input
                      type="url"
                      name="github_url"
                      className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                      placeholder="https://github.com/yourusername"
                      {...formik.getFieldProps('github_url')}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Portfolio Website
                  </label>
                  <input
                    type="url"
                    name="portfolio_url"
                    className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                    placeholder="https://yourportfolio.com"
                    {...formik.getFieldProps('portfolio_url')}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Email Verification */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Communication Email *
                  </label>
                  <input
                    type="email"
                    name="email_for_communication"
                    className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                    placeholder="your@email.com"
                    {...formik.getFieldProps('email_for_communication')}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    This email will be used for all future communications regarding your expert profile
                  </p>
                  {formik.touched.email_for_communication && formik.errors.email_for_communication && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.email_for_communication}</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-gray-300">
                      Verification OTP *
                    </label>
                    {!otpSent ? (
                      <button
                        type="button"
                        onClick={handleSendOTP}
                        disabled={isLoading || !formik.values.email_for_communication}
                        className="text-sm font-medium text-accent hover:text-accent-dark disabled:text-gray-400"
                      >
                        Send OTP
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendOTP}
                        disabled={isLoading}
                        className="text-sm font-medium text-accent hover:text-accent-dark disabled:text-gray-400"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    name="otp"
                    maxLength="6"
                    disabled={!otpSent}
                    className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 text-center text-2xl tracking-widest"
                    placeholder="000000"
                    {...formik.getFieldProps('otp')}
                  />
                  {otpSent && (
                    <p className="mt-1 text-xs text-gray-500">
                      OTP sent to {formik.values.email_for_communication}. Check your inbox.
                    </p>
                  )}
                  {formik.touched.otp && formik.errors.otp && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.otp}</p>
                  )}
                </div>

                <div className="bg-blue-900/20 border border-blue-800 rounded-md p-4">
                  <h4 className="text-sm font-medium text-blue-300 mb-2">
                    What happens next?
                  </h4>
                  <ul className="text-sm text-blue-400 space-y-1">
                    <li>• Your application will be sent to the admin for review</li>
                    <li>• Admin will review your documents and credentials</li>
                    <li>• You'll receive an email notification once approved</li>
                    <li>• After approval, you can start offering consultations</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-8 flex gap-4">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700"
                >
                  Back
                </button>
              )}
              
              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-primary-start to-primary-end text-white rounded-md hover:opacity-90"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading || !otpSent}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-primary-start to-primary-end text-white rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Submitting...' : 'Submit Application'}
                </button>
              )}
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link to="/dashboard" className="text-sm text-gray-400 hover:text-accent">
              Cancel and go back to dashboard
            </Link>
          </div>
        </div>
      </div>

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}

export default ExpertRegister
