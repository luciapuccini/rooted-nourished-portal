'use client'

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar
} from 'recharts'
import { format } from 'date-fns'

interface Entry {
  id: string
  weekDate: string
  energy: number | null
  sleep: number | null
  digestion: number | null
  mood: number | null
  stress: number | null
  bloating: number | null
}

const LINES = [
  { key: 'energy', label: 'Energy', color: '#f59e0b' },
  { key: 'sleep', label: 'Sleep', color: '#6366f1' },
  { key: 'digestion', label: 'Digestion', color: '#3d6b4f' },
  { key: 'mood', label: 'Mood', color: '#ec4899' },
  { key: 'stress', label: 'Stress', color: '#ef4444' },
  { key: 'bloating', label: 'Bloating', color: '#c17a4a' },
]

export default function ClientSymptomsChart({ entries }: { entries: Entry[] }) {
  const chartData = entries.slice(-16).map((e) => ({
    week: format(new Date(e.weekDate), 'MMM d'),
    energy: e.energy,
    sleep: e.sleep,
    digestion: e.digestion,
    mood: e.mood,
    stress: e.stress,
    bloating: e.bloating,
  }))

  const latest = entries[entries.length - 1]
  const radarData = latest ? LINES.map((l) => ({
    subject: l.label,
    value: (latest as unknown as Record<string, number | null | string>)[l.key] ?? 0,
    fullMark: 10,
  })) : []

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 rounded-xl p-6" style={{ background: '#ffffff', border: '1px solid #e0d8cc' }}>
        <h2 className="font-semibold mb-4" style={{ color: '#2c2c2c' }}>Symptom Trends Over Time</h2>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0d8cc" />
            <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#8a8a7a' }} />
            <YAxis tick={{ fontSize: 11, fill: '#8a8a7a' }} domain={[0, 10]} />
            <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e0d8cc', borderRadius: 8, fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {LINES.map((l) => (
              <Line key={l.key} type="monotone" dataKey={l.key} name={l.label} stroke={l.color}
                strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} connectNulls />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {latest && (
        <div className="rounded-xl p-6" style={{ background: '#ffffff', border: '1px solid #e0d8cc' }}>
          <h2 className="font-semibold mb-4" style={{ color: '#2c2c2c' }}>Latest Week Overview</h2>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e0d8cc" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#8a8a7a' }} />
              <Radar name="Score" dataKey="value" stroke="#3d6b4f" fill="#3d6b4f" fillOpacity={0.3} />
            </RadarChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1">
            {LINES.map((l) => {
              const val = (latest as unknown as Record<string, number | null | string>)[l.key] as number | null
              return (
                <div key={l.key} className="flex items-center justify-between text-xs">
                  <span style={{ color: '#8a8a7a' }}>{l.label}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: '#e0d8cc' }}>
                      <div className="h-full rounded-full" style={{ width: `${((val ?? 0) / 10) * 100}%`, background: l.color }} />
                    </div>
                    <span className="font-medium w-6 text-right" style={{ color: l.color }}>{val ?? '—'}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
