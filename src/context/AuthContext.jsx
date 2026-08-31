import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { authService, clearTokens, getAccessToken, apiMessage } from '../services'
import { userService } from '../services/userService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [authReady, setAuthReady] = useState(false)

  const loadMe = useCallback(async () => {
    if (!getAccessToken()) {
      setUser(null)
      setAuthReady(true)
      return null
    }
    try {
      const current = await userService.me()
      setUser(current)
      return current
    } catch {
      clearTokens()
      setUser(null)
      return null
    } finally {
      setAuthReady(true)
    }
  }, [])

  useEffect(() => { loadMe() }, [loadMe])

  useEffect(() => {
    const expired = () => { setUser(null); setAuthReady(true) }
    window.addEventListener('hh:auth-expired', expired)
    return () => window.removeEventListener('hh:auth-expired', expired)
  }, [])

  const login = useCallback(async (values) => {
    const result = await authService.login(values)
    setUser(result.user)
    return result.user
  }, [])

  const register = useCallback(async (values) => {
    const result = await authService.register(values)
    setUser(result.user)
    return result.user
  }, [])

  const logout = useCallback(async () => {
    try { await authService.logout() } finally { setUser(null) }
  }, [])

  const updateProfile = useCallback(async (values) => {
    const updated = await userService.updateProfile(values)
    setUser(updated)
    return updated
  }, [])

  const value = useMemo(() => ({
    user,
    setUser,
    authReady,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout,
    updateProfile,
    refreshUser: loadMe,
    apiMessage
  }), [user, authReady, login, register, logout, updateProfile, loadMe])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used inside AuthProvider')
  return value
}
