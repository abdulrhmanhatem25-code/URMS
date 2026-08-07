import { CalendarDays, User, GraduationCap, Eye } from 'lucide-react'
import { useLanguageStore } from '@/app/store/useLanguageStore'
import { STATUS_CONFIG } from '@/shared/components/RequestDetailsModal'
import { cn } from '@/lib/utils'

const formatDate = (d, lang) => {
  if (!d) return '—'
  return new Date(d).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

import { useTranslation } from '@/app/hooks/useTranslation'

export default function RequestCard({ request, onView, showStudent = true }) {
  const { t: tx, lang, dir } = useTranslation('requestCard')

  const statusCfg = STATUS_CONFIG[request.status] ?? STATUS_CONFIG.Pending
  const formTitle = lang === 'ar' ? request.formTitleAr : request.formTitleEn
  const studentName = lang === 'ar' ? request.studentNameAr : request.studentNameEn

  return (
    <div
      dir={dir}
      className="group flex flex-col bg-card rounded-2xl border border-border p-5 gap-4 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 transition-all duration-200 cursor-pointer"
      onClick={() => onView(request)}
    >
      {/* Top row: status + request ID */}
      <div className="flex items-center justify-between gap-2">
        <span className={cn(
          'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border',
          statusCfg.cls,
        )}>
          {lang === 'ar' ? (request.statusAr || statusCfg.ar) : (request.statusEn || statusCfg.en)}
        </span>
        <span className="text-xs text-muted-foreground font-mono">{tx.requestId}{request.id}</span>
      </div>

      {/* Form title */}
      <div>
        <p className="text-xs text-muted-foreground mb-0.5">{lang === 'ar' ? 'النموذج' : 'Form'}</p>
        <p className="text-sm font-semibold text-foreground leading-snug line-clamp-2">
          {formTitle ?? '—'}
        </p>
      </div>

      {/* Next Action */}
      {request.nextAction && (
        <div className="mt-1 p-2.5 bg-primary/5 rounded-lg border border-primary/10">
          <p className="text-[11px] font-medium text-primary/70 mb-0.5 uppercase tracking-wider">
            {lang === 'ar' ? 'الإجراء التالي' : 'Next Action'}
          </p>
          <p className="text-xs font-semibold text-primary leading-snug line-clamp-2">
            {lang === 'ar' ? request.nextAction : (request.nextActionEn || request.nextAction)}
          </p>
        </div>
      )}

      {/* Student info — shown for admin view, hidden for student's own view */}
      {showStudent && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate font-medium text-foreground">{studentName}</span>
          {request.universityCode && (
            <span className="text-xs bg-secondary border border-border rounded px-1.5 py-0.5 font-mono shrink-0">
              {request.universityCode}
            </span>
          )}
        </div>
      )}

      {/* Advisor */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <GraduationCap className="w-3.5 h-3.5 shrink-0" />
        <span>{request.advisorName ?? tx.noAdvisor}</span>
      </div>

      {/* Footer: date + details button */}
      <div className="flex items-center justify-between pt-3 border-t border-border/50 mt-auto">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <CalendarDays className="w-3.5 h-3.5" />
          <span>{formatDate(request.createdAt, lang)}</span>
        </div>
        <button
          onClick={e => { e.stopPropagation(); onView(request) }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-secondary hover:bg-primary hover:text-primary-foreground border border-border hover:border-primary transition-all duration-150"
        >
          <Eye className="w-3 h-3" />
          {tx.details}
        </button>
      </div>
    </div>
  )
}
