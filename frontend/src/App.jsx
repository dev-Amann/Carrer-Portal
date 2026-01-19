import { AuthProvider } from './contexts/AuthContext'

import AppRoutes from './routes'
import ErrorBoundary from './components/ErrorBoundary'
import Nav from './components/Nav'
import Footer from './components/Footer'

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
          <Nav />
          <main className="flex-1 pt-16">
            <AppRoutes />
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
