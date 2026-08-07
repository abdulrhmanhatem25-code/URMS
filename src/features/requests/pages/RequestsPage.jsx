import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RefreshCw, AlertTriangle, FileText, Search, SlidersHorizontal } from 'lucide-react'
import { useLanguageStore } from '@/app/store/useLanguageStore'
import { usePublicForms } from '../hooks/useRequests'
import StudentFormCard from '../components/StudentFormCard'

import { useTranslation } from '@/app/hooks/useTranslation'

function SkeletonCard() {
  return (
    <div className="flex flex-col bg-card rounded-2xl border border-border p-6 gap-4 animate-pulse">
      <div className="flex justify-between">
        <div className="h-5 w-24 rounded-full bg-secondary" />
        <div className="h-5 w-12 rounded-full bg-secondary" />
      </div>
      <div className="h-5 w-3/4 rounded bg-secondary" />
      <div className="h-4 w-full rounded bg-secondary" />
      <div className="h-4 w-2/3 rounded bg-secondary" />
      <div className="h-px w-full bg-secondary mt-2" />
      <div className="flex justify-between">
        <div className="h-4 w-28 rounded bg-secondary" />
        <div className="h-7 w-24 rounded-lg bg-secondary" />
      </div>
    </div>
  )
}

export default function RequestsPage({ basePath }) {
  const { t: tx, lang, dir } = useTranslation('studentRequests')
  const navigate = useNavigate()

  const { data: forms, isLoading, isError, refetch } = usePublicForms()

  const [filter, setFilter] = useState('all')     // 'all' | 'active' | 'closed'
  const [search, setSearch] = useState('')

  const handleApply = (form) => {
    navigate(`${basePath}/${form.id}`)
  }

  // Apply filters
  const filtered = (forms ?? []).filter(f => {
    const matchFilter =
      filter === 'all' ||
      (filter === 'active' && f.isActive) ||
      (filter === 'closed' && !f.isActive)

    const query = search.trim().toLowerCase()
    const matchSearch = !query ||
      (f.titleAr ?? '').toLowerCase().includes(query) ||
      (f.titleEn ?? '').toLowerCase().includes(query) ||
      (f.description ?? '').toLowerCase().includes(query)

    return matchFilter && matchSearch
  })

  const filterBtns = [
    { key: 'all',    label: tx.all },
    { key: 'active', label: tx.active },
    { key: 'closed', label: tx.closed },
  ]

  return (
    <div dir={dir} className="space-y-6">

      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{tx.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{tx.subtitle}</p>
        </div>
      </div>

      {/* ── Toolbar: search + filter ─────────────────────────────────────────── */}
      {!isLoading && !isError && (
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute inset-y-0 start-3 my-auto w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={tx.search}
              className="w-full ps-9 pe-4 py-2 rounded-lg border border-border bg-input text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            />
          </div>

          {/* Filter pills */}
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-4 h-4 text-muted-foreground shrink-0" />
            {filterBtns.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={[
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border',
                  filter === key
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card text-muted-foreground border-border hover:bg-secondary',
                ].join(' ')}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Loading ──────────────────────────────────────────────────────────── */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* ── Error ────────────────────────────────────────────────────────────── */}
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

      {/* ── Empty ────────────────────────────────────────────────────────────── */}
      {!isLoading && !isError && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="p-4 bg-secondary rounded-full border border-border">
            <FileText className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-sm">
            {search || filter !== 'all' ? tx.noResults : tx.empty}
          </p>
        </div>
      )}

      {/* ── Forms Grid ───────────────────────────────────────────────────────── */}
      {!isLoading && !isError && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(form => (
            <StudentFormCard
              key={form.id}
              form={form}
              onApply={handleApply}
            />
          ))}
        </div>
      )}

    </div>
  )
}
