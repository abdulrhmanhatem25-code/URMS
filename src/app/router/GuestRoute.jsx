import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/app/store/useAuthStore'

const ROLE_ROUTES = {
  SuperAdmin: '/dashboard/admin',
  Secretary: '/dashboard/secretary',
  Advisor: '/dashboard/advisor',
  Student: '/dashboard/student',
}

const getDashboard = (roles = []) => {
  for (const role of roles) {
    if (ROLE_ROUTES[role]) return ROLE_ROUTES[role]
  }
  return '/'
}

/**
 * GuestRoute — accessible only when NOT authenticated.
 * If the user is already logged in, redirect them to their dashboard.
 */
export default function GuestRoute({ children }) {
  const { isAuthenticated, user } = useAuthStore()

  if (isAuthenticated) {
    return <Navigate to={getDashboard(user?.roles)} replace />
  }

  return children
}
