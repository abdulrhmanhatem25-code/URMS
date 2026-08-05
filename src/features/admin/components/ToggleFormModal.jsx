import { useState } from 'react'
import { Loader2, AlertTriangle } from 'lucide-react'
import Modal from '@/shared/components/Modal'
import { Button } from '@/components/ui/button'
import { useLanguageStore } from '@/app/store/useLanguageStore'
import { useToggleForm } from '../hooks/useAdminForms'

const t = {
  ar: {
    activate: { title: 'تفعيل النموذج', btn: 'تفعيل', hint: 'هل تريد تفعيل هذا النموذج والسماح بالتقديم عليه؟' },
    deactivate: { title: 'إغلاق النموذج', btn: 'إغلاق', hint: 'أدخل سبب إغلاق النموذج (اختياري)' },
    cancel: 'إلغاء',
    reasonLabel: 'سبب الإغلاق',
    reasonPlaceholder: 'مثال: اكتمل العدد المسموح',
  },
  en: {
    activate: { title: 'Activate Form', btn: 'Activate', hint: 'Do you want to activate this form and allow submissions?' },
    deactivate: { title: 'Close Form', btn: 'Close', hint: 'Enter a reason for closing the form (optional)' },
    cancel: 'Cancel',
    reasonLabel: 'Closure reason',
    reasonPlaceholder: 'e.g. Maximum submissions reached',
  },
}

export default function ToggleFormModal({ form, isOpen, onClose }) {
  const { lang, dir } = useLanguageStore()
  const tx = t[lang]
  const { mutate: toggle, isPending } = useToggleForm()
  const [reason, setReason] = useState(form?.closedReasonMessage ?? '')

  // If form is currently active → we're closing it; if inactive → activating
  const isActivating = !form?.isActive
  const mode = isActivating ? tx.activate : tx.deactivate

  const handleSubmit = () => {
    toggle(
      { id: form.id, isActive: isActivating, closedReasonMessage: isActivating ? '' : reason },
      { onSuccess: onClose }
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode.title} dir={dir} size="sm">
      <div className="p-6 space-y-5">
        {/* Info text */}
        <div className="flex items-start gap-3 p-4 rounded-lg bg-secondary/50 border border-border">
          <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">
              {lang === 'ar'
                ? (form?.titleAr ?? '')
                : (form?.titleEn ?? '')}
            </p>
            <p className="text-xs text-muted-foreground">{mode.hint}</p>
          </div>
        </div>

        {/* Reason input — only when deactivating */}
        {!isActivating && (
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">{tx.reasonLabel}</label>
            <input
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder={tx.reasonPlaceholder}
              className="w-full px-3.5 py-2.5 rounded-lg bg-input/40 border border-border text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary transition-colors"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-1">
          <Button variant="outline" onClick={onClose} disabled={isPending}>{tx.cancel}</Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending}
            className={isActivating ? '' : 'bg-destructive hover:bg-destructive/90 text-destructive-foreground'}
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : mode.btn}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
