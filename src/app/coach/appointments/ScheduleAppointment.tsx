'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, X, CalendarPlus } from 'lucide-react'

interface Client { id: string; name: string; email: string }

export default function ScheduleAppointment({
  clients,
  coachId,
}: {
  clients: Client[]
  coachId: string
}) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    clientId: '', title: 'Nutrition Consultation', date: '', time: '10:00',
    duration: '60', notes: '', zoomLink: '',
  })
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, duration: Number(form.duration) }),
    })
    setSaving(false)
    setOpen(false)
    setForm({ clientId: '', title: 'Nutrition Consultation', date: '', time: '10:00', duration: '60', notes: '', zoomLink: '' })
    router.refresh()
  }

  const fc = "w-full px-4 py-2.5 rounded-lg border text-sm outline-none"
  const fs = { borderColor: '#e0d8cc', background: '#faf7f2', color: '#2c2c2c' }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white"
        style={{ background: '#3d6b4f' }}>
        <CalendarPlus size={16} /> Schedule Appointment
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.4)' }}>
      <div className="w-full max-w-lg rounded-2xl shadow-xl"
        style={{ background: '#ffffff', maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="flex items-center justify-between px-6 py-5 border-b"
          style={{ borderColor: '#e0d8cc' }}>
          <h2 className="font-semibold text-lg" style={{ color: '#2c2c2c' }}>Schedule Appointment</h2>
          <button onClick={() => setOpen(false)}><X size={20} color="#8a8a7a" /></button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#2c2c2c' }}>Client</label>
            <select required className={fc} style={fs}
              value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })}>
              <option value="">Select client…</option>
              {clients.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.email})</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#2c2c2c' }}>Session Type</label>
            <select className={fc} style={fs}
              value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}>
              {['Nutrition Consultation', 'Follow-up Session', 'Initial Assessment', 'Check-in Call', 'Gut Health Review', 'Hormone Health Session', 'Custom'].map(t => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#2c2c2c' }}>Date</label>
              <input type="date" required className={fc} style={fs}
                value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#2c2c2c' }}>Time</label>
              <input type="time" required className={fc} style={fs}
                value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#2c2c2c' }}>Duration</label>
              <select className={fc} style={fs}
                value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })}>
                {['30', '45', '60', '90', '120'].map(d => <option key={d} value={d}>{d} min</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#2c2c2c' }}>
              Zoom Link (optional)
            </label>
            <input type="url" placeholder="https://zoom.us/j/…" className={fc} style={fs}
              value={form.zoomLink} onChange={(e) => setForm({ ...form, zoomLink: e.target.value })} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#2c2c2c' }}>
              Notes for client (optional)
            </label>
            <textarea rows={2} className={fc} style={fs} placeholder="e.g. Please bring your 3-day food journal"
              value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white"
              style={{ background: '#3d6b4f', opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Scheduling…' : 'Schedule & Notify Client'}
            </button>
            <button type="button" onClick={() => setOpen(false)}
              className="px-5 py-2.5 rounded-lg text-sm font-medium border"
              style={{ borderColor: '#e0d8cc', color: '#8a8a7a' }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
