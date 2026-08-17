import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Auth Store
 * - Tokens: stored in HttpOnly cookies (managed by the server, not here).
 * - User profile, roles, permissions: stored in-memory + persisted to
 *   localStorage so the UI can render immediately on page reload without
 *   an extra round-trip. A /me call on mount will re-validate if needed.
 */
export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      /** Called after login + /me fetch — stores full user profile */
      setAuthData: (data) =>
        set({
          user: {
            id: data.id,
            email: data.email,
            fullNameAr: data.fullNameAr,
            fullNameEn: data.fullNameEn,
            universityCode: data.universityCode,
            advisorCode: data.advisorCode,
            isApproved: data.isApproved,
            isActive: data.isActive,
            roles: data.roles ?? [],
            permissions: data.permissions ?? [],
          },
          isAuthenticated: true,
        }),

      /** Full logout — clear everything (cookie cleared server-side) */
      clearAuth: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'urms-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
