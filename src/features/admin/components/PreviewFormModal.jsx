import { CalendarDays, AlertTriangle, Users, CheckCircle, XCircle } from 'lucide-react'
import Modal from '@/shared/components/Modal'
import { Button } from '@/components/ui/button'
import { useLanguageStore } from '@/app/store/useLanguageStore'
import { cn } from '@/lib/utils'

const formatDate = (d, lang) => {
  if (!d) return ''
  return new Date(d).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}

export default function PreviewFormModal({ form, isOpen, onClose }) {
  const { lang, dir } = useLanguageStore()

  if (!form) return null

  const title = lang === 'ar' ? form.titleAr : form.titleEn
  const fields = [...(form.fields ?? [])].sort((a, b) => a.order - b.order)

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={lang === 'ar' ? 'معاينة النموذج' : 'Form Preview'}
      dir={dir}
      size="xl"
    >
      <div className="p-0">
        {/* Form Header (Simulated Student View) */}
        <div className="bg-primary/5 px-6 py-8 border-b border-border space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold',
              form.isActive
                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                : 'bg-destructive/10 text-destructive border border-destructive/20'
            )}>
              {form.isActive
                ? <><CheckCircle className="w-3.5 h-3.5" /> {lang === 'ar' ? 'متاح للتقديم' : 'Open for submissions'}</>
                : <><XCircle className="w-3.5 h-3.5" /> {lang === 'ar' ? 'مغلق' : 'Closed'}</>
              }
            </span>
          </div>

          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          
          {form.description && (
            <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
              {form.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 pt-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <CalendarDays className="w-4 h-4" />
              <span>{lang === 'ar' ? 'من:' : 'From:'} {formatDate(form.startDate, lang)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CalendarDays className="w-4 h-4" />
              <span>{lang === 'ar' ? 'إلى:' : 'To:'} {formatDate(form.endDate, lang)}</span>
            </div>
          </div>
          
          {!form.isActive && form.closedReasonMessage && (
            <div className="inline-flex items-start gap-2 px-4 py-2 mt-2 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{form.closedReasonMessage}</span>
            </div>
          )}
        </div>

        {/* Form Fields (Simulated) */}
        <div className="p-6 space-y-6 bg-card">
          {fields.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground text-sm">
              {lang === 'ar' ? 'لا توجد حقول لعرضها' : 'No fields to display'}
            </div>
          ) : (
            fields.map((field) => {
              const fLabel = lang === 'ar' ? field.labelAr : field.labelEn
              
              return (
                <div key={field.id} className="space-y-2 max-w-2xl">
                  <label className="flex items-center gap-1 text-sm font-semibold text-foreground">
                    {fLabel}
                    {field.isRequired && <span className="text-destructive">*</span>}
                  </label>

                  {field.type === 'Text' && (
                    <input
                      type="text"
                      disabled
                      placeholder={field.placeholder}
                      className="w-full px-4 py-2.5 rounded-lg bg-input/40 border border-border text-sm text-muted-foreground opacity-70 cursor-not-allowed"
                    />
                  )}

                  {field.type === 'Number' && (
                    <input
                      type="number"
                      disabled
                      placeholder={field.placeholder}
                      className="w-full px-4 py-2.5 rounded-lg bg-input/40 border border-border text-sm text-muted-foreground opacity-70 cursor-not-allowed"
                    />
                  )}

                  {field.type === 'Dropdown' && (
                    <select
                      disabled
                      className="w-full px-4 py-2.5 rounded-lg bg-input/40 border border-border text-sm text-muted-foreground opacity-70 cursor-not-allowed"
                    >
                      <option value="">{field.placeholder || (lang === 'ar' ? 'اختر...' : 'Select...')}</option>
                      {(field.options ?? []).map((opt, i) => (
                        <option key={i} value={opt}>{opt}</option>
                      ))}
                    </select>
                  )}

                  {field.type === 'Checkbox' && (
                    <div className="space-y-2 mt-2">
                      {(field.options ?? []).map((opt, i) => (
                        <label key={i} className="flex items-center gap-2 opacity-70 cursor-not-allowed">
                          <input type="checkbox" disabled className="w-4 h-4 rounded border-border" />
                          <span className="text-sm text-muted-foreground">{opt}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-border bg-secondary/20">
          <Button variant="outline" onClick={onClose}>
            {lang === 'ar' ? 'إغلاق المعاينة' : 'Close Preview'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
