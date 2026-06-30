'use client'

import { useState, useEffect, useCallback } from 'react'
import { format } from 'date-fns'
import { FileText, CheckCircle, ChevronRight } from 'lucide-react'
import IntakeForm from './IntakeForm'

interface Form {
  id: string
  type: string
  submittedAt: string
  data: string
}

export default function FormsPage() {
  const [forms, setForms] = useState<Form[]>([])
  const [showIntake, setShowIntake] = useState(false)

  const load = useCallback(async () => {
    const res = await fetch('/api/forms')
    const data = await res.json()
    if (data.forms) setForms(data.forms)
  }, [])

  useEffect(() => { load() }, [load])

  const intakeSubmitted = forms.some((f) => f.type === 'INTAKE')

  if (showIntake) {
    return (
      <IntakeForm
        onCancel={() => setShowIntake(false)}
        onSubmit={async (data) => {
          await fetch('/api/forms', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'INTAKE', data }),
          })
          setShowIntake(false)
          load()
        }}
      />
    )
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold" style={{ color: '#2c2c2c' }}>Forms</h1>
        <p className="mt-1 text-sm" style={{ color: '#8a8a7a' }}>
          Health history and intake forms for your program
        </p>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #e0d8cc' }}>
        <div
          className="flex items-center justify-between px-6 py-5 cursor-pointer transition-colors"
          style={{ background: '#ffffff' }}
          onClick={() => !intakeSubmitted && setShowIntake(true)}
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background: intakeSubmitted ? '#e8f0eb' : '#f5ebe0' }}>
              {intakeSubmitted
                ? <CheckCircle size={20} color="#3d6b4f" />
                : <FileText size={20} color="#c17a4a" />}
            </div>
            <div>
              <h3 className="font-semibold" style={{ color: '#2c2c2c' }}>Initial Health Intake Form</h3>
              <p className="text-sm" style={{ color: '#8a8a7a' }}>
                {intakeSubmitted
                  ? `Submitted ${format(new Date(forms.find(f => f.type === 'INTAKE')!.submittedAt), 'MMMM d, yyyy')}`
                  : 'Complete your health history — required before first session'}
              </p>
            </div>
          </div>
          {!intakeSubmitted && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium px-2.5 py-1 rounded-full"
                style={{ background: '#f5ebe0', color: '#c17a4a' }}>Required</span>
              <ChevronRight size={18} color="#8a8a7a" />
            </div>
          )}
        </div>
      </div>

      {forms.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: '#8a8a7a' }}>
            Submitted Forms
          </h2>
          <div className="space-y-3">
            {forms.map((form) => {
              let parsed: Record<string, unknown> = {}
              try { parsed = JSON.parse(form.data) } catch {}
              return (
                <div key={form.id} className="rounded-xl p-5"
                  style={{ background: '#ffffff', border: '1px solid #e0d8cc' }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle size={16} color="#3d6b4f" />
                      <span className="font-medium text-sm" style={{ color: '#2c2c2c' }}>
                        {form.type === 'INTAKE' ? 'Initial Health Intake Form' : form.type}
                      </span>
                    </div>
                    <span className="text-xs" style={{ color: '#8a8a7a' }}>
                      {format(new Date(form.submittedAt), 'MMM d, yyyy')}
                    </span>
                  </div>
                  {parsed.healthGoals && (
                    <p className="text-sm" style={{ color: '#8a8a7a' }}>
                      Goals: {String(parsed.healthGoals).slice(0, 120)}…
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
