import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/app/store/useAuthStore'

/**
 * Protects routes — redirects to /login if not authenticated.
 * Auth state is hydrated from localStorage via zustand/persist on app load.
 * Optionally checks allowedRoles (array of role strings).
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && user?.roles) {
    const hasRole = user.roles.some((r) => allowedRoles.includes(r))
    if (!hasRole) {
      return <Navigate to="/unauthorized" replace />
    }
  }

  return children
}
