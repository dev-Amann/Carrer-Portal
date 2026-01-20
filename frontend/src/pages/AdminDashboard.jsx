import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { API } from '../lib/api'
import Toast from '../components/Toast'
import SEO from '../components/SEO'
import Button from '../components/ui/Button'
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

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

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-400 font-medium">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  const COLORS = ['#6366f1', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444']

  const bookingsData = stats ? [
    { name: 'Pending', value: stats.bookings.pending },
    { name: 'Confirmed', value: stats.bookings.confirmed },
    { name: 'Completed', value: stats.bookings.completed },
    { name: 'Cancelled', value: stats.bookings.cancelled },
  ] : []

  const expertsData = stats ? [
    { name: 'Pending', value: stats.experts.pending },
    { name: 'Approved', value: stats.experts.approved },
    { name: 'Rejected', value: stats.experts.rejected },
  ] : []

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'pending-experts', label: 'Pending Experts', icon: '⏳' },
    { id: 'approved-experts', label: 'Approved Experts', icon: '✅' },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0f] py-24 relative overflow-hidden">
      <SEO title="Admin Dashboard" description="Admin dashboard and management" />
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" style={{ opacity: 0.05, pointerEvents: 'none' }}></div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-red-500/20">
                A
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-gray-400">
                  Welcome back, {user?.name}
                </p>
              </div>
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

        {activeTab === 'overview' && stats && (
          <div className="space-y-8 animate-fade-in">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Total Users", value: stats.users.total, color: "blue", subtext: null },
                { label: "Total Experts", value: stats.experts.total, color: "purple", subtext: `${stats.experts.pending} pending approval` },
                { label: "Total Bookings", value: stats.bookings.total, color: "emerald", subtext: `${stats.bookings.completed} completed` },
                { label: "Total Revenue", value: `₹${stats.revenue.total.toLocaleString()}`, color: "indigo", subtext: `${stats.transactions.completed} transactions` },
              ].map((stat, idx) => (
                <div key={idx} className="glass-card p-6 relative overflow-hidden group">
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-500/10 rounded-full blur-2xl group-hover:bg-${stat.color}-500/20 transition-all`}></div>
                  <div className="relative z-10">
                    <h3 className="text-sm font-medium text-gray-400">{stat.label}</h3>
                    <p className="mt-2 text-3xl font-bold text-white tracking-tight">
                      {stat.value}
                    </p>
                    {stat.subtext && (
                      <p className="mt-1 text-xs text-gray-500 font-medium">
                        {stat.subtext}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass-card p-6">
                <h3 className="text-lg font-bold text-white mb-6">Bookings Status</h3>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={bookingsData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {bookingsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0.5)" strokeWidth={2} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '0.5rem', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        formatter={(value, entry) => <span className="text-gray-300 ml-2">{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="text-lg font-bold text-white mb-6">Experts Status</h3>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={expertsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                      <XAxis dataKey="name" tick={{ fill: '#9ca3af' }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} tickLine={false} />
                      <YAxis tick={{ fill: '#9ca3af' }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} tickLine={false} />
                      <Tooltip
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '0.5rem', color: '#fff' }}
                      />
                      <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="glass-card overflow-hidden animate-fade-in">
            <div className="px-6 py-5 border-b border-white/5">
              <h3 className="text-lg font-bold text-white">All Users</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/5">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Bookings</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {user.total_bookings || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {user.is_admin ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                            Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-500/10 text-gray-400 border border-gray-500/20">
                            User
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'pending-experts' && (
          <div className="glass-card overflow-hidden animate-fade-in">
            <div className="px-6 py-5 border-b border-white/5 flex gap-2 items-center">
              <h3 className="text-lg font-bold text-white">
                Pending Approvals
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 text-xs font-bold border border-yellow-500/20">{pendingExperts.length}</span>
            </div>
            <div className="divide-y divide-white/5">
              {pendingExperts.length === 0 ? (
                <div className="px-6 py-12 text-center text-gray-400">
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  All caught up! No pending expert approvals.
                </div>
              ) : (
                pendingExperts.map((expert) => (
                  <div key={expert.id} className="px-6 py-6 hover:bg-white/5 transition-colors">
                    <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-xl font-bold text-white">
                            {expert.user?.name}
                          </h4>
                          <span className="text-sm px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded border border-blue-500/20">
                            {expert.specialization}
                          </span>
                        </div>

                        <p className="text-sm text-gray-400 font-mono mb-4">
                          {expert.user?.email}
                        </p>


                        <div className="mb-4">
                          <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">Bio</p>
                          <p className="text-sm text-gray-300 leading-relaxed max-w-3xl">
                            {expert.bio}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">Experience</p>
                            <p className="text-white">{expert.years_of_experience} years</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">Rate</p>
                            <p className="text-white">₹{expert.rate_per_hour}/hour</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {expert.resume_url && (
                            <a href={expert.resume_url} target="_blank" rel="noopener noreferrer" className="btn-link">
                              📄 Resume
                            </a>
                          )}
                          {expert.linkedin_url && (
                            <a href={expert.linkedin_url} target="_blank" rel="noopener noreferrer" className="btn-link">
                              💼 LinkedIn
                            </a>
                          )}
                          {expert.github_url && (
                            <a href={expert.github_url} target="_blank" rel="noopener noreferrer" className="btn-link">
                              💻 GitHub
                            </a>
                          )}
                          {expert.portfolio_url && (
                            <a href={expert.portfolio_url} target="_blank" rel="noopener noreferrer" className="btn-link">
                              🌐 Portfolio
                            </a>
                          )}
                          {expert.email_for_communication && (
                            <span className="btn-link cursor-default">
                              📧 {expert.email_for_communication}
                            </span>
                          )}
                        </div>

                        {((expert.certificate_urls && expert.certificate_urls.length > 0) || (expert.other_documents && expert.other_documents.length > 0)) && (
                          <div className="mt-4 pt-4 border-t border-white/5">
                            <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">Documents</p>
                            <div className="flex flex-wrap gap-2">
                              {expert.certificate_urls?.map((cert, idx) => (
                                <a key={`cert-${idx}`} href={cert} target="_blank" rel="noopener noreferrer" className="btn-link text-xs">
                                  Spec Cert {idx + 1}
                                </a>
                              ))}
                              {expert.other_documents?.map((doc, idx) => (
                                <a key={`doc-${idx}`} href={doc} target="_blank" rel="noopener noreferrer" className="btn-link text-xs">
                                  Doc {idx + 1}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}


                      </div>
                      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <Button
                          onClick={() => handleApproveExpert(expert.id)}
                          className="bg-green-600 hover:bg-green-500 text-white w-full sm:w-auto justify-center"
                        >
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleRejectExpert(expert.id)}
                          className="bg-red-600 hover:bg-red-500 text-white w-full sm:w-auto justify-center"
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'approved-experts' && (
          <div className="glass-card overflow-hidden animate-fade-in">
            <div className="px-6 py-5 border-b border-white/5 flex gap-2 items-center">
              <h3 className="text-lg font-bold text-white">
                Approved Experts
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-xs font-bold border border-green-500/20">{approvedExperts.length}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/5">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rate/Hour</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {approvedExperts.map((expert) => (
                    <tr key={expert.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        {expert.user?.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {expert.user?.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                        ₹{expert.rate_per_hour}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                          Approved
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .btn-link {
            @apply inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-indigo-300 hover:text-white transition-all text-sm font-medium;
        }
      `}</style>

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
