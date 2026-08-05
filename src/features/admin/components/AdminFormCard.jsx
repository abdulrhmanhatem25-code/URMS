import { useState } from 'react'
import { CalendarDays, Users, MoreVertical, ToggleLeft, ToggleRight, Pencil, Trash2, CheckCircle, XCircle, Eye } from 'lucide-react'
import { useLanguageStore } from '@/app/store/useLanguageStore'
import { cn } from '@/lib/utils'

const formatDate = (d, lang) =>
  new Date(d).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  })

export default function AdminFormCard({ form, onToggle, onEdit, onDelete, onPreview }) {
  const { lang, dir } = useLanguageStore()
  const [menuOpen, setMenuOpen] = useState(false)

  const title = lang === 'ar' ? form.titleAr : form.titleEn

  return (
    <div dir={dir} className="relative flex flex-col bg-card rounded-xl border border-border p-5 gap-3 hover:border-border/80 transition-colors">
      {/* Top row: status + actions menu */}
      <div className="flex items-center justify-between">
        <span className={cn(
          'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold',
          form.isActive
            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
            : 'bg-destructive/10 text-destructive border border-destructive/20'
        )}>
          {form.isActive
            ? <><CheckCircle className="w-3 h-3" /> {lang === 'ar' ? 'نشط' : 'Active'}</>
            : <><XCircle className="w-3 h-3" /> {lang === 'ar' ? 'مغلق' : 'Closed'}</>
          }
        </span>

        {/* Actions dropdown */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(p => !p)}
            className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className={cn(
                'absolute z-20 top-8 w-44 bg-card border border-border rounded-xl shadow-xl overflow-hidden',
                dir === 'rtl' ? 'left-0' : 'right-0'
              )}>
                <button
                  onClick={() => { setMenuOpen(false); onToggle(form) }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-secondary transition-colors text-foreground"
                >
                  {form.isActive
                    ? <ToggleLeft className="w-4 h-4 text-amber-500" />
                    : <ToggleRight className="w-4 h-4 text-emerald-500" />
                  }
                  {form.isActive
                    ? (lang === 'ar' ? 'إغلاق النموذج' : 'Close Form')
                    : (lang === 'ar' ? 'تفعيل النموذج' : 'Activate Form')
                  }
                </button>
                <button
                  onClick={() => { setMenuOpen(false); onPreview(form) }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-secondary transition-colors text-foreground"
                >
                  <Eye className="w-4 h-4 text-primary" />
                  {lang === 'ar' ? 'معاينة' : 'Preview'}
                </button>
                <button
                  onClick={() => { setMenuOpen(false); onEdit(form) }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-secondary transition-colors text-foreground"
                >
                  <Pencil className="w-4 h-4 text-primary" />
                  {lang === 'ar' ? 'تعديل' : 'Edit'}
                </button>
                <button
                  onClick={() => { setMenuOpen(false); onDelete(form) }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-destructive/10 transition-colors text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                  {lang === 'ar' ? 'حذف' : 'Delete'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="font-bold text-sm text-foreground leading-snug line-clamp-2">{title}</h3>

      {/* Description */}
      {form.description && (
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{form.description}</p>
      )}

      {/* Closed reason */}
      {!form.isActive && form.closedReasonMessage && (
        <p className="text-xs text-destructive/80 bg-destructive/5 border border-destructive/15 rounded-lg px-3 py-2">
          {lang === 'ar' ? 'سبب الإغلاق: ' : 'Reason: '}{form.closedReasonMessage}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/50 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <CalendarDays className="w-3 h-3" />
          <span>{formatDate(form.startDate, lang)} — {formatDate(form.endDate, lang)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          <span>{form.requestsCount}</span>
        </div>
      </div>
    </div>
  )
}
