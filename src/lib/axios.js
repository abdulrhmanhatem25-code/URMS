import axios from 'axios'
import { useAuthStore } from '@/app/store/useAuthStore'

const BASE_URL = import.meta.env.VITE_API_URL ?? ''

// ─── Axios Instance ───────────────────────────────────────────────────────────
// Dev:  VITE_API_URL=''  → requests go through Vite proxy → http://localhost:5174
// Prod: VITE_API_URL='https://urms.runasp.net' → direct to backend
export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// ─── Request Interceptor — attach Bearer token ────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ─── Refresh Token Logic ──────────────────────────────────────────────────────
let isRefreshing = false
let failedQueue = []

const processQueue = (error, newToken = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error)
    else prom.resolve(newToken)
  })
  failedQueue = []
}

// ─── Response Interceptor — auto refresh on 401 ──────────────────────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue while a refresh is already in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            return api(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      const { token, refreshToken, setTokens, clearAuth } = useAuthStore.getState()

      if (!refreshToken) {
        clearAuth()
        return Promise.reject(error)
      }

      try {
        // POST /api/Auth/refresh-token with { token, refreshToken } in body
        const { data } = await axios.post(
          `${BASE_URL}/api/Auth/refresh-token`,
          { token, refreshToken },
          { headers: { 'Content-Type': 'application/json' } }
        )

        // Persist new tokens
        setTokens(
          data.token,
          data.refreshToken,
          data.tokenExpiresOn,
          data.refreshTokenExpiresOn
        )

        processQueue(null, data.token)
        originalRequest.headers.Authorization = `Bearer ${data.token}`
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError)
        clearAuth()
        if (window.location.pathname !== '/' && window.location.pathname !== '/login') {
          window.location.href = '/'
        }
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)
