import { useState, useCallback } from 'react'
import { useMyStudents } from '../hooks/useAdvisorAssignments'
import { useLanguageStore } from '@/app/store/useLanguageStore'
import {
  Loader2,
  AlertCircle,
  Users,
  Search,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  GraduationCap,
  Hash,
  Mail,
  Phone,
  IdCard,
  Calendar,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Constants ──────────────────────────────────────────────────────────────────
const PAGE_SIZE = 10

const SEARCH_COLUMNS = [
  { value: '', labelAr: 'كل الحقول', labelEn: 'All Fields' },
  { value: 'isRegistered', labelAr: 'حالة التسجيل', labelEn: 'Registration Status' },
  { value: 'universityCode', labelAr: 'كود الجامعة', labelEn: 'University Code' },
  { value: 'fullNameAr', labelAr: 'الاسم بالعربي', labelEn: 'Name (AR)' },
  { value: 'fullNameEn', labelAr: 'الاسم بالإنجليزي', labelEn: 'Name (EN)' },
  { value: 'nationalId', labelAr: 'الرقم القومي', labelEn: 'National ID' },
  { value: 'email', labelAr: 'البريد الإلكتروني', labelEn: 'Email' },
]

// ── Helper ─────────────────────────────────────────────────────────────────────
const fmt = (d, lang) => {
  if (!d) return '—'
  return new Date(d).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

// ── Student Card ───────────────────────────────────────────────────────────────
function StudentCard({ student, lang, dir }) {
  const name = lang === 'ar' ? student.fullNameAr : student.fullNameEn

  return (
    <div
      dir={dir}
      className={cn(
        'group flex flex-col bg-card rounded-2xl border p-5 gap-4',
        'hover:shadow-lg hover:shadow-primary/5 transition-all duration-300',
        student.isRegistered
          ? 'border-border hover:border-green-500/30'
          : 'border-border hover:border-amber-500/30',
      )}
    >
      {/* ── Top row ── */}
      <div className="flex items-center justify-between gap-2">
        <span
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border',
            student.isRegistered
              ? 'bg-green-500/10 text-green-600 border-green-500/20'
              : 'bg-amber-500/10 text-amber-600 border-amber-500/20',
          )}
        >
          {student.isRegistered ? (
            <CheckCircle2 className="w-3.5 h-3.5" />
          ) : (
            <XCircle className="w-3.5 h-3.5" />
          )}
          {student.isRegistered
            ? lang === 'ar' ? 'مسجل' : 'Registered'
            : lang === 'ar' ? 'غير مسجل' : 'Not Registered'}
        </span>

        <span className="text-xs text-muted-foreground font-medium bg-secondary px-2 py-1 rounded-md">
          {fmt(student.assignedAt, lang)}
        </span>
      </div>

      {/* ── Name & email ── */}
      <div>
        <h3 className="text-lg font-bold text-foreground leading-snug line-clamp-2">
          {name || '—'}
        </h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-1 flex items-center gap-1">
          <Mail className="w-3.5 h-3.5 shrink-0" />
          {student.email || '—'}
        </p>
      </div>

      {/* ── Details grid ── */}
      <div className="grid grid-cols-2 gap-3 text-sm bg-secondary/40 p-3.5 rounded-xl border border-border/50">
        <div>
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
            <Hash className="w-3 h-3" />
            {lang === 'ar' ? 'كود الجامعة' : 'Uni Code'}
          </p>
          <p className="font-semibold text-foreground">{student.universityCode || '—'}</p>
        </div>

        <div>
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
            <IdCard className="w-3 h-3" />
            {lang === 'ar' ? 'الرقم القومي' : 'National ID'}
          </p>
          <p className="font-semibold text-foreground text-xs">{student.nationalId || '—'}</p>
        </div>

        <div>
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
            <Phone className="w-3 h-3" />
            {lang === 'ar' ? 'الهاتف' : 'Phone'}
          </p>
          <p className="font-semibold text-foreground" dir="ltr" style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>
            {student.phoneNumber || '—'}
          </p>
        </div>

        <div>
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {lang === 'ar' ? 'تاريخ التعيين' : 'Assigned At'}
          </p>
          <p className="font-semibold text-foreground text-xs">{fmt(student.assignedAt, lang)}</p>
        </div>
      </div>
    </div>
  )
}

// ── Pagination ─────────────────────────────────────────────────────────────────
function Pagination({ pageNumber, totalPages, onPageChange, lang, dir }) {
  if (totalPages <= 1) return null

  const pages = []
  for (let i = 1; i <= totalPages; i++) pages.push(i)

  return (
    <div className="flex items-center justify-center gap-2 pt-4" dir={dir}>
      <button
        onClick={() => onPageChange(pageNumber - 1)}
        disabled={pageNumber === 1}
        className="p-2 rounded-lg border border-border bg-card hover:bg-secondary disabled:opacity-40 disabled:pointer-events-none transition-colors"
        aria-label={lang === 'ar' ? 'الصفحة السابقة' : 'Previous page'}
      >
        {dir === 'rtl' ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      <div className="flex items-center gap-1">
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={cn(
              'w-9 h-9 rounded-lg text-sm font-medium transition-colors',
              p === pageNumber
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'border border-border bg-card hover:bg-secondary text-muted-foreground hover:text-foreground',
            )}
          >
            {p}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(pageNumber + 1)}
        disabled={pageNumber === totalPages}
        className="p-2 rounded-lg border border-border bg-card hover:bg-secondary disabled:opacity-40 disabled:pointer-events-none transition-colors"
        aria-label={lang === 'ar' ? 'الصفحة التالية' : 'Next page'}
      >
        {dir === 'rtl' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function MyStudentsPage() {
  const { lang, dir } = useLanguageStore()

  const [searchColumn, setSearchColumn] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [inputValue, setInputValue] = useState('')   // local input, committed on Enter / button
  const [pageNumber, setPageNumber] = useState(1)

  // Build query params — only include non-empty values
  const queryParams = {
    ...(searchColumn && { searchColumn }),
    ...(searchTerm  && { searchTerm }),
    pageNumber,
    pageSize: PAGE_SIZE,
  }

  const { data: response, isLoading, isError, error, isFetching } = useMyStudents(queryParams)

  const advisorData = response?.data
  const students = advisorData?.students

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSearch = useCallback(() => {
    setSearchTerm(inputValue.trim())
    setPageNumber(1)
  }, [inputValue])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch()
  }

  const handleColumnChange = (col) => {
    setSearchColumn(col)
    // Reset search term when switching column, unless it's a boolean column
    if (col === 'isRegistered') {
      setInputValue('')
      setSearchTerm('')
    }
    setPageNumber(1)
  }

  const handleRegisteredFilter = (value) => {
    setSearchTerm(value)
    setInputValue(value)
    setPageNumber(1)
  }

  const handleClear = () => {
    setSearchColumn('')
    setSearchTerm('')
    setInputValue('')
    setPageNumber(1)
  }

  // ── Loading / Error ────────────────────────────────────────────────────────
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
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div>
            <p className="font-medium">{lang === 'ar' ? 'حدث خطأ أثناء جلب البيانات' : 'Error fetching data'}</p>
            <p className="text-sm opacity-80 mt-0.5">{error?.message}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6" dir={dir}>

      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-primary" />
            {lang === 'ar' ? 'طلابي' : 'My Students'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {lang === 'ar'
              ? `${advisorData?.advisorNameAr ?? ''} · كود: ${advisorData?.advisorCode ?? ''}`
              : `${advisorData?.advisorNameEn ?? ''} · Code: ${advisorData?.advisorCode ?? ''}`}
          </p>
        </div>

        {/* ── Stats badges ── */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="px-4 py-2 bg-primary/10 text-primary rounded-xl font-medium text-sm border border-primary/20 shadow-sm">
            {lang === 'ar' ? 'الإجمالي: ' : 'Total: '}
            <span className="font-bold">{advisorData?.totalStudents ?? 0}</span>
          </div>
          <div className="px-4 py-2 bg-green-500/10 text-green-600 rounded-xl font-medium text-sm border border-green-500/20 shadow-sm">
            {lang === 'ar' ? 'مسجل: ' : 'Registered: '}
            <span className="font-bold">{advisorData?.registeredStudentsCount ?? 0}</span>
          </div>
          <div className="px-4 py-2 bg-amber-500/10 text-amber-600 rounded-xl font-medium text-sm border border-amber-500/20 shadow-sm">
            {lang === 'ar' ? 'غير مسجل: ' : 'Unregistered: '}
            <span className="font-bold">{advisorData?.unregisteredStudentsCount ?? 0}</span>
          </div>
        </div>
      </div>

      {/* ── Search & Filter bar ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Column selector */}
        <select
          value={searchColumn}
          onChange={(e) => handleColumnChange(e.target.value)}
          className="sm:w-52 text-sm rounded-xl border border-border bg-card px-3 py-2.5 outline-none focus:border-primary transition-colors text-foreground"
        >
          {SEARCH_COLUMNS.map((col) => (
            <option key={col.value} value={col.value}>
              {lang === 'ar' ? col.labelAr : col.labelEn}
            </option>
          ))}
        </select>

        {/* isRegistered boolean quick filter */}
        {searchColumn === 'isRegistered' ? (
          <div className="flex gap-2 flex-1">
            <button
              onClick={() => handleRegisteredFilter('true')}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200',
                searchTerm === 'true'
                  ? 'bg-green-500 text-white border-green-500 shadow-sm'
                  : 'bg-card border-border text-muted-foreground hover:bg-secondary',
              )}
            >
              <CheckCircle2 className="w-4 h-4" />
              {lang === 'ar' ? 'مسجل' : 'Registered'}
            </button>
            <button
              onClick={() => handleRegisteredFilter('false')}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200',
                searchTerm === 'false'
                  ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                  : 'bg-card border-border text-muted-foreground hover:bg-secondary',
              )}
            >
              <XCircle className="w-4 h-4" />
              {lang === 'ar' ? 'غير مسجل' : 'Not Registered'}
            </button>
            {searchTerm && (
              <button
                onClick={handleClear}
                className="px-4 py-2.5 rounded-xl text-sm border border-border bg-card text-muted-foreground hover:bg-secondary transition-colors"
              >
                {lang === 'ar' ? 'الكل' : 'All'}
              </button>
            )}
          </div>
        ) : (
          /* Text search */
          <div className="flex flex-1 gap-2">
            <div className="relative flex-1">
              <Search className={cn('absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground', dir === 'rtl' ? 'right-3' : 'left-3')} />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={lang === 'ar' ? 'ابحث…' : 'Search…'}
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
        )}
      </div>

      {/* ── Results info + fetching indicator ── */}
      {students && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {lang === 'ar'
              ? `عرض ${students.items?.length ?? 0} من ${students.totalCount ?? 0} طالب`
              : `Showing ${students.items?.length ?? 0} of ${students.totalCount ?? 0} students`}
          </span>
          {isFetching && !isLoading && (
            <span className="flex items-center gap-1.5 text-primary text-xs">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              {lang === 'ar' ? 'جارٍ التحديث…' : 'Updating…'}
            </span>
          )}
        </div>
      )}

      {/* ── Empty state ── */}
      {students?.items?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 px-4 border border-dashed border-border rounded-2xl bg-secondary/30">
          <div className="w-16 h-16 bg-card rounded-full flex items-center justify-center mb-4 shadow-sm border border-border">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            {lang === 'ar' ? 'لا يوجد طلاب' : 'No students found'}
          </h3>
          <p className="text-sm text-muted-foreground text-center">
            {lang === 'ar' ? 'لم يتم العثور على طلاب مطابقين للبحث.' : 'No students match your search criteria.'}
          </p>
        </div>
      )}

      {/* ── Cards grid ── */}
      {students?.items?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.items.map((student) => (
            <StudentCard
              key={student.assignmentId}
              student={student}
              lang={lang}
              dir={dir}
            />
          ))}
        </div>
      )}

      {/* ── Pagination ── */}
      <Pagination
        pageNumber={students?.pageNumber ?? 1}
        totalPages={students?.totalPages ?? 1}
        onPageChange={(p) => setPageNumber(p)}
        lang={lang}
        dir={dir}
      />
    </div>
  )
}
