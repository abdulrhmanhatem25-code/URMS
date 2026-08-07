import { usePermissions } from '@/app/hooks/usePermissions'

/**
 * Guard Component
 * Conditionally renders children based on the user's roles or permissions.
 *
 * @param {Object} props
 * @param {string[]} [props.roles] - Array of roles. User must have at least one.
 * @param {string[]} [props.permissions] - Array of permissions. User must have at least one.
 * @param {boolean} [props.requireAll=false] - If true, requires the user to have ALL specified roles AND permissions.
 * @param {React.ReactNode} [props.fallback=null] - What to render if access is denied.
 * @param {React.ReactNode} props.children - What to render if access is granted.
 */
export default function Guard({
  roles = [],
  permissions = [],
  requireAll = false,
  fallback = null,
  children,
}) {
  const { hasRole, hasAnyRole, hasPermission, hasAnyPermission } = usePermissions()

  let isAllowed = false

  if (requireAll) {
    const hasAllRoles = roles.length === 0 || roles.every(r => hasRole(r))
    const hasAllPermissions = permissions.length === 0 || permissions.every(p => hasPermission(p))
    isAllowed = hasAllRoles && hasAllPermissions
  } else {
    const roleMatch = roles.length === 0 || hasAnyRole(roles)
    const permissionMatch = permissions.length === 0 || hasAnyPermission(permissions)
    isAllowed = roleMatch && permissionMatch
  }

  // If no roles or permissions were specified, just render children
  if (roles.length === 0 && permissions.length === 0) {
    isAllowed = true
  }

  return isAllowed ? children : fallback
}
