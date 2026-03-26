import { createContext, useContext, useState, useEffect } from 'react'
import { API } from '../lib/api'

const AuthContext = createContext(null)

const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [accessToken, setAccessToken] = useState(null)
  const [refreshToken, setRefreshToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load tokens from localStorage on mount
  useEffect(() => {
    const storedAccessToken = localStorage.getItem('accessToken')
    const storedRefreshToken = localStorage.getItem('refreshToken')
    const storedUser = localStorage.getItem('user')

    if (storedAccessToken && storedRefreshToken && storedUser) {
      setAccessToken(storedAccessToken)
      setRefreshToken(storedRefreshToken)
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = (userData, tokens) => {
    setUser(userData)
    setAccessToken(tokens.access_token)
    setRefreshToken(tokens.refresh_token)

    localStorage.setItem('accessToken', tokens.access_token)
    localStorage.setItem('refreshToken', tokens.refresh_token)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const signup = async (name, email, password, otp) => {
    const response = await API.auth.register({ name, email, password, otp })
    if (response.data.success || response.data.access_token) {
      if (response.data.access_token) {
        login(response.data.user || { name, email }, {
          access_token: response.data.access_token,
          refresh_token: response.data.refresh_token
        })
      }
    }
    return response
  }

  const sendOTP = async (email, purpose = 'verification') => {
    return await API.auth.sendOTP({ email, purpose })
  }

  const logout = () => {
    setUser(null)
    setAccessToken(null)
    setRefreshToken(null)

    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
  }

  const updateAccessToken = (newAccessToken) => {
    setAccessToken(newAccessToken)
    localStorage.setItem('accessToken', newAccessToken)
  }

  const value = {
    user,
    accessToken,
    refreshToken,
    loading,
    login,
    signup,
    sendOTP,
    logout,
    updateAccessToken,
    isAuthenticated: !!user && !!accessToken,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export { useAuth }
