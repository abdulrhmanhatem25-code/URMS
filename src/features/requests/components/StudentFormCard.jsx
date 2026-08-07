import { CalendarDays, CheckCircle, XCircle, Send, Clock } from 'lucide-react'
import { useLanguageStore } from '@/app/store/useLanguageStore'
import { cn } from '@/lib/utils'

const formatDate = (d, lang) => {
  if (!d) return ''
  return new Date(d).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

import { useTranslation } from '@/app/hooks/useTranslation'

export default function StudentFormCard({ form, onApply }) {
  const { t: tx, lang, dir } = useTranslation('studentFormCard')

  const title = lang === 'ar' ? form.titleAr : form.titleEn

  return (
    <div
      dir={dir}
      className={cn(
        'group relative flex flex-col bg-card rounded-2xl border p-6 gap-4 transition-all duration-200',
        form.isActive
          ? 'border-border hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 cursor-pointer'
          : 'border-border/50 opacity-70',
      )}
    >
      {/* Decorative top accent */}
      {form.isActive && (
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary/0 via-primary to-primary/0 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
      )}

      {/* Status badge */}
      <div className="flex items-center justify-between">
        <span className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold',
          form.isActive
            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
            : 'bg-destructive/10 text-destructive border border-destructive/20',
        )}>
          {form.isActive
            ? <><CheckCircle className="w-3 h-3" />{tx.active}</>
            : <><XCircle className="w-3 h-3" />{tx.closed}</>
          }
        </span>

        {/* Field count indicator */}
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          {(form.fields ?? []).length}&nbsp;{lang === 'ar' ? 'حقل' : 'fields'}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-bold text-base text-foreground leading-snug line-clamp-2 flex-1">
        {title}
      </h3>

      {/* Description */}
      {form.description && (
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 -mt-1">
          {form.description}
        </p>
      )}

      {/* Closed reason */}
      {!form.isActive && form.closedReasonMessage && (
        <p className="text-xs text-destructive/80 bg-destructive/5 border border-destructive/15 rounded-lg px-3 py-2">
          {tx.reason} {form.closedReasonMessage}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-border/50 mt-auto">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <CalendarDays className="w-3.5 h-3.5" />
          <span>
            {formatDate(form.startDate, lang)}
            {' — '}
            {formatDate(form.endDate, lang)}
          </span>
        </div>

        <button
          onClick={() => onApply(form)}
          disabled={!form.isActive}
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150',
            form.isActive
              ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md hover:shadow-primary/20 active:scale-95'
              : 'bg-secondary text-muted-foreground cursor-not-allowed',
          )}
        >
          <Send className="w-3 h-3" />
          {tx.apply}
        </button>
      </div>
    </div>
  )
}
