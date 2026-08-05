import { NavLink, useNavigate } from 'react-router-dom'
import { GraduationCap, FileText, LogOut, LayoutDashboard, X } from 'lucide-react'
import { useLanguageStore } from '@/app/store/useLanguageStore'
import { useAuthStore } from '@/app/store/useAuthStore'
import { useLogout } from '@/features/auth/hooks/useAuth'
import { cn } from '@/lib/utils'

const navItems = [
  {
    icon: LayoutDashboard,
    label: { ar: 'الرئيسية', en: 'Overview' },
    path: '/dashboard/admin',
    end: true,
  },
  {
    icon: FileText,
    label: { ar: 'النماذج', en: 'Forms' },
    path: '/dashboard/admin/forms',
  },
]

export default function AdminSidebar({ onClose }) {
  const { lang, dir } = useLanguageStore()
  const { user } = useAuthStore()
  const { mutate: logout, isPending: loggingOut } = useLogout()

  return (
    <aside
      className="flex flex-col h-full w-full bg-card border-e border-border"
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-5 h-16 border-b border-border shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-primary/10 rounded-lg border border-primary/20">
            <GraduationCap className="w-5 h-5 text-primary" />
          </div>
          <span className="font-bold text-sm">URMS</span>
        </div>
        {/* Close button — mobile only */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navItems.map(({ icon: Icon, label, path, end }) => (
          <NavLink
            key={path}
            to={path}
            end={end}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              )
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label[lang]}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="p-4 border-t border-border shrink-0 space-y-3">
        <div className="px-3 py-2 rounded-lg bg-secondary/50">
          <p className="text-xs font-semibold text-foreground truncate">
            {lang === 'ar' ? user?.fullNameAr : user?.fullNameEn}
          </p>
          <p className="text-xs text-muted-foreground truncate mt-0.5">{user?.email}</p>
        </div>
        <button
          onClick={() => logout()}
          disabled={loggingOut}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {lang === 'ar' ? 'تسجيل الخروج' : 'Logout'}
        </button>
      </div>
    </aside>
  )
}
