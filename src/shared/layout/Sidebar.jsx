import { NavLink } from 'react-router-dom'
import { LayoutDashboard, FileText, ClipboardList, LogOut, ChevronRight, ChevronLeft, UserPlus, Users, GraduationCap, KeyRound } from 'lucide-react'
import { useLanguageStore } from '@/app/store/useLanguageStore'
import { useAuthStore } from '@/app/store/useAuthStore'
import { usePermissions } from '@/app/hooks/usePermissions'
import { useLogout } from '@/features/auth/hooks/useAuth'
import { cn } from '@/lib/utils'

// Centralized navigation configuration
const NAV_ITEMS = [
  {
    icon: LayoutDashboard,
    label: { ar: 'لوحة التحكم', en: 'Dashboard' },
    path: '/dashboard/admin',
    roles: ['SuperAdmin'],
  },
  {
    icon: FileText,
    label: { ar: 'النماذج', en: 'Forms' },
    path: '/dashboard/admin/forms',
    roles: ['SuperAdmin'],
  },
  {
    icon: UserPlus,
    label: { ar: 'إدارة التسجيل', en: 'Registration Management' },
    path: '/dashboard/admin/registration',
    roles: ['SuperAdmin'],
  },
  {
    icon: Users,
    label: { ar: 'إدارة المستخدمين', en: 'Users Management' },
    path: '/dashboard/admin/users',
    roles: ['SuperAdmin'],
  },
  {
    icon: UserPlus,
    label: { ar: 'إدارة التسجيل', en: 'Registration Management' },
    path: '/dashboard/secretary/registration',
    roles: ['Secretary'],
  },
  {
    icon: GraduationCap,
    label: { ar: 'طلابي', en: 'My Students' },
    path: '/dashboard/advisor/my-students',
    roles: ['AcademicAdvisor'],
  },
  {
    icon: UserPlus,
    label: { ar: 'إدارة التسجيل', en: 'Registration Management' },
    path: '/dashboard/advisor/registration',
    roles: ['AcademicAdvisor'],
  },
  {
    icon: ClipboardList,
    label: { ar: 'إدارة الطلبات', en: 'Manage Requests' },
    path: '/dashboard/admin/manage-requests',
    roles: ['SuperAdmin'],
  },
  {
    icon: ClipboardList,
    label: { ar: 'إدارة الطلبات', en: 'Manage Requests' },
    path: '/dashboard/advisor/manage-requests',
    roles: ['AcademicAdvisor'],
  },
  {
    icon: FileText,
    label: { ar: 'الطلبات المتاحة', en: 'Available Requests' },
    path: '/dashboard/student/requests',
    roles: ['Student'],
  },
  {
    icon: FileText,
    label: { ar: 'الطلبات المتاحة', en: 'Available Requests' },
    path: '/dashboard/admin/requests',
    roles: ['SuperAdmin'],
  },
  {
    icon: ClipboardList,
    label: { ar: 'طلباتي', en: 'My Requests' },
    path: '/dashboard/student/my-requests',
    roles: ['Student'],
  },
  // ── Shared ───────────────────────────────────────────────────────────────
  {
    icon: KeyRound,
    label: { ar: 'تغيير كلمة المرور', en: 'Change Password' },
    path: '/dashboard/change-password',
    // no roles = visible to all authenticated users
  },
]

export default function Sidebar({ isOpen, isMobile, onToggle, onClose }) {
  const { lang, dir } = useLanguageStore()
  const { user } = useAuthStore()
  const { hasAnyRole, hasAnyPermission } = usePermissions()
  const { mutate: logout } = useLogout()

  const logoutTxt = lang === 'ar' ? 'تسجيل الخروج' : 'Logout'

  // Filter items based on roles/permissions
  const allowedItems = NAV_ITEMS.filter(item => {
    // If neither roles nor permissions are specified, it's public (or just show it)
    if (!item.roles && !item.permissions) return true

    const roleMatch = item.roles ? hasAnyRole(item.roles) : true
    const permissionMatch = item.permissions ? hasAnyPermission(item.permissions) : true

    return roleMatch && permissionMatch
  })

  return (
    <div className="flex flex-col h-full bg-card border-x border-border relative">
      
      {/* ── Desktop Toggle Button ────────────────────────────────────────── */}
      {!isMobile && (
        <button
          onClick={onToggle}
          className={cn(
            "absolute top-5 z-50 p-1 rounded-full border border-border bg-background text-muted-foreground hover:text-foreground transition-transform",
            dir === 'rtl' ? "-left-3" : "-right-3"
          )}
        >
          {isOpen ? (
            dir === 'rtl' ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />
          ) : (
            dir === 'rtl' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
          )}
        </button>
      )}

      {/* ── Brand ───────────────────────────────────────────────────────── */}
      <div className={cn(
        "h-16 flex items-center px-4 md:px-6 border-b border-border shrink-0 transition-all duration-300",
        isOpen ? "justify-start" : "justify-center"
      )}>
        <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          {isOpen ? 'URMS' : 'U'}
        </h2>
      </div>

      {/* ── User Info ────────────────────────────────────────────────────── */}
      <div className={cn(
        "p-4 border-b border-border transition-all duration-300 overflow-hidden",
        isOpen ? "opacity-100" : "opacity-0 h-0 p-0 border-0"
      )}>
        <p className="font-semibold text-sm text-foreground truncate">
          {lang === 'ar' ? user?.fullNameAr : user?.fullNameEn}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5 truncate">
          {user?.email}
        </p>
      </div>

      {/* ── Navigation ───────────────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-thin">
        {allowedItems.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.path}
            onClick={isMobile ? onClose : undefined}
            end={item.path === '/dashboard/admin' || item.path === '/dashboard/student'} // strict match for root dashboards
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                !isOpen && 'justify-center'
              )
            }
            title={!isOpen ? item.label[lang] : undefined}
          >
            <item.icon className={cn("shrink-0", isOpen ? "w-4 h-4" : "w-5 h-5")} />
            {isOpen && <span className="truncate">{item.label[lang]}</span>}
          </NavLink>
        ))}
      </nav>

      {/* ── Logout ───────────────────────────────────────────────────────── */}
      <div className="p-3 mt-auto border-t border-border bg-card">
        <button
          onClick={() => logout()}
          className={cn(
            'flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors',
            !isOpen && 'justify-center'
          )}
          title={!isOpen ? logoutTxt : undefined}
        >
          <LogOut className={cn("shrink-0", isOpen ? "w-4 h-4" : "w-5 h-5")} />
          {isOpen && <span className="truncate">{logoutTxt}</span>}
        </button>
      </div>
    </div>
  )
}
