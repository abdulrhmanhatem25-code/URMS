import { useState, useCallback } from 'react'
import { RefreshCw, AlertTriangle, ClipboardList, Search, SlidersHorizontal, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { useMyRequests } from '@/features/requests/hooks/useRequests'
import RequestCard from '@/shared/components/RequestCard'
import RequestDetailsModal, { STATUS_CONFIG } from '@/shared/components/RequestDetailsModal'
import { useTranslation } from '@/app/hooks/useTranslation'
import { cn } from '@/lib/utils'

const PAGE_SIZE = 10

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

function Pagination({ pageNumber, totalPages, onPageChange, dir }) {
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center justify-center gap-2 pt-2" dir={dir}>
      <button
        onClick={() => onPageChange(pageNumber - 1)}
        disabled={pageNumber === 1}
        className="p-2 rounded-lg border border-border bg-card hover:bg-secondary disabled:opacity-40 disabled:pointer-events-none transition-colors"
      >
        {dir === 'rtl' ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={cn(
            'w-9 h-9 rounded-lg text-sm font-medium transition-colors',
            p === pageNumber
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'border border-border bg-card hover:bg-secondary text-muted-foreground',
          )}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onPageChange(pageNumber + 1)}
        disabled={pageNumber === totalPages}
        className="p-2 rounded-lg border border-border bg-card hover:bg-secondary disabled:opacity-40 disabled:pointer-events-none transition-colors"
      >
        {dir === 'rtl' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>
    </div>
  )
}

export default function MyRequestsPage() {
  const { t: tx, lang, dir } = useTranslation('myRequests')

  const [statusFilter, setStatusFilter] = useState('')
  const [inputValue, setInputValue]     = useState('')
  const [searchTerm, setSearchTerm]     = useState('')
  const [pageNumber, setPageNumber]     = useState(1)

  const params = {
    ...(statusFilter && { status: statusFilter }),
    ...(searchTerm   && { searchColumn: 'formTitleAr,formTitleEn', searchTerm }),
    pageNumber,
    pageSize: PAGE_SIZE,
  }

  const { data: paged, isLoading, isError, isFetching, refetch } = useMyRequests(params)

  const [selectedRequest, setSelectedRequest] = useState(null)

  const handleSearch = useCallback(() => {
    setSearchTerm(inputValue.trim())
    setPageNumber(1)
  }, [inputValue])

  const handleStatusChange = (key) => {
    setStatusFilter(key === 'all' ? '' : key)
    setPageNumber(1)
  }

  const statusPills = [
    { key: 'all', label: tx.all },
    ...Object.entries(STATUS_CONFIG).map(([key, cfg]) => ({ key, label: cfg[lang] })),
  ]

  const requests  = paged?.items ?? []
  const totalPages = paged?.totalPages ?? 1
  const totalCount = paged?.totalCount ?? 0

  return (
    <div dir={dir} className="space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{tx.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{tx.subtitle}</p>
        </div>
        {!isLoading && !isError && (
          <span className="text-xs text-muted-foreground bg-secondary border border-border px-3 py-1.5 rounded-lg flex items-center gap-1.5">
            {isFetching && <Loader2 className="w-3 h-3 animate-spin" />}
            {tx.count(totalCount)}
          </span>
        )}
      </div>

      {/* ── Toolbar ── */}
      {!isLoading && !isError && (
        <div className="flex flex-col gap-3">
          <div className="flex gap-2 max-w-sm">
            <div className="relative flex-1">
              <Search className="absolute inset-y-0 start-3 my-auto w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder={tx.search}
                className="w-full ps-9 pe-4 py-2 rounded-lg border border-border bg-input text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              {lang === 'ar' ? 'بحث' : 'Search'}
            </button>
            {(searchTerm || inputValue) && (
              <button
                onClick={() => { setInputValue(''); setSearchTerm(''); setPageNumber(1) }}
                className="px-3 py-2 rounded-lg border border-border bg-card text-sm text-muted-foreground hover:bg-secondary transition-colors"
              >
                {lang === 'ar' ? 'مسح' : 'Clear'}
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <SlidersHorizontal className="w-4 h-4 text-muted-foreground shrink-0" />
            {statusPills.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => handleStatusChange(key)}
                className={[
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border',
                  (key === 'all' ? !statusFilter : statusFilter === key)
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

      {/* ── Loading ── */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* ── Error ── */}
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

      {/* ── Empty ── */}
      {!isLoading && !isError && requests.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="p-4 bg-secondary rounded-full border border-border">
            <ClipboardList className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-sm">
            {searchTerm || statusFilter ? tx.noResults : tx.empty}
          </p>
        </div>
      )}

      {/* ── Grid ── */}
      {!isLoading && !isError && requests.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {requests.map(r => (
            <RequestCard key={r.id} request={r} onView={setSelectedRequest} showStudent={false} />
          ))}
        </div>
      )}

      {/* ── Pagination ── */}
      {!isLoading && !isError && (
        <Pagination
          pageNumber={paged?.pageNumber ?? 1}
          totalPages={totalPages}
          onPageChange={setPageNumber}
          dir={dir}
        />
      )}

      {/* ── Details Modal ── */}
      <RequestDetailsModal
        request={selectedRequest}
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
      />
    </div>
  )
}
