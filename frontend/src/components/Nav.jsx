import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { API } from '../lib/api'
import Button from './ui/Button'

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()
  const userMenuRef = useRef(null)

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [location])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  // Check for expert profile
  const [hasExpertProfile, setHasExpertProfile] = useState(false)
  useEffect(() => {
    const checkExpertProfile = async () => {
      if (isAuthenticated && !user?.is_admin) {
        try {
          await API.expertDashboard.getProfile()
          setHasExpertProfile(true)
        } catch (error) {
          setHasExpertProfile(false)
        }
      }
    }
    checkExpertProfile()
  }, [isAuthenticated, user])

  const isAdminOrExpert = user?.is_admin || hasExpertProfile

  // Navigation Links
  const baseNavLinks = [
    { name: 'Home', path: '/' },
    { name: 'Experts', path: '/experts', hideForAdminExpert: true, showForGuests: true },
    { name: 'About', path: '/about' },
    { name: 'Bookings', path: '/bookings', hideForAdminExpert: true, requiresAuth: true },
    { name: 'Contact', path: '/contact' },
  ]

  const navLinks = baseNavLinks.filter(link => {
    if (link.requiresAuth && !isAuthenticated) return false
    if (link.hideForAdminExpert && isAuthenticated && isAdminOrExpert) return false
    return true
  })

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  // Handle Outside Click for User Menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
    navigate('/')
  }

  const getDashboardUrl = () => {
    if (!user) return '/dashboard'
    if (user.is_admin) return '/admin/dashboard'
    if (hasExpertProfile) return '/expert/dashboard'
    return '/dashboard'
  }

  return (
    <>
      {/* Navbar Container */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-300 ${isScrolled ? 'pt-2' : 'pt-4'}`}
      >
        <nav
          className={`relative mx-4 w-full max-w-7xl rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 flex items-center justify-between px-6 ${isScrolled ? 'py-2' : 'py-3'}`}
        >
          <Link
            to="/"
            className="flex items-center gap-2 group relative z-10"
            aria-label="CareerPortal Home"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 shadow-sm group-hover:bg-indigo-700 transition-colors">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              CareerPortal
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${active ? 'bg-slate-100 text-indigo-600' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                >
                  <span className="relative z-10">{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4 relative z-10">
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 group outline-none"
                >
                  <div className="hidden lg:block text-right">
                    <p className="text-sm font-medium text-slate-700 group-hover:text-indigo-600 transition-colors">{user?.name}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center overflow-hidden">
                    <span className="text-xs font-bold text-slate-700">{user?.name?.charAt(0).toUpperCase()}</span>
                  </div>
                </button>

                {/* Dropdown */}
                {showUserMenu && (
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-lg bg-white border border-slate-200 shadow-lg overflow-hidden origin-top-right ring-1 ring-black/5"
                  >
                    <div className="p-1 space-y-1">
                      <div className="px-3 py-2 border-b border-slate-100 mb-1 lg:hidden">
                        <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                      </div>
                      <Link
                        to={getDashboardUrl()}
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center px-3 py-2 rounded-md text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors group"
                      >
                        <span className="mr-2 text-slate-400 group-hover:text-indigo-500">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                          </svg>
                        </span>
                        Dashboard
                      </Link>
                      <div className="h-px bg-slate-100 my-1" />
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center px-3 py-2 rounded-md text-sm text-red-600 hover:bg-red-50 transition-colors group"
                      >
                        <span className="mr-2 text-red-400">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                        </span>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-slate-600 hover:text-indigo-600">Log In</Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white border-none">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg bg-slate-50 text-slate-600 hover:text-indigo-600 transition-colors"
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span className={`w-full h-0.5 bg-current transform transition-all duration-200 ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`w-full h-0.5 bg-current transition-all duration-200 ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
                <span className={`w-full h-0.5 bg-current transform transition-all duration-200 ${isOpen ? '-rotate-45 -translate-y-2.5' : ''}`} />
              </div>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
            onClick={() => setIsOpen(false)}
          />
          <div
            className="fixed top-20 left-4 right-4 z-50 md:hidden bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden"
          >
            <div className="p-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-2.5 rounded-md text-base font-medium transition-colors ${isActive(link.path)
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                >
                  {link.name}
                </Link>
              ))}

              <div className="h-px bg-slate-100 my-2" />

              {!isAuthenticated && (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="secondary" className="w-full justify-center">Log In</Button>
                  </Link>
                  <Link to="/signup" onClick={() => setIsOpen(false)}>
                    <Button variant="primary" className="w-full justify-center">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default Nav
