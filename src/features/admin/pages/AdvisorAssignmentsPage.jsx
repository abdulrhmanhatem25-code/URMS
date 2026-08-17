import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAllAdvisorAssignments } from '@/features/advisorAssignments/hooks/useAdvisorAssignments'
import { useLanguageStore } from '@/app/store/useLanguageStore'
import {
  Loader2, AlertCircle, Search, ChevronLeft, ChevronRight,
  GraduationCap, Users, Mail, Hash, ArrowLeft, ArrowRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const PAGE_SIZE = 12

const SEARCH_COLUMNS = [
  { value: '',              labelAr: 'كل الحقول',              labelEn: 'All Fields' },
  { value: 'advisorNameAr', labelAr: 'الاسم بالعربي',          labelEn: 'Name (AR)' },
  { value: 'advisorNameEn', labelAr: 'الاسم بالإنجليزي',       labelEn: 'Name (EN)' },
  { value: 'email',         labelAr: 'البريد الإلكتروني',      labelEn: 'Email' },
  { value: 'advisorCode',   labelAr: 'كود المرشد',              labelEn: 'Advisor Code' },
]

// ─── Pagination ───────────────────────────────────────────────────────────────
function Pagination({ pageNumber, totalPages, onPageChange, dir }) {
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center justify-center gap-2 pt-4" dir={dir}>
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

// ─── Advisor Card ─────────────────────────────────────────────────────────────
function AdvisorCard({ advisor, lang, dir, onClick }) {
  const name = lang === 'ar' ? advisor.advisorNameAr : advisor.advisorNameEn

  return (
    <button
      onClick={onClick}
      className={cn(
        'group w-full text-start bg-card rounded-2xl border border-border p-5',
        'hover:border-primary/40 hover:shadow-xl hover:shadow-primary/8',
        'hover:-translate-y-1 transition-all duration-300 cursor-pointer',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      )}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="p-2.5 bg-primary/10 rounded-xl border border-primary/20 shrink-0 group-hover:bg-primary/20 transition-colors">
          <GraduationCap className="w-5 h-5 text-primary" />
        </div>
        <div className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold border',
          advisor.totalStudents > 0
            ? 'bg-primary/10 text-primary border-primary/20'
            : 'bg-muted text-muted-foreground border-border',
        )}>
          <Users className="w-3.5 h-3.5" />
          {advisor.totalStudents}
        </div>
      </div>

      {/* Name */}
      <h3 className="font-bold text-foreground leading-snug line-clamp-2 mb-3 group-hover:text-primary transition-colors">
        {name}
      </h3>

      {/* Meta */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Hash className="w-3 h-3 shrink-0" />
          <span dir="ltr" className="font-medium">{advisor.advisorCode}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Mail className="w-3 h-3 shrink-0" />
          <span dir="ltr" className="truncate">{advisor.email}</span>
        </div>
      </div>

      {/* Footer arrow */}
      <div className={cn(
        'flex items-center gap-1 mt-4 pt-3 border-t border-border/60',
        'text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors',
        dir === 'rtl' ? 'flex-row' : 'flex-row-reverse',
      )}>
        {dir === 'rtl'
          ? <><span>{lang === 'ar' ? 'عرض التفاصيل' : 'View Details'}</span><ArrowLeft className="w-3.5 h-3.5" /></>
          : <><span>{lang === 'ar' ? 'عرض التفاصيل' : 'View Details'}</span><ArrowRight className="w-3.5 h-3.5" /></>
        }
      </div>
    </button>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdvisorAssignmentsPage() {
  const { lang, dir } = useLanguageStore()
  const navigate = useNavigate()

  const [searchColumn, setSearchColumn] = useState('')
  const [inputValue,   setInputValue]   = useState('')
  const [searchTerm,   setSearchTerm]   = useState('')
  const [pageNumber,   setPageNumber]   = useState(1)

  const params = {
    ...(searchColumn && { searchColumn }),
    ...(searchTerm   && { searchTerm }),
    pageNumber,
    pageSize: PAGE_SIZE,
  }

  const { data: response, isLoading, isError, error, isFetching } = useAllAdvisorAssignments(params)

  const handleSearch = useCallback(() => {
    setSearchTerm(inputValue.trim())
    setPageNumber(1)
  }, [inputValue])

  const handleClear = () => {
    setInputValue('')
    setSearchTerm('')
    setSearchColumn('')
    setPageNumber(1)
  }

  const advisors   = response?.data?.items ?? []
  const totalPages = response?.data?.totalPages ?? 1
  const totalCount = response?.data?.totalCount ?? 0

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-6">
        <div className="bg-destructive/10 text-destructive p-4 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          <p>{lang === 'ar' ? 'حدث خطأ أثناء جلب البيانات' : 'Error fetching data'}</p>
          <p className="text-sm opacity-80">{error?.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6" dir={dir}>

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {lang === 'ar' ? 'توزيع المرشدين الأكاديميين' : 'Advisor Assignments'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {lang === 'ar'
              ? 'اختر مرشداً لعرض بياناته وطلابه'
              : 'Select an advisor to view their details and students'}
          </p>
        </div>
        <div className="px-4 py-2 bg-primary/10 text-primary rounded-xl font-medium text-sm border border-primary/20 shadow-sm flex items-center gap-1.5">
          {isFetching && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          {lang === 'ar' ? 'إجمالي المرشدين: ' : 'Total Advisors: '}
          <span className="font-bold">{totalCount}</span>
        </div>
      </div>

      {/* ── Search bar ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={searchColumn}
          onChange={e => { setSearchColumn(e.target.value); setPageNumber(1) }}
          className="sm:w-52 text-sm rounded-xl border border-border bg-card px-3 py-2.5 outline-none focus:border-primary transition-colors text-foreground"
        >
          {SEARCH_COLUMNS.map(col => (
            <option key={col.value} value={col.value}>
              {lang === 'ar' ? col.labelAr : col.labelEn}
            </option>
          ))}
        </select>

        <div className="flex flex-1 gap-2">
          <div className="relative flex-1">
            <Search className={cn('absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground', dir === 'rtl' ? 'right-3' : 'left-3')} />
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder={lang === 'ar' ? 'ابحث عن مرشد…' : 'Search advisor…'}
              className={cn(
                'w-full text-sm rounded-xl border border-border bg-card py-2.5 outline-none focus:border-primary transition-colors',
                dir === 'rtl' ? 'pr-9 pl-3' : 'pl-9 pr-3',
              )}
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
          >
            {lang === 'ar' ? 'بحث' : 'Search'}
          </button>
          {(searchTerm || inputValue) && (
            <button
              onClick={handleClear}
              className="px-4 py-2.5 rounded-xl text-sm border border-border bg-card text-muted-foreground hover:bg-secondary transition-colors"
            >
              {lang === 'ar' ? 'مسح' : 'Clear'}
            </button>
          )}
        </div>
      </div>

      {/* ── Results info ── */}
      <p className="text-sm text-muted-foreground">
        {lang === 'ar'
          ? `عرض ${advisors.length} من ${totalCount} مرشد`
          : `Showing ${advisors.length} of ${totalCount} advisors`}
      </p>

      {/* ── Empty state ── */}
      {advisors.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 px-4 border border-dashed border-border rounded-2xl bg-secondary/30">
          <div className="w-16 h-16 bg-card rounded-full flex items-center justify-center mb-4 shadow-sm border border-border">
            <GraduationCap className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            {lang === 'ar' ? 'لا يوجد مرشدون لعرضهم' : 'No advisors found'}
          </h3>
        </div>
      )}

      {/* ── Cards Grid ── */}
      {advisors.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {advisors.map(advisor => (
            <AdvisorCard
              key={advisor.advisorId}
              advisor={advisor}
              lang={lang}
              dir={dir}
              onClick={() =>
                navigate(
                  `/dashboard/admin/advisor-assignments/${advisor.advisorId}`,
                  { state: { advisor } }
                )
              }
            />
          ))}
        </div>
      )}

      {/* ── Pagination ── */}
      <Pagination
        pageNumber={response?.data?.pageNumber ?? 1}
        totalPages={totalPages}
        onPageChange={setPageNumber}
        dir={dir}
      />
    </div>
  )
}
