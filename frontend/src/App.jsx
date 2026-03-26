import { useLocation } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import AppRoutes from './routes'
import ErrorBoundary from './components/ErrorBoundary'
import Nav from './components/Nav'
import Footer from './components/Footer'

function App() {
  const location = useLocation()

  // paths where navbar should be hidden
  const hideNavPaths = ['/admin', '/expert/dashboard']
  const shouldShowNav = !hideNavPaths.some(path => location.pathname.startsWith(path))

  return (
    <ErrorBoundary>
      <AuthProvider>
        <div className="min-h-screen bg-white text-slate-900 flex flex-col">
          {shouldShowNav && <Nav />}
          <main className={`flex-1 ${shouldShowNav ? 'pt-16' : ''}`}>
            <AppRoutes />
          </main>
          {shouldShowNav && <Footer />}
        </div>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
