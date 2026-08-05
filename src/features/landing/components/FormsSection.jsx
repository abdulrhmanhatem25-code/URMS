import { FileText, RefreshCw, AlertTriangle } from 'lucide-react'
import { useLanguageStore } from '@/app/store/useLanguageStore'
import { useForms } from '../hooks/useForms'
import FormCard from './FormCard'

const t = {
  ar: {
    title: 'النماذج المتاحة',
    subtitle: 'اضغط على أي نموذج للتقديم — يتطلب تسجيل الدخول',
    empty: 'لا توجد نماذج متاحة حالياً',
    error: 'حدث خطأ أثناء تحميل النماذج',
    retry: 'إعادة المحاولة',
  },
  en: {
    title: 'Available Forms',
    subtitle: 'Click any form to apply — login required',
    empty: 'No forms available at the moment',
    error: 'Failed to load forms',
    retry: 'Try again',
  },
}

// Skeleton card for loading state
function SkeletonCard() {
  return (
    <div className="flex flex-col bg-card rounded-xl border border-border p-5 gap-4 animate-pulse">
      <div className="flex justify-between">
        <div className="h-5 w-20 rounded-full bg-secondary" />
        <div className="h-4 w-16 rounded-full bg-secondary" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-full rounded bg-secondary" />
        <div className="h-4 w-3/4 rounded bg-secondary" />
      </div>
      <div className="h-3 w-full rounded bg-secondary" />
      <div className="h-3 w-2/3 rounded bg-secondary" />
      <div className="h-3 w-1/2 rounded bg-secondary mt-auto" />
    </div>
  )
}

export default function FormsSection() {
  const { lang, dir } = useLanguageStore()
  const tx = t[lang]
  const { data: forms, isLoading, isError, refetch } = useForms()

  return (
    <section dir={dir} className="py-16 md:py-20">
      <div className="container mx-auto px-4 md:px-8 space-y-10">
        {/* Section header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="h-px flex-1 max-w-16 bg-border" />
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {lang === 'ar' ? 'النماذج' : 'Forms'}
            </span>
            <div className="h-px flex-1 max-w-16 bg-border" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">{tx.title}</h2>
          <p className="text-sm text-muted-foreground">{tx.subtitle}</p>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
            <div className="p-4 bg-destructive/10 rounded-full border border-destructive/20">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            <p className="text-muted-foreground">{tx.error}</p>
            <button
              onClick={() => refetch()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 border border-border text-sm transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              {tx.retry}
            </button>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !isError && forms?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <div className="p-4 bg-secondary rounded-full border border-border">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">{tx.empty}</p>
          </div>
        )}

        {/* Forms grid */}
        {!isLoading && !isError && forms?.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {forms.map((form) => (
              <FormCard key={form.id} form={form} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
