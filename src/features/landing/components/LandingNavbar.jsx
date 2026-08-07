import { Link } from 'react-router-dom'
import { GraduationCap, Sun, Moon, LogIn, UserPlus, Languages } from 'lucide-react'
import { useTheme } from '@/shared/hooks/useTheme'
import { useLanguageStore } from '@/app/store/useLanguageStore'
import { Button } from '@/components/ui/button'

import { useTranslation } from '@/app/hooks/useTranslation'

export default function LandingNavbar() {
  const { isDark, toggleTheme } = useTheme()
  const { t: tx, lang, dir } = useTranslation('landingNavbar')
  const { toggleLang } = useLanguageStore()

  return (
    <nav
      dir={dir}
      className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="p-1.5 bg-primary/10 rounded-lg border border-primary/20 group-hover:bg-primary/20 transition-colors">
            <GraduationCap className="w-5 h-5 text-primary" />
          </div>
          <span className="font-bold text-base tracking-tight">{tx.systemName}</span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Language toggle */}
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 border border-border text-sm font-medium text-muted-foreground hover:text-foreground transition-all"
            aria-label="Toggle language"
          >
            <Languages className="w-4 h-4" />
            {lang === 'ar' ? 'EN' : 'ع'}
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 border border-border transition-colors"
            aria-label="Toggle theme"
          >
            {isDark
              ? <Sun className="w-4 h-4 text-muted-foreground" />
              : <Moon className="w-4 h-4 text-muted-foreground" />
            }
          </button>

          {/* Login */}
          <Link to="/login">
            <Button variant="outline" size="sm" className="gap-1.5 hidden sm:flex">
              <LogIn className="w-3.5 h-3.5" />
              {tx.login}
            </Button>
          </Link>

          {/* Register */}
          <Link to="/register">
            <Button size="sm" className="gap-1.5">
              <UserPlus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{tx.register}</span>
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
