import { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react'
import { useWorkflowModal } from '@/lib/workflowModalContext'
import type { WorkQueueItemType } from './ChatbotPanel'
import { toast } from 'sonner'
import { useNavigate } from 'react-router'

const PAYROLL_READINESS = {
  status: 'Missing inputs',
  deadline: 'Feb 14, 2026 · 5:00 PM PST',
  blockers: [
    { label: 'Missing manager inputs', count: 3, link: 'View managers' },
    { label: 'Unapproved timecards', count: 2, link: 'Review' },
    { label: 'Pending bonus entries', count: 1, link: 'Enter bonuses' },
  ],
  nextActions: [
    'Send reminder to Sarah Chen, Mike Ross, Jamie Lee',
    'Approve 2 timecards in Time & Attendance',
    'Add Q1 bonus for Engineering in Payroll run',
  ],
}

const VARIANCE_ROWS = [
  { name: 'Alex Rivera', changePct: 28, driver: 'Bonus', confidence: 'High' },
  { name: 'Jordan Kim', changePct: -22, driver: 'Unpaid leave', confidence: 'High' },
  { name: 'Sam Taylor', changePct: 34, driver: 'Overtime', confidence: 'Medium' },
  { name: 'Morgan Bell', changePct: 19, driver: 'Comp change', confidence: 'High' },
  { name: 'Casey Davis', changePct: -15, driver: 'Unpaid leave', confidence: 'Medium' },
]

const RESOLVE_PLANS: Record<WorkQueueItemType, { diagnose: string; steps: string[]; preview: { recipients?: string; message?: string; tasks?: string } }> = {
  payroll_missing_inputs: {
    diagnose: '3 managers have not submitted their payroll inputs for the current run.',
    steps: ['Identify owners (Sarah Chen, Mike Ross, Jamie Lee)', 'Draft reminder messages', 'Create follow-up tasks with due dates'],
    preview: { recipients: 'Sarah Chen, Mike Ross, Jamie Lee', message: 'Reminder: Please submit payroll inputs by Feb 13, 5pm PST.', tasks: '3 tasks created, due Feb 13' },
  },
  time_non_compliant: {
    diagnose: '12 employees have timecards that don’t meet policy. They need to correct or get manager approval.',
    steps: ['List non-compliant employees', 'Draft nudges to employees and managers', 'Create tasks for managers to review'],
    preview: { recipients: '12 employees, 4 managers', message: 'Your timecard needs attention.', tasks: '4 manager review tasks' },
  },
  it_non_compliant: {
    diagnose: '7 devices have encryption off or other policy violations.',
    steps: ['List non-compliant devices and owners', 'Trigger encryption remediation where supported', 'Draft message to device owners'],
    preview: { recipients: '7 device owners', message: 'Your device does not meet security policy. Please enable encryption.', tasks: '1 IT follow-up task' },
  },
  spend_expense_pending: {
    diagnose: '5 expense reports have been pending approval for more than 7 days.',
    steps: ['List reports and approvers', 'Send reminder to approvers', 'Create escalation tasks if >14 days'],
    preview: { recipients: '3 approvers', message: 'You have expense reports pending approval.', tasks: '3 reminder tasks' },
  },
}

type ResolveStep = 'diagnose' | 'plan' | 'preview' | 'confirm' | 'done'

function PayrollRunboardContent() {
  const { close } = useWorkflowModal()
  const navigate = useNavigate()
  return (
    <div className="space-y-4 py-2">
      <p className="text-sm text-muted-foreground">
        Payroll Runboard (prototype). In production this would open the full Runboard or navigate to Payroll.
      </p>
      <div className="rounded-md border bg-muted/30 p-3 text-sm">
        <p className="font-medium mb-1">Current run</p>
        <p className="text-muted-foreground">{PAYROLL_READINESS.deadline}</p>
        <p className="text-muted-foreground">Blockers: {PAYROLL_READINESS.blockers.map((b) => `${b.label} (${b.count})`).join(', ')}</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => { navigate('/jobs'); close(); }}>
          Go to Payroll
        </Button>
        <Button size="sm" onClick={close}>Close</Button>
      </div>
    </div>
  )
}

function PayrollSubmitContent() {
  const { close } = useWorkflowModal()
  const [confirmed, setConfirmed] = useState(false)
  const [auditNote, setAuditNote] = useState('Reviewed blockers and totals. Approved for submission.')

  return (
    <div className="space-y-4 py-2">
      <Card className="border-amber-200 bg-amber-50/30 dark:bg-amber-950/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            Preflight checklist
          </CardTitle>
          <CardDescription>Confirm before submitting. Never auto-submitted.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="rounded-md border bg-background p-2 font-mono text-xs">
            <p className="font-medium mb-1">Impact summary:</p>
            <p>Gross: +$12,450 · Net: +$9,200 · Headcount: 247 (no change)</p>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="confirm" checked={confirmed} onCheckedChange={(c) => setConfirmed(!!c)} />
            <label htmlFor="confirm" className="cursor-pointer">I reviewed blockers and totals</label>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Audit note</label>
            <textarea
              className="mt-1 w-full rounded border bg-background px-2 py-1.5 text-xs"
              rows={2}
              value={auditNote}
              onChange={(e) => setAuditNote(e.target.value)}
            />
          </div>
          <Button
            size="sm"
            className="w-full"
            disabled={!confirmed}
            onClick={() => {
              toast.success('Payroll submitted. Now Strip and Work Queue will update.')
              close()
            }}
          >
            Submit payroll
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

function VarianceContent() {
  const { close, open } = useWorkflowModal()
  return (
    <div className="space-y-4 py-2">
      <p className="text-sm text-muted-foreground">Pay variance vs last period. Click a row for detail.</p>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="text-left p-2 font-medium">Employee</th>
            <th className="text-right p-2 font-medium">Change %</th>
            <th className="text-left p-2 font-medium">Driver</th>
          </tr>
        </thead>
        <tbody>
          {VARIANCE_ROWS.map((row, i) => (
            <tr
              key={i}
              className="border-b cursor-pointer hover:bg-muted/30"
              onClick={() => open('variance_detail', { varianceEmployeeName: row.name })}
            >
              <td className="p-2">{row.name}</td>
              <td className="p-2 text-right">{row.changePct > 0 ? '+' : ''}{row.changePct}%</td>
              <td className="p-2">{row.driver}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Button variant="outline" size="sm" onClick={close}>Close</Button>
    </div>
  )
}

function VarianceDetailContent() {
  const { close, payload } = useWorkflowModal()
  const name = payload?.varianceEmployeeName
  const row = VARIANCE_ROWS.find((r) => r.name === name)
  return (
    <div className="space-y-4 py-2">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Employee pay change: {name}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          {row && (
            <p>Change: {row.changePct > 0 ? '+' : ''}{row.changePct}% · Driver: {row.driver} · Confidence: {row.confidence}</p>
          )}
        </CardContent>
      </Card>
      <Button variant="outline" size="sm" onClick={close}>Close</Button>
    </div>
  )
}

function ResolveContent() {
  const { payload, close, markResolved } = useWorkflowModal()
  const item = payload?.resolveItem
  const [step, setStep] = useState<ResolveStep>('diagnose')

  if (!item) return null
  const plan = RESOLVE_PLANS[item.type]

  const next = () => {
    if (step === 'diagnose') setStep('plan')
    else if (step === 'plan') setStep('preview')
    else if (step === 'preview') setStep('confirm')
    else if (step === 'confirm') {
      markResolved(item.id)
      setStep('done')
      setTimeout(() => close(), 1500)
    }
  }

  if (step === 'done') {
    return (
      <div className="py-8 flex items-center gap-2 text-green-800 dark:text-green-200">
        <CheckCircle2 className="h-5 w-5 shrink-0" />
        <span className="font-medium">Resolved.</span> Work Queue updated.
      </div>
    )
  }

  return (
    <div className="space-y-4 py-2">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Resolve: {item.title}</CardTitle>
          <CardDescription>Step: {step}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {step === 'diagnose' && <p className="text-muted-foreground">{plan.diagnose}</p>}
          {step === 'plan' && (
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              {plan.steps.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          )}
          {step === 'preview' && (
            <div className="space-y-2 text-muted-foreground">
              {plan.preview.recipients && <p><strong>Recipients:</strong> {plan.preview.recipients}</p>}
              {plan.preview.message && <p><strong>Message draft:</strong> {plan.preview.message}</p>}
              {plan.preview.tasks && <p><strong>Tasks:</strong> {plan.preview.tasks}</p>}
            </div>
          )}
          {step === 'confirm' && (
            <p className="text-muted-foreground">Confirm to send messages and create tasks.</p>
          )}
          <Button size="sm" className="gap-1.5" onClick={next}>
            {step === 'confirm' ? 'Execute' : 'Next'}
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export function WorkflowModal() {
  const { type, close } = useWorkflowModal()
  const open = type !== null

  const titles: Record<NonNullable<typeof type>, string> = {
    payroll_runboard: 'Payroll Runboard',
    payroll_submit: 'Submit payroll',
    variance: 'Pay variance',
    variance_detail: 'Employee pay detail',
    resolve: 'Resolve',
  }
  const title = type ? titles[type] : ''

  return (
    <Sheet open={open} onOpenChange={(o) => !o && close()}>
      <SheetContent side="right" className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>
            {type === 'payroll_runboard' && 'View and fix blockers for the current run'}
            {type === 'payroll_submit' && 'Preflight checklist and submit'}
            {type === 'variance' && 'Net pay changes vs last period'}
            {type === 'variance_detail' && 'Employee-level detail'}
            {type === 'resolve' && 'Diagnose, plan, and execute'}
          </SheetDescription>
        </SheetHeader>
        <div className="px-4 pb-8">
          {type === 'payroll_runboard' && <PayrollRunboardContent />}
          {type === 'payroll_submit' && <PayrollSubmitContent />}
          {type === 'variance' && <VarianceContent />}
          {type === 'variance_detail' && <VarianceDetailContent />}
          {type === 'resolve' && <ResolveContent />}
        </div>
      </SheetContent>
    </Sheet>
  )
}
