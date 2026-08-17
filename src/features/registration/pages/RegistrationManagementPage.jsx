import { useState, useCallback } from 'react'
import { usePendingStudents, useApproveStudent } from '../hooks/useRegistration'
import { useLanguageStore } from '@/app/store/useLanguageStore'
import { Loader2, CheckCircle, Edit2, AlertCircle, Clock, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import EditStudentModal from '../components/EditStudentModal'
import { cn } from '@/lib/utils'

const PAGE_SIZE = 10

const SEARCH_COLUMNS = [
  { value: '',               labelAr: 'كل الحقول',         labelEn: 'All Fields' },
  { value: 'fullNameAr',    labelAr: 'الاسم بالعربي',      labelEn: 'Name (AR)' },
  { value: 'fullNameEn',    labelAr: 'الاسم بالإنجليزي',   labelEn: 'Name (EN)' },
  { value: 'email',         labelAr: 'البريد الإلكتروني',  labelEn: 'Email' },
  { value: 'universityCode', labelAr: 'كود الجامعة',       labelEn: 'University Code' },
  { value: 'nationalId',    labelAr: 'الرقم القومي',       labelEn: 'National ID' },
  { value: 'phoneNumber',   labelAr: 'رقم الهاتف',         labelEn: 'Phone' },
]

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

export default function RegistrationManagementPage() {
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

  const { data: paged, isLoading, isError, error, isFetching } = usePendingStudents(params)
  const { mutate: approveStudent, isPending: isApproving } = useApproveStudent()

  const [selectedStudent, setSelectedStudent] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [approvingId, setApprovingId] = useState(null)

  const handleApprove = (studentId) => {
    setApprovingId(studentId)
    approveStudent(studentId, { onSettled: () => setApprovingId(null) })
  }

  const handleEdit = (student) => {
    setSelectedStudent(student)
    setIsEditModalOpen(true)
  }

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

  const students   = paged?.items ?? []
  const totalPages = paged?.totalPages ?? 1
  const totalCount = paged?.totalCount ?? 0

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
            {lang === 'ar' ? 'إدارة التسجيل' : 'Registration Management'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {lang === 'ar' ? 'مراجعة وتفعيل حسابات الطلاب الجديدة' : 'Review and activate new student accounts'}
          </p>
        </div>
        <div className="px-4 py-2 bg-primary/10 text-primary rounded-xl font-medium text-sm border border-primary/20 shadow-sm flex items-center gap-1.5">
          {isFetching && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          {lang === 'ar' ? 'إجمالي الطلبات: ' : 'Total Requests: '}
          <span className="font-bold">{totalCount}</span>
        </div>
      </div>

      {/* ── Search bar ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={searchColumn}
          onChange={e => { setSearchColumn(e.target.value); setPageNumber(1) }}
          className="sm:w-48 text-sm rounded-xl border border-border bg-card px-3 py-2.5 outline-none focus:border-primary transition-colors text-foreground"
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
          ? `عرض ${students.length} من ${totalCount} طالب`
          : `Showing ${students.length} of ${totalCount} students`}
      </p>

      {/* ── Empty ── */}
      {students.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 px-4 border border-dashed border-border rounded-2xl bg-secondary/30">
          <div className="w-16 h-16 bg-card rounded-full flex items-center justify-center mb-4 shadow-sm border border-border">
            <CheckCircle className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            {lang === 'ar' ? 'لا توجد طلبات معلقة' : 'No pending requests'}
          </h3>
          <p className="text-sm text-muted-foreground text-center">
            {lang === 'ar' ? 'جميع حسابات الطلاب مفعلة حالياً.' : 'All student accounts are currently active.'}
          </p>
        </div>
      )}

      {/* ── Cards grid ── */}
      {students.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <div
              key={student.id}
              dir={dir}
              className="group flex flex-col bg-card rounded-2xl border border-border p-5 gap-4 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
            >
              {/* Top row */}
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-500/10 text-yellow-600 border border-yellow-500/20">
                  <Clock className="w-3.5 h-3.5" />
                  {lang === 'ar' ? 'قيد الانتظار' : 'Pending'}
                </span>
                <span className="text-xs text-muted-foreground font-medium bg-secondary px-2 py-1 rounded-md">
                  {new Date(student.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}
                </span>
              </div>

              {/* Student Info */}
              <div>
                <h3 className="text-lg font-bold text-foreground leading-snug line-clamp-2">
                  {lang === 'ar' ? student.fullNameAr : student.fullNameEn}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{student.email}</p>
              </div>

              {/* Details Box */}
              <div className="grid grid-cols-2 gap-3 text-sm bg-secondary/40 p-3.5 rounded-xl border border-border/50">
                <div>
                  <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
                    {lang === 'ar' ? 'كود الجامعة' : 'Uni Code'}
                  </p>
                  <p className="font-semibold text-foreground">{student.universityCode || '—'}</p>
                </div>
                <div>
                  <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
                    {lang === 'ar' ? 'الرقم القومي' : 'National ID'}
                  </p>
                  <p className="font-semibold text-foreground text-xs">{student.nationalId || '—'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
                    {lang === 'ar' ? 'رقم الهاتف' : 'Phone'}
                  </p>
                  <p className="font-semibold text-foreground" dir="ltr" style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>
                    {student.phoneNumber || '—'}
                  </p>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center gap-3 pt-4 border-t border-border/60 mt-auto">
                <button
                  onClick={() => handleApprove(student.id)}
                  disabled={isApproving && approvingId === student.id}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200',
                    'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md hover:-translate-y-0.5',
                    'disabled:opacity-50 disabled:pointer-events-none disabled:transform-none'
                  )}
                >
                  {isApproving && approvingId === student.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  {lang === 'ar' ? 'تفعيل الحساب' : 'Activate Account'}
                </button>
                <button
                  onClick={() => handleEdit(student)}
                  className={cn(
                    'flex items-center justify-center px-4 py-2.5 rounded-xl transition-all duration-200',
                    'border border-border bg-card hover:bg-secondary text-foreground hover:text-primary hover:border-primary/30'
                  )}
                  title={lang === 'ar' ? 'تعديل البيانات' : 'Edit Details'}
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Pagination ── */}
      <Pagination
        pageNumber={paged?.pageNumber ?? 1}
        totalPages={totalPages}
        onPageChange={setPageNumber}
        dir={dir}
      />

      <EditStudentModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        student={selectedStudent}
      />
    </div>
  )
}
