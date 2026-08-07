import { useState } from 'react'
import { RefreshCw, AlertTriangle, ClipboardList, Search, SlidersHorizontal } from 'lucide-react'
import { useLanguageStore } from '@/app/store/useLanguageStore'
import { useAllRequests } from '../hooks/useRequests'
import RequestCard from '@/shared/components/RequestCard'
import RequestDetailsModal, { STATUS_CONFIG } from '@/shared/components/RequestDetailsModal'

import { useTranslation } from '@/app/hooks/useTranslation'

function SkeletonCard() {
  return (
    <div className="flex flex-col bg-card rounded-2xl border border-border p-5 gap-4 animate-pulse">
      <div className="flex justify-between">
        <div className="h-5 w-24 rounded-full bg-secondary" />
        <div className="h-5 w-16 rounded bg-secondary" />
      </div>
      <div className="h-4 w-3/4 rounded bg-secondary" />
      <div className="h-4 w-1/2 rounded bg-secondary" />
      <div className="h-px bg-secondary" />
      <div className="flex justify-between">
        <div className="h-4 w-24 rounded bg-secondary" />
        <div className="h-7 w-20 rounded-lg bg-secondary" />
      </div>
    </div>
  )
}

export default function AllRequestsPage() {
  const { t: tx, lang, dir } = useTranslation('allRequests')

  const { data: requests, isLoading, isError, refetch } = useAllRequests()

  const [selectedRequest, setSelectedRequest] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')

  // Filter + Search
  const filtered = (requests ?? []).filter(r => {
    const matchStatus = statusFilter === 'all' || r.status === statusFilter
    const q = search.trim().toLowerCase()
    const matchSearch = !q ||
      (r.studentNameAr ?? '').toLowerCase().includes(q) ||
      (r.studentNameEn ?? '').toLowerCase().includes(q) ||
      (r.universityCode ?? '').toLowerCase().includes(q) ||
      (r.formTitleAr ?? '').toLowerCase().includes(q) ||
      (r.formTitleEn ?? '').toLowerCase().includes(q)
    return matchStatus && matchSearch
  })

  // Status filter pills
  const statusPills = [
    { key: 'all', label: tx.all },
    ...Object.entries(STATUS_CONFIG).map(([key, cfg]) => ({
      key,
      label: cfg[lang],
    })),
  ]

  return (
    <div dir={dir} className="space-y-6">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{tx.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{tx.subtitle}</p>
        </div>
        {!isLoading && !isError && requests?.length > 0 && (
          <span className="text-xs text-muted-foreground bg-secondary border border-border px-3 py-1.5 rounded-lg">
            {tx.count(filtered.length)}
          </span>
        )}
      </div>

      {/* ── Toolbar ─────────────────────────────────────────────────────────── */}
      {!isLoading && !isError && (
        <div className="flex flex-col gap-3">
          {/* Search */}
          <div className="relative max-w-sm">
            <Search className="absolute inset-y-0 start-3 my-auto w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={tx.search}
              className="w-full ps-9 pe-4 py-2 rounded-lg border border-border bg-input text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            />
          </div>

          {/* Status filter */}
          <div className="flex flex-wrap items-center gap-1.5">
            <SlidersHorizontal className="w-4 h-4 text-muted-foreground shrink-0" />
            {statusPills.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setStatusFilter(key)}
                className={[
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border',
                  statusFilter === key
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

      {/* ── Loading ─────────────────────────────────────────────────────────── */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* ── Error ───────────────────────────────────────────────────────────── */}
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

      {/* ── Empty ───────────────────────────────────────────────────────────── */}
      {!isLoading && !isError && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="p-4 bg-secondary rounded-full border border-border">
            <ClipboardList className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-sm">
            {search || statusFilter !== 'all' ? tx.noResults : tx.empty}
          </p>
        </div>
      )}

      {/* ── Grid ────────────────────────────────────────────────────────────── */}
      {!isLoading && !isError && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(r => (
            <RequestCard
              key={r.id}
              request={r}
              onView={setSelectedRequest}
              showStudent={true}
            />
          ))}
        </div>
      )}

      {/* ── Details Modal ────────────────────────────────────────────────────── */}
      <RequestDetailsModal
        request={selectedRequest}
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
      />
    </div>
  )
}
