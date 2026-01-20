import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { API } from '../lib/api'
import Toast from '../components/Toast'
import { format } from 'date-fns'
import SEO from '../components/SEO'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

const ExpertDashboard = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [profile, setProfile] = useState(null)
  const [bookings, setBookings] = useState([])
  const [earnings, setEarnings] = useState(null)
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [bookingFilter, setBookingFilter] = useState('all')
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [editForm, setEditForm] = useState({ bio: '', rate_per_hour: '' })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)

      // Fetch expert profile
      const profileResponse = await API.expertDashboard.getProfile()
      setProfile(profileResponse.data.expert)

      // Fetch bookings
      const bookingsResponse = await API.expertDashboard.getBookings({})
      setBookings(bookingsResponse.data.bookings)

      // Fetch earnings
      const earningsResponse = await API.expertDashboard.getEarnings()
      setEarnings(earningsResponse.data.earnings)

      setLoading(false)
    } catch (error) {
      console.error('Error fetching expert data:', error)

      if (error.response?.status === 403) {
        setToast({
          type: 'error',
          message: 'Expert profile not found. Please register as an expert.',
        })
        setTimeout(() => navigate('/dashboard'), 2000)
      } else {
        setToast({
          type: 'error',
          message: 'Failed to load dashboard data',
        })
      }
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/expert/login')
  }

  const handleEditProfile = () => {
    setEditForm({
      bio: profile?.bio || '',
      rate_per_hour: profile?.rate_per_hour || ''
    })
    setIsEditingProfile(true)
  }

  const handleCancelEdit = () => {
    setIsEditingProfile(false)
    setEditForm({ bio: '', rate_per_hour: '' })
  }

  const handleSaveProfile = async () => {
    try {
      const response = await API.expertDashboard.updateProfile(editForm)

      if (response.data.success) {
        setProfile(response.data.expert)
        setIsEditingProfile(false)
        setToast({
          type: 'success',
          message: 'Profile updated successfully!',
        })
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      setToast({
        type: 'error',
        message: error.response?.data?.error || 'Failed to update profile',
      })
    }
  }

  const getFilteredBookings = () => {
    if (bookingFilter === 'all') return bookings
    if (bookingFilter === 'upcoming') {
      return bookings.filter(b => new Date(b.slot_start) > new Date())
    }
    return bookings.filter(b => b.status === bookingFilter)
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      confirmed: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
    }
    return colors[status] || 'bg-gray-500/10 text-gray-400 border-gray-500/20'
  }

  const getPaymentStatusColor = (status) => {
    const colors = {
      created: 'bg-yellow-500/10 text-yellow-400',
      completed: 'bg-emerald-500/10 text-emerald-400',
      failed: 'bg-red-500/10 text-red-400',
    }
    return colors[status] || 'bg-gray-500/10 text-gray-400'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-400 font-medium">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const filteredBookings = getFilteredBookings()
  const upcomingBookings = bookings.filter(b =>
    new Date(b.slot_start) > new Date() &&
    ['pending', 'confirmed'].includes(b.status)
  )

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'bookings', label: 'Bookings', icon: '📅' },
    { id: 'earnings', label: 'Earnings', icon: '💰' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0f] py-24 relative overflow-hidden">
      <SEO title="Expert Dashboard" description="Manage your expert profile and bookings" />
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" style={{ opacity: 0.05, pointerEvents: 'none' }}></div>


      {/* Header */}
      <header className="relative z-10 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                {user?.name?.[0] || 'E'}
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  Expert Dashboard
                </h1>
                <p className="text-sm text-gray-400">
                  Welcome back, {user?.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:block px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-xs font-medium text-green-400">
                ● status: {profile?.status || 'Active'}
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="text-red-400 border-red-500/20 hover:bg-red-500/10 hover:border-red-500/40"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-white/5 p-1 rounded-xl w-full sm:w-auto inline-flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && earnings && (
          <div className="space-y-8 animate-fade-in">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Total Earnings", value: `₹${earnings.total_earnings.toLocaleString()}`, color: "indigo" },
                { label: "Pending Earnings", value: `₹${earnings.pending_earnings.toLocaleString()}`, color: "yellow" },
                { label: "Total Bookings", value: earnings.total_bookings, color: "emerald" },
                { label: "Upcoming Bookings", value: earnings.upcoming_bookings, color: "blue" },
              ].map((stat, idx) => (
                <div key={idx} className="glass-card p-6 relative overflow-hidden group">
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-500/10 rounded-full blur-2xl group-hover:bg-${stat.color}-500/20 transition-all`}></div>
                  <div className="relative z-10">
                    <h3 className="text-sm font-medium text-gray-400">{stat.label}</h3>
                    <p className="mt-2 text-3xl font-bold text-white tracking-tight">
                      {stat.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Upcoming Bookings */}
            <div className="glass-card overflow-hidden">
              <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-1 h-6 bg-indigo-500 rounded-full"></span>
                  Upcoming Sessions
                </h3>
                <span className="text-xs font-medium px-2 py-1 bg-white/5 rounded text-gray-400">{upcomingBookings.length} sessions</span>
              </div>
              <div className="divide-y divide-white/5">
                {upcomingBookings.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-400">No upcoming bookings schedule</p>
                  </div>
                ) : (
                  upcomingBookings.slice(0, 5).map((booking) => (
                    <div key={booking.id} className="px-6 py-4 hover:bg-white/5 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-sm font-bold text-gray-300 pointer-events-none select-none">
                            {booking.user?.name?.[0]}
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-white">
                              {booking.user?.name}
                            </h4>
                            <p className="text-xs text-indigo-400 mt-0.5 flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {format(new Date(booking.slot_start), 'PPp')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full border ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </div>
                          {booking.payment && (
                            <p className="text-xs text-gray-500 mt-1">
                              ₹{booking.payment.amount} • {booking.payment.status}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="glass-card overflow-hidden animate-fade-in">
            <div className="px-6 py-5 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
              <h3 className="text-lg font-bold text-white">All Bookings</h3>
              <div className="relative">
                <select
                  value={bookingFilter}
                  onChange={(e) => setBookingFilter(e.target.value)}
                  className="pl-3 pr-8 py-2 border border-white/10 rounded-lg text-sm bg-black/20 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
                >
                  <option value="all">All Bookings</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/5">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Payment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{booking.user?.name}</div>
                        <div className="text-xs text-gray-500">{booking.user?.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        <div className="text-white">{format(new Date(booking.slot_start), 'PP')}</div>
                        <div className="text-xs">{format(new Date(booking.slot_start), 'p')} - {format(new Date(booking.slot_end), 'p')}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {booking.payment ? (
                          <div className="flex flex-col">
                            <span className="text-white font-medium">₹{booking.payment.amount}</span>
                            <span className={`text-[10px] uppercase font-bold ${booking.payment.status === 'completed' ? 'text-green-500' :
                              booking.payment.status === 'failed' ? 'text-red-500' : 'text-yellow-500'
                              }`}>
                              {booking.payment.status}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-600 italic">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {booking.jitsi_room && booking.status === 'confirmed' ? (
                          <a
                            href={`https://meet.jit.si/${booking.jitsi_room}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Join Meeting
                          </a>
                        ) : (
                          <span className="text-gray-600 text-xs">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'earnings' && earnings && (
          <div className="space-y-6 animate-fade-in">
            <div className="glass-card p-8">
              <h3 className="text-lg font-bold text-white mb-6">Earnings Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <p className="text-sm text-gray-400">Total Earnings</p>
                  <p className="text-3xl font-bold text-white mt-2">
                    ₹{earnings.total_earnings.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <p className="text-sm text-gray-400">Pending Earnings</p>
                  <p className="text-3xl font-bold text-white mt-2">
                    ₹{earnings.pending_earnings.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <p className="text-sm text-gray-400">Completed Transactions</p>
                  <p className="text-3xl font-bold text-white mt-2">
                    {earnings.completed_transactions}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <p className="text-sm text-gray-400">Hourly Rate</p>
                  <p className="text-3xl font-bold text-white mt-2">
                    ₹{earnings.rate_per_hour}<span className="text-sm font-normal text-gray-500">/hr</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && profile && (
          <div className="glass-card p-8 animate-fade-in max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-white">Expert Profile</h3>
              {!isEditingProfile && (
                <Button
                  onClick={handleEditProfile}
                  variant="primary"
                >
                  Edit Profile
                </Button>
              )}
            </div>

            {!isEditingProfile ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Name</p>
                    <p className="text-lg text-white mt-1 font-medium border-b border-white/5 pb-2">{profile.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Email</p>
                    <p className="text-lg text-white mt-1 font-medium border-b border-white/5 pb-2">{profile.email}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Bio</p>
                  <div className="mt-2 p-4 bg-white/5 rounded-xl border border-white/5 text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {profile.bio}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Rate per Hour</p>
                    <p className="text-2xl text-white mt-1 font-bold">₹{profile.rate_per_hour}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Status</p>
                    <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full mt-2 border ${profile.status === 'approved' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                      profile.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                        'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                      {profile.status}
                    </span>
                  </div>
                </div>

                {profile.resume_url && (
                  <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-2">Resume</p>
                    <a
                      href={profile.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-500/10 px-4 py-2 rounded-lg border border-indigo-500/20 hover:bg-indigo-500/20"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      View Resume
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <Input
                    label="Bio"
                    as="textarea"
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    rows={6}
                    maxLength={1000}
                    placeholder="Tell clients about your expertise and experience..."
                  />
                  <p className="mt-2 text-xs text-gray-500 text-right">
                    {editForm.bio.length}/1000 characters
                  </p>
                </div>

                <div>
                  <Input
                    label="Hourly Rate"
                    type="number"
                    value={editForm.rate_per_hour}
                    onChange={(e) => setEditForm({ ...editForm, rate_per_hour: e.target.value })}
                    min="0"
                    max="100000"
                    step="50"
                    placeholder="1500"
                    icon={<span className="text-gray-400 font-bold">₹</span>}
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Set your hourly consultation rate
                  </p>
                </div>

                <div className="flex gap-4 pt-6 mt-4 border-t border-white/10">
                  <Button
                    onClick={handleSaveProfile}
                  >
                    Save Changes
                  </Button>
                  <Button
                    onClick={handleCancelEdit}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
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

export default ExpertDashboard
