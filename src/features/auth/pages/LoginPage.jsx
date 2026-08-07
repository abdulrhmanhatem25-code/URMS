import { Link } from 'react-router-dom'
import { GraduationCap, Sun, Moon, ArrowRight } from 'lucide-react'
import { useTheme } from '@/shared/hooks/useTheme'
import LoginForm from '../components/LoginForm'

export default function LoginPage() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <div dir="rtl" className="min-h-screen bg-background flex">

      {/* ── Left: Branding (desktop only) ─────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden flex-col items-center justify-center p-12">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-violet-600/10 to-transparent" />
        {/* Blur orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl" />
        {/* Border on right */}
        <div className="absolute inset-y-0 left-0 w-px bg-border" />

        <div className="relative z-10 text-center space-y-8 max-w-xs">
          {/* Logo */}
          <div className="flex justify-center">
            <Link to="/" className="p-5 bg-primary/10 rounded-2xl border border-primary/20 shadow-lg shadow-primary/10 hover:scale-105 transition-transform">
              <GraduationCap className="w-14 h-14 text-primary" />
            </Link>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
              URMS
            </h1>
            <p className="text-lg font-medium text-muted-foreground leading-snug">
              نظام إدارة الطلبات الجامعية
            </p>
            <p className="text-sm text-muted-foreground/70 leading-relaxed">
              منصة متكاملة لإدارة ومتابعة كافة الطلبات الأكاديمية والإدارية للكليات
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-2 gap-3 text-sm text-right">
            {[
              { emoji: '📄', label: 'طلبات الوثائق' },
              { emoji: '📋', label: 'متابعة الطلبات' },
              { emoji: '📚', label: 'تسجيل المقررات' },
              { emoji: '🏛️', label: 'إجراءات إدارية' },
            ].map(({ emoji, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-secondary/60 border border-border/50"
              >
                <span className="text-base">{emoji}</span>
                <span className="text-muted-foreground text-xs">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right: Login Form ─────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 lg:px-14 relative">
        {/* Header Controls */}
        <div className="absolute top-5 left-5 flex items-center gap-2">
          <Link
            to="/"
            className="flex items-center gap-2 p-2 px-3 rounded-lg bg-secondary hover:bg-secondary/80 border border-border text-sm font-medium transition-colors text-muted-foreground hover:text-foreground"
          >
            <ArrowRight className="w-4 h-4" />
            الرئيسية
          </Link>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 border border-border transition-colors"
            aria-label="تغيير المظهر"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-muted-foreground" />
            ) : (
              <Moon className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        </div>

        <div className="w-full max-w-sm space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden text-center space-y-3">
            <div className="flex justify-center">
              <div className="p-3 bg-primary/10 rounded-xl border border-primary/20">
                <GraduationCap className="w-9 h-9 text-primary" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold">URMS</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                نظام إدارة الطلبات الجامعية
              </p>
            </div>
          </div>

          {/* Form heading */}
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-foreground">تسجيل الدخول</h2>
            <p className="text-sm text-muted-foreground">
              أدخل بياناتك للوصول إلى حسابك
            </p>
          </div>

          {/* Form */}
          <LoginForm />

          {/* Register link - students only */}
          <p className="text-center text-sm text-muted-foreground">
            طالب وليس لديك حساب؟{' '}
            <Link
              to="/register"
              className="text-primary hover:underline font-medium transition-colors"
            >
              سجل الآن
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
