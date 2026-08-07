import { Clock, User, GraduationCap, BookOpen, UserCheck, XCircle, CheckCircle, AlertTriangle, CalendarDays } from 'lucide-react'
import Modal from '@/shared/components/Modal'
import { Button } from '@/components/ui/button'
import { useLanguageStore } from '@/app/store/useLanguageStore'
import { cn } from '@/lib/utils'

// ── Status config ──────────────────────────────────────────────────────────────

export const STATUS_CONFIG = {
  Pending:         { ar: 'قيد الانتظار',    en: 'Pending',           cls: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
  AdvisorApproved: { ar: 'موافقة المرشد',   en: 'Advisor Approved',  cls: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  Approved:        { ar: 'مقبول',           en: 'Approved',          cls: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  Rejected:        { ar: 'مرفوض',           en: 'Rejected',          cls: 'bg-destructive/10 text-destructive border-destructive/20' },
  Completed:       { ar: 'مكتمل',           en: 'Completed',         cls: 'bg-green-600/10 text-green-600 border-green-600/20' },
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

export default function RequestDetailsModal({ request, isOpen, onClose }) {
  const { t: tx, lang, dir } = useTranslation('requestDetailsModal')

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
            {statusCfg[lang]}
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
        </div>

        {/* ── Footer ──────────────────────────────────────────────────────── */}
        <div className="flex justify-end px-6 py-4 border-t border-border bg-secondary/20">
          <Button variant="outline" onClick={onClose}>{tx.close}</Button>
        </div>
      </div>
    </Modal>
  )
}
