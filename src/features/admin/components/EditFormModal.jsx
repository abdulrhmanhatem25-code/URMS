import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Loader2, Trash2, AlignLeft, Hash, List, CheckSquare, Plus, X,
} from 'lucide-react'
import Modal from '@/shared/components/Modal'
import { Button } from '@/components/ui/button'
import { useLanguageStore } from '@/app/store/useLanguageStore'
import { useUpdateForm, useDeleteField } from '../hooks/useAdminForms'
import { cn } from '@/lib/utils'

// ─── Constants ────────────────────────────────────────────────────────────────
const FIELD_TYPES = ['Text', 'Number', 'Dropdown', 'Checkbox']

const FIELD_ICONS = {
  Text: AlignLeft, Number: Hash, Dropdown: List, Checkbox: CheckSquare,
}

const FIELD_LABELS = {
  ar: { Text: 'نص', Number: 'رقم', Dropdown: 'قائمة منسدلة', Checkbox: 'اختيار متعدد' },
  en: { Text: 'Text', Number: 'Number', Dropdown: 'Dropdown', Checkbox: 'Checkbox' },
}

const toDateLocal = (d) => d ? new Date(d).toISOString().slice(0, 16) : ''

// ─── Zod schema (basic info only) ────────────────────────────────────────────
const schema = z.object({
  titleAr: z.string().min(1, 'مطلوب'),
  titleEn: z.string().min(1, 'Required'),
  description: z.string().optional().default(''),
  isActive: z.boolean().default(true),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
})

// ─── Component ────────────────────────────────────────────────────────────────
export default function EditFormModal({ form, isOpen, onClose }) {
  const { lang, dir } = useLanguageStore()
  const { mutate: updateForm, isPending } = useUpdateForm()
  const { mutate: deleteField } = useDeleteField()

  const [tab, setTab] = useState('basic')
  // Local fields state — updated optimistically on delete / edit
  const [fields, setFields] = useState(() =>
    [...(form?.fields ?? [])].sort((a, b) => a.order - b.order)
  )
  const [expandedId, setExpandedId] = useState(null)
  const [newOpts, setNewOpts] = useState({}) // { [fieldId]: string }

  const {
    register, handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      titleAr: form?.titleAr ?? '',
      titleEn: form?.titleEn ?? '',
      description: form?.description ?? '',
      isActive: form?.isActive ?? true,
      startDate: toDateLocal(form?.startDate),
      endDate: toDateLocal(form?.endDate),
    },
  })

  // Update a field property in local state
  const patchField = (id, changes) =>
    setFields(prev => prev.map(f => f.id === id ? { ...f, ...changes } : f))

  // Delete a field via API → remove from local state
  const handleDeleteField = (fieldId) => {
    deleteField(fieldId, {
      onSuccess: () => {
        setFields(prev => prev.filter(f => f.id !== fieldId))
        if (expandedId === fieldId) setExpandedId(null)
      },
    })
  }

  // Options helpers
  const addOpt = (fieldId) => {
    const val = (newOpts[fieldId] ?? '').trim()
    if (!val) return
    patchField(fieldId, {
      options: [...(fields.find(f => f.id === fieldId)?.options ?? []), val],
    })
    setNewOpts(p => ({ ...p, [fieldId]: '' }))
  }

  const removeOpt = (fieldId, idx) => {
    const field = fields.find(f => f.id === fieldId)
    patchField(fieldId, { options: field.options.filter((_, i) => i !== idx) })
  }

  const onSubmit = (basic) => {
    updateForm({
      id: form.id,
      ...basic,
      startDate: new Date(basic.startDate).toISOString(),
      endDate: new Date(basic.endDate).toISOString(),
      fields: fields.map((f, idx) => ({
        fieldKey: f.fieldKey,
        labelAr: f.labelAr,
        labelEn: f.labelEn,
        placeholder: f.placeholder ?? '',
        type: f.type,
        isRequired: f.isRequired,
        order: idx + 1,
        options: f.options ?? [],
      })),
    }, { onSuccess: onClose })
  }

  const inputCls = (err) => cn(
    'w-full px-3.5 py-2.5 rounded-lg bg-input/40 border text-sm text-foreground outline-none transition-colors focus:border-primary',
    err ? 'border-destructive' : 'border-border'
  )

  const tabs = [
    { id: 'basic', ar: 'معلومات أساسية', en: 'Basic Info' },
    { id: 'fields', ar: 'الحقول', en: 'Fields' },
  ]

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={lang === 'ar' ? 'تعديل النموذج' : 'Edit Form'}
      dir={dir}
      size="xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        {/* ── Tabs ──────────────────────────────────────────────────────────── */}
        <div className="flex border-b border-border px-6 shrink-0">
          {tabs.map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                'px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors',
                tab === t.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              {t[lang]}
            </button>
          ))}
        </div>

        {/* ── Tab: Basic Info ───────────────────────────────────────────────── */}
        {tab === 'basic' && (
          <div className="p-6 space-y-4">
            {/* Titles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">{lang === 'ar' ? 'العنوان بالعربية' : 'Title (Arabic)'} <span className="text-destructive">*</span></label>
                <input {...register('titleAr')} dir="rtl" className={inputCls(errors.titleAr)} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">{lang === 'ar' ? 'العنوان بالإنجليزية' : 'Title (English)'} <span className="text-destructive">*</span></label>
                <input {...register('titleEn')} dir="ltr" className={inputCls(errors.titleEn)} />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">{lang === 'ar' ? 'الوصف' : 'Description'}</label>
              <textarea
                {...register('description')}
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-lg bg-input/40 border border-border text-sm text-foreground outline-none focus:border-primary transition-colors resize-none"
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">{lang === 'ar' ? 'تاريخ البدء' : 'Start Date'}</label>
                <input {...register('startDate')} type="datetime-local" className={inputCls(errors.startDate)} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">{lang === 'ar' ? 'تاريخ الانتهاء' : 'End Date'}</label>
                <input {...register('endDate')} type="datetime-local" className={inputCls(errors.endDate)} />
              </div>
            </div>

            {/* isActive toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/40 border border-border">
              <div>
                <p className="text-sm font-medium">{lang === 'ar' ? 'حالة النموذج' : 'Form Status'}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {lang === 'ar' ? 'تحديد إذا كان النموذج متاحاً للتقديم' : 'Whether the form is open for submissions'}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" {...register('isActive')} className="sr-only peer" />
                <div className="w-11 h-6 bg-secondary border border-border rounded-full peer peer-checked:bg-primary peer-checked:border-primary transition-all after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full" />
              </label>
            </div>
          </div>
        )}

        {/* ── Tab: Fields ───────────────────────────────────────────────────── */}
        {tab === 'fields' && (
          <div className="p-6 space-y-3 min-h-[300px]">
            {fields.length === 0 && (
              <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">
                {lang === 'ar' ? 'لا توجد حقول في هذا النموذج' : 'No fields in this form'}
              </div>
            )}

            {fields.map((field) => {
              const Icon = FIELD_ICONS[field.type] ?? AlignLeft
              const expanded = expandedId === field.id
              const hasOptions = ['Dropdown', 'Checkbox'].includes(field.type)

              return (
                <div key={field.id} className="border border-border rounded-xl overflow-hidden">
                  {/* Field header (click to expand) */}
                  <div
                    className="flex items-center justify-between px-4 py-3 bg-secondary/30 cursor-pointer select-none"
                    onClick={() => setExpandedId(expanded ? null : field.id)}
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <Icon className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-sm font-medium">
                        {lang === 'ar' ? field.labelAr : field.labelEn}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                        {FIELD_LABELS[lang][field.type]}
                      </span>
                      {field.isRequired && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-destructive/10 text-destructive border border-destructive/20">
                          {lang === 'ar' ? 'مطلوب' : 'Required'}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleDeleteField(field.id) }}
                      className="p-1.5 rounded-lg text-destructive hover:bg-destructive/10 transition-colors shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Expanded edit area */}
                  {expanded && (
                    <div className="p-4 space-y-3 border-t border-border bg-card">
                      {/* Labels */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs text-muted-foreground font-medium">{lang === 'ar' ? 'تسمية (ع)' : 'Label (AR)'}</label>
                          <input
                            dir="rtl"
                            value={field.labelAr}
                            onChange={e => patchField(field.id, { labelAr: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-input/40 border border-border text-sm outline-none focus:border-primary transition-colors"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-muted-foreground font-medium">{lang === 'ar' ? 'تسمية (EN)' : 'Label (EN)'}</label>
                          <input
                            dir="ltr"
                            value={field.labelEn}
                            onChange={e => patchField(field.id, { labelEn: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-input/40 border border-border text-sm outline-none focus:border-primary transition-colors"
                          />
                        </div>
                      </div>

                      {/* Placeholder + Type */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs text-muted-foreground font-medium">Placeholder</label>
                          <input
                            value={field.placeholder ?? ''}
                            onChange={e => patchField(field.id, { placeholder: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-input/40 border border-border text-sm outline-none focus:border-primary transition-colors"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-muted-foreground font-medium">{lang === 'ar' ? 'النوع' : 'Type'}</label>
                          <select
                            value={field.type}
                            onChange={e => patchField(field.id, {
                              type: e.target.value,
                              options: ['Text', 'Number'].includes(e.target.value) ? [] : (field.options ?? []),
                            })}
                            className="w-full px-3 py-2 rounded-lg bg-input/40 border border-border text-sm outline-none focus:border-primary transition-colors"
                          >
                            {FIELD_TYPES.map(t => (
                              <option key={t} value={t}>{FIELD_LABELS[lang][t]}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Required */}
                      <label className="flex items-center gap-2 cursor-pointer w-fit">
                        <input
                          type="checkbox"
                          checked={field.isRequired}
                          onChange={e => patchField(field.id, { isRequired: e.target.checked })}
                          className="w-4 h-4 accent-primary"
                        />
                        <span className="text-sm text-muted-foreground">{lang === 'ar' ? 'حقل مطلوب' : 'Required field'}</span>
                      </label>

                      {/* Options (Dropdown / Checkbox) */}
                      {hasOptions && (
                        <div className="space-y-2">
                          <label className="text-xs text-muted-foreground font-medium">{lang === 'ar' ? 'الخيارات' : 'Options'}</label>
                          <div className="flex flex-wrap gap-2 min-h-[28px]">
                            {(field.options ?? []).map((opt, i) => (
                              <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs text-primary">
                                {opt}
                                <button
                                  type="button"
                                  onClick={() => removeOpt(field.id, i)}
                                  className="hover:text-destructive transition-colors"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <input
                              value={newOpts[field.id] ?? ''}
                              onChange={e => setNewOpts(p => ({ ...p, [field.id]: e.target.value }))}
                              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addOpt(field.id) } }}
                              placeholder={lang === 'ar' ? 'أضف خيار ثم اضغط Enter' : 'Add option, press Enter'}
                              className="flex-1 px-3 py-2 rounded-lg bg-input/40 border border-border text-sm outline-none focus:border-primary transition-colors"
                            />
                            <button
                              type="button"
                              onClick={() => addOpt(field.id)}
                              className="px-3 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* ── Footer ────────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-secondary/20 shrink-0">
          <span className="text-xs text-muted-foreground">
            {lang === 'ar' ? `${fields.length} حقل` : `${fields.length} field(s)`}
          </span>
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              {lang === 'ar' ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button type="submit" disabled={isPending} className="gap-2">
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {lang === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  )
}
