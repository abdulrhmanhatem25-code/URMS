import { useState, useCallback } from 'react'
import { useAllAdvisorAssignments } from '@/features/advisorAssignments/hooks/useAdvisorAssignments'
import { useLanguageStore } from '@/app/store/useLanguageStore'
import {
  Loader2, AlertCircle, Search, ChevronLeft, ChevronRight,
  GraduationCap, Users, Mail, Hash, ChevronDown, ChevronUp,
  UserCheck, UserX,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const PAGE_SIZE = 10

const SEARCH_COLUMNS = [
  { value: '',             labelAr: 'كل الحقول',          labelEn: 'All Fields' },
  { value: 'advisorNameAr', labelAr: 'اسم المرشد (عربي)', labelEn: 'Advisor Name (AR)' },
  { value: 'advisorNameEn', labelAr: 'اسم المرشد (إنجليزي)', labelEn: 'Advisor Name (EN)' },
  { value: 'email',        labelAr: 'البريد الإلكتروني',   labelEn: 'Email' },
  { value: 'advisorCode',  labelAr: 'كود المرشد',           labelEn: 'Advisor Code' },
]

// ─── Pagination ───────────────────────────────────────────────────────────────
function Pagination({ pageNumber, totalPages, onPageChange, dir }) {
  if (totalPages <= 1) return null
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  return (
    <div className="flex items-center justify-center gap-2 pt-4" dir={dir}>
      <button
        onClick={() => onPageChange(pageNumber - 1)}
        disabled={pageNumber === 1}
        className="p-2 rounded-lg border border-border bg-card hover:bg-secondary disabled:opacity-40 disabled:pointer-events-none transition-colors"
      >
        {dir === 'rtl' ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
      {pages.map(p => (
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

// ─── Student Row ──────────────────────────────────────────────────────────────
function StudentRow({ student, lang, dir }) {
  const name = lang === 'ar'
    ? (student.studentNameAr || student.universityCode)
    : (student.studentNameEn || student.universityCode)

  return (
    <div className={cn(
      'flex items-center justify-between gap-3 px-3 py-2 rounded-lg',
      'bg-secondary/30 hover:bg-secondary/60 transition-colors text-sm',
    )}>
      <div className="flex items-center gap-2 min-w-0">
        <span className={cn(
          'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold border shrink-0',
          student.isStudentRegistered
            ? 'bg-green-500/10 text-green-600 border-green-500/20'
            : 'bg-orange-500/10 text-orange-600 border-orange-500/20'
        )}>
          {student.isStudentRegistered
            ? (lang === 'ar' ? <UserCheck className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />)
            : (lang === 'ar' ? <UserX className="w-3 h-3" /> : <UserX className="w-3 h-3" />)}
        </span>
        <span className="font-medium text-foreground truncate">{name}</span>
      </div>
      <span className="text-xs text-muted-foreground shrink-0" dir="ltr">
        {student.universityCode}
      </span>
    </div>
  )
}

// ─── Advisor Card ─────────────────────────────────────────────────────────────
function AdvisorCard({ advisor, lang, dir }) {
  const [expanded, setExpanded] = useState(false)

  const name = lang === 'ar' ? advisor.advisorNameAr : advisor.advisorNameEn
  const students = advisor.students?.items ?? []
  const registeredCount = students.filter(s => s.isStudentRegistered).length
  const unregisteredCount = students.length - registeredCount

  return (
    <div className={cn(
      'bg-card rounded-2xl border border-border overflow-hidden',
      'hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300',
    )}>
      {/* ── Card Header ── */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          {/* Advisor info */}
          <div className="flex items-start gap-3 min-w-0">
            <div className="p-2.5 bg-primary/10 rounded-xl border border-primary/20 shrink-0">
              <GraduationCap className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-foreground leading-snug line-clamp-2">{name}</h3>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                <Hash className="w-3 h-3 shrink-0" />
                <span dir="ltr">{advisor.advisorCode}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5 text-xs text-muted-foreground">
                <Mail className="w-3 h-3 shrink-0" />
                <span dir="ltr" className="truncate">{advisor.email}</span>
              </div>
            </div>
          </div>

          {/* Students count badge */}
          <div className="flex flex-col items-center gap-1 shrink-0">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-xl border border-primary/20">
              <Users className="w-3.5 h-3.5" />
              <span className="text-sm font-bold">{advisor.totalStudents}</span>
            </div>
            <span className="text-[10px] text-muted-foreground">
              {lang === 'ar' ? 'طالب' : 'students'}
            </span>
          </div>
        </div>

        {/* Stats row */}
        {students.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className="flex items-center gap-2 px-3 py-2 bg-green-500/8 border border-green-500/20 rounded-lg text-xs">
              <UserCheck className="w-3.5 h-3.5 text-green-600 shrink-0" />
              <span className="text-green-700 dark:text-green-400 font-medium">
                {registeredCount} {lang === 'ar' ? 'مسجل' : 'registered'}
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-orange-500/8 border border-orange-500/20 rounded-lg text-xs">
              <UserX className="w-3.5 h-3.5 text-orange-600 shrink-0" />
              <span className="text-orange-700 dark:text-orange-400 font-medium">
                {unregisteredCount} {lang === 'ar' ? 'غير مسجل' : 'unregistered'}
              </span>
            </div>
          </div>
        )}

        {/* Expand toggle */}
        {students.length > 0 && (
          <button
            onClick={() => setExpanded(p => !p)}
            className={cn(
              'mt-3 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium transition-colors',
              'border border-border hover:bg-secondary text-muted-foreground hover:text-foreground',
            )}
          >
            {expanded
              ? <><ChevronUp className="w-3.5 h-3.5" />{lang === 'ar' ? 'إخفاء الطلاب' : 'Hide students'}</>
              : <><ChevronDown className="w-3.5 h-3.5" />{lang === 'ar' ? 'عرض الطلاب' : 'Show students'}</>
            }
          </button>
        )}

        {advisor.totalStudents === 0 && (
          <p className="mt-3 text-center text-xs text-muted-foreground py-2 border border-dashed border-border rounded-xl">
            {lang === 'ar' ? 'لا يوجد طلاب مسندون' : 'No students assigned'}
          </p>
        )}
      </div>

      {/* ── Students List (collapsible) ── */}
      {expanded && students.length > 0 && (
        <div className="border-t border-border bg-secondary/20 px-4 py-3 space-y-1.5 max-h-72 overflow-y-auto scrollbar-thin">
          {students.map(student => (
            <StudentRow
              key={student.assignmentId}
              student={student}
              lang={lang}
              dir={dir}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdvisorAssignmentsPage() {
  const { lang, dir } = useLanguageStore()

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
              ? 'عرض جميع المرشدين الأكاديميين والطلاب المسندين إليهم'
              : 'View all academic advisors and their assigned students'}
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
      </div>

      {/* ── Results info ── */}
      <p className="text-sm text-muted-foreground">
        {lang === 'ar'
          ? `عرض ${advisors.length} من ${totalCount} مرشد أكاديمي`
          : `Showing ${advisors.length} of ${totalCount} advisors`}
      </p>

      {/* ── Empty state ── */}
      {advisors.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 px-4 border border-dashed border-border rounded-2xl bg-secondary/30">
          <div className="w-16 h-16 bg-card rounded-full flex items-center justify-center mb-4 shadow-sm border border-border">
            <GraduationCap className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            {lang === 'ar' ? 'لا يوجد مرشدون لعرضهم' : 'No advisors to display'}
          </h3>
        </div>
      )}

      {/* ── Advisor Cards grid ── */}
      {advisors.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {advisors.map(advisor => (
            <AdvisorCard
              key={advisor.advisorId}
              advisor={advisor}
              lang={lang}
              dir={dir}
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
