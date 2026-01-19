import { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { contactAPI } from '../lib/api'
import Toast from './Toast'

/**
 * MiniContactForm component - simplified version for home page
 * Uses same validation and submission logic as ContactForm
 * 
 * Requirements: 25.5
 */
const MiniContactForm = () => {
  const [toast, setToast] = useState(null)

  // Simplified Yup validation schema
  const validationSchema = Yup.object({
    fullName: Yup.string()
      .required('Full name is required')
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must be less than 100 characters'),
    email: Yup.string()
      .required('Email is required')
      .email('Invalid email address'),
    message: Yup.string()
      .required('Message is required')
      .min(10, 'Message must be at least 10 characters')
      .max(1000, 'Message must be less than 1000 characters'),
    consent: Yup.boolean()
      .oneOf([true], 'You must accept the terms'),
    website: Yup.string() // Honeypot field
  })

  const initialValues = {
    fullName: '',
    businessName: '',
    email: '',
    phone: '',
    budgetRange: 'Not specified',
    interestedService: 'General Inquiry',
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
      console.error('Mini contact form submission error:', error)
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
          <Form className="space-y-4">
            {/* Full Name */}
            <div>
              <label
                htmlFor="mini-fullName"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Full Name <span className="text-red-500">*</span>
              </label>
              <Field
                type="text"
                id="mini-fullName"
                name="fullName"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white ${
                  errors.fullName && touched.fullName
                    ? 'border-red-500'
                    : 'border-gray-600'
                }`}
                placeholder="John Doe"
              />
              <ErrorMessage
                name="fullName"
                component="div"
                className="mt-1 text-xs text-red-400"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="mini-email"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Email <span className="text-red-500">*</span>
              </label>
              <Field
                type="email"
                id="mini-email"
                name="email"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white ${
                  errors.email && touched.email
                    ? 'border-red-500'
                    : 'border-gray-600'
                }`}
                placeholder="john@example.com"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="mt-1 text-xs text-red-400"
              />
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="mini-message"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Message <span className="text-red-500">*</span>
              </label>
              <Field
                as="textarea"
                id="mini-message"
                name="message"
                rows="3"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white ${
                  errors.message && touched.message
                    ? 'border-red-500'
                    : 'border-gray-600'
                }`}
                placeholder="Tell us about your inquiry..."
              />
              <ErrorMessage
                name="message"
                component="div"
                className="mt-1 text-xs text-red-400"
              />
            </div>

            {/* Honeypot field - hidden from users */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="mini-website">Website</label>
              <Field
                type="text"
                id="mini-website"
                name="website"
                tabIndex="-1"
                autoComplete="off"
              />
            </div>

            {/* Consent Checkbox */}
            <div className="flex items-start">
              <Field
                type="checkbox"
                id="mini-consent"
                name="consent"
                className={`mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded ${
                  errors.consent && touched.consent ? 'border-red-500' : ''
                }`}
              />
              <label
                htmlFor="mini-consent"
                className="ml-2 block text-xs text-gray-300"
              >
                I agree to the terms and conditions{' '}
                <span className="text-red-500">*</span>
              </label>
            </div>
            <ErrorMessage
              name="consent"
              component="div"
              className="text-xs text-red-400"
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-4 py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold rounded-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
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

export default MiniContactForm
