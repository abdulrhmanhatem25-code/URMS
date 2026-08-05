import { Loader2, Trash2 } from 'lucide-react'
import Modal from '@/shared/components/Modal'
import { Button } from '@/components/ui/button'
import { useLanguageStore } from '@/app/store/useLanguageStore'
import { useDeleteForm } from '../hooks/useAdminForms'

export default function DeleteFormModal({ form, isOpen, onClose }) {
  const { lang, dir } = useLanguageStore()
  const { mutate: deleteForm, isPending } = useDeleteForm()

  const title = lang === 'ar' ? form?.titleAr : form?.titleEn

  const handleDelete = () => {
    deleteForm(form.id, { onSuccess: onClose })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={lang === 'ar' ? 'حذف النموذج' : 'Delete Form'}
      dir={dir}
      size="sm"
    >
      <div className="p-6 space-y-5">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {lang === 'ar'
              ? 'هل أنت متأكد من حذف هذا النموذج؟ لا يمكن التراجع عن هذا الإجراء.'
              : 'Are you sure you want to delete this form? This action cannot be undone.'}
          </p>
          <div className="px-4 py-3 rounded-lg bg-destructive/5 border border-destructive/20">
            <p className="text-sm font-medium text-foreground">{title}</p>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            {lang === 'ar' ? 'إلغاء' : 'Cancel'}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
            className="gap-2"
          >
            {isPending
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <Trash2 className="w-4 h-4" />
            }
            {lang === 'ar' ? 'حذف نهائياً' : 'Delete'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
