'use client'

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar
} from 'recharts'
import { format } from 'date-fns'

interface Entry {
  weekDate: string
  energy: number | null
  sleep: number | null
  digestion: number | null
  mood: number | null
  stress: number | null
  hydration: number | null
  exercise: number | null
}

export default function ProgressCharts({ symptoms }: { symptoms: Entry[] }) {
  const data = symptoms.map((e) => ({
    week: format(new Date(e.weekDate), 'MMM d'),
    energy: e.energy,
    sleep: e.sleep,
    digestion: e.digestion,
    mood: e.mood,
    stress: e.stress,
    hydration: e.hydration,
    exercise: e.exercise,
  }))

  return (
    <div className="space-y-6">
      <div className="rounded-xl p-6" style={{ background: '#ffffff', border: '1px solid #e0d8cc' }}>
        <h2 className="font-semibold mb-4" style={{ color: '#2c2c2c' }}>Energy, Sleep & Digestion</h2>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <defs>
              {[['energy', '#f59e0b'], ['sleep', '#6366f1'], ['digestion', '#3d6b4f']].map(([k, c]) => (
                <linearGradient key={k} id={`grad-${k}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={c} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={c} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0d8cc" />
            <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#8a8a7a' }} />
            <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: '#8a8a7a' }} />
            <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e0d8cc', borderRadius: 8, fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Area type="monotone" dataKey="energy" name="Energy" stroke="#f59e0b" fill="url(#grad-energy)" strokeWidth={2} />
            <Area type="monotone" dataKey="sleep" name="Sleep" stroke="#6366f1" fill="url(#grad-sleep)" strokeWidth={2} />
            <Area type="monotone" dataKey="digestion" name="Digestion" stroke="#3d6b4f" fill="url(#grad-digestion)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="rounded-xl p-6" style={{ background: '#ffffff', border: '1px solid #e0d8cc' }}>
          <h2 className="font-semibold mb-4" style={{ color: '#2c2c2c' }}>Mood & Stress</h2>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0d8cc" />
              <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#8a8a7a' }} />
              <YAxis domain={[0, 10]} tick={{ fontSize: 10, fill: '#8a8a7a' }} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="mood" name="Mood" fill="#ec4899" radius={[3, 3, 0, 0]} />
              <Bar dataKey="stress" name="Stress" fill="#ef4444" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl p-6" style={{ background: '#ffffff', border: '1px solid #e0d8cc' }}>
          <h2 className="font-semibold mb-4" style={{ color: '#2c2c2c' }}>Hydration & Exercise</h2>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0d8cc" />
              <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#8a8a7a' }} />
              <YAxis tick={{ fontSize: 10, fill: '#8a8a7a' }} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="hydration" name="Water (glasses)" fill="#0ea5e9" radius={[3, 3, 0, 0]} />
              <Bar dataKey="exercise" name="Exercise (min)" fill="#22c55e" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
