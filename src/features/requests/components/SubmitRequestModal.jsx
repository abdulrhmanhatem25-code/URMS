import { useState } from 'react'
import { Send, Loader2, CheckCircle, AlertTriangle, CalendarDays } from 'lucide-react'
import Modal from '@/shared/components/Modal'
import { Button } from '@/components/ui/button'
import { useLanguageStore } from '@/app/store/useLanguageStore'
import { useSubmitRequest } from '../hooks/useRequests'
import { cn } from '@/lib/utils'

const formatDate = (d, lang) => {
  if (!d) return ''
  return new Date(d).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

import { useTranslation } from '@/app/hooks/useTranslation'

export default function SubmitRequestModal({ form, isOpen, onClose }) {
  const { t: tx, lang, dir } = useTranslation('submitRequestModal')

  const { mutate: submit, isPending, isSuccess, isError, error, reset } = useSubmitRequest()

  // Build initial form values: { [field.id]: '' }
  const fields = [...(form?.fields ?? [])].sort((a, b) => a.order - b.order)
  const [values, setValues] = useState(() =>
    Object.fromEntries(fields.map(f => [f.id, '']))
  )
  const [touched, setTouched] = useState({})
  const [errors, setErrors] = useState({})

  if (!form) return null

  const title = lang === 'ar' ? form.titleAr : form.titleEn

  // ── Helpers ─────────────────────────────────────────────────────────────────

  const setValue = (fieldId, val) => {
    setValues(prev => ({ ...prev, [fieldId]: val }))
    // Clear error on change
    if (errors[fieldId]) setErrors(prev => ({ ...prev, [fieldId]: '' }))
  }

  const validate = () => {
    const newErrors = {}
    fields.forEach(f => {
      if (f.isRequired) {
        const val = values[f.id]
        const empty = val === '' || val === null || val === undefined ||
          (Array.isArray(val) && val.length === 0)
        if (empty) newErrors[f.id] = tx.required
      }
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    setTouched(Object.fromEntries(fields.map(f => [f.id, true])))
    if (!validate()) return

    // Build additionalData: { [field.labelEn]: value }
    const additionalData = {}
    fields.forEach(f => {
      const raw = values[f.id]
      // For checkbox arrays → join as comma-separated string
      additionalData[f.labelEn] = Array.isArray(raw) ? raw.join(', ') : String(raw)
    })

    submit(
      { formDefinitionId: form.id, additionalData },
    )
  }

  const handleClose = () => {
    // Reset everything on close
    reset()
    setValues(Object.fromEntries(fields.map(f => [f.id, ''])))
    setTouched({})
    setErrors({})
    onClose()
  }

  // ── Checkbox toggle helper ───────────────────────────────────────────────────
  const toggleCheckbox = (fieldId, opt) => {
    setValues(prev => {
      const current = Array.isArray(prev[fieldId]) ? prev[fieldId] : []
      const next = current.includes(opt)
        ? current.filter(o => o !== opt)
        : [...current, opt]
      return { ...prev, [fieldId]: next }
    })
    if (errors[fieldId]) setErrors(prev => ({ ...prev, [fieldId]: '' }))
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={tx.title}
      dir={dir}
      size="xl"
    >
      <div className="p-0">

        {/* ── Success State ─────────────────────────────────────────────────── */}
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center gap-5 py-16 px-8 text-center">
            <div className="p-5 bg-emerald-500/10 rounded-full border border-emerald-500/20">
              <CheckCircle className="w-10 h-10 text-emerald-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">{tx.success}</h3>
              <p className="text-sm text-muted-foreground mt-1">{tx.successSub}</p>
            </div>
            <Button onClick={handleClose} className="mt-2 px-8">
              {tx.close}
            </Button>
          </div>
        ) : (
          <>
            {/* ── Form Header ─────────────────────────────────────────────── */}
            <div className="bg-primary/5 px-6 py-6 border-b border-border space-y-2">
              <h2 className="text-xl font-bold text-foreground">{title}</h2>

              {form.description && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {form.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CalendarDays className="w-3.5 h-3.5" />
                  {tx.from} {formatDate(form.startDate, lang)}
                </span>
                <span className="flex items-center gap-1">
                  <CalendarDays className="w-3.5 h-3.5" />
                  {tx.to} {formatDate(form.endDate, lang)}
                </span>
              </div>
            </div>

            {/* ── Form Fields ─────────────────────────────────────────────── */}
            <div className="p-6 space-y-6">
              {fields.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground text-sm">
                  {lang === 'ar' ? 'لا توجد حقول لملئها' : 'No fields to fill'}
                </p>
              ) : (
                fields.map((field) => {
                  const label = lang === 'ar' ? field.labelAr : field.labelEn
                  const hasError = touched[field.id] && errors[field.id]
                  const inputBase = cn(
                    'w-full px-4 py-2.5 rounded-lg bg-input border text-sm transition-colors outline-none',
                    'focus:ring-2 focus:ring-primary/30 focus:border-primary',
                    hasError ? 'border-destructive focus:ring-destructive/30' : 'border-border',
                  )

                  return (
                    <div key={field.id} className="space-y-2 max-w-2xl">
                      <label className="flex items-center gap-1 text-sm font-semibold text-foreground">
                        {label}
                        {field.isRequired && <span className="text-destructive">*</span>}
                      </label>

                      {/* ── Text ── */}
                      {field.type === 'Text' && (
                        <input
                          type="text"
                          value={values[field.id]}
                          onChange={e => setValue(field.id, e.target.value)}
                          onBlur={() => setTouched(p => ({ ...p, [field.id]: true }))}
                          placeholder={field.placeholder}
                          className={inputBase}
                        />
                      )}

                      {/* ── Number ── */}
                      {field.type === 'Number' && (
                        <input
                          type="number"
                          value={values[field.id]}
                          onChange={e => setValue(field.id, e.target.value)}
                          onBlur={() => setTouched(p => ({ ...p, [field.id]: true }))}
                          placeholder={field.placeholder}
                          className={inputBase}
                        />
                      )}

                      {/* ── Dropdown ── */}
                      {field.type === 'Dropdown' && (
                        <select
                          value={values[field.id]}
                          onChange={e => setValue(field.id, e.target.value)}
                          onBlur={() => setTouched(p => ({ ...p, [field.id]: true }))}
                          className={cn(inputBase, 'cursor-pointer')}
                        >
                          <option value="">{field.placeholder || tx.select}</option>
                          {(field.options ?? []).map((opt, i) => (
                            <option key={i} value={opt}>{opt}</option>
                          ))}
                        </select>
                      )}

                      {/* ── Checkbox ── */}
                      {field.type === 'Checkbox' && (
                        <div className="space-y-2.5 mt-1">
                          {(field.options ?? []).map((opt, i) => {
                            const checked = Array.isArray(values[field.id])
                              ? values[field.id].includes(opt)
                              : false
                            return (
                              <label
                                key={i}
                                className="flex items-center gap-3 cursor-pointer group"
                              >
                                <div
                                  onClick={() => toggleCheckbox(field.id, opt)}
                                  className={cn(
                                    'w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors',
                                    checked
                                      ? 'bg-primary border-primary'
                                      : 'border-border group-hover:border-primary/50',
                                  )}
                                >
                                  {checked && (
                                    <svg className="w-2.5 h-2.5 text-primary-foreground" fill="none" viewBox="0 0 10 10">
                                      <path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                  )}
                                </div>
                                <span className="text-sm text-foreground">{opt}</span>
                              </label>
                            )
                          })}
                        </div>
                      )}

                      {/* Validation error */}
                      {hasError && (
                        <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                          <AlertTriangle className="w-3 h-3 shrink-0" />
                          {errors[field.id]}
                        </p>
                      )}
                    </div>
                  )
                })
              )}

              {/* API Error */}
              {isError && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{error?.response?.data?.message ?? tx.error}</span>
                </div>
              )}
            </div>

            {/* ── Footer ──────────────────────────────────────────────────── */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-secondary/20">
              <Button variant="outline" onClick={handleClose} disabled={isPending}>
                {tx.cancel}
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isPending}
                className="gap-2 min-w-[140px]"
              >
                {isPending
                  ? <><Loader2 className="w-4 h-4 animate-spin" />{tx.submitting}</>
                  : <><Send className="w-4 h-4" />{tx.submit}</>
                }
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}
