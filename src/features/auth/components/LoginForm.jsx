import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2, Mail, Lock } from 'lucide-react'
import { useLogin } from '../hooks/useAuth'
import { Button } from '@/components/ui/button'
import FormInput from '@/shared/components/FormInput'

const schema = z.object({
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  password: z.string().min(1, 'كلمة المرور مطلوبة'),
})

export default function LoginForm() {
  const [showPass, setShowPass] = useState(false)
  const { mutate: login, isPending, error } = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = (data) => login(data)

  const apiError =
    error?.response?.data?.message ||
    (error ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة' : null)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* API Error */}
      {apiError && (
        <div className="px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/25 text-destructive text-sm text-center">
          {apiError}
        </div>
      )}

      {/* Email */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-foreground">
          البريد الإلكتروني
        </label>
        <div className="relative">
          <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            {...register('email')}
            type="email"
            placeholder="example@urms.edu.eg"
            dir="ltr"
            autoComplete="email"
            className={[
              'w-full pr-10 pl-4 py-2.5 rounded-lg bg-input/40 border text-sm text-foreground',
              'placeholder:text-muted-foreground/40 outline-none transition-all duration-150',
              'focus:ring-2 focus:ring-ring/30',
              errors.email
                ? 'border-destructive focus:border-destructive'
                : 'border-border focus:border-primary',
            ].join(' ')}
          />
        </div>
        {errors.email && (
          <p className="text-xs text-destructive flex items-center gap-1">
            <span>⚠</span> {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-foreground">
          كلمة المرور
        </label>
        <div className="relative">
          <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            {...register('password')}
            type={showPass ? 'text' : 'password'}
            placeholder="••••••••"
            dir="ltr"
            autoComplete="current-password"
            className={[
              'w-full pr-10 pl-10 py-2.5 rounded-lg bg-input/40 border text-sm text-foreground',
              'placeholder:text-muted-foreground/40 outline-none transition-all duration-150',
              'focus:ring-2 focus:ring-ring/30',
              errors.password
                ? 'border-destructive focus:border-destructive'
                : 'border-border focus:border-primary',
            ].join(' ')}
          />
          <button
            type="button"
            onClick={() => setShowPass((p) => !p)}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            tabIndex={-1}
          >
            {showPass ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-destructive flex items-center gap-1">
            <span>⚠</span> {errors.password.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full gap-2 h-10" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            جاري تسجيل الدخول...
          </>
        ) : (
          'تسجيل الدخول'
        )}
      </Button>
    </form>
  )
}
