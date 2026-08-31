import { api, apiData, clearTokens, getRefreshToken, saveTokens } from './apiClient'

export const authService = {
  async register(payload) {
    const response = await api.post('/auth/register', payload)
    const data = apiData(response)
    saveTokens(data)
    return data
  },
  async login(payload) {
    const response = await api.post('/auth/login', payload)
    const data = apiData(response)
    saveTokens(data)
    return data
  },
  async refresh() {
    const response = await api.post('/auth/refresh', { refreshToken: getRefreshToken() })
    const data = apiData(response)
    saveTokens(data)
    return data
  },
  async logout() {
    const refreshToken = getRefreshToken()
    try { if (refreshToken) await api.post('/auth/logout', { refreshToken }) } finally { clearTokens() }
  },
  async forgotPassword(email) {
    const response = await api.post('/auth/forgot-password', { email })
    return { data: apiData(response), message: response.data?.message }
  },
  async resetPassword(payload) {
    const response = await api.post('/auth/reset-password', payload)
    return { data: apiData(response), message: response.data?.message }
  }
}
