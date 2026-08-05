import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Auth Store
 * - Access Token: stored in-memory + persisted via localStorage (zustand/persist)
 * - Refresh Token: persisted in localStorage
 * - User profile, roles, permissions: from login response directly
 */
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      tokenExpiresOn: null,
      refreshTokenExpiresOn: null,
      isAuthenticated: false,

      /** Called after successful login — stores everything from the response */
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
          token: data.token,
          refreshToken: data.refreshToken,
          tokenExpiresOn: data.tokenExpiresOn,
          refreshTokenExpiresOn: data.refreshTokenExpiresOn,
          isAuthenticated: true,
        }),

      /** Called after a successful token refresh */
      setTokens: (token, refreshToken, tokenExpiresOn, refreshTokenExpiresOn) =>
        set({ token, refreshToken, tokenExpiresOn, refreshTokenExpiresOn }),

      /** Full logout — clear everything */
      clearAuth: () =>
        set({
          user: null,
          token: null,
          refreshToken: null,
          tokenExpiresOn: null,
          refreshTokenExpiresOn: null,
          isAuthenticated: false,
        }),

      /** Returns true if the access token is expired or missing */
      isTokenExpired: () => {
        const { tokenExpiresOn } = get()
        if (!tokenExpiresOn) return true
        return new Date(tokenExpiresOn) <= new Date()
      },
    }),
    {
      name: 'urms-auth', // localStorage key
      // Only persist what's needed — skip transient UI state
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        tokenExpiresOn: state.tokenExpiresOn,
        refreshTokenExpiresOn: state.refreshTokenExpiresOn,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
