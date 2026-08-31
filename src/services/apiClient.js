import axios from 'axios'

export const API_BASE_URL = String(import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1').replace(/\/$/, '')

const ACCESS_KEY = 'hh_access_token'
const REFRESH_KEY = 'hh_refresh_token'

export function getAccessToken() {
  try { return localStorage.getItem(ACCESS_KEY) || '' } catch { return '' }
}

export function getRefreshToken() {
  try { return localStorage.getItem(REFRESH_KEY) || '' } catch { return '' }
}

export function saveTokens(tokens = {}) {
  try {
    if (tokens.accessToken) localStorage.setItem(ACCESS_KEY, tokens.accessToken)
    if (tokens.refreshToken) localStorage.setItem(REFRESH_KEY, tokens.refreshToken)
  } catch { /* storage can be unavailable in private contexts */ }
}

export function clearTokens() {
  try {
    localStorage.removeItem(ACCESS_KEY)
    localStorage.removeItem(REFRESH_KEY)
  } catch { /* ignore */ }
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: Number(import.meta.env.VITE_API_TIMEOUT || 20000),
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' }
})

api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

let refreshPromise = null

async function refreshAccessToken() {
  const refreshToken = getRefreshToken()
  if (!refreshToken) throw new Error('No refresh token')
  if (!refreshPromise) {
    refreshPromise = axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken }, {
      timeout: Number(import.meta.env.VITE_API_TIMEOUT || 20000),
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' }
    }).then((response) => {
      const data = response?.data?.data || {}
      saveTokens(data)
      return data.accessToken
    }).finally(() => { refreshPromise = null })
  }
  return refreshPromise
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    const status = error.response?.status
    const isAuthEndpoint = String(original?.url || '').includes('/auth/login') || String(original?.url || '').includes('/auth/register') || String(original?.url || '').includes('/auth/refresh')
    if (status === 401 && original && !original._retry && !isAuthEndpoint && getRefreshToken()) {
      original._retry = true
      try {
        const token = await refreshAccessToken()
        original.headers = original.headers || {}
        original.headers.Authorization = `Bearer ${token}`
        return api(original)
      } catch {
        clearTokens()
        window.dispatchEvent(new CustomEvent('hh:auth-expired'))
      }
    }
    return Promise.reject(error)
  }
)

export function apiData(response) {
  return response?.data?.data
}

export function apiMeta(response) {
  return response?.data?.meta || null
}

export function apiMessage(error, fallback = 'Something went wrong. Please try again.') {
  const body = error?.response?.data
  if (Array.isArray(body?.errors) && body.errors.length) return body.errors.map((item) => item.message).join(' ')
  return body?.message || error?.message || fallback
}
