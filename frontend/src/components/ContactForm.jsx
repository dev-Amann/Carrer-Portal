import { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { contactAPI } from '../lib/api'
import Toast from './Toast'

/**
 * ContactForm component with Formik validation
 * Includes honeypot spam prevention and optional reCAPTCHA support
 * 
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7
 */
const ContactForm = ({ prefilledService = '' }) => {
  const [toast, setToast] = useState(null)

  // Yup validation schema
  const validationSchema = Yup.object({
    fullName: Yup.string()
      .required('Full name is required')
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must be less than 100 characters'),
    businessName: Yup.string()
      .max(100, 'Business name must be less than 100 characters'),
    email: Yup.string()
      .required('Email is required')
      .email('Invalid email address'),
    phone: Yup.string()
      .matches(/^[0-9+\-\s()]*$/, 'Invalid phone number format')
      .min(10, 'Phone number must be at least 10 digits')
      .max(20, 'Phone number must be less than 20 characters'),
    budgetRange: Yup.string()
      .required('Budget range is required'),
    interestedService: Yup.string()
      .required('Please select a service'),
    message: Yup.string()
      .required('Message is required')
      .min(10, 'Message must be at least 10 characters')
      .max(1000, 'Message must be less than 1000 characters'),
    consent: Yup.boolean()
      .oneOf([true], 'You must accept the terms and conditions'),
    website: Yup.string() // Honeypot field - should remain empty
  })

  const initialValues = {
    fullName: '',
    businessName: '',
    email: '',
    phone: '',
    budgetRange: '',
    interestedService: prefilledService,
    message: '',
    consent: false,
    website: '' // Honeypot field
  }

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Check honeypot field
      if (values.website) {
        setToast({
          type: 'error',
          message: 'Spam detected. Please try again.'
        })
        setSubmitting(false)
        return
      }

      // Optional: reCAPTCHA integration hook
      // if (window.grecaptcha) {
      //   const recaptchaToken = await window.grecaptcha.execute(
      //     import.meta.env.VITE_RECAPTCHA_SITE_KEY,
      //     { action: 'contact_form' }
      //   )
      //   values.recaptchaToken = recaptchaToken
      // }

      // Submit form data
      const response = await contactAPI.submit(values)

      if (response.data.success) {
        setToast({
          type: 'success',
          message: 'Thank you! Your message has been sent successfully.'
        })
        resetForm()
      } else {
        setToast({
          type: 'error',
          message: response.data.message || 'Failed to send message. Please try again.'
        })
      }
    } catch (error) {
      console.error('Contact form submission error:', error)
      setToast({
        type: 'error',
        message: error.response?.data?.error || 'An error occurred. Please try again later.'
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className="space-y-6">
            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Full Name <span className="text-red-500">*</span>
              </label>
              <Field
                type="text"
                id="fullName"
                name="fullName"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white ${
                  errors.fullName && touched.fullName
                    ? 'border-red-500'
                    : 'border-gray-600'
                }`}
                placeholder="John Doe"
              />
              <ErrorMessage
                name="fullName"
                component="div"
                className="mt-1 text-sm text-red-400"
              />
            </div>

            {/* Business Name */}
            <div>
              <label
                htmlFor="businessName"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Business Name
              </label>
              <Field
                type="text"
                id="businessName"
                name="businessName"
                className="w-full px-4 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white"
                placeholder="Your Company"
              />
              <ErrorMessage
                name="businessName"
                component="div"
                className="mt-1 text-sm text-red-400"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Email <span className="text-red-500">*</span>
              </label>
              <Field
                type="email"
                id="email"
                name="email"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white ${
                  errors.email && touched.email
                    ? 'border-red-500'
                    : 'border-gray-600'
                }`}
                placeholder="john@example.com"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="mt-1 text-sm text-red-400"
              />
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Phone
              </label>
              <Field
                type="tel"
                id="phone"
                name="phone"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white ${
                  errors.phone && touched.phone
                    ? 'border-red-500'
                    : 'border-gray-600'
                }`}
                placeholder="+1 (555) 123-4567"
              />
              <ErrorMessage
                name="phone"
                component="div"
                className="mt-1 text-sm text-red-400"
              />
            </div>

            {/* Budget Range */}
            <div>
              <label
                htmlFor="budgetRange"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Budget Range <span className="text-red-500">*</span>
              </label>
              <Field
                as="select"
                id="budgetRange"
                name="budgetRange"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white ${
                  errors.budgetRange && touched.budgetRange
                    ? 'border-red-500'
                    : 'border-gray-600'
                }`}
              >
                <option value="">Select budget range</option>
                <option value="<5000">Less than $5,000</option>
                <option value="5000-10000">$5,000 - $10,000</option>
                <option value="10000-25000">$10,000 - $25,000</option>
                <option value="25000-50000">$25,000 - $50,000</option>
                <option value=">50000">More than $50,000</option>
              </Field>
              <ErrorMessage
                name="budgetRange"
                component="div"
                className="mt-1 text-sm text-red-400"
              />
            </div>

            {/* Interested Service */}
            <div>
              <label
                htmlFor="interestedService"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Interested Service <span className="text-red-500">*</span>
              </label>
              <Field
                as="select"
                id="interestedService"
                name="interestedService"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white ${
                  errors.interestedService && touched.interestedService
                    ? 'border-red-500'
                    : 'border-gray-600'
                }`}
              >
                <option value="">Select a service</option>
                <option value="Career Recommendation">Career Recommendation</option>
                <option value="Skill Gap Analysis">Skill Gap Analysis</option>
                <option value="Expert Consultation">Expert Consultation</option>
                <option value="Resume Review">Resume Review</option>
                <option value="Interview Prep">Interview Prep</option>
                <option value="Other">Other</option>
              </Field>
              <ErrorMessage
                name="interestedService"
                component="div"
                className="mt-1 text-sm text-red-400"
              />
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Message <span className="text-red-500">*</span>
              </label>
              <Field
                as="textarea"
                id="message"
                name="message"
                rows="5"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white ${
                  errors.message && touched.message
                    ? 'border-red-500'
                    : 'border-gray-600'
                }`}
                placeholder="Tell us about your project or inquiry..."
              />
              <ErrorMessage
                name="message"
                component="div"
                className="mt-1 text-sm text-red-400"
              />
            </div>

            {/* Honeypot field - hidden from users */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <Field
                type="text"
                id="website"
                name="website"
                tabIndex="-1"
                autoComplete="off"
              />
            </div>

            {/* Consent Checkbox */}
            <div className="flex items-start">
              <Field
                type="checkbox"
                id="consent"
                name="consent"
                className={`mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded ${
                  errors.consent && touched.consent ? 'border-red-500' : ''
                }`}
              />
              <label
                htmlFor="consent"
                className="ml-2 block text-sm text-gray-300"
              >
                I agree to the terms and conditions and privacy policy{' '}
                <span className="text-red-500">*</span>
              </label>
            </div>
            <ErrorMessage
              name="consent"
              component="div"
              className="text-sm text-red-400"
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold rounded-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </Form>
        )}
      </Formik>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  )
}

export default ContactForm
