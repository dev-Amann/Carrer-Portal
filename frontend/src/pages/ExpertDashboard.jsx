import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { API } from '../lib/api'
import Toast from '../components/Toast'
import { format } from 'date-fns'

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
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getPaymentStatusColor = (status) => {
    const colors = {
      created: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-end"></div>
      </div>
    )
  }

  const filteredBookings = getFilteredBookings()
  const upcomingBookings = bookings.filter(b => 
    new Date(b.slot_start) > new Date() && 
    ['pending', 'confirmed'].includes(b.status)
  )

  return (
    <div className="min-h-screen bg-gray-900 pt-16">
      {/* Header */}
      <header className="bg-gray-800 shadow-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Expert Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-400">
                Welcome back, {user?.name}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="border-b border-gray-700">
          <nav className="-mb-px flex space-x-8">
            {['overview', 'bookings', 'earnings', 'profile'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${
                  activeTab === tab
                    ? 'border-accent text-accent'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && earnings && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-800 p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-400">Total Earnings</h3>
                <p className="mt-2 text-3xl font-bold text-white">
                  ₹{earnings.total_earnings.toLocaleString()}
                </p>
              </div>
              
              <div className="bg-gray-800 p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-400">Pending Earnings</h3>
                <p className="mt-2 text-3xl font-bold text-white">
                  ₹{earnings.pending_earnings.toLocaleString()}
                </p>
              </div>
              
              <div className="bg-gray-800 p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-400">Total Bookings</h3>
                <p className="mt-2 text-3xl font-bold text-white">
                  {earnings.total_bookings}
                </p>
              </div>
              
              <div className="bg-gray-800 p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-400">Upcoming Bookings</h3>
                <p className="mt-2 text-3xl font-bold text-white">
                  {earnings.upcoming_bookings}
                </p>
              </div>
            </div>

            {/* Upcoming Bookings */}
            <div className="bg-gray-800 rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-700">
                <h3 className="text-lg font-medium text-white">
                  Upcoming Bookings ({upcomingBookings.length})
                </h3>
              </div>
              <div className="divide-y divide-gray-700">
                {upcomingBookings.length === 0 ? (
                  <div className="px-6 py-8 text-center text-gray-400">
                    No upcoming bookings
                  </div>
                ) : (
                  upcomingBookings.slice(0, 5).map((booking) => (
                    <div key={booking.id} className="px-6 py-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-white">
                            {booking.user?.name}
                          </h4>
                          <p className="text-sm text-gray-400 mt-1">
                            {format(new Date(booking.slot_start), 'PPp')} - {format(new Date(booking.slot_end), 'p')}
                          </p>
                          {booking.payment && (
                            <p className="text-sm text-gray-400 mt-1">
                              Payment: ₹{booking.payment.amount} ({booking.payment.status})
                            </p>
                          )}
                        </div>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-700">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-white">All Bookings</h3>
                <select
                  value={bookingFilter}
                  onChange={(e) => setBookingFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-600 rounded-md text-sm bg-gray-700 text-white"
                >
                  <option value="all">All Bookings</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Room
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">
                          {booking.user?.name}
                        </div>
                        <div className="text-sm text-gray-400">
                          {booking.user?.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        <div>{format(new Date(booking.slot_start), 'PP')}</div>
                        <div>{format(new Date(booking.slot_start), 'p')} - {format(new Date(booking.slot_end), 'p')}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {booking.payment ? (
                          <div>
                            <div>₹{booking.payment.amount}</div>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(booking.payment.status)}`}>
                              {booking.payment.status}
                            </span>
                          </div>
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {booking.jitsi_room ? (
                          <a
                            href={`https://meet.jit.si/${booking.jitsi_room}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent hover:underline"
                          >
                            Join
                          </a>
                        ) : (
                          'N/A'
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
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-white mb-4">Earnings Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-400">Total Earnings</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    ₹{earnings.total_earnings.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Pending Earnings</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    ₹{earnings.pending_earnings.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Completed Transactions</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {earnings.completed_transactions}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Hourly Rate</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    ₹{earnings.rate_per_hour}/hour
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && profile && (
          <div className="bg-gray-800 rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-white">Expert Profile</h3>
              {!isEditingProfile && (
                <button
                  onClick={handleEditProfile}
                  className="px-4 py-2 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent-dark transition-colors"
                >
                  Edit Profile
                </button>
              )}
            </div>

            {!isEditingProfile ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Name</p>
                  <p className="text-base text-white mt-1">{profile.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-base text-white mt-1">{profile.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Bio</p>
                  <p className="text-base text-white mt-1 whitespace-pre-wrap">{profile.bio}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Rate per Hour</p>
                  <p className="text-base text-white mt-1">₹{profile.rate_per_hour}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Status</p>
                  <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full mt-1 ${
                    profile.status === 'approved' ? 'bg-green-100 text-green-800' :
                    profile.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {profile.status}
                  </span>
                </div>
                {profile.resume_url && (
                  <div>
                    <p className="text-sm text-gray-400">Resume</p>
                    <a
                      href={profile.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline mt-1 inline-block"
                    >
                      View Resume
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    rows={6}
                    maxLength={1000}
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-gray-700 text-white"
                    placeholder="Tell clients about your expertise and experience..."
                  />
                  <p className="mt-1 text-sm text-gray-400">
                    {editForm.bio.length}/1000 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Hourly Rate (₹)
                  </label>
                  <input
                    type="number"
                    value={editForm.rate_per_hour}
                    onChange={(e) => setEditForm({ ...editForm, rate_per_hour: e.target.value })}
                    min="0"
                    max="100000"
                    step="50"
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-gray-700 text-white"
                    placeholder="1500"
                  />
                  <p className="mt-1 text-sm text-gray-400">
                    Set your hourly consultation rate
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSaveProfile}
                    className="px-6 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-6 py-2.5 text-sm font-medium text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
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
