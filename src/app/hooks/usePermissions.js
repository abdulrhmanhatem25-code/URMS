import { useAuthStore } from '@/app/store/useAuthStore'

export function usePermissions() {
  const { user, isAuthenticated } = useAuthStore()

  const roles = user?.roles || []
  const permissions = user?.permissions || []

  /**
   * Check if user has a specific role
   * @param {string} role
   * @returns {boolean}
   */
  const hasRole = (role) => {
    if (!isAuthenticated) return false
    return roles.includes(role)
  }

  /**
   * Check if user has ANY of the specified roles
   * @param {string[]} rolesArray
   * @returns {boolean}
   */
  const hasAnyRole = (rolesArray) => {
    if (!isAuthenticated || !rolesArray?.length) return false
    return rolesArray.some((r) => roles.includes(r))
  }

  /**
   * Check if user has a specific permission
   * @param {string} permission
   * @returns {boolean}
   */
  const hasPermission = (permission) => {
    if (!isAuthenticated) return false
    return permissions.includes(permission)
  }

  /**
   * Check if user has ANY of the specified permissions
   * @param {string[]} permissionsArray
   * @returns {boolean}
   */
  const hasAnyPermission = (permissionsArray) => {
    if (!isAuthenticated || !permissionsArray?.length) return false
    return permissionsArray.some((p) => permissions.includes(p))
  }

  return {
    roles,
    permissions,
    hasRole,
    hasAnyRole,
    hasPermission,
    hasAnyPermission,
  }
}
