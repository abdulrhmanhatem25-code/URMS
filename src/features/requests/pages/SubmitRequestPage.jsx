import { useState, useMemo, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Send, Loader2, CheckCircle, AlertTriangle,
  CalendarDays, ArrowLeft, ArrowRight,
} from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { useLanguageStore } from '@/app/store/useLanguageStore'
import { useSubmitRequest } from '../hooks/useRequests'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const formatDate = (d, lang) => {
  if (!d) return ''
  return new Date(d).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

import { useTranslation } from '@/app/hooks/useTranslation'

export default function SubmitRequestPage() {
  const { formId } = useParams()
  const navigate = useNavigate()
  const { t: tx, lang, dir } = useTranslation('submitRequestPage')
  const BackIcon = dir === 'rtl' ? ArrowRight : ArrowLeft

  // Read the form from the active-forms cache (populated by StudentRequestsPage)
  const qc = useQueryClient()
  const form = useMemo(() => {
    const list = qc.getQueryData(['student-public-forms'])
    return Array.isArray(list) ? list.find(f => String(f.id) === String(formId)) : undefined
  }, [qc, formId])

  // If cache is cold (direct URL access), go back to the list
  useEffect(() => {
    if (form === undefined) navigate(-1)
  }, [form, navigate])

  const { mutate: submit, isPending, isSuccess, isError: submitError, error } = useSubmitRequest()

  const fields = [...(form?.fields ?? [])].sort((a, b) => a.order - b.order)

  const [values, setValues] = useState({})
  const [touched, setTouched] = useState({})
  const [errors, setErrors] = useState({})

  // Init values once form is available
  const [initialized, setInitialized] = useState(false)
  if (form && !initialized) {
    setValues(Object.fromEntries(fields.map(f => [f.id, ''])))
    setInitialized(true)
  }

  // ── Helpers ─────────────────────────────────────────────────────────────────

  const setValue = (fieldId, val) => {
    setValues(prev => ({ ...prev, [fieldId]: val }))
    if (errors[fieldId]) setErrors(prev => ({ ...prev, [fieldId]: '' }))
  }

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

    const additionalData = {}
    fields.forEach(f => {
      const raw = values[f.id]
      const keyWithoutSpaces = (f.labelEn || '').replace(/\s+/g, '')
      additionalData[keyWithoutSpaces] = Array.isArray(raw) ? raw.join(', ') : String(raw)
    })

    submit({ formDefinitionId: form.id, additionalData })
  }

  // ── Guard — wait for cache to be confirmed ───────────────────────────────────

  if (!form) {
    return (
      <div dir={dir} className="max-w-3xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 w-32 rounded-lg bg-secondary" />
        <div className="h-32 rounded-2xl bg-secondary" />
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-24 rounded bg-secondary" />
              <div className="h-10 rounded-lg bg-secondary" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const title = lang === 'ar' ? form?.titleAr : form?.titleEn

  // ── Success ────────────────────────────────────────────────────────────────────

  if (isSuccess) {
    return (
      <div dir={dir} className="flex flex-col items-center justify-center py-20 gap-5 text-center max-w-md mx-auto">
        <div className="p-6 bg-emerald-500/10 rounded-full border border-emerald-500/20">
          <CheckCircle className="w-12 h-12 text-emerald-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">{tx.success}</h2>
          <p className="text-sm text-muted-foreground mt-2">{tx.successSub}</p>
        </div>
        <Button
          onClick={() => navigate(-1)}
          variant="outline"
          className="mt-2 gap-2"
        >
          <BackIcon className="w-4 h-4" />
          {tx.backToList}
        </Button>
      </div>
    )
  }

  // ── Form ──────────────────────────────────────────────────────────────────────

  return (
    <div dir={dir} className="max-w-3xl mx-auto space-y-6">

      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <BackIcon className="w-4 h-4" />
        {tx.back}
      </button>

      {/* Form card */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">

        {/* Header */}
        <div className="bg-primary/5 px-6 py-8 border-b border-border space-y-3">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>

          {form?.description && (
            <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
              {form.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-5 pt-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5" />
              {tx.from} {formatDate(form?.startDate, lang)}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5" />
              {tx.to} {formatDate(form?.endDate, lang)}
            </span>
          </div>
        </div>

        {/* Fields */}
        <div className="p-6 md:p-8 space-y-7">
          {fields.length === 0 ? (
            <p className="text-center py-10 text-muted-foreground text-sm">{tx.noFields}</p>
          ) : (
            fields.map((field) => {
              const label = lang === 'ar' ? field.labelAr : field.labelEn
              const hasError = touched[field.id] && errors[field.id]
              const inputBase = cn(
                'w-full px-4 py-3 rounded-xl bg-input border text-sm transition-colors outline-none',
                'focus:ring-2 focus:ring-primary/30 focus:border-primary',
                hasError ? 'border-destructive focus:ring-destructive/30' : 'border-border',
              )

              return (
                <div key={field.id} className="space-y-2">
                  <label className="flex items-center gap-1 text-sm font-semibold text-foreground">
                    {label}
                    {field.isRequired && <span className="text-destructive">*</span>}
                  </label>

                  {/* Text */}
                  {field.type === 'Text' && (
                    <input
                      type="text"
                      value={values[field.id] ?? ''}
                      onChange={e => setValue(field.id, e.target.value)}
                      onBlur={() => setTouched(p => ({ ...p, [field.id]: true }))}
                      placeholder={field.placeholder}
                      className={inputBase}
                    />
                  )}

                  {/* Number */}
                  {field.type === 'Number' && (
                    <input
                      type="number"
                      value={values[field.id] ?? ''}
                      onChange={e => setValue(field.id, e.target.value)}
                      onBlur={() => setTouched(p => ({ ...p, [field.id]: true }))}
                      placeholder={field.placeholder}
                      className={inputBase}
                    />
                  )}

                  {/* Dropdown */}
                  {field.type === 'Dropdown' && (
                    <select
                      value={values[field.id] ?? ''}
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

                  {/* Checkbox */}
                  {field.type === 'Checkbox' && (
                    <div className="space-y-3 mt-1">
                      {(field.options ?? []).map((opt, i) => {
                        const checked = Array.isArray(values[field.id])
                          ? values[field.id].includes(opt)
                          : false
                        return (
                          <label key={i} className="flex items-center gap-3 cursor-pointer group">
                            <div
                              onClick={() => toggleCheckbox(field.id, opt)}
                              className={cn(
                                'w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors',
                                checked
                                  ? 'bg-primary border-primary'
                                  : 'border-border group-hover:border-primary/50',
                              )}
                            >
                              {checked && (
                                <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 10 10">
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
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 shrink-0" />
                      {errors[field.id]}
                    </p>
                  )}
                </div>
              )
            })
          )}

          {/* API error */}
          {submitError && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error?.response?.data?.message ?? tx.error}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 md:px-8 py-5 border-t border-border bg-secondary/20">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <BackIcon className="w-4 h-4" />
            {tx.back}
          </button>

          <Button
            onClick={handleSubmit}
            disabled={isPending}
            className="gap-2 min-w-[160px]"
          >
            {isPending
              ? <><Loader2 className="w-4 h-4 animate-spin" />{tx.submitting}</>
              : <><Send className="w-4 h-4" />{tx.submit}</>
            }
          </Button>
        </div>
      </div>
    </div>
  )
}
