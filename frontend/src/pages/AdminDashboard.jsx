import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { API } from '../lib/api'
import Toast from '../components/Toast'
import SEO from '../components/SEO'
import { OverviewIcon, UsersIcon, PendingIcon, ApprovedIcon, LogoutIcon } from '../components/admin/AdminIcons'
import AdminOverview from '../components/admin/AdminOverview'
import UserManagement from '../components/admin/UserManagement'
import PendingExperts from '../components/admin/PendingExperts'
import ApprovedExperts from '../components/admin/ApprovedExperts'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [pendingExperts, setPendingExperts] = useState([])
  const [approvedExperts, setApprovedExperts] = useState([])
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    // Check if user is admin
    if (!user?.is_admin) {
      setToast({
        type: 'error',
        message: 'Access denied. Admin privileges required.',
      })
      setTimeout(() => navigate('/'), 2000)
      return
    }

    fetchData()
  }, [user, navigate])

  const fetchData = async () => {
    try {
      setLoading(true)

      // Fetch stats
      const statsResponse = await API.admin.getStats()
      setStats(statsResponse.data.stats)

      // Fetch users
      const usersResponse = await API.admin.getAllUsers()
      setUsers(usersResponse.data.users)

      // Fetch pending experts
      const pendingResponse = await API.admin.getPendingExperts()
      setPendingExperts(pendingResponse.data.experts)

      // Fetch approved experts
      const approvedResponse = await API.experts.getAll('approved')
      setApprovedExperts(approvedResponse.data.experts)

      setLoading(false)
    } catch (error) {
      console.error('Error fetching admin data:', error)
      setToast({
        type: 'error',
        message: 'Failed to load dashboard data',
      })
      setLoading(false)
    }
  }

  const handleApproveExpert = async (expertId) => {
    try {
      await API.admin.approveExpert(expertId)
      setToast({
        type: 'success',
        message: 'Expert approved successfully',
      })
      fetchData()
    } catch (error) {
      console.error('Error approving expert:', error)
      setToast({
        type: 'error',
        message: 'Failed to approve expert',
      })
    }
  }

  const handleRejectExpert = async (expertId) => {
    try {
      await API.admin.rejectExpert(expertId)
      setToast({
        type: 'success',
        message: 'Expert rejected',
      })
      fetchData()
    } catch (error) {
      console.error('Error rejecting expert:', error)
      setToast({
        type: 'error',
        message: 'Failed to reject expert',
      })
    }
  }

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return
    }

    try {
      await API.admin.deleteUser(userId)
      setToast({
        type: 'success',
        message: 'User deleted successfully',
      })
      fetchData()
    } catch (error) {
      console.error('Error deleting user:', error)
      setToast({
        type: 'error',
        message: error.response?.data?.error || 'Failed to delete user',
      })
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  const COLORS = ['#6366f1', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444']

  const bookingsData = stats ? [
    { name: 'Confirmed', value: stats.bookings.confirmed },
    { name: 'Completed', value: stats.bookings.completed },
  ] : []

  const expertsData = stats ? [
    { name: 'Pending', value: stats.experts.pending },
    { name: 'Approved', value: stats.experts.approved },
    { name: 'Rejected', value: stats.experts.rejected },
  ] : []

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <OverviewIcon className="w-5 h-5" /> },
    { id: 'users', label: 'Users', icon: <UsersIcon className="w-5 h-5" /> },
    { id: 'pending-experts', label: 'Pending Experts', icon: <PendingIcon className="w-5 h-5" /> },
    { id: 'approved-experts', label: 'Approved Experts', icon: <ApprovedIcon className="w-5 h-5" /> },
  ]

  return (
    <div className="min-h-screen bg-slate-50/50 relative">
      <SEO title="Admin Dashboard" description="Admin dashboard and management" />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                A
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">
                  Admin Dashboard
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  {user?.name}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="group flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200"
            >
              <LogoutIcon className="w-4 h-4 text-slate-400 group-hover:text-red-500 transition-colors" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Tab Navigation */}
        <div className="mb-8 overflow-x-auto pb-2">
          <nav className="flex space-x-1 bg-white p-1 rounded-xl border border-slate-200 shadow-sm min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${activeTab === tab.id
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {activeTab === 'overview' && (
          <AdminOverview
            stats={stats}
            bookingsData={bookingsData}
            expertsData={expertsData}
            COLORS={COLORS}
          />
        )}

        {activeTab === 'users' && (
          <UserManagement
            users={users}
            currentUser={user}
            onDeleteUser={handleDeleteUser}
          />
        )}

        {activeTab === 'pending-experts' && (
          <PendingExperts
            experts={pendingExperts}
            onApprove={handleApproveExpert}
            onReject={handleRejectExpert}
          />
        )}

        {activeTab === 'approved-experts' && (
          <ApprovedExperts
            experts={approvedExperts}
          />
        )}
      </main>

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

export default AdminDashboard
