import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Menu, Sun, Moon, Languages } from 'lucide-react'
import { useLanguageStore } from '@/app/store/useLanguageStore'
import { useTheme } from '@/shared/hooks/useTheme'
import AdminSidebar from './AdminSidebar'

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { lang, dir, toggleLang } = useLanguageStore()
  const { isDark, toggleTheme } = useTheme()

  return (
    <div dir={dir} className="min-h-screen bg-background flex">
      {/* ── Mobile overlay ────────────────────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ───────────────────────────────────────────────────────── */}
      <div
        className={[
          'fixed inset-y-0 z-50 w-64 transition-transform duration-300 lg:relative lg:translate-x-0',
          dir === 'rtl'
            ? sidebarOpen ? 'right-0 translate-x-0' : 'right-0 translate-x-full lg:translate-x-0'
            : sidebarOpen ? 'left-0 translate-x-0' : 'left-0 -translate-x-full lg:translate-x-0',
        ].join(' ')}
      >
        <AdminSidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* ── Main ──────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-4 md:px-6 bg-background/80 backdrop-blur-md border-b border-border">
          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-secondary border border-border transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-4 h-4 text-muted-foreground" />
          </button>

          {/* Desktop spacer */}
          <div className="hidden lg:block" />

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 border border-border text-xs font-medium text-muted-foreground hover:text-foreground transition-all"
            >
              <Languages className="w-3.5 h-3.5" />
              {lang === 'ar' ? 'EN' : 'ع'}
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 border border-border transition-colors"
            >
              {isDark
                ? <Sun className="w-4 h-4 text-muted-foreground" />
                : <Moon className="w-4 h-4 text-muted-foreground" />
              }
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
