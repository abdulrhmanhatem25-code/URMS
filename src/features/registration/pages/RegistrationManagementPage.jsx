import { useState } from 'react'
import { usePendingStudents, useApproveStudent } from '../hooks/useRegistration'
import { useLanguageStore } from '@/app/store/useLanguageStore'
import { Loader2, CheckCircle, Edit2, AlertCircle, Clock } from 'lucide-react'
import EditStudentModal from '../components/EditStudentModal'
import { cn } from '@/lib/utils'

export default function RegistrationManagementPage() {
  const { lang, dir } = useLanguageStore()
  const { data: students, isLoading, isError, error } = usePendingStudents()
  const { mutate: approveStudent, isPending: isApproving } = useApproveStudent()

  const [selectedStudent, setSelectedStudent] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [approvingId, setApprovingId] = useState(null)

  const handleApprove = (studentId) => {
    setApprovingId(studentId)
    approveStudent(studentId, {
      onSettled: () => setApprovingId(null)
    })
  }

  const handleEdit = (student) => {
    setSelectedStudent(student)
    setIsEditModalOpen(true)
  }

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
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {lang === 'ar' ? 'إدارة التسجيل' : 'Registration Management'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {lang === 'ar' ? 'مراجعة وتفعيل حسابات الطلاب الجديدة' : 'Review and activate new student accounts'}
          </p>
        </div>
        <div className="px-4 py-2 bg-primary/10 text-primary rounded-xl font-medium text-sm border border-primary/20 shadow-sm">
          {lang === 'ar' ? 'إجمالي الطلبات: ' : 'Total Requests: '}
          <span className="font-bold">{students?.length || 0}</span>
        </div>
      </div>

      {students?.length === 0 ? (
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students?.map((student) => (
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
                  <p className="font-semibold text-foreground">{student.universityCode}</p>
                </div>
                <div>
                  <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
                    {lang === 'ar' ? 'الرقم القومي' : 'National ID'}
                  </p>
                  <p className="font-semibold text-foreground">{student.nationalId}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
                    {lang === 'ar' ? 'رقم الهاتف' : 'Phone'}
                  </p>
                  <p className="font-semibold text-foreground" dir="ltr" style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>
                    {student.phoneNumber}
                  </p>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center gap-3 pt-4 border-t border-border/60 mt-auto">
                <button
                  onClick={() => handleApprove(student.id)}
                  disabled={isApproving && approvingId === student.id}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
                    "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md hover:-translate-y-0.5",
                    "disabled:opacity-50 disabled:pointer-events-none disabled:transform-none"
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
                    "flex items-center justify-center px-4 py-2.5 rounded-xl transition-all duration-200",
                    "border border-border bg-card hover:bg-secondary text-foreground hover:text-primary hover:border-primary/30"
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

      <EditStudentModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        student={selectedStudent}
      />
    </div>
  )
}
