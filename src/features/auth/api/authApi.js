import { api } from '@/lib/axios'

export const authApi = {
  /**
   * POST /api/Auth/login
   * Sends credentials, server sets HttpOnly cookie (access + refresh tokens).
   * Response: { isSuccess, data: { id, email, fullNameAr, fullNameEn, ... } }
   */
  login: async (credentials) => {
    const { data } = await api.post('/api/Auth/login', credentials)
    return data.data   // basic user info (no tokens — they're in the cookie)
  },

  /**
   * GET /api/Auth/me
   * Returns full user profile including roles & permissions.
   * Cookie is sent automatically by the browser (withCredentials).
   */
  getMe: async () => {
    const { data } = await api.get('/api/Auth/me')
    return data.data
  },

  /** POST /api/Auth/register */
  register: async (payload) => {
    const { data } = await api.post('/api/Auth/register', payload)
    return data
  },

  /**
   * POST /api/Auth/refresh
   * No body needed — refresh token is in the HttpOnly cookie.
   */
  refreshToken: async () => {
    const { data } = await api.post('/api/Auth/refresh')
    return data
  },

  /**
   * POST /api/Auth/revoke-refresh-token
   * Revokes the refresh token (server clears the HttpOnly cookie) = logout.
   * No body needed — tokens are in the HttpOnly cookie.
   */
  revokeRefreshToken: async () => {
    const { data } = await api.post('/api/Auth/revoke-refresh-token')
    return data
  },

  /**
   * POST /api/Auth/change-password
   * Body: { currentPassword: string, newPassword: string }
   */
  changePassword: async (body) => {
    const { data } = await api.post('/api/Auth/change-password', body)
    return data
  },
}
