import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/app/store/useAuthStore'
import { usePermissions } from '@/app/hooks/usePermissions'

/**
 * Protects routes — redirects to /login if not authenticated.
 * Auth state is hydrated from localStorage via zustand/persist on app load.
 * Optionally checks allowedRoles and allowedPermissions.
 */
export default function ProtectedRoute({ children, allowedRoles, allowedPermissions }) {
  const { isAuthenticated } = useAuthStore()
  const { hasAnyRole, hasAnyPermission } = usePermissions()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Check roles
  if (allowedRoles?.length > 0) {
    if (!hasAnyRole(allowedRoles)) {
      return <Navigate to="/unauthorized" replace />
    }
  }

  // Check permissions
  if (allowedPermissions?.length > 0) {
    if (!hasAnyPermission(allowedPermissions)) {
      return <Navigate to="/unauthorized" replace />
    }
  }

  return children
}
