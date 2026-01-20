import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'
import { useAuth } from '../contexts/AuthContext'
import { API } from '../lib/api'
import Button from './ui/Button'

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const prefersReducedMotion = usePrefersReducedMotion()
  const { user, isAuthenticated, logout } = useAuth()
  const userMenuRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [location])

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

  const baseNavLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Experts', path: '/experts', hideForAdminExpert: true, showForGuests: true },
    { name: 'About', path: '/about' },
    { name: 'Blog', path: '/blog' },
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

  const toggleMenu = () => setIsOpen(!isOpen)

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
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-white/5 ${isScrolled || isOpen
          ? 'glass-panel py-3'
          : 'bg-transparent border-transparent py-5'
        }`}
      initial={false}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 group"
            aria-label="CarrerPortal Home"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center transform group-hover:scale-105 transition-transform duration-200 shadow-lg shadow-indigo-500/20">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 group-hover:to-white transition-all">
              CareerPortal
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 bg-white/5 p-1 rounded-full border border-white/5 backdrop-blur-md">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${isActive(link.path)
                    ? 'bg-white/10 text-white shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="hidden md:block relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 group outline-none"
                >
                  <div className="text-right hidden lg:block">
                    <p className="text-sm font-medium text-white group-hover:text-indigo-400 transition-colors">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 border-2 border-transparent group-hover:border-indigo-500/50 transition-all flex items-center justify-center overflow-hidden">
                    <span className="text-sm font-bold text-white">{user?.name?.charAt(0).toUpperCase()}</span>
                  </div>
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-4 w-56 rounded-xl bg-[#13131f] border border-white/10 shadow-2xl overflow-hidden"
                    >
                      <div className="p-2 space-y-1">
                        <Link
                          to={getDashboardUrl()}
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center px-4 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                        >
                          <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                          </svg>
                          Dashboard
                        </Link>
                        {!isAdminOrExpert && (
                          <>
                            <Link
                              to="/career-recommendation"
                              onClick={() => setShowUserMenu(false)}
                              className="flex items-center px-4 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                            >
                              <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                              </svg>
                              Recommendations
                            </Link>
                            <Link
                              to="/bookings"
                              onClick={() => setShowUserMenu(false)}
                              className="flex items-center px-4 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                            >
                              <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              My Bookings
                            </Link>
                          </>
                        )}
                        <div className="h-px bg-white/5 my-1" />
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center px-4 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Link to="/login">
                  <Button variant="ghost" size="sm">Log In</Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm" className="shadow-lg shadow-indigo-500/20">Sign Up</Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-lg text-gray-300 hover:bg-white/5 focus:outline-none"
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span className={`w-full h-0.5 bg-current transform transition-transform duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`w-full h-0.5 bg-current transition-opacity duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
                <span className={`w-full h-0.5 bg-current transform transition-transform duration-300 ${isOpen ? '-rotate-45 -translate-y-2.5' : ''}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden bg-[#0a0a0f] border-t border-white/5 mt-4 rounded-xl"
            >
              <div className="p-4 space-y-4">
                <div className="space-y-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${isActive(link.path)
                          ? 'bg-indigo-500/10 text-indigo-400'
                          : 'text-gray-400 hover:bg-white/5 hover:text-white'
                        }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>

                <div className="pt-4 border-t border-white/5">
                  {isAuthenticated ? (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 px-4 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 flex items-center justify-center">
                          <span className="text-white font-bold">{user?.name?.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{user?.name}</p>
                          <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>
                      </div>
                      <Button onClick={() => navigate(getDashboardUrl())} variant="secondary" className="w-full justify-start">
                        Dashboard
                      </Button>
                      <Button onClick={handleLogout} variant="danger" className="w-full justify-start">
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <Link to="/login" className="block">
                        <Button variant="secondary" className="w-full">Log In</Button>
                      </Link>
                      <Link to="/signup" className="block">
                        <Button variant="primary" className="w-full">Sign Up</Button>
                      </Link>
                    </div>
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
