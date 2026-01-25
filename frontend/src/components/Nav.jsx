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
      {/* Floating Navbar Container */}
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-300 pointer-events-none ${isScrolled ? 'pt-4' : 'pt-6'}`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.nav
          className={`pointer-events-auto relative mx-4 w-full max-w-7xl rounded-2xl border border-white/10 bg-[#0a0a0f]/80 backdrop-blur-xl shadow-2xl transition-all duration-300 flex items-center justify-between px-6 ${isScrolled ? 'py-3' : 'py-4'}`}
          layout
        >
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group relative z-10"
            aria-label="CareerPortal Home"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-indigo-200 transition-colors">
              CareerPortal
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 ${active ? 'text-white' : 'text-gray-400 hover:text-white'
                    }`}
                >
                  {active && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-white/10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
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
                  className="flex items-center gap-3 group outline-none"
                >
                  <div className="hidden lg:block text-right">
                    <p className="text-sm font-medium text-white group-hover:text-indigo-300 transition-colors">{user?.name}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-800 to-gray-700 border border-white/10 group-hover:border-indigo-500/50 transition-all flex items-center justify-center overflow-hidden shadow-inner">
                    <span className="text-sm font-bold text-white">{user?.name?.charAt(0).toUpperCase()}</span>
                  </div>
                </button>

                {/* Dropdown */}
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95, filter: "blur(10px)" }}
                      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: 10, scale: 0.95, filter: "blur(10px)" }}
                      className="absolute right-0 mt-4 w-60 rounded-xl bg-[#13131f]/95 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden origin-top-right ring-1 ring-black/5"
                    >
                      <div className="p-2 space-y-1">
                        <div className="px-4 py-3 border-b border-white/5 mb-1 lg:hidden">
                          <p className="text-sm font-medium text-white">{user?.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                        <Link
                          to={getDashboardUrl()}
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center px-4 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-all group"
                        >
                          <span className="mr-3 p-1 rounded-md bg-white/5 group-hover:bg-indigo-500/20 text-gray-400 group-hover:text-indigo-300 transition-colors">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                          </span>
                          Dashboard
                        </Link>
                        <div className="h-px bg-white/5 my-1" />
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center px-4 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors group"
                        >
                          <span className="mr-3 p-1 rounded-md bg-red-500/10 group-hover:bg-red-500/20 text-red-400 transition-colors">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                          </span>
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">Log In</Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm" className="shadow-lg shadow-indigo-500/20 bg-indigo-600 hover:bg-indigo-500 border-none">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-xl bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span className={`w-full h-0.5 bg-current transform transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2.5' : ''}`} />
                <span className={`w-full h-0.5 bg-current transition-all duration-300 ${isOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`} />
                <span className={`w-full h-0.5 bg-current transform transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </div>
            </button>
          </div>
        </motion.nav>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed top-24 left-4 right-4 z-50 md:hidden bg-[#13131f] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-4 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-base font-medium transition-all ${isActive(link.path)
                      ? 'bg-indigo-600/10 text-indigo-400'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                      }`}
                  >
                    {link.name}
                  </Link>
                ))}

                <div className="h-px bg-white/5 my-2" />

                {!isAuthenticated && (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="secondary" className="w-full justify-center">Log In</Button>
                    </Link>
                    <Link to="/signup" onClick={() => setIsOpen(false)}>
                      <Button variant="primary" className="w-full justify-center">Sign Up</Button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Nav
