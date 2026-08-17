import { KeyRound } from 'lucide-react'
import ChangePasswordForm from '../components/ChangePasswordForm'

export default function ChangePasswordPage() {
  return (
    <div dir="rtl" className="max-w-md mx-auto py-10 px-4">
      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <div className="mb-8 space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
            <KeyRound className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">تغيير كلمة المرور</h1>
            <p className="text-sm text-muted-foreground">
              أدخل كلمة مرورك الحالية ثم كلمة المرور الجديدة
            </p>
          </div>
        </div>
      </div>

      {/* ── Card ─────────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <ChangePasswordForm />
      </div>
    </div>
  )
}
