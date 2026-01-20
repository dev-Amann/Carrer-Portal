import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useAuth } from '../contexts/AuthContext'
import { API } from '../lib/api'
import Toast from '../components/Toast'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import SEO from '../components/SEO'

const AdminLogin = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [toast, setToast] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .required('Password is required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setIsLoading(true)
      setSubmitting(true)

      try {
        const response = await API.auth.login(values)

        if (response.data.success) {
          const userData = response.data.user

          // Check if user is admin
          if (!userData.is_admin) {
            setToast({
              type: 'error',
              message: 'Access denied. Admin privileges required.',
            })
            setIsLoading(false)
            setSubmitting(false)
            return
          }

          login(userData, {
            access_token: response.data.access_token,
            refresh_token: response.data.refresh_token,
          })

          setToast({
            type: 'success',
            message: 'Admin login successful!',
          })

          setTimeout(() => {
            navigate('/admin/dashboard')
          }, 1000)
        } else {
          setToast({
            type: 'error',
            message: response.data.error || 'Login failed',
          })
        }
      } catch (error) {
        console.error('Admin login error:', error)
        setToast({
          type: 'error',
          message: error.response?.data?.error || 'Login failed. Please try again.',
        })
      } finally {
        setIsLoading(false)
        setSubmitting(false)
      }
    },
  })

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" style={{ opacity: 0.05, pointerEvents: 'none' }}></div>
      <SEO title="Admin Login" description="Sign in to the Admin Dashboard" />

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-500/20 to-pink-500/20 border border-white/10 mb-6 shadow-2xl backdrop-blur-sm">
            <span className="text-3xl">🛡️</span>
          </div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-2">
            Admin Access
          </h1>
          <p className="text-sm text-gray-400">
            Secure login for system administrators
          </p>
        </div>

        <div className="glass-card p-8 animate-fade-in-up">
          <form className="space-y-6" onSubmit={(e) => {
            e.preventDefault()
            formik.handleSubmit(e)
          }}>

            <Input
              label="Email Address"
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="admin@example.com"
              {...formik.getFieldProps('email')}
              error={formik.touched.email && formik.errors.email}
            />

            <Input
              label="Password"
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Password"
              {...formik.getFieldProps('password')}
              error={formik.touched.password && formik.errors.password}
            />

            <div>
              <Button
                type="submit"
                disabled={isLoading}
                isLoading={isLoading}
                loadingText="Verifying..."
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 border-purple-500/30 shadow-lg shadow-purple-500/20"
              >
                Sign in as Admin
              </Button>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Back to regular login
              </Link>
            </div>
          </form>
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

export default AdminLogin
