import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useExternalRequest, useRespondToRequest } from '../hooks/useAdmission'
import {
  Loader2, AlertTriangle, CheckCircle, XCircle, LinkIcon,
  User, GraduationCap, CalendarDays, FileText, BookOpen, Clock,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Helpers ────────────────────────────────────────────────────────────────────
const formatDate = (d) => {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('ar-EG', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

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

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function AdmissionReviewPage() {
  const { token } = useParams()
  const { data: request, isLoading, isError, error } = useExternalRequest(token)
  const { mutate: respond, isPending: isResponding } = useRespondToRequest(token)

  const [isApproved, setIsApproved] = useState(true)
  const [notes, setNotes] = useState('')
  const [otp, setOtp] = useState('')
  const [isDone, setIsDone] = useState(false)
  const [otpError, setOtpError] = useState('')

  const handleSubmit = () => {
    if (!otp.trim()) {
      setOtpError('يرجى إدخال رمز التحقق (OTP) المُرسل إليك')
      return
    }
    setOtpError('')
    respond(
      { isApproved, notes: notes.trim(), otp: otp.trim() },
      { onSuccess: () => setIsDone(true) }
    )
  }

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm">جارٍ التحقق من الرابط…</p>
      </div>
    )
  }

  // ── Success (After Submission) — must come before isError check ─────────────
  if (isDone) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 p-6">
        <div className={cn(
          'p-5 rounded-full border',
          isApproved
            ? 'bg-green-500/10 border-green-500/20'
            : 'bg-destructive/10 border-destructive/20'
        )}>
          {isApproved
            ? <CheckCircle className="w-10 h-10 text-green-500" />
            : <XCircle className="w-10 h-10 text-destructive" />
          }
        </div>
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {isApproved ? 'تمت الموافقة بنجاح' : 'تم الرفض بنجاح'}
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {isApproved
              ? 'تم إرسال قرار الموافقة إلى النظام. يمكنك إغلاق هذه الصفحة.'
              : 'تم إرسال قرار الرفض إلى النظام. يمكنك إغلاق هذه الصفحة.'
            }
          </p>
        </div>
        <p className="text-xs text-muted-foreground">لن يمكن استخدام هذا الرابط مرة أخرى.</p>
      </div>
    )
  }

  // ── Invalid / Expired Token ──────────────────────────────────────────────────
  if (isError) {
    const msg = error?.response?.data?.message || 'هذا الرابط غير صالح أو تم استخدامه مسبقاً أو انتهت صلاحيته.'
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 p-6">
        <div className="p-5 bg-destructive/10 rounded-full border border-destructive/20">
          <LinkIcon className="w-10 h-10 text-destructive" />
        </div>
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-foreground mb-2">عذراً!</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">{msg}</p>
        </div>
        <div className="px-4 py-2 bg-secondary rounded-lg border border-border text-xs text-muted-foreground font-mono">
          Token: {token}
        </div>
      </div>
    )
  }


  // ── Data ─────────────────────────────────────────────────────────────────────
  const additionalData = request?.additionalData ?? {}
  const formTitle = request?.formTitleAr || request?.formTitleEn || '—'
  const studentName = request?.studentNameAr || request?.studentNameEn || '—'

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <FileText className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-foreground">نظام إدارة الطلبات الجامعية</h1>
            <p className="text-xs text-muted-foreground">مراجعة طلب الإدارة الخارجية</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full">
          <Clock className="w-3.5 h-3.5" />
          رابط ذو استخدام واحد
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* ── Request Info Card ─────────────────────────────────────────────── */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          {/* Card Header */}
          <div className="bg-primary/5 px-6 py-4 border-b border-border flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">اسم النموذج</p>
              <h2 className="text-base font-bold text-foreground">{formTitle}</h2>
            </div>
            <span className="text-xs font-medium bg-indigo-500/10 text-indigo-600 border border-indigo-500/20 px-2.5 py-1 rounded-full">
              في انتظار ردكم
            </span>
          </div>

          {/* Info Grid */}
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <InfoRow icon={User} label="اسم الطالب" value={studentName} />
            <InfoRow icon={GraduationCap} label="الكود الجامعي" value={request?.universityCode} />
            <InfoRow icon={BookOpen} label="المرشد الأكاديمي" value={request?.advisorName} />
            <InfoRow icon={CalendarDays} label="تاريخ تقديم الطلب" value={formatDate(request?.createdAt)} />
          </div>
        </div>

        {/* ── Additional Form Data ───────────────────────────────────────────── */}
        {Object.keys(additionalData).length > 0 && (
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <div className="w-1 h-4 bg-primary rounded-full" />
                بيانات الطلب
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <tbody>
                  {Object.entries(additionalData).map(([key, value], i) => (
                    <tr
                      key={key}
                      className={cn('transition-colors', i % 2 === 0 ? 'bg-secondary/30' : 'bg-card')}
                    >
                      <td className="px-5 py-3 font-medium text-muted-foreground border-b border-border/50 w-1/2">{key}</td>
                      <td className="px-5 py-3 text-foreground border-b border-border/50">{String(value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Decision Card ────────────────────────────────────────────────── */}
        <div className="bg-card rounded-2xl border border-border p-6 space-y-5">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <div className="w-1 h-4 bg-primary rounded-full" />
            قراركم بخصوص هذا الطلب
          </h3>

          {/* Approve / Reject toggle */}
          <div className="flex gap-3">
            <button
              onClick={() => setIsApproved(true)}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-semibold transition-all duration-200',
                isApproved
                  ? 'bg-green-500/10 text-green-600 border-green-500/30 shadow-sm'
                  : 'bg-card text-muted-foreground border-border hover:bg-secondary'
              )}
            >
              <CheckCircle className="w-4 h-4" />
              موافقة
            </button>
            <button
              onClick={() => setIsApproved(false)}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-semibold transition-all duration-200',
                !isApproved
                  ? 'bg-destructive/10 text-destructive border-destructive/30 shadow-sm'
                  : 'bg-card text-muted-foreground border-border hover:bg-secondary'
              )}
            >
              <XCircle className="w-4 h-4" />
              رفض
            </button>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              الملاحظات <span className="text-muted-foreground/60">(اختياري)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="أدخل أي ملاحظات أو سبب القرار هنا…"
              rows={3}
              className="w-full text-sm rounded-xl border border-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
            />
          </div>

          {/* OTP */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              رمز التحقق (OTP) <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => { setOtp(e.target.value); setOtpError('') }}
              placeholder="أدخل الرمز المُرسل إليك"
              className={cn(
                'w-full text-sm rounded-xl border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors font-mono tracking-widest',
                otpError ? 'border-destructive focus:ring-destructive/30' : 'border-border'
              )}
            />
            {otpError && (
              <p className="text-xs text-destructive mt-1.5 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                {otpError}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1.5">
              رمز OTP تم إرساله إليكم عبر البريد الإلكتروني للتحقق من هويتكم.
            </p>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={isResponding}
            className={cn(
              'w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-200',
              isApproved
                ? 'bg-green-600 text-white hover:bg-green-700 hover:shadow-lg'
                : 'bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-lg',
              'disabled:opacity-50 disabled:pointer-events-none'
            )}
          >
            {isResponding ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isApproved ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <XCircle className="w-4 h-4" />
            )}
            {isResponding
              ? 'جارٍ الإرسال…'
              : isApproved
                ? 'تأكيد الموافقة على الطلب'
                : 'تأكيد رفض الطلب'
            }
          </button>

          <p className="text-xs text-muted-foreground text-center">
            ⚠️ تنبيه: بعد الضغط على "تأكيد"، لن يمكن التراجع أو إعادة استخدام هذا الرابط.
          </p>
        </div>
      </div>
    </div>
  )
}
