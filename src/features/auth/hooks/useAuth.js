import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../api/authApi'
import { useAuthStore } from '@/app/store/useAuthStore'

// ─── Role → dashboard route map ──────────────────────────────────────────────
const ROLE_ROUTES = {
  SuperAdmin: '/dashboard/admin',
  Secretary: '/dashboard/secretary',
  Advisor: '/dashboard/advisor',
  Student: '/dashboard/student',
}

const getRedirectPath = (roles = []) => {
  for (const role of roles) {
    if (ROLE_ROUTES[role]) return ROLE_ROUTES[role]
  }
  return '/dashboard'
}

// ─── useLogin ─────────────────────────────────────────────────────────────────
export function useLogin() {
  const { setAuthData } = useAuthStore()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      // Store token and user data in Zustand (which persists to localStorage)
      setAuthData(data)
      navigate(getRedirectPath(data.roles), { replace: true })
    },
  })
}

// ─── useRegister ──────────────────────────────────────────────────────────────
export function useRegister() {
  return useMutation({
    mutationFn: authApi.register,
  })
}

// ─── useLogout ────────────────────────────────────────────────────────────────
export function useLogout() {
  const { clearAuth, token, refreshToken } = useAuthStore()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async () => {
      // Try to revoke the token and logout on the backend
      if (token && refreshToken) {
        await authApi.revokeToken(token, refreshToken).catch(() => {})
      }
      await authApi.logout().catch(() => {})
    },
    onSettled: () => {
      clearAuth()
      navigate('/', { replace: true })
    },
  })
}
