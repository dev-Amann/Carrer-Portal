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

const ExpertLogin = () => {
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

          login(userData, {
            access_token: response.data.access_token,
            refresh_token: response.data.refresh_token,
          })

          // Check if user has expert profile
          try {
            await API.expertDashboard.getProfile()

            setToast({
              type: 'success',
              message: 'Expert login successful!',
            })

            setTimeout(() => {
              navigate('/expert/dashboard')
            }, 1000)
          } catch (error) {
            if (error.response?.status === 403) {
              setToast({
                type: 'error',
                message: 'No expert profile found. Please register as an expert first.',
              })
              setTimeout(() => {
                navigate('/expert/register')
              }, 2000)
            } else {
              throw error
            }
          }
        } else {
          setToast({
            type: 'error',
            message: response.data.error || 'Login failed',
          })
        }
      } catch (error) {
        console.error('Expert login error:', error)
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

      <SEO title="Expert Login" description="Login to your expert dashboard" />

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 mb-2">
            Expert Portal
          </h1>
          <p className="text-sm text-gray-400">
            Sign in to manage your consultations
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
              placeholder="expert@example.com"
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
                loadingText="Signing in..."
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 border-blue-500/30 shadow-lg shadow-blue-500/20"
              >
                Sign in as Expert
              </Button>
            </div>

            <div className="mt-6 text-center space-y-3">
              <Link
                to="/login"
                className="block text-sm text-gray-400 hover:text-white transition-colors"
              >
                Back to regular login
              </Link>
              <div className="pt-4 border-t border-white/10">
                <p className="text-sm text-gray-400">
                  Don't have an expert profile?{' '}
                  <Link to="/expert/register" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
                    Register first
                  </Link>
                </p>
              </div>
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

export default ExpertLogin
