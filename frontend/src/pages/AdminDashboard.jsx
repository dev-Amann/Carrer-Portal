import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { API } from '../lib/api'
import Toast from '../components/Toast'
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-end"></div>
      </div>
    )
  }

  const COLORS = ['#6EE7B7', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444']

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

  return (
    <div className="min-h-screen bg-gray-900 pt-16">
      {/* Header */}
      <header className="bg-gray-800 shadow-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Admin Dashboard
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
            {['overview', 'users', 'pending-experts', 'approved-experts'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${
                  activeTab === tab
                    ? 'border-accent text-accent'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
              >
                {tab.replace('-', ' ')}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && stats && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-800 p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-400">Total Users</h3>
                <p className="mt-2 text-3xl font-bold text-white">{stats.users.total}</p>
              </div>
              
              <div className="bg-gray-800 p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-400">Total Experts</h3>
                <p className="mt-2 text-3xl font-bold text-white">{stats.experts.total}</p>
                <p className="mt-1 text-sm text-gray-400">
                  {stats.experts.pending} pending approval
                </p>
              </div>
              
              <div className="bg-gray-800 p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-400">Total Bookings</h3>
                <p className="mt-2 text-3xl font-bold text-white">{stats.bookings.total}</p>
                <p className="mt-1 text-sm text-gray-400">
                  {stats.bookings.completed} completed
                </p>
              </div>
              
              <div className="bg-gray-800 p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-400">Total Revenue</h3>
                <p className="mt-2 text-3xl font-bold text-white">
                  ₹{stats.revenue.total.toLocaleString()}
                </p>
                <p className="mt-1 text-sm text-gray-400">
                  {stats.transactions.completed} transactions
                </p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-800 p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-white mb-4">Bookings Status</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={bookingsData}
                      cx="50%"
                      cy="45%"
                      labelLine={false}
                      label={false}
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {bookingsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      formatter={(value, entry) => `${value}: ${entry.payload.value}`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-gray-800 p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-white mb-4">Experts Status</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={expertsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-700">
              <h3 className="text-lg font-medium text-white">All Users</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Bookings
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Admin
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {user.total_bookings || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {user.is_admin ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Yes
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                            No
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
          <div className="bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-700">
              <h3 className="text-lg font-medium text-white">
                Pending Expert Approvals ({pendingExperts.length})
              </h3>
            </div>
            <div className="divide-y divide-gray-700">
              {pendingExperts.length === 0 ? (
                <div className="px-6 py-8 text-center text-gray-400">
                  No pending expert approvals
                </div>
              ) : (
                pendingExperts.map((expert) => (
                  <div key={expert.id} className="px-6 py-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-medium text-white">
                          {expert.user?.name}
                        </h4>
                        <p className="text-sm text-gray-400 mt-1">
                          {expert.user?.email}
                        </p>
                        
                        {expert.specialization && (
                          <p className="text-sm font-medium text-accent mt-2">
                            {expert.specialization} • {expert.years_of_experience} years experience
                          </p>
                        )}
                        
                        <p className="text-sm text-gray-300 mt-2">
                          {expert.bio}
                        </p>
                        
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center gap-4 text-sm flex-wrap">
                            <span className="text-gray-400">
                              Rate: ₹{expert.rate_per_hour}/hour
                            </span>
                            {expert.email_for_communication && (
                              <span className="text-gray-400">
                                Contact: {expert.email_for_communication}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-3 text-sm flex-wrap">
                            {expert.resume_url && (
                              <a
                                href={expert.resume_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-accent hover:underline"
                              >
                                📄 Resume
                              </a>
                            )}
                            {expert.linkedin_url && (
                              <a
                                href={expert.linkedin_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-accent hover:underline"
                              >
                                💼 LinkedIn
                              </a>
                            )}
                            {expert.github_url && (
                              <a
                                href={expert.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-accent hover:underline"
                              >
                                💻 GitHub
                              </a>
                            )}
                            {expert.portfolio_url && (
                              <a
                                href={expert.portfolio_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-accent hover:underline"
                              >
                                🌐 Portfolio
                              </a>
                            )}
                          </div>
                          
                          {expert.certificate_urls && expert.certificate_urls.length > 0 && (
                            <div className="text-sm">
                              <span className="text-gray-400">Certificates: </span>
                              {expert.certificate_urls.map((cert, idx) => (
                                <a
                                  key={idx}
                                  href={cert}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-accent hover:underline mr-2"
                                >
                                  Cert {idx + 1}
                                </a>
                              ))}
                            </div>
                          )}
                          
                          {expert.other_documents && expert.other_documents.length > 0 && (
                            <div className="text-sm">
                              <span className="text-gray-400">Other Docs: </span>
                              {expert.other_documents.map((doc, idx) => (
                                <a
                                  key={idx}
                                  href={doc}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-accent hover:underline mr-2"
                                >
                                  Doc {idx + 1}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="ml-4 flex gap-2">
                        <button
                          onClick={() => handleApproveExpert(expert.id)}
                          className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectExpert(expert.id)}
                          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'approved-experts' && (
          <div className="bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-700">
              <h3 className="text-lg font-medium text-white">
                Approved Experts ({approvedExperts.length})
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Rate/Hour
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {approvedExperts.map((expert) => (
                    <tr key={expert.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        {expert.user?.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {expert.user?.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        ₹{expert.rate_per_hour}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
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
