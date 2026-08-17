import axios from 'axios'
import { useAuthStore } from '@/app/store/useAuthStore'

const BASE_URL = import.meta.env.VITE_API_URL ?? ''

// ─── Axios Instance ───────────────────────────────────────────────────────────
// Dev:  VITE_API_URL=''  → requests go through Vite proxy → http://localhost:5174
// Prod: VITE_API_URL='https://urms.runasp.net' → direct to backend
//
// withCredentials: true  → browser automatically sends the HttpOnly auth cookie
// on every request (access token + refresh token are stored server-side).
export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,          // ← required for HttpOnly cookie auth
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// ─── Refresh Token Logic ──────────────────────────────────────────────────────
let isRefreshing = false
let failedQueue = []

const processQueue = (error) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error)
    else prom.resolve()
  })
  failedQueue = []
}

// ─── Response Interceptor — auto refresh on 401 ──────────────────────────────
// The cookie is sent automatically; we just need to call /refresh-token
// when we get a 401 and retry the original request.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Avoid infinite loop on the refresh endpoint itself
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/api/Auth/refresh') &&
      !originalRequest.url?.includes('/api/Auth/revoke-refresh-token')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        // Cookie is sent automatically — no body needed
        await axios.post(
          `${BASE_URL}/api/Auth/refresh`,
          {},
          { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
        )

        processQueue(null)
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError)
        useAuthStore.getState().clearAuth()
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
