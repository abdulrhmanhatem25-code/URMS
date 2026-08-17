import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../api/authApi'
import { useAuthStore } from '@/app/store/useAuthStore'

// ─── Role → dashboard route map ──────────────────────────────────────────────
const ROLE_ROUTES = {
  SuperAdmin:      '/dashboard/admin',
  Secretary:       '/dashboard/secretary',
  AcademicAdvisor: '/dashboard/advisor',
  Student:         '/dashboard/student',
}

const getRedirectPath = (roles = []) => {
  for (const role of roles) {
    if (ROLE_ROUTES[role]) return ROLE_ROUTES[role]
  }
  return '/dashboard'
}

// ─── useLogin ─────────────────────────────────────────────────────────────────
// Flow:
//   1. POST /api/Auth/login   → server sets HttpOnly cookie, returns basic user info
//   2. GET  /api/Auth/me      → fetch full profile (roles + permissions)
//   3. Store profile in Zustand & redirect based on role
export function useLogin() {
  const { setAuthData } = useAuthStore()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (credentials) => {
      await authApi.login(credentials)         // sets the cookie
      return authApi.getMe()                   // fetch full profile with roles
    },
    onSuccess: (userData) => {
      setAuthData(userData)
      navigate(getRedirectPath(userData.roles), { replace: true })
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
// Calls POST /api/Auth/revoke-refresh-token (server clears the HttpOnly cookie)
// then clears the Zustand store and redirects to home.
export function useLogout() {
  const { clearAuth } = useAuthStore()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: () => authApi.revokeRefreshToken().catch(() => {}),   // best-effort
    onSettled: () => {
      clearAuth()
      navigate('/', { replace: true })
    },
  })
}

// ─── useChangePassword ────────────────────────────────────────────────────────
export function useChangePassword() {
  return useMutation({
    mutationFn: (body) => authApi.changePassword(body),
  })
}
