import { Menu, Sun, Moon, Languages } from 'lucide-react'
import { useLanguageStore } from '@/app/store/useLanguageStore'
import { useTheme } from '@/shared/hooks/useTheme'

export default function Header({ onMobileMenuClick }) {
  const { lang, toggleLang } = useLanguageStore()
  const { isDark, toggleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-4 md:px-6 bg-background/80 backdrop-blur-md border-b border-border">
      {/* Mobile menu button */}
      <button
        className="lg:hidden p-2 rounded-lg hover:bg-secondary border border-border transition-colors"
        onClick={onMobileMenuClick}
      >
        <Menu className="w-5 h-5 text-muted-foreground" />
      </button>

      {/* Desktop spacer */}
      <div className="hidden lg:block" />

      {/* Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleLang}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 border border-border text-xs font-medium text-muted-foreground hover:text-foreground transition-all"
        >
          <Languages className="w-4 h-4" />
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
  )
}
