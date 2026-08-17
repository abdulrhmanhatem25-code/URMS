import { useState, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useLanguageStore } from '@/app/store/useLanguageStore'
import {
  ArrowRight, ArrowLeft, GraduationCap, Mail, Hash, Users,
  UserCheck, UserX, Search, X, Calendar,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Student status badge ─────────────────────────────────────────────────────
function StatusBadge({ registered, lang }) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border',
      registered
        ? 'bg-green-500/10 text-green-600 border-green-500/20'
        : 'bg-orange-500/10 text-orange-600 border-orange-500/20'
    )}>
      {registered
        ? <><UserCheck className="w-3 h-3" />{lang === 'ar' ? 'مسجل' : 'Registered'}</>
        : <><UserX className="w-3 h-3" />{lang === 'ar' ? 'غير مسجل' : 'Unregistered'}</>
      }
    </span>
  )
}

// ─── Student Row ──────────────────────────────────────────────────────────────
function StudentRow({ student, lang, index }) {
  const nameAr = student.studentNameAr
  const nameEn = student.studentNameEn
  const displayName = lang === 'ar'
    ? (nameAr || nameEn || '—')
    : (nameEn || nameAr || '—')

  const assignedDate = student.assignedAt
    ? new Date(student.assignedAt).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')
    : '—'

  return (
    <tr className="group border-b border-border/50 hover:bg-secondary/30 transition-colors">
      {/* # */}
      <td className="px-4 py-3 text-sm text-muted-foreground font-medium w-12">{index + 1}</td>

      {/* University Code */}
      <td className="px-4 py-3">
        <span className="text-sm font-mono font-semibold text-foreground" dir="ltr">
          {student.universityCode}
        </span>
      </td>

      {/* Name */}
      <td className="px-4 py-3">
        <div>
          {nameAr && <p className="text-sm font-medium text-foreground">{nameAr}</p>}
          {nameEn && <p className="text-xs text-muted-foreground">{nameEn}</p>}
          {!nameAr && !nameEn && (
            <span className="text-xs text-muted-foreground italic">
              {lang === 'ar' ? 'غير مسجل بعد' : 'Not registered yet'}
            </span>
          )}
        </div>
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        <StatusBadge registered={student.isStudentRegistered} lang={lang} />
      </td>

      {/* Assigned At */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="w-3 h-3 shrink-0" />
          <span dir="ltr">{assignedDate}</span>
        </div>
      </td>
    </tr>
  )
}

// ─── Advisor Detail Page ──────────────────────────────────────────────────────
export default function AdvisorDetailPage() {
  const { lang, dir } = useLanguageStore()
  const navigate = useNavigate()
  const { state } = useLocation()

  const advisor = state?.advisor

  const [searchTerm,  setSearchTerm]  = useState('')
  const [statusFilter, setStatusFilter] = useState('all') // 'all' | 'registered' | 'unregistered'

  // Redirect back if no data (e.g. direct URL access)
  if (!advisor) {
    navigate('/dashboard/admin/advisor-assignments', { replace: true })
    return null
  }

  const allStudents = advisor.students?.items ?? []
  const advisorName = lang === 'ar' ? advisor.advisorNameAr : advisor.advisorNameEn

  // ── Client-side search & filter ──────────────────────────────────────────────
  const filteredStudents = useMemo(() => {
    const q = searchTerm.trim().toLowerCase()
    return allStudents.filter(s => {
      // Status filter
      if (statusFilter === 'registered'   && !s.isStudentRegistered) return false
      if (statusFilter === 'unregistered' &&  s.isStudentRegistered) return false

      // Search filter
      if (!q) return true
      return (
        s.universityCode?.toLowerCase().includes(q) ||
        s.studentNameAr?.toLowerCase().includes(q) ||
        s.studentNameEn?.toLowerCase().includes(q)
      )
    })
  }, [allStudents, searchTerm, statusFilter])

  const registeredCount   = allStudents.filter(s =>  s.isStudentRegistered).length
  const unregisteredCount = allStudents.filter(s => !s.isStudentRegistered).length

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6" dir={dir}>

      {/* ── Back button ── */}
      <button
        onClick={() => navigate('/dashboard/admin/advisor-assignments')}
        className={cn(
          'flex items-center gap-2 text-sm font-medium text-muted-foreground',
          'hover:text-foreground transition-colors',
        )}
      >
        {dir === 'rtl'
          ? <><ArrowRight className="w-4 h-4" />{lang === 'ar' ? 'رجوع للمرشدين' : 'Back to Advisors'}</>
          : <><ArrowLeft  className="w-4 h-4" />{lang === 'ar' ? 'رجوع للمرشدين' : 'Back to Advisors'}</>
        }
      </button>

      {/* ── Advisor Info Card ── */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
            <GraduationCap className="w-8 h-8 text-primary" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-foreground leading-snug">{advisorName}</h1>
            <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Hash className="w-3.5 h-3.5 shrink-0" />
                <span dir="ltr" className="font-medium">{advisor.advisorCode}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Mail className="w-3.5 h-3.5 shrink-0" />
                <span dir="ltr">{advisor.email}</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-3 shrink-0 flex-wrap">
            <div className="flex flex-col items-center px-4 py-3 rounded-xl bg-primary/10 border border-primary/20">
              <div className="flex items-center gap-1 text-primary font-bold text-xl">
                <Users className="w-4 h-4" />
                {advisor.totalStudents}
              </div>
              <span className="text-[11px] text-muted-foreground mt-0.5">
                {lang === 'ar' ? 'إجمالي الطلاب' : 'Total'}
              </span>
            </div>
            <div className="flex flex-col items-center px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/20">
              <div className="flex items-center gap-1 text-green-600 font-bold text-xl">
                <UserCheck className="w-4 h-4" />
                {registeredCount}
              </div>
              <span className="text-[11px] text-muted-foreground mt-0.5">
                {lang === 'ar' ? 'مسجل' : 'Registered'}
              </span>
            </div>
            <div className="flex flex-col items-center px-4 py-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
              <div className="flex items-center gap-1 text-orange-600 font-bold text-xl">
                <UserX className="w-4 h-4" />
                {unregisteredCount}
              </div>
              <span className="text-[11px] text-muted-foreground mt-0.5">
                {lang === 'ar' ? 'غير مسجل' : 'Unregistered'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Students Section ── */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">

        {/* Section header + search */}
        <div className="p-5 border-b border-border space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-bold text-foreground">
              {lang === 'ar' ? 'الطلاب المسندون' : 'Assigned Students'}
            </h2>
            <span className="text-sm text-muted-foreground">
              {filteredStudents.length !== allStudents.length
                ? `${filteredStudents.length} / ${allStudents.length}`
                : allStudents.length}
            </span>
          </div>

          {/* Search + status filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search input */}
            <div className="relative flex-1">
              <Search className={cn(
                'absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground',
                dir === 'rtl' ? 'right-3' : 'left-3',
              )} />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder={lang === 'ar' ? 'ابحث بالكود أو الاسم…' : 'Search by code or name…'}
                className={cn(
                  'w-full text-sm rounded-xl border border-border bg-background py-2.5 outline-none',
                  'focus:border-primary transition-colors',
                  dir === 'rtl' ? 'pr-9 pl-9' : 'pl-9 pr-9',
                )}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className={cn(
                    'absolute top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors',
                    dir === 'rtl' ? 'left-3' : 'right-3',
                  )}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Status filter pills */}
            <div className="flex gap-2 shrink-0">
              {[
                { value: 'all',           labelAr: 'الكل',        labelEn: 'All' },
                { value: 'registered',    labelAr: 'مسجل',        labelEn: 'Registered' },
                { value: 'unregistered',  labelAr: 'غير مسجل',    labelEn: 'Unregistered' },
              ].map(f => (
                <button
                  key={f.value}
                  onClick={() => setStatusFilter(f.value)}
                  className={cn(
                    'px-3 py-2 rounded-xl text-xs font-semibold border transition-colors',
                    statusFilter === f.value
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-card text-muted-foreground border-border hover:bg-secondary',
                  )}
                >
                  {lang === 'ar' ? f.labelAr : f.labelEn}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        {filteredStudents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-3">
              <Users className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              {lang === 'ar' ? 'لا يوجد طلاب مطابقون للبحث' : 'No students match your search'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full" dir={dir}>
              <thead>
                <tr className="bg-secondary/50 border-b border-border">
                  <th className="px-4 py-3 text-start text-xs font-semibold text-muted-foreground uppercase tracking-wider w-12">#</th>
                  <th className="px-4 py-3 text-start text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {lang === 'ar' ? 'الكود الجامعي' : 'Uni Code'}
                  </th>
                  <th className="px-4 py-3 text-start text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {lang === 'ar' ? 'الاسم' : 'Name'}
                  </th>
                  <th className="px-4 py-3 text-start text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {lang === 'ar' ? 'الحالة' : 'Status'}
                  </th>
                  <th className="px-4 py-3 text-start text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {lang === 'ar' ? 'تاريخ الإسناد' : 'Assigned At'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, idx) => (
                  <StudentRow
                    key={student.assignmentId}
                    student={student}
                    lang={lang}
                    index={idx}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
