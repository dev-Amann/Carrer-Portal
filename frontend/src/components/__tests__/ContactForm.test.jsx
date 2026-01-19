import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ContactForm from '../ContactForm'
import { contactAPI } from '../../lib/api'

// Mock the API module
jest.mock('../../lib/api', () => ({
  contactAPI: {
    submit: jest.fn(),
  },
}))

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}))

describe('ContactForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('displays validation errors for empty required fields', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    // Click submit button without filling any fields
    const submitButton = screen.getByRole('button', { name: /send message/i })
    await user.click(submitButton)

    // Wait for validation errors to appear
    await waitFor(() => {
      expect(screen.getByText(/full name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
      expect(screen.getByText(/budget range is required/i)).toBeInTheDocument()
      expect(screen.getByText(/please select a service/i)).toBeInTheDocument()
      expect(screen.getByText(/message is required/i)).toBeInTheDocument()
      expect(screen.getByText(/you must accept the terms/i)).toBeInTheDocument()
    })

    // Verify API was not called
    expect(contactAPI.submit).not.toHaveBeenCalled()
  })

  test('submits form successfully with valid data', async () => {
    const user = userEvent.setup()
    
    // Mock successful API response
    contactAPI.submit.mockResolvedValueOnce({
      data: { success: true, message: 'Message sent successfully' },
    })

    render(<ContactForm />)

    // Fill in all required fields
    await user.type(screen.getByLabelText(/full name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/phone/i), '1234567890')
    await user.selectOptions(screen.getByLabelText(/budget range/i), '5000-10000')
    await user.selectOptions(screen.getByLabelText(/interested service/i), 'Career Recommendation')
    await user.type(screen.getByLabelText(/message/i), 'This is a test message for the contact form.')
    await user.click(screen.getByLabelText(/i agree to the terms/i))

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /send message/i })
    await user.click(submitButton)

    // Wait for API call
    await waitFor(() => {
      expect(contactAPI.submit).toHaveBeenCalledTimes(1)
    })

    // Verify the submitted data
    const submittedData = contactAPI.submit.mock.calls[0][0]
    expect(submittedData.fullName).toBe('John Doe')
    expect(submittedData.email).toBe('john@example.com')
    expect(submittedData.phone).toBe('1234567890')
    expect(submittedData.budgetRange).toBe('5000-10000')
    expect(submittedData.interestedService).toBe('Career Recommendation')
    expect(submittedData.message).toBe('This is a test message for the contact form.')
    expect(submittedData.consent).toBe(true)
    expect(submittedData.website).toBe('') // Honeypot should be empty

    // Verify success toast appears
    await waitFor(() => {
      expect(screen.getByText(/thank you! your message has been sent successfully/i)).toBeInTheDocument()
    })
  })

  test('rejects submission when honeypot field is filled', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    // Fill in all required fields
    await user.type(screen.getByLabelText(/full name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.selectOptions(screen.getByLabelText(/budget range/i), '5000-10000')
    await user.selectOptions(screen.getByLabelText(/interested service/i), 'Career Recommendation')
    await user.type(screen.getByLabelText(/message/i), 'This is a test message.')
    await user.click(screen.getByLabelText(/i agree to the terms/i))

    // Fill the honeypot field (simulating a bot)
    const honeypotField = screen.getByLabelText(/website/i)
    await user.type(honeypotField, 'http://spam.com')

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /send message/i })
    await user.click(submitButton)

    // Wait for error toast
    await waitFor(() => {
      expect(screen.getByText(/spam detected/i)).toBeInTheDocument()
    })

    // Verify API was not called
    expect(contactAPI.submit).not.toHaveBeenCalled()
  })

  test('displays error message when API call fails', async () => {
    const user = userEvent.setup()
    
    // Mock failed API response
    contactAPI.submit.mockRejectedValueOnce({
      response: {
        data: { error: 'Server error occurred' },
      },
    })

    render(<ContactForm />)

    // Fill in all required fields
    await user.type(screen.getByLabelText(/full name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.selectOptions(screen.getByLabelText(/budget range/i), '5000-10000')
    await user.selectOptions(screen.getByLabelText(/interested service/i), 'Career Recommendation')
    await user.type(screen.getByLabelText(/message/i), 'This is a test message.')
    await user.click(screen.getByLabelText(/i agree to the terms/i))

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /send message/i })
    await user.click(submitButton)

    // Wait for error toast
    await waitFor(() => {
      expect(screen.getByText(/server error occurred/i)).toBeInTheDocument()
    })
  })
})
