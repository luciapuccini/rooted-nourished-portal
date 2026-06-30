'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { TrendingUp, Save } from 'lucide-react'
import { DEMO_SYMPTOMS } from '@/lib/demo'

const SYMPTOMS = [
  { key: 'energy',    label: 'Energy',          color: '#f59e0b', max: 10 },
  { key: 'sleep',     label: 'Sleep Quality',   color: '#6366f1', max: 10 },
  { key: 'digestion', label: 'Digestion',       color: '#3d6b4f', max: 10 },
  { key: 'mood',      label: 'Mood',            color: '#ec4899', max: 10 },
  { key: 'stress',    label: 'Stress',          color: '#ef4444', max: 10 },
  { key: 'appetite',  label: 'Appetite',        color: '#8b5cf6', max: 10 },
  { key: 'bloating',  label: 'Bloating',        color: '#c17a4a', max: 5  },
  { key: 'headaches', label: 'Headaches',       color: '#64748b', max: 10 },
  { key: 'hydration', label: 'Water (glasses)', color: '#0ea5e9', max: 12 },
  { key: 'exercise',  label: 'Exercise (min)',  color: '#22c55e', max: 120 },
] as const

type SymptomKey = typeof SYMPTOMS[number]['key']

export default function DemoSymptoms() {
  const latest = DEMO_SYMPTOMS[DEMO_SYMPTOMS.length - 1]
  const [current, setCurrent] = useState<Record<string, number>>({
    energy: latest.energy, sleep: latest.sleep, digestion: latest.digestion,
    mood: latest.mood, stress: latest.stress, appetite: latest.appetite,
    bloating: latest.bloating, headaches: latest.headaches,
    hydration: latest.hydration, exercise: latest.exercise,
  })
  const [saved, setSaved] = useState(false)
  const [activeLines, setActiveLines] = useState<Set<string>>(
    new Set(['energy', 'sleep', 'digestion', 'mood'])
  )

  const chartData = DEMO_SYMPTOMS.map((e) => ({
    week: format(new Date(e.weekDate + 'T12:00:00'), 'MMM d'),
    energy: e.energy, sleep: e.sleep, digestion: e.digestion, mood: e.mood,
    stress: e.stress, appetite: e.appetite, bloating: e.bloating, headaches: e.headaches,
  }))

  function toggleLine(key: string) {
    setActiveLines((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold" style={{ color: '#2c2c2c' }}>Symptom Tracker</h1>
        <p className="mt-1 text-sm" style={{ color: '#8a8a7a' }}>
          Log your weekly symptoms to track progress over time
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-xl p-6" style={{ background: '#ffffff', border: '1px solid #e0d8cc' }}>
          <h2 className="font-semibold mb-1" style={{ color: '#2c2c2c' }}>This Week</h2>
          <p className="text-xs mb-5" style={{ color: '#8a8a7a' }}>
            Week of June 23, 2026
          </p>

          <div className="space-y-4">
            {SYMPTOMS.map((s) => (
              <div key={s.key}>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-medium" style={{ color: '#2c2c2c' }}>{s.label}</label>
                  <span className="text-sm font-semibold" style={{ color: s.color }}>
                    {current[s.key]}{s.max <= 10 ? `/${s.max}` : ''}
                  </span>
                </div>
                <input
                  type="range" min={0} max={s.max}
                  value={current[s.key] ?? 0}
                  onChange={(e) => setCurrent({ ...current, [s.key]: Number(e.target.value) })}
                  className="w-full h-2 rounded-full cursor-pointer"
                  style={{ accentColor: s.color }}
                />
              </div>
            ))}
          </div>

          <div className="mt-5">
            <label className="text-sm font-medium mb-1.5 block" style={{ color: '#2c2c2c' }}>Notes</label>
            <textarea
              rows={3}
              defaultValue="Incredible progress — energy through the roof!"
              placeholder="Any additional notes about how you're feeling this week…"
              className="w-full px-3 py-2 rounded-lg text-sm resize-none border"
              style={{ borderColor: '#e0d8cc', background: '#faf7f2', color: '#2c2c2c' }}
            />
          </div>

          <button
            onClick={handleSave}
            className="mt-4 flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white"
            style={{ background: saved ? '#22c55e' : '#3d6b4f' }}
          >
            <Save size={15} />
            {saved ? 'Saved!' : 'Save Entry'}
          </button>
        </div>

        <div className="rounded-xl p-6" style={{ background: '#ffffff', border: '1px solid #e0d8cc' }}>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} color="#3d6b4f" />
            <h2 className="font-semibold" style={{ color: '#2c2c2c' }}>Progress Chart</h2>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {SYMPTOMS.slice(0, 8).map((s) => (
              <button key={s.key} onClick={() => toggleLine(s.key)}
                className="text-xs px-2 py-1 rounded-full border transition-all"
                style={{
                  borderColor: activeLines.has(s.key) ? s.color : '#e0d8cc',
                  background: activeLines.has(s.key) ? s.color + '18' : 'transparent',
                  color: activeLines.has(s.key) ? s.color : '#8a8a7a',
                }}>
                {s.label}
              </button>
            ))}
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0d8cc" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#8a8a7a' }} />
              <YAxis tick={{ fontSize: 11, fill: '#8a8a7a' }} domain={[0, 10]} />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid #e0d8cc', borderRadius: 8, fontSize: 12 }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {SYMPTOMS.slice(0, 8).map((s) =>
                activeLines.has(s.key) ? (
                  <Line key={s.key} type="monotone" dataKey={s.key} name={s.label}
                    stroke={s.color} strokeWidth={2}
                    dot={{ r: 3, fill: s.color }} activeDot={{ r: 5 }} />
                ) : null
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-8 rounded-xl p-6" style={{ background: '#ffffff', border: '1px solid #e0d8cc' }}>
        <h2 className="font-semibold mb-4" style={{ color: '#2c2c2c' }}>Entry History</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid #e0d8cc' }}>
                <th className="text-left py-2 pr-4 font-medium" style={{ color: '#8a8a7a' }}>Week</th>
                {SYMPTOMS.slice(0, 6).map((s) => (
                  <th key={s.key} className="text-center py-2 px-2 font-medium" style={{ color: '#8a8a7a' }}>{s.label}</th>
                ))}
                <th className="text-left py-2 pl-4 font-medium" style={{ color: '#8a8a7a' }}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {[...DEMO_SYMPTOMS].reverse().map((e) => (
                <tr key={e.id} style={{ borderBottom: '1px solid #f0ebe4' }}>
                  <td className="py-2 pr-4" style={{ color: '#2c2c2c' }}>
                    {format(new Date(e.weekDate + 'T12:00:00'), 'MMM d')}
                  </td>
                  {SYMPTOMS.slice(0, 6).map((s) => {
                    const val = e[s.key as SymptomKey] as number
                    const pct = val / s.max
                    const color = pct >= 0.7 ? '#3d6b4f' : pct >= 0.4 ? '#c17a4a' : '#ef4444'
                    return (
                      <td key={s.key} className="text-center py-2 px-2">
                        <span className="text-sm font-medium" style={{ color }}>{val}</span>
                      </td>
                    )
                  })}
                  <td className="py-2 pl-4 text-xs" style={{ color: '#8a8a7a' }}>{e.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
