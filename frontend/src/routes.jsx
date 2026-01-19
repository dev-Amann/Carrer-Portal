import { Suspense, lazy } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useAuth } from './contexts/AuthContext'
import PageTransition from './components/PageTransition'

// Lazy load page components
const Home = lazy(() => import('./pages/Home'))
const Services = lazy(() => import('./pages/Services'))
const Experts = lazy(() => import('./pages/Experts'))

const About = lazy(() => import('./pages/About'))
const Blog = lazy(() => import('./pages/Blog'))
const PostPage = lazy(() => import('./pages/PostPage'))
const Contact = lazy(() => import('./pages/Contact'))
const Bookings = lazy(() => import('./pages/Bookings'))
const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const CareerRecommendation = lazy(() => import('./pages/CareerRecommendation'))
const SkillGapAnalysis = lazy(() => import('./pages/SkillGapAnalysis'))
const CareerDetails = lazy(() => import('./pages/CareerDetails'))
const AdminLogin = lazy(() => import('./pages/AdminLogin'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const ExpertLogin = lazy(() => import('./pages/ExpertLogin'))
const ExpertDashboard = lazy(() => import('./pages/ExpertDashboard'))
const ExpertRegister = lazy(() => import('./pages/ExpertRegister'))
const NotFound = lazy(() => import('./pages/NotFound'))

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-end"></div>
  </div>
)

// Wrapper to add page transitions to route elements
const withPageTransition = (Component) => {
  return (
    <PageTransition>
      <Component />
    </PageTransition>
  )
}

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <LoadingFallback />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

const AppRoutes = () => {
  const location = useLocation()

  return (
    <Suspense fallback={<LoadingFallback />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={withPageTransition(Home)} />
          <Route path="/services" element={withPageTransition(Services)} />
          <Route path="/experts" element={withPageTransition(Experts)} />

          <Route path="/about" element={withPageTransition(About)} />
          <Route path="/blog" element={withPageTransition(Blog)} />
          <Route path="/blog/:slug" element={withPageTransition(PostPage)} />
          <Route path="/contact" element={withPageTransition(Contact)} />
          <Route path="/login" element={withPageTransition(Login)} />
          <Route path="/signup" element={withPageTransition(Signup)} />
          <Route path="/admin/login" element={withPageTransition(AdminLogin)} />
          <Route path="/expert/login" element={withPageTransition(ExpertLogin)} />
          <Route path="/expert/register" element={withPageTransition(ExpertRegister)} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <PageTransition>
                  <Dashboard />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/career-recommendation"
            element={
              <ProtectedRoute>
                <PageTransition>
                  <CareerRecommendation />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/skill-gap/:careerId"
            element={
              <ProtectedRoute>
                <PageTransition>
                  <SkillGapAnalysis />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/careers/:careerId"
            element={
              <ProtectedRoute>
                <PageTransition>
                  <CareerDetails />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <PageTransition>
                  <Bookings />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <PageTransition>
                  <AdminDashboard />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/expert/dashboard"
            element={
              <ProtectedRoute>
                <PageTransition>
                  <ExpertDashboard />
                </PageTransition>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={withPageTransition(NotFound)} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  )
}

export default AppRoutes
