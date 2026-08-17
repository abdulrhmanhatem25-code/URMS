import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2, Lock, CheckCircle2 } from 'lucide-react'
import { useChangePassword } from '../hooks/useAuth'
import { Button } from '@/components/ui/button'

// ─── Validation Schema ────────────────────────────────────────────────────────
const schema = z
  .object({
    currentPassword: z.string().min(1, 'كلمة المرور الحالية مطلوبة'),
    newPassword: z
      .string()
      .min(8, 'كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل'),
    confirmPassword: z.string().min(1, 'تأكيد كلمة المرور مطلوب'),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'كلمتا المرور غير متطابقتين',
    path: ['confirmPassword'],
  })

// ─── Reusable password field ──────────────────────────────────────────────────
function PasswordField({ label, id, registration, error, autoComplete }) {
  const [show, setShow] = useState(false)
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="relative">
        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          id={id}
          {...registration}
          type={show ? 'text' : 'password'}
          placeholder="••••••••"
          dir="ltr"
          autoComplete={autoComplete}
          className={[
            'w-full pr-10 pl-10 py-2.5 rounded-lg bg-input/40 border text-sm text-foreground',
            'placeholder:text-muted-foreground/40 outline-none transition-all duration-150',
            'focus:ring-2 focus:ring-ring/30',
            error
              ? 'border-destructive focus:border-destructive'
              : 'border-border focus:border-primary',
          ].join(' ')}
        />
        <button
          type="button"
          onClick={() => setShow((p) => !p)}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          tabIndex={-1}
          aria-label={show ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {error && (
        <p className="text-xs text-destructive flex items-center gap-1">
          <span>⚠</span> {error.message}
        </p>
      )}
    </div>
  )
}

// ─── ChangePasswordForm ───────────────────────────────────────────────────────
export default function ChangePasswordForm() {
  const { mutate: changePassword, isPending, error, isSuccess } = useChangePassword()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = (data) => {
    changePassword(
      { currentPassword: data.currentPassword, newPassword: data.newPassword },
      { onSuccess: () => reset() }
    )
  }

  const apiError =
    error?.response?.data?.message ||
    (error ? 'حدث خطأ، تأكد من كلمة المرور الحالية وحاول مجدداً' : null)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Success message */}
      {isSuccess && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-lg bg-green-500/10 border border-green-500/25 text-green-600 dark:text-green-400 text-sm">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          تم تغيير كلمة المرور بنجاح
        </div>
      )}

      {/* API Error */}
      {apiError && (
        <div className="px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/25 text-destructive text-sm text-center">
          {apiError}
        </div>
      )}

      <PasswordField
        label="كلمة المرور الحالية"
        id="currentPassword"
        registration={register('currentPassword')}
        error={errors.currentPassword}
        autoComplete="current-password"
      />

      <PasswordField
        label="كلمة المرور الجديدة"
        id="newPassword"
        registration={register('newPassword')}
        error={errors.newPassword}
        autoComplete="new-password"
      />

      <PasswordField
        label="تأكيد كلمة المرور الجديدة"
        id="confirmPassword"
        registration={register('confirmPassword')}
        error={errors.confirmPassword}
        autoComplete="new-password"
      />

      <Button type="submit" className="w-full gap-2 h-10" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            جاري التغيير...
          </>
        ) : (
          'تغيير كلمة المرور'
        )}
      </Button>
    </form>
  )
}
