import { useState } from 'react'
import { Link } from 'react-router-dom'
import { GraduationCap, Sun, Moon, CheckCircle2, ArrowRight } from 'lucide-react'
import { useTheme } from '@/shared/hooks/useTheme'
import RegisterForm from '../components/RegisterForm'

const STEPS = [
  { id: 1, label: 'الاسم بالعربية' },
  { id: 2, label: 'الاسم بالإنجليزية' },
  { id: 3, label: 'البيانات الشخصية' },
]

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const { isDark, toggleTheme } = useTheme()

  return (
    <div dir="rtl" className="min-h-screen bg-background flex flex-col">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/50 backdrop-blur-sm">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="p-1.5 bg-primary/10 rounded-lg border border-primary/20 group-hover:bg-primary/15 transition-colors">
            <GraduationCap className="w-5 h-5 text-primary" />
          </div>
          <span className="font-bold text-base text-foreground">URMS</span>
        </Link>

        <div className="flex items-center gap-2">
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
      </header>

      {/* ── Body ──────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg space-y-8">

          {submitted ? (
            /* ── Success State ─────────────────────────────────────────────── */
            <div className="text-center space-y-5 py-10">
              <div className="flex justify-center">
                <div className="p-5 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                  <CheckCircle2 className="w-14 h-14 text-emerald-500" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">
                  تم إرسال طلب التسجيل
                </h2>
                <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  تم استلام بياناتك بنجاح. سيقوم المختص بمراجعة بياناتك
                  وتفعيل حسابك في أقرب وقت.
                </p>
                <p className="text-sm text-muted-foreground/70">
                  ستصلك رسالة على بريدك الإلكتروني عند تفعيل الحساب.
                </p>
              </div>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 mt-4 text-primary hover:underline font-medium text-sm transition-colors"
              >
                العودة لتسجيل الدخول
              </Link>
            </div>
          ) : (
            /* ── Form ─────────────────────────────────────────────────────── */
            <>
              {/* Page title */}
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-foreground">
                  إنشاء حساب جديد
                </h1>
                <p className="text-sm text-muted-foreground">
                  للطلاب فقط — أدخل بياناتك لإنشاء حسابك
                </p>
              </div>

              {/* Step indicator */}
              <div className="flex items-start">
                {STEPS.map((s, i) => (
                  <div key={s.id} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div
                        className={[
                          'w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-200',
                          step > s.id
                            ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/30'
                            : step === s.id
                            ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                            : 'bg-secondary text-muted-foreground',
                        ].join(' ')}
                      >
                        {step > s.id ? '✓' : s.id}
                      </div>
                      <span
                        className={[
                          'text-xs mt-1.5 whitespace-nowrap font-medium',
                          step === s.id
                            ? 'text-primary'
                            : 'text-muted-foreground',
                        ].join(' ')}
                      >
                        {s.label}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div
                        className={[
                          'flex-1 h-px mx-3 mb-5 transition-colors duration-300',
                          step > s.id ? 'bg-primary' : 'bg-border',
                        ].join(' ')}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Form card */}
              <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                <RegisterForm
                  step={step}
                  setStep={setStep}
                  onSuccess={() => setSubmitted(true)}
                />
              </div>

              {/* Login link */}
              <p className="text-center text-sm text-muted-foreground">
                لديك حساب بالفعل؟{' '}
                <Link
                  to="/login"
                  className="text-primary hover:underline font-medium transition-colors"
                >
                  تسجيل الدخول
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
