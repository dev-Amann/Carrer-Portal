import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'

import { useAuth } from '../contexts/AuthContext'
import { API } from '../lib/api'

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const prefersReducedMotion = usePrefersReducedMotion()
  const { user, isAuthenticated, logout } = useAuth()
  const userMenuRef = useRef(null)

  // Handle scroll for compression animation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [location])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Check if user has expert profile
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

  // Check if user is admin or expert
  const isAdminOrExpert = user?.is_admin || hasExpertProfile

  // Base navigation links
  const baseNavLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Experts', path: '/experts', hideForAdminExpert: true, showForGuests: true },
    { name: 'About', path: '/about' },
    { name: 'Blog', path: '/blog' },
    { name: 'Bookings', path: '/bookings', hideForAdminExpert: true, requiresAuth: true },
    { name: 'Contact', path: '/contact' },
  ]

  // Filter navigation links based on user role and authentication
  const navLinks = baseNavLinks.filter(link => {
    // If link requires auth and user is not authenticated, hide it
    if (link.requiresAuth && !isAuthenticated) {
      return false
    }
    // If link should be hidden for admin/expert and user is admin/expert, hide it
    if (link.hideForAdminExpert && isAuthenticated && isAdminOrExpert) {
      return false
    }
    return true
  })

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  // Handle keyboard navigation for mobile menu
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
      if (e.key === 'Escape' && showUserMenu) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, showUserMenu])

  // Close user menu when clicking outside
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

  // Determine dashboard URL based on user role
  const getDashboardUrl = () => {
    if (!user) return '/dashboard'
    if (user.is_admin) return '/admin/dashboard'
    if (hasExpertProfile) return '/expert/dashboard'
    return '/dashboard'
  }

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-800 transition-all duration-300 ${isScrolled ? 'py-2 shadow-md' : 'py-4'
        }`}
      initial={false}
      animate={
        prefersReducedMotion
          ? {}
          : {
            paddingTop: isScrolled ? '0.5rem' : '1rem',
            paddingBottom: isScrolled ? '0.5rem' : '1rem',
          }
      }
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-md px-2 py-1"
            aria-label="CarrerPortal Home"
          >
            <svg
              className="w-8 h-8"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6EE7B7" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
              </defs>
              <rect width="40" height="40" rx="8" fill="url(#logo-gradient)" />
              <path
                d="M12 20C12 15.5817 15.5817 12 20 12C24.4183 12 28 15.5817 28 20C28 24.4183 24.4183 28 20 28"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx="20" cy="20" r="3" fill="white" />
            </svg>
            <span className="bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
              CarrerPortal
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 ${isActive(link.path)
                  ? 'text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'text-gray-300 hover:text-blue-400 hover:bg-gray-800'
                  }`}
                aria-current={isActive(link.path) ? 'page' : undefined}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-3">
            {/* User Menu or Login/Signup - Desktop */}
            {isAuthenticated ? (
              <div className="hidden md:block relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span>{user?.name}</span>
                  <svg className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-700">
                    <Link
                      to={getDashboardUrl()}
                      onClick={() => setShowUserMenu(false)}
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                    >
                      Dashboard
                    </Link>
                    {!isAdminOrExpert && (
                      <>
                        <Link
                          to="/career-recommendation"
                          onClick={() => setShowUserMenu(false)}
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                        >
                          Career Recommendations
                        </Link>
                        <Link
                          to="/bookings"
                          onClick={() => setShowUserMenu(false)}
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                        >
                          My Bookings
                        </Link>
                      </>
                    )}
                    <hr className="my-1 border-gray-700" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2 rounded-md text-sm font-semibold text-white bg-gradient-to-r from-emerald-400 to-blue-500 hover:from-emerald-500 hover:to-blue-600 transition-all duration-200 focus:outline-none focus:ring-offset-gray-900 shadow-sm hover:shadow-md"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-md text-gray-300 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
              aria-expanded={isOpen}
              aria-label="Toggle navigation menu"
              aria-controls="mobile-menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                {isOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              id="mobile-menu"
              className="md:hidden fixed inset-0 top-[60px] bg-gray-900 z-40"
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -20 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex flex-col h-full overflow-y-auto">
                <div className="flex-1 px-4 py-6 space-y-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`block px-4 py-3 rounded-md text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 ${isActive(link.path)
                        ? 'text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                        : 'text-gray-300 hover:text-blue-400 hover:bg-gray-800'
                        }`}
                      aria-current={isActive(link.path) ? 'page' : undefined}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>

                {/* Mobile Auth Buttons or User Menu */}
                <div className="p-4 border-t border-gray-800 space-y-2">
                  {isAuthenticated ? (
                    <>
                      <div className="px-5 py-3 bg-gray-800 rounded-md">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {user?.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-white">{user?.name}</p>
                            <p className="text-sm text-gray-400">{user?.email}</p>
                          </div>
                        </div>
                        <Link
                          to={getDashboardUrl()}
                          className="block w-full text-center px-4 py-2 mb-2 rounded-md text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600"
                        >
                          Dashboard
                        </Link>
                        {!isAdminOrExpert && (
                          <>
                            <Link
                              to="/career-recommendation"
                              className="block w-full text-center px-4 py-2 mb-2 rounded-md text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600"
                            >
                              Career Recommendations
                            </Link>
                            <Link
                              to="/bookings"
                              className="block w-full text-center px-4 py-2 mb-2 rounded-md text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600"
                            >
                              My Bookings
                            </Link>
                          </>
                        )}
                        <button
                          onClick={handleLogout}
                          className="block w-full text-center px-4 py-2 rounded-md text-sm font-medium text-red-400 bg-gray-700 hover:bg-gray-600"
                        >
                          Logout
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="block w-full text-center px-5 py-3 rounded-md text-base font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        Login
                      </Link>
                      <Link
                        to="/signup"
                        className="block w-full text-center px-5 py-3 rounded-md text-base font-semibold text-white bg-gradient-to-r from-emerald-400 to-blue-500 hover:from-emerald-500 hover:to-blue-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}

export default Nav
