import axios from 'axios'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle 401 errors and token refresh
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')

        if (!refreshToken) {
          // No refresh token available, logout user
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('user')
          window.location.href = '/login'
          return Promise.reject(error)
        }

        // Attempt to refresh the access token
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/refresh`,
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        )

        const { access_token } = response.data

        // Update the access token in localStorage
        localStorage.setItem('accessToken', access_token)

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${access_token}`
        return api(originalRequest)
      } catch (refreshError) {
        // Refresh token failed, logout user
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api

// ============================================
// API Endpoint Functions
// ============================================

// Authentication endpoints
export const authAPI = {
  sendOTP: (data) => api.post('/auth/send-otp', data),
  verifyOTP: (data) => api.post('/auth/verify-otp', data),
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  refresh: () => api.post('/auth/refresh'),
  logout: () => api.post('/auth/logout'),
}

// Skills endpoints
export const skillsAPI = {
  getAll: () => api.get('/skills'),
  saveUserSkills: (skills) => api.post('/skills/user', { skills }),
  getUserSkills: () => api.get('/skills/user'),
}

// Careers endpoints
export const careersAPI = {
  getRecommendations: () => api.post('/careers/recommend'),
  getById: (id) => api.get(`/careers/${id}`),
  getSkillGap: (id) => api.get(`/careers/${id}/skill-gap`),
  save: (careerId) => api.post('/careers/save', { career_id: careerId }),
  getSaved: () => api.get('/careers/saved'),
  unsave: (careerId) => api.delete(`/careers/save/${careerId}`),
  emailReport: (careerId) => api.post(`/careers/${careerId}/email-report`),
  downloadPDF: (careerId) => api.get(`/careers/${careerId}/download-pdf`, { responseType: 'blob' }),
}

// Experts endpoints
export const expertsAPI = {
  register: (data) => api.post('/experts/register', data),
  getAll: (status = 'approved') => api.get('/experts', { params: { status } }),
}

// Bookings endpoints
export const bookingsAPI = {
  create: (data) => api.post('/bookings/create', data),
  getUserBookings: () => api.get('/bookings/user'),
}

// Payments endpoints
export const paymentsAPI = {
  createOrder: (data) => api.post('/payments/create-order', data),
  verify: (data) => api.post('/payments/verify', data),
  cancelBooking: (bookingId) => api.delete(`/payments/bookings/${bookingId}`),
}

// Contact endpoint
export const contactAPI = {
  submit: (data) => api.post('/contact', data),
}

// Admin endpoints
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getAllUsers: () => api.get('/admin/users'),
  getPendingExperts: () => api.get('/admin/experts/pending'),
  approveExpert: (expertId) => api.post(`/admin/experts/${expertId}/approve`),
  rejectExpert: (expertId) => api.post(`/admin/experts/${expertId}/reject`),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
}

// Expert Dashboard endpoints
export const expertDashboardAPI = {
  getBookings: (params) => api.get('/expert-dashboard/bookings', { params }),
  getEarnings: () => api.get('/expert-dashboard/earnings'),
  getProfile: () => api.get('/expert-dashboard/profile'),
  updateProfile: (data) => api.put('/expert-dashboard/profile', data),
}

// Feedback endpoints
export const feedbackAPI = {
  create: (data) => api.post('/feedback', data),
  getExpertFeedback: (expertId) => api.get(`/feedback/expert/${expertId}`),
  getBookingFeedback: (bookingId) => api.get(`/feedback/booking/${bookingId}`),
}

// Export organized API object
export const API = {
  auth: authAPI,
  skills: skillsAPI,
  careers: careersAPI,
  experts: expertsAPI,
  bookings: bookingsAPI,
  payments: paymentsAPI,
  feedback: feedbackAPI,
  contact: contactAPI,
  admin: adminAPI,
  expertDashboard: expertDashboardAPI,
}
