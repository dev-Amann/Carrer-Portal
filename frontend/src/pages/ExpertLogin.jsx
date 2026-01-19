import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useAuth } from '../contexts/AuthContext'
import { API } from '../lib/api'
import Toast from '../components/Toast'

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
        console.log('Attempting login with:', { email: values.email })
        const response = await API.auth.login(values)
        console.log('Login response:', response.data)
        
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
        console.error('Error response:', error.response?.data)
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-start to-primary-end py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-lg shadow-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Expert Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Sign in to access your expert dashboard
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={(e) => {
          e.preventDefault()
          formik.handleSubmit(e)
        }}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className={`appearance-none relative block w-full px-3 py-2 border ${
                  formik.touched.email && formik.errors.email
                    ? 'border-red-500'
                    : 'border-gray-600'
                } placeholder-gray-500 dark:placeholder-gray-400 text-white rounded-md focus:outline-none focus:ring-accent focus:border-accent focus:z-10 sm:text-sm bg-white dark:bg-gray-700`}
                placeholder="expert@example.com"
                {...formik.getFieldProps('email')}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.email}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                className={`appearance-none relative block w-full px-3 py-2 border ${
                  formik.touched.password && formik.errors.password
                    ? 'border-red-500'
                    : 'border-gray-600'
                } placeholder-gray-500 dark:placeholder-gray-400 text-white rounded-md focus:outline-none focus:ring-accent focus:border-accent focus:z-10 sm:text-sm bg-white dark:bg-gray-700`}
                placeholder="Password"
                {...formik.getFieldProps('password')}
              />
              {formik.touched.password && formik.errors.password && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.password}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-primary-start to-primary-end hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign in as Expert'}
            </button>
          </div>
          
          <div className="text-center space-y-2">
            <Link
              to="/login"
              className="block text-sm text-accent hover:text-accent-dark"
            >
              Back to regular login
            </Link>
            <p className="text-sm text-gray-400">
              Don't have an expert profile?{' '}
              <Link to="/expert/register" className="text-accent hover:text-accent-dark">
                Register first
              </Link>
            </p>
          </div>
        </form>
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
