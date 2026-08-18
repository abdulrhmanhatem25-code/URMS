import { Clock, User, GraduationCap, BookOpen, UserCheck, XCircle, CheckCircle, AlertTriangle, CalendarDays } from 'lucide-react'
import Modal from '@/shared/components/Modal'
import { Button } from '@/components/ui/button'
import { useLanguageStore } from '@/app/store/useLanguageStore'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { useAuthStore } from '@/app/store/useAuthStore'
import { useGetStatuses, useAdvisorReview, useStaffConfirm, useAdminOverride, useWithdrawRequest, useSendToAdministration } from '@/features/requests/hooks/useRequests'

// ── Status config ──────────────────────────────────────────────────────────────

export const STATUS_CONFIG = {
  Pending:              { ar: 'معلق (في انتظار مراجعة المرشد)',   en: 'Pending Advisor Review', cls: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
  AdvisorApproved:      { ar: 'موافق عليه من المرشد الأكاديمي',  en: 'Approved by Advisor',    cls: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  SentToAdministration: { ar: 'أُرسِل إلى شؤون الطلاب / الإدارة', en: 'Sent to Administration', cls: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' },
  Completed:            { ar: 'مكتمل / تم التنفيذ',              en: 'Completed',              cls: 'bg-green-600/10 text-green-600 border-green-600/20' },
  Rejected:             { ar: 'مرفوض',                           en: 'Rejected',               cls: 'bg-destructive/10 text-destructive border-destructive/20' },
}

const formatDate = (d, lang) => {
  if (!d) return '—'
  return new Date(d).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

const formatShortDate = (d, lang) => {
  if (!d) return '—'
  return new Date(d).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

import { useTranslation } from '@/app/hooks/useTranslation'

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="p-1.5 bg-secondary rounded-lg shrink-0 mt-0.5">
        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground break-words">{value || '—'}</p>
      </div>
    </div>
  )
}

function AdvisorAction({ request, onClose, lang }) {
  const [isApproved, setIsApproved] = useState(true)
  const [reason, setReason] = useState('')
  const { mutate, isPending } = useAdvisorReview()

  const handleSubmit = () => {
    mutate({ id: request.id, body: { isApproved, rejectionReason: reason.trim() || null } }, {
      onSuccess: onClose
    })
  }

  return (
    <div className="p-5 bg-secondary/30 rounded-xl border border-border mt-8 space-y-4">
      <h4 className="text-sm font-semibold flex items-center gap-2">
        <div className="w-1 h-4 bg-primary rounded-full" />
        {lang === 'ar' ? 'مراجعة المرشد الأكاديمي' : 'Academic Advisor Review'}
      </h4>
      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="radio" checked={isApproved} onChange={() => setIsApproved(true)} className="accent-primary w-4 h-4" />
          {lang === 'ar' ? 'موافق' : 'Approve'}
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="radio" checked={!isApproved} onChange={() => setIsApproved(false)} className="accent-primary w-4 h-4" />
          {lang === 'ar' ? 'غير موافق' : 'Reject'}
        </label>
      </div>
      {!isApproved && (
        <textarea
          value={reason}
          onChange={e => setReason(e.target.value)}
          placeholder={lang === 'ar' ? 'سبب الرفض (اختياري)' : 'Rejection Reason (Optional)'}
          className="w-full text-sm rounded-md border border-input bg-background px-3 py-2 outline-none focus:border-primary"
          rows={2}
        />
      )}
      <div className="flex justify-end pt-2">
        <Button onClick={handleSubmit} disabled={isPending} size="sm">
          {lang === 'ar' ? 'إرسال المراجعة' : 'Submit Review'}
        </Button>
      </div>
    </div>
  )
}

function StaffAction({ request, onClose, lang }) {
  const [isApproved, setIsApproved] = useState(true)
  const [notes, setNotes] = useState('')
  const { mutate, isPending } = useStaffConfirm()

  const handleSubmit = () => {
    mutate({ id: request.id, body: { isApproved, confirmationNotes: notes.trim() || null } }, {
      onSuccess: onClose
    })
  }

  return (
    <div className="p-5 bg-secondary/30 rounded-xl border border-border mt-8 space-y-4">
      <h4 className="text-sm font-semibold flex items-center gap-2">
        <div className="w-1 h-4 bg-primary rounded-full" />
        {lang === 'ar' ? 'تأكيد السكرتارية' : 'Staff Confirmation'}
      </h4>
      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="radio" checked={isApproved} onChange={() => setIsApproved(true)} className="accent-primary w-4 h-4" />
          {lang === 'ar' ? 'تأكيد الطلب' : 'Confirm Request'}
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="radio" checked={!isApproved} onChange={() => setIsApproved(false)} className="accent-primary w-4 h-4" />
          {lang === 'ar' ? 'رفض الطلب' : 'Reject Request'}
        </label>
      </div>
      <textarea
        value={notes}
        onChange={e => setNotes(e.target.value)}
        placeholder={lang === 'ar' ? 'ملاحظات التأكيد (اختياري)' : 'Confirmation Notes (Optional)'}
        className="w-full text-sm rounded-md border border-input bg-background px-3 py-2 outline-none focus:border-primary"
        rows={2}
      />
      <div className="flex justify-end pt-2">
        <Button onClick={handleSubmit} disabled={isPending} size="sm">
          {lang === 'ar' ? 'إرسال التأكيد' : 'Submit Confirmation'}
        </Button>
      </div>
    </div>
  )
}

function AdminAction({ request, onClose, lang }) {
  const [targetStatus, setTargetStatus] = useState('')
  const [notes, setNotes] = useState('')
  const { mutate, isPending } = useAdminOverride()
  const { data: statuses } = useGetStatuses()

  const handleSubmit = () => {
    if (!targetStatus) return
    mutate({ id: request.id, body: { targetStatus, reasonOrNotes: notes.trim() || null } }, {
      onSuccess: onClose
    })
  }

  return (
    <div className="p-5 bg-destructive/5 rounded-xl border border-destructive/20 mt-8 space-y-4">
      <h4 className="text-sm font-semibold text-destructive flex items-center gap-2">
        <AlertTriangle className="w-4 h-4" />
        {lang === 'ar' ? 'صلاحيات مدير النظام (تخطي الحالة)' : 'SuperAdmin Override'}
      </h4>
      
      <select
        value={targetStatus}
        onChange={e => setTargetStatus(e.target.value)}
        className="w-full text-sm rounded-md border border-input bg-background px-3 py-2 outline-none focus:border-primary"
      >
        <option value="">{lang === 'ar' ? '-- اختر الحالة الجديدة --' : '-- Select Target Status --'}</option>
        {statuses?.map(s => (
          <option key={s.id} value={s.name}>
            {lang === 'ar' ? s.displayNameAr : s.displayNameEn}
          </option>
        ))}
      </select>

      <textarea
        value={notes}
        onChange={e => setNotes(e.target.value)}
        placeholder={lang === 'ar' ? 'سبب التجاوز أو ملاحظات (اختياري)' : 'Override Reason/Notes (Optional)'}
        className="w-full text-sm rounded-md border border-input bg-background px-3 py-2 outline-none focus:border-primary"
        rows={2}
      />
      <div className="flex justify-end pt-2">
        <Button variant="destructive" onClick={handleSubmit} disabled={isPending || !targetStatus} size="sm">
          {lang === 'ar' ? 'تنفيذ التخطي' : 'Apply Override'}
        </Button>
      </div>
    </div>
  )
}

function StudentAction({ request, onClose, lang }) {
  const { mutate, isPending } = useWithdrawRequest()

  const handleWithdraw = () => {
    if (!confirm(lang === 'ar' ? 'هل أنت متأكد من رغبتك في سحب وإلغاء هذا الطلب نهائياً؟' : 'Are you sure you want to withdraw and cancel this request permanently?')) return
    mutate(request.id, {
      onSuccess: onClose
    })
  }

  return (
    <div className="p-5 bg-destructive/5 rounded-xl border border-destructive/20 mt-8 space-y-4">
      <h4 className="text-sm font-semibold text-destructive flex items-center gap-2">
        <XCircle className="w-4 h-4" />
        {lang === 'ar' ? 'سحب الطلب' : 'Withdraw Request'}
      </h4>
      <p className="text-sm text-muted-foreground">
        {lang === 'ar' ? 'بإمكانك سحب (إلغاء) هذا الطلب نهائياً الآن. لن يتمكن المرشد أو الإدارة من مراجعته بعد السحب.' : 'You can withdraw (cancel) this request permanently now. Advisors or staff will not be able to review it afterward.'}
      </p>
      <div className="flex justify-end pt-2">
        <Button variant="destructive" onClick={handleWithdraw} disabled={isPending} size="sm">
          {lang === 'ar' ? 'سحب الطلب' : 'Withdraw Request'}
        </Button>
      </div>
    </div>
  )
}

function SendToAdministrationAction({ request, onClose, lang }) {
  const { mutate, isPending } = useSendToAdministration()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [emailError, setEmailError] = useState('')

  const handleSend = () => {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError(lang === 'ar' ? 'يرجى إدخال بريد إلكتروني صحيح' : 'Please enter a valid email')
      return
    }
    setEmailError('')
    mutate(
      { id: request.id, body: { administrationEmail: email.trim(), message: message.trim() } },
      { onSuccess: onClose }
    )
  }

  return (
    <div className="p-5 bg-indigo-500/5 rounded-xl border border-indigo-500/20 mt-8 space-y-4">
      <h4 className="text-sm font-semibold text-indigo-600 flex items-center gap-2">
        <div className="w-1 h-4 bg-indigo-500 rounded-full" />
        {lang === 'ar' ? 'إرسال إلى الإدارة الخارجية (شؤون الطلاب)' : 'Send to External Administration'}
      </h4>
      <p className="text-xs text-muted-foreground leading-relaxed">
        {lang === 'ar'
          ? 'سيتم إرسال بريد إلكتروني يحتوي على رابط خاص ذو استخدام واحد لمسؤول شؤون الطلاب. سيقوم المسؤول بمراجعة الطلب والرد عليه بدون الحاجة لتسجيل الدخول.'
          : 'An email with a one-time magic link will be sent to the administration. They can review and respond without logging in.'
        }
      </p>

      {/* Email Field */}
      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-1.5">
          {lang === 'ar' ? 'البريد الإلكتروني للمسؤول' : 'Administration Email'} <span className="text-destructive">*</span>
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setEmailError('') }}
          placeholder={lang === 'ar' ? 'example@university.edu.eg' : 'example@university.edu.eg'}
          dir="ltr"
          className={`w-full text-sm rounded-lg border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-colors ${emailError ? 'border-destructive' : 'border-border'}`}
        />
        {emailError && (
          <p className="text-xs text-destructive mt-1">{emailError}</p>
        )}
      </div>

      {/* Message Field */}
      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-1.5">
          {lang === 'ar' ? 'رسالة مخصصة (اختياري)' : 'Custom Message (Optional)'}
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={lang === 'ar' ? 'أدخل رسالة مخصصة ستُرفق مع الإيميل…' : 'Add a custom message to attach with the email…'}
          rows={2}
          className="w-full text-sm rounded-lg border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-colors resize-none"
        />
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSend}
          disabled={isPending}
          className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
          size="sm"
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              {lang === 'ar' ? 'جارٍ الإرسال…' : 'Sending…'}
            </span>
          ) : (
            lang === 'ar' ? '📧 إرسال للشؤون' : '📧 Send to Administration'
          )}
        </Button>
      </div>
    </div>
  )
}


export default function RequestDetailsModal({ request, isOpen, onClose }) {
  const { t: tx, lang, dir } = useTranslation('requestDetailsModal')
  const { user } = useAuthStore()

  if (!request) return null

  const statusCfg = STATUS_CONFIG[request.status] ?? STATUS_CONFIG.Pending
  const formTitle = lang === 'ar' ? request.formTitleAr : request.formTitleEn
  const studentName = lang === 'ar' ? request.studentNameAr : request.studentNameEn
  const additionalData = request.additionalData ?? {}
  const historyLogs = [...(request.historyLogs ?? [])].reverse() // newest first

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${tx.requestDetails} — ${tx.requestId}${request.id}`}
      dir={dir}
      size="xl"
    >
      <div className="p-0">

        {/* ── Header band ─────────────────────────────────────────────────── */}
        <div className="bg-primary/5 px-6 py-5 border-b border-border flex flex-wrap items-center gap-3">
          <span className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border',
            statusCfg.cls,
          )}>
            {lang === 'ar' ? (request.statusAr || statusCfg.ar) : (request.statusEn || statusCfg.en)}
          </span>
          {formTitle && (
            <span className="text-sm font-semibold text-foreground">{formTitle}</span>
          )}
        </div>

        <div className="p-6 space-y-6">

          {/* ── Info grid ──────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoRow icon={User}           label={tx.student}        value={studentName} />
            <InfoRow icon={GraduationCap}  label={tx.universityCode} value={request.universityCode} />
            <InfoRow icon={BookOpen}       label={tx.form}           value={formTitle} />
            <InfoRow icon={UserCheck}      label={tx.advisor}        value={request.advisorName ?? tx.noAdvisor} />
            <InfoRow icon={CalendarDays}   label={tx.submittedAt}    value={formatDate(request.createdAt, lang)} />
            {request.approvedAt && (
              <InfoRow icon={CheckCircle}  label={tx.approvedAt}     value={formatDate(request.approvedAt, lang)} />
            )}
            {request.completedAt && (
              <InfoRow icon={CheckCircle}  label={tx.completedAt}    value={formatDate(request.completedAt, lang)} />
            )}
          </div>

          {/* ── Next Action ────────────────────────────────────────────────── */}
          {request.nextAction && (
            <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-primary/10 border border-primary/20 text-sm text-primary">
              <Clock className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-xs mb-1">{lang === 'ar' ? 'الإجراء التالي' : 'Next Action'}</p>
                <p>{lang === 'ar' ? request.nextAction : (request.nextActionEn || request.nextAction)}</p>
              </div>
            </div>
          )}

          {/* ── Rejection reason ───────────────────────────────────────────── */}
          {request.status === 'Rejected' && request.rejectionReason && (
            <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive">
              <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-xs mb-1">{tx.rejectionReason}</p>
                <p>{request.rejectionReason}</p>
              </div>
            </div>
          )}

          {/* ── External Administration ──────────────────────────────────────── */}
          {(request.isExternalAdministrationNotificationSent || request.externalAdministrationEmail) && (
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <div className="w-1 h-4 bg-primary rounded-full" />
                {lang === 'ar' ? 'شؤون الطلاب / الإدارة' : 'Administration / Staff'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl border border-border bg-card">
                <InfoRow icon={User} label={lang === 'ar' ? 'البريد الإلكتروني' : 'Email'} value={request.externalAdministrationEmail} />
                <InfoRow icon={CalendarDays} label={lang === 'ar' ? 'تاريخ الإرسال' : 'Sent At'} value={formatDate(request.externalAdministrationSentAt, lang)} />
                {request.externalAdministrationRespondedAt && (
                  <InfoRow icon={CheckCircle} label={lang === 'ar' ? 'تاريخ الرد' : 'Responded At'} value={formatDate(request.externalAdministrationRespondedAt, lang)} />
                )}
                {request.externalAdministrationResponseNotes && (
                  <div className="sm:col-span-2 mt-2">
                    <p className="text-xs text-muted-foreground mb-1">{lang === 'ar' ? 'ملاحظات' : 'Notes'}</p>
                    <p className="text-sm p-3 rounded-lg bg-secondary/50 border border-border text-foreground">{request.externalAdministrationResponseNotes}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Additional data ────────────────────────────────────────────── */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <div className="w-1 h-4 bg-primary rounded-full" />
              {tx.formData}
            </h3>
            {Object.keys(additionalData).length === 0 ? (
              <p className="text-sm text-muted-foreground">{tx.noData}</p>
            ) : (
              <div className="rounded-xl border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <tbody>
                    {Object.entries(additionalData).map(([key, value], i) => (
                      <tr
                        key={key}
                        className={cn(
                          'transition-colors',
                          i % 2 === 0 ? 'bg-secondary/30' : 'bg-card',
                        )}
                      >
                        <td className="px-4 py-2.5 font-medium text-muted-foreground border-b border-border/50 w-1/2">
                          {key}
                        </td>
                        <td className="px-4 py-2.5 text-foreground border-b border-border/50">
                          {value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ── History log timeline ───────────────────────────────────────── */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <div className="w-1 h-4 bg-primary rounded-full" />
              {tx.history}
            </h3>
            {historyLogs.length === 0 ? (
              <p className="text-sm text-muted-foreground">{tx.noHistory}</p>
            ) : (
              <div className="space-y-0">
                {historyLogs.map((log, i) => {
                  const logStatus = STATUS_CONFIG[log.newStatusName] ?? STATUS_CONFIG.Pending
                  return (
                    <div key={i} className="flex gap-4">
                      {/* Timeline line */}
                      <div className="flex flex-col items-center">
                        <div className={cn(
                          'w-2.5 h-2.5 rounded-full border-2 mt-1 shrink-0',
                          i === 0 ? 'border-primary bg-primary' : 'border-border bg-card',
                        )} />
                        {i < historyLogs.length - 1 && (
                          <div className="w-px flex-1 bg-border mt-1" />
                        )}
                      </div>
                      {/* Content */}
                      <div className={cn('pb-4', i === historyLogs.length - 1 && 'pb-0')}>
                        <p className="text-sm font-medium text-foreground">{log.actionMessage}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className={cn(
                            'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border',
                            logStatus.cls,
                          )}>
                            {logStatus[lang]}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {log.actionByName}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatShortDate(log.actionDate, lang)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* ── Action Forms ─────────────────────────────────────────────── */}
          {request.canWithdraw && user?.roles?.includes('Student') && (
            <StudentAction request={request} onClose={onClose} lang={lang} />
          )}
          {user?.roles?.includes('AcademicAdvisor') && (
            <AdvisorAction request={request} onClose={onClose} lang={lang} />
          )}
          {user?.roles?.includes('Secretary') && (
            <StaffAction request={request} onClose={onClose} lang={lang} />
          )}
          {user?.roles?.includes('SuperAdmin') && (
            <AdminAction request={request} onClose={onClose} lang={lang} />
          )}
          {(user?.roles?.includes('SuperAdmin') || user?.roles?.includes('Secretary')) && (
            <SendToAdministrationAction request={request} onClose={onClose} lang={lang} />
          )}

        </div>

        {/* ── Footer ──────────────────────────────────────────────────────── */}
        <div className="flex justify-end px-6 py-4 border-t border-border bg-secondary/20">
          <Button variant="outline" onClick={onClose}>{tx.close}</Button>
        </div>
      </div>
    </Modal>
  )
}
