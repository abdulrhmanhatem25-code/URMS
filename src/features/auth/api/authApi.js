import { api } from '@/lib/axios'
import { useAuthStore } from '@/app/store/useAuthStore'

export const authApi = {
  /** POST /api/Auth/login → returns full user data + token + refreshToken */
  login: async (credentials) => {
    const { data } = await api.post('/api/Auth/login', credentials)
    return data
  },

  /** POST /api/Auth/register */
  register: async (payload) => {
    const { data } = await api.post('/api/Auth/register', payload)
    return data
  },

  /** POST /api/Auth/refresh-token → { token, refreshToken } */
  refreshToken: async (token, refreshToken) => {
    const { data } = await api.post('/api/Auth/refresh-token', { token, refreshToken })
    return data
  },

  /** POST /api/Auth/revoke-token → { token, refreshToken } */
  revokeToken: async (token, refreshToken) => {
    const { data } = await api.post('/api/Auth/revoke-token', { token, refreshToken })
    return data
  },

  /** POST /api/Auth/logout */
  logout: async () => {
    const { data } = await api.post('/api/Auth/logout')
    return data
  },
}
