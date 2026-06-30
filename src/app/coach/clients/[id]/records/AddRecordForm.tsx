'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, X, Save } from 'lucide-react'

interface Appointment {
  id: string
  title: string
  date: string
}

export default function AddRecordForm({
  clientId,
  appointments,
}: {
  clientId: string
  appointments: Appointment[]
}) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ notes: '', recommendations: '', appointmentId: '' })
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await fetch('/api/records', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientId, ...form }),
    })
    setSaving(false)
    setOpen(false)
    setForm({ notes: '', recommendations: '', appointmentId: '' })
    router.refresh()
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white"
        style={{ background: '#3d6b4f' }}>
        <Plus size={16} /> Add Session Note
      </button>
    )
  }

  const fieldClass = "w-full px-4 py-2.5 rounded-lg border text-sm outline-none"
  const fieldStyle = { borderColor: '#e0d8cc', background: '#faf7f2', color: '#2c2c2c' }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl p-6"
      style={{ background: '#ffffff', border: '2px solid #3d6b4f' }}>
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-semibold" style={{ color: '#2c2c2c' }}>New Session Note</h2>
        <button type="button" onClick={() => setOpen(false)}><X size={18} color="#8a8a7a" /></button>
      </div>

      <div className="space-y-4">
        {appointments.length > 0 && (
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#2c2c2c' }}>
              Link to appointment (optional)
            </label>
            <select className={fieldClass} style={fieldStyle}
              value={form.appointmentId} onChange={(e) => setForm({ ...form, appointmentId: e.target.value })}>
              <option value="">No appointment linked</option>
              {appointments.map((a) => (
                <option key={a.id} value={a.id}>{a.title} — {a.date}</option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: '#2c2c2c' }}>
            Session Notes
          </label>
          <textarea rows={5} required className={fieldClass} style={fieldStyle}
            placeholder="What did you discuss? Client's progress, concerns, observations…"
            value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: '#c17a4a' }}>
            Recommendations
          </label>
          <textarea rows={4} required className={fieldClass} style={fieldStyle}
            placeholder="Dietary changes, supplements, lifestyle recommendations, action items…"
            value={form.recommendations} onChange={(e) => setForm({ ...form, recommendations: e.target.value })} />
        </div>
      </div>

      <div className="flex gap-3 mt-5">
        <button type="submit" disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white"
          style={{ background: '#3d6b4f', opacity: saving ? 0.7 : 1 }}>
          <Save size={15} />
          {saving ? 'Saving…' : 'Save Note'}
        </button>
        <button type="button" onClick={() => setOpen(false)}
          className="px-5 py-2.5 rounded-lg text-sm font-medium border"
          style={{ borderColor: '#e0d8cc', color: '#8a8a7a', background: '#fff' }}>
          Cancel
        </button>
      </div>
    </form>
  )
}
