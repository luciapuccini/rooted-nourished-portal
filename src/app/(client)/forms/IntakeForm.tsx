'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Send } from 'lucide-react'

interface IntakeFormProps {
  onCancel: () => void
  onSubmit: (data: Record<string, unknown>) => Promise<void>
}

const STEPS = [
  { title: 'Personal Information', fields: [] },
  { title: 'Health History', fields: [] },
  { title: 'Current Symptoms', fields: [] },
  { title: 'Diet & Lifestyle', fields: [] },
  { title: 'Goals & Expectations', fields: [] },
]

type FormData = Record<string, string | string[]>

export default function IntakeForm({ onCancel, onSubmit }: IntakeFormProps) {
  const [step, setStep] = useState(0)
  const [data, setData] = useState<FormData>({})
  const [submitting, setSubmitting] = useState(false)

  function set(key: string, val: string | string[]) {
    setData((d) => ({ ...d, [key]: val }))
  }

  function toggleMulti(key: string, val: string) {
    const current = (data[key] as string[]) || []
    set(key, current.includes(val) ? current.filter((v) => v !== val) : [...current, val])
  }

  async function handleSubmit() {
    setSubmitting(true)
    await onSubmit(data)
    setSubmitting(false)
  }

  const fieldClass = "w-full px-4 py-2.5 rounded-lg border text-sm outline-none"
  const fieldStyle = { borderColor: '#e0d8cc', background: '#faf7f2', color: '#2c2c2c' }
  const labelClass = "block text-sm font-medium mb-1.5"
  const labelStyle = { color: '#2c2c2c' }

  function CheckBox({ k, val, label }: { k: string; val: string; label: string }) {
    const checked = ((data[k] as string[]) || []).includes(val)
    return (
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={checked} onChange={() => toggleMulti(k, val)}
          className="rounded" style={{ accentColor: '#3d6b4f' }} />
        <span className="text-sm" style={{ color: '#2c2c2c' }}>{label}</span>
      </label>
    )
  }

  const steps = [
    <div key={0} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass} style={labelStyle}>Date of Birth</label>
          <input type="date" className={fieldClass} style={fieldStyle}
            value={(data.dob as string) || ''} onChange={(e) => set('dob', e.target.value)} />
        </div>
        <div>
          <label className={labelClass} style={labelStyle}>Gender</label>
          <select className={fieldClass} style={fieldStyle}
            value={(data.gender as string) || ''} onChange={(e) => set('gender', e.target.value)}>
            <option value="">Select…</option>
            {['Female', 'Male', 'Non-binary', 'Prefer not to say'].map(v => <option key={v}>{v}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass} style={labelStyle}>Height</label>
          <input type="text" placeholder="e.g. 5'6&quot;" className={fieldClass} style={fieldStyle}
            value={(data.height as string) || ''} onChange={(e) => set('height', e.target.value)} />
        </div>
        <div>
          <label className={labelClass} style={labelStyle}>Weight</label>
          <input type="text" placeholder="e.g. 145 lbs" className={fieldClass} style={fieldStyle}
            value={(data.weight as string) || ''} onChange={(e) => set('weight', e.target.value)} />
        </div>
      </div>
      <div>
        <label className={labelClass} style={labelStyle}>Occupation</label>
        <input type="text" className={fieldClass} style={fieldStyle}
          value={(data.occupation as string) || ''} onChange={(e) => set('occupation', e.target.value)} />
      </div>
      <div>
        <label className={labelClass} style={labelStyle}>How did you hear about Rooted & Nourished?</label>
        <input type="text" className={fieldClass} style={fieldStyle}
          value={(data.referral as string) || ''} onChange={(e) => set('referral', e.target.value)} />
      </div>
    </div>,

    <div key={1} className="space-y-5">
      <div>
        <label className={labelClass} style={labelStyle}>
          Do you have any diagnosed medical conditions?
        </label>
        <textarea rows={3} className={fieldClass} style={fieldStyle}
          placeholder="List any diagnoses (e.g. IBS, hypothyroidism, PCOS, anxiety…)"
          value={(data.diagnoses as string) || ''} onChange={(e) => set('diagnoses', e.target.value)} />
      </div>
      <div>
        <label className={labelClass} style={labelStyle}>Current medications or supplements</label>
        <textarea rows={3} className={fieldClass} style={fieldStyle}
          placeholder="Name, dose, and frequency…"
          value={(data.medications as string) || ''} onChange={(e) => set('medications', e.target.value)} />
      </div>
      <div>
        <label className={labelClass} style={labelStyle}>Previous surgeries or hospitalizations</label>
        <textarea rows={2} className={fieldClass} style={fieldStyle}
          value={(data.surgeries as string) || ''} onChange={(e) => set('surgeries', e.target.value)} />
      </div>
      <div>
        <label className={labelClass} style={labelStyle}>Family history of any health conditions</label>
        <textarea rows={2} className={fieldClass} style={fieldStyle}
          value={(data.familyHistory as string) || ''} onChange={(e) => set('familyHistory', e.target.value)} />
      </div>
    </div>,

    <div key={2} className="space-y-5">
      <div>
        <label className={labelClass} style={labelStyle}>Current symptoms (select all that apply)</label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {['Fatigue', 'Bloating', 'Gas', 'Constipation', 'Diarrhea', 'Heartburn/Reflux',
            'Brain fog', 'Headaches', 'Insomnia/poor sleep', 'Anxiety', 'Depression', 'Mood swings',
            'Joint pain', 'Skin issues', 'Weight gain', 'Weight loss', 'Food cravings', 'Hormonal issues'].map(s => (
            <CheckBox key={s} k="currentSymptoms" val={s} label={s} />
          ))}
        </div>
      </div>
      <div>
        <label className={labelClass} style={labelStyle}>Describe your most bothersome symptom</label>
        <textarea rows={3} className={fieldClass} style={fieldStyle}
          value={(data.worstSymptom as string) || ''} onChange={(e) => set('worstSymptom', e.target.value)} />
      </div>
      <div>
        <label className={labelClass} style={labelStyle}>How long have you been experiencing these symptoms?</label>
        <input type="text" placeholder="e.g. 2 years" className={fieldClass} style={fieldStyle}
          value={(data.symptomDuration as string) || ''} onChange={(e) => set('symptomDuration', e.target.value)} />
      </div>
    </div>,

    <div key={3} className="space-y-5">
      <div>
        <label className={labelClass} style={labelStyle}>Current diet (describe a typical day of eating)</label>
        <textarea rows={4} className={fieldClass} style={fieldStyle}
          placeholder="Breakfast, lunch, dinner, snacks…"
          value={(data.typicalDiet as string) || ''} onChange={(e) => set('typicalDiet', e.target.value)} />
      </div>
      <div>
        <label className={labelClass} style={labelStyle}>Dietary restrictions or preferences</label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {['Gluten-free', 'Dairy-free', 'Vegetarian', 'Vegan', 'Paleo', 'Low FODMAP', 'Nut-free', 'Soy-free'].map(v => (
            <CheckBox key={v} k="dietaryRestrictions" val={v} label={v} />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass} style={labelStyle}>Glasses of water per day</label>
          <input type="number" min={0} max={20} className={fieldClass} style={fieldStyle}
            value={(data.waterIntake as string) || ''} onChange={(e) => set('waterIntake', e.target.value)} />
        </div>
        <div>
          <label className={labelClass} style={labelStyle}>Exercise frequency</label>
          <select className={fieldClass} style={fieldStyle}
            value={(data.exerciseFrequency as string) || ''} onChange={(e) => set('exerciseFrequency', e.target.value)}>
            <option value="">Select…</option>
            {['None', '1–2x/week', '3–4x/week', '5+/week', 'Daily'].map(v => <option key={v}>{v}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className={labelClass} style={labelStyle}>Sleep quality</label>
        <select className={fieldClass} style={fieldStyle}
          value={(data.sleepQuality as string) || ''} onChange={(e) => set('sleepQuality', e.target.value)}>
          <option value="">Select…</option>
          {['Poor', 'Fair', 'Good', 'Excellent'].map(v => <option key={v}>{v}</option>)}
        </select>
      </div>
      <div>
        <label className={labelClass} style={labelStyle}>Stress level (1–10)</label>
        <input type="range" min={1} max={10} className="w-full" style={{ accentColor: '#3d6b4f' }}
          value={(data.stressLevel as string) || '5'} onChange={(e) => set('stressLevel', e.target.value)} />
        <p className="text-xs mt-1" style={{ color: '#8a8a7a' }}>Current: {data.stressLevel || '5'}/10</p>
      </div>
    </div>,

    <div key={4} className="space-y-5">
      <div>
        <label className={labelClass} style={labelStyle}>
          What are your main health goals? What would you like to achieve?
        </label>
        <textarea rows={4} className={fieldClass} style={fieldStyle}
          placeholder="Be as specific as possible…"
          value={(data.healthGoals as string) || ''} onChange={(e) => set('healthGoals', e.target.value)} />
      </div>
      <div>
        <label className={labelClass} style={labelStyle}>
          What does success look like for you in 3 months?
        </label>
        <textarea rows={3} className={fieldClass} style={fieldStyle}
          value={(data.successVision as string) || ''} onChange={(e) => set('successVision', e.target.value)} />
      </div>
      <div>
        <label className={labelClass} style={labelStyle}>
          What has held you back from achieving these goals in the past?
        </label>
        <textarea rows={3} className={fieldClass} style={fieldStyle}
          value={(data.barriers as string) || ''} onChange={(e) => set('barriers', e.target.value)} />
      </div>
      <div>
        <label className={labelClass} style={labelStyle}>Anything else you&apos;d like Sophia to know?</label>
        <textarea rows={3} className={fieldClass} style={fieldStyle}
          value={(data.additionalNotes as string) || ''} onChange={(e) => set('additionalNotes', e.target.value)} />
      </div>
    </div>,
  ]

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold" style={{ color: '#2c2c2c' }}>Initial Health Intake Form</h1>
        <p className="mt-1 text-sm" style={{ color: '#8a8a7a' }}>
          Step {step + 1} of {STEPS.length} — {STEPS[step].title}
        </p>
        <div className="flex gap-1 mt-3">
          {STEPS.map((_, i) => (
            <div key={i} className="h-1.5 flex-1 rounded-full transition-all"
              style={{ background: i <= step ? '#3d6b4f' : '#e0d8cc' }} />
          ))}
        </div>
      </div>

      <div className="rounded-xl p-6 mb-6" style={{ background: '#ffffff', border: '1px solid #e0d8cc' }}>
        <h2 className="font-semibold mb-5" style={{ color: '#2c2c2c' }}>{STEPS[step].title}</h2>
        {steps[step]}
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={step === 0 ? onCancel : () => setStep(step - 1)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium border"
          style={{ borderColor: '#e0d8cc', color: '#2c2c2c', background: '#fff' }}
        >
          <ChevronLeft size={16} />
          {step === 0 ? 'Cancel' : 'Back'}
        </button>

        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep(step + 1)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white"
            style={{ background: '#3d6b4f' }}
          >
            Next <ChevronRight size={16} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white"
            style={{ background: '#3d6b4f', opacity: submitting ? 0.7 : 1 }}
          >
            <Send size={15} />
            {submitting ? 'Submitting…' : 'Submit Form'}
          </button>
        )}
      </div>
    </div>
  )
}
