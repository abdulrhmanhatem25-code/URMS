import { useNavigate } from 'react-router-dom'
import { CalendarDays, Users, AlertCircle, ArrowLeft, ArrowRight, CheckCircle, XCircle } from 'lucide-react'
import { useLanguageStore } from '@/app/store/useLanguageStore'
import { cn } from '@/lib/utils'

const t = {
  ar: {
    apply: 'تقديم الطلب',
    closed: 'مغلق',
    active: 'متاح',
    requests: 'طلب',
    from: 'من',
    to: 'إلى',
    closedReason: 'سبب الإغلاق',
    loginRequired: 'يجب تسجيل الدخول للتقديم',
  },
  en: {
    apply: 'Apply Now',
    closed: 'Closed',
    active: 'Available',
    requests: 'requests',
    from: 'From',
    to: 'To',
    closedReason: 'Closure reason',
    loginRequired: 'Login required to apply',
  },
}

const formatDate = (dateStr, lang) => {
  return new Date(dateStr).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function FormCard({ form }) {
  const { lang, dir } = useLanguageStore()
  const tx = t[lang]
  const navigate = useNavigate()

  const title = lang === 'ar' ? form.titleAr : form.titleEn
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight

  const handleClick = () => {
    navigate('/login')
  }

  return (
    <div
      dir={dir}
      onClick={handleClick}
      className={cn(
        'group relative flex flex-col bg-card rounded-xl border border-border p-5 gap-4',
        'cursor-pointer transition-all duration-200',
        'hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5',
        !form.isActive && 'opacity-80'
      )}
    >
      {/* Status badge */}
      <div className="flex items-center justify-between">
        <span
          className={cn(
            'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold',
            form.isActive
              ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
              : 'bg-destructive/10 text-destructive border border-destructive/20'
          )}
        >
          {form.isActive
            ? <><CheckCircle className="w-3 h-3" /> {tx.active}</>
            : <><XCircle className="w-3 h-3" /> {tx.closed}</>
          }
        </span>

        {/* Requests count */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Users className="w-3.5 h-3.5" />
          <span>{form.requestsCount} {tx.requests}</span>
        </div>
      </div>

      {/* Title */}
      <h3 className="font-bold text-base text-foreground leading-snug line-clamp-2">
        {title}
      </h3>

      {/* Description */}
      {form.description && (
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {form.description}
        </p>
      )}

      {/* Closed reason */}
      {!form.isActive && form.closedReasonMessage && (
        <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-destructive/5 border border-destructive/15 text-xs text-destructive">
          <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <span>{form.closedReasonMessage}</span>
        </div>
      )}

      {/* Date range */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-auto">
        <CalendarDays className="w-3.5 h-3.5 shrink-0" />
        <span>
          {tx.from} {formatDate(form.startDate, lang)} {tx.to} {formatDate(form.endDate, lang)}
        </span>
      </div>

      {/* Apply button — shows on hover */}
      <div className="flex items-center gap-2 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {tx.apply}
        <Arrow className="w-4 h-4" />
      </div>
    </div>
  )
}
