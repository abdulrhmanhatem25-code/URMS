import { useState } from 'react'
import { RefreshCw, AlertTriangle, FileText, Plus } from 'lucide-react'
import { useLanguageStore } from '@/app/store/useLanguageStore'
import { useAdminForms } from '../hooks/useAdminForms'
import AdminFormCard from '../components/AdminFormCard'
import ToggleFormModal from '../components/ToggleFormModal'
import EditFormModal from '../components/EditFormModal'
import CreateFormModal from '../components/CreateFormModal'
import PreviewFormModal from '../components/PreviewFormModal'
import DeleteFormModal from '../components/DeleteFormModal'
import { Button } from '@/components/ui/button'

const t = {
  ar: {
    title: 'إدارة النماذج',
    subtitle: 'عرض وتعديل وإدارة جميع نماذج الطلبات',
    newForm: 'نموذج جديد',
    empty: 'لا توجد نماذج بعد',
    error: 'فشل في تحميل النماذج',
    retry: 'إعادة المحاولة',
  },
  en: {
    title: 'Forms Management',
    subtitle: 'View, edit and manage all request forms',
    newForm: 'New Form',
    empty: 'No forms yet',
    error: 'Failed to load forms',
    retry: 'Try again',
  },
}

function SkeletonCard() {
  return (
    <div className="flex flex-col bg-card rounded-xl border border-border p-5 gap-3 animate-pulse">
      <div className="flex justify-between">
        <div className="h-5 w-16 rounded-full bg-secondary" />
        <div className="h-5 w-5 rounded bg-secondary" />
      </div>
      <div className="h-4 w-full rounded bg-secondary" />
      <div className="h-4 w-2/3 rounded bg-secondary" />
      <div className="h-3 w-full rounded bg-secondary mt-auto" />
    </div>
  )
}

export default function AdminFormsPage() {
  const { lang, dir } = useLanguageStore()
  const tx = t[lang]

  const { data: forms, isLoading, isError, refetch } = useAdminForms()

  // Modal states
  const [createOpen, setCreateOpen] = useState(false)
  const [previewTarget, setPreviewTarget] = useState(null)
  const [toggleTarget, setToggleTarget] = useState(null)
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  return (
    <div dir={dir} className="space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{tx.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{tx.subtitle}</p>
        </div>
        {/* Create button */}
        <Button className="gap-2 shrink-0" onClick={() => setCreateOpen(true)}>
          <Plus className="w-4 h-4" />
          {tx.newForm}
        </Button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="p-4 bg-destructive/10 rounded-full border border-destructive/20">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <p className="text-muted-foreground text-sm">{tx.error}</p>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 border border-border text-sm transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            {tx.retry}
          </button>
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isError && forms?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="p-4 bg-secondary rounded-full border border-border">
            <FileText className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-sm">{tx.empty}</p>
        </div>
      )}

      {/* Forms grid */}
      {!isLoading && !isError && forms?.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {forms.map(form => (
            <AdminFormCard
              key={form.id}
              form={form}
              onToggle={setToggleTarget}
              onPreview={setPreviewTarget}
              onEdit={setEditTarget}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <CreateFormModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
      />

      <PreviewFormModal
        form={previewTarget}
        isOpen={!!previewTarget}
        onClose={() => setPreviewTarget(null)}
      />

      {toggleTarget && (
        <ToggleFormModal
          form={toggleTarget}
          isOpen={!!toggleTarget}
          onClose={() => setToggleTarget(null)}
        />
      )}

      {editTarget && (
        <EditFormModal
          form={editTarget}
          isOpen={!!editTarget}
          onClose={() => setEditTarget(null)}
        />
      )}

      {deleteTarget && (
        <DeleteFormModal
          form={deleteTarget}
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}
