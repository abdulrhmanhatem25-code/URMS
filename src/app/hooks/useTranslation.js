import { useLanguageStore } from '@/app/store/useLanguageStore'
import ar from '@/locales/ar'
import en from '@/locales/en'

const translations = { ar, en }

/**
 * useTranslation Hook
 * @param {string} namespace - Optional namespace (e.g., 'landing', 'requests')
 * @returns {{ t: any, lang: string, dir: string }}
 */
export function useTranslation(namespace) {
  const { lang, dir } = useLanguageStore()

  let t = translations[lang]

  // If a namespace is provided, return that specific section
  if (namespace && t[namespace]) {
    t = t[namespace]
  }

  return { t, lang, dir }
}
