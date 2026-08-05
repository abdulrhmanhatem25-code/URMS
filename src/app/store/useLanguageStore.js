import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Language Store — AR (RTL) / EN (LTR)
 * Persisted in localStorage so the user's preference is remembered.
 */
export const useLanguageStore = create(
  persist(
    (set) => ({
      lang: 'ar',
      dir: 'rtl',

      toggleLang: () =>
        set((state) =>
          state.lang === 'ar'
            ? { lang: 'en', dir: 'ltr' }
            : { lang: 'ar', dir: 'rtl' }
        ),

      setLang: (lang) =>
        set({ lang, dir: lang === 'ar' ? 'rtl' : 'ltr' }),
    }),
    { name: 'urms-lang' }
  )
)
