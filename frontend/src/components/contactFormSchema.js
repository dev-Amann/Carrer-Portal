import * as Yup from 'yup'

/**
 * Yup validation schema for the contact form
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7
 */
export const contactValidationSchema = Yup.object({
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

export const getInitialValues = (prefilledService = '') => ({
    fullName: '',
    businessName: '',
    email: '',
    phone: '',
    budgetRange: '',
    interestedService: prefilledService,
    message: '',
    consent: false,
    website: '' // Honeypot field
})
