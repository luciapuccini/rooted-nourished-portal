import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import ProgressCharts from './ProgressCharts'

export default async function ClientProgressPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const client = await prisma.user.findUnique({
    where: { id, role: 'CLIENT' },
    select: { name: true },
  })
  if (!client) notFound()

  const [symptoms, records, appointments] = await Promise.all([
    prisma.symptomEntry.findMany({ where: { clientId: id }, orderBy: { weekDate: 'asc' } }),
    prisma.record.findMany({ where: { clientId: id }, orderBy: { createdAt: 'asc' }, take: 10 }),
    prisma.appointment.count({ where: { clientId: id, status: 'COMPLETED' } }),
  ])

  const avgFirst = symptoms.slice(0, 3)
  const avgLast = symptoms.slice(-3)
  const avg = (arr: typeof symptoms, key: keyof typeof symptoms[0]) => {
    const vals = arr.map((e) => e[key] as number | null).filter((v): v is number => v != null)
    return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length * 10) / 10 : null
  }

  const improvements = (['energy', 'sleep', 'digestion', 'mood'] as const).map((key) => {
    const before = avg(avgFirst, key)
    const after = avg(avgLast, key)
    const delta = before != null && after != null ? after - before : null
    return { key, before, after, delta }
  })

  return (
    <div className="p-8 max-w-5xl">
      <Link href={`/coach/clients/${id}`} className="flex items-center gap-1.5 text-sm mb-6"
        style={{ color: '#8a8a7a' }}>
        <ArrowLeft size={15} /> {client.name}
      </Link>
      <h1 className="text-2xl font-semibold mb-6" style={{ color: '#2c2c2c' }}>
        {client.name} — Progress Overview
      </h1>

      {symptoms.length === 0 ? (
        <div className="rounded-xl p-12 text-center" style={{ background: '#ffffff', border: '1px solid #e0d8cc' }}>
          <p style={{ color: '#8a8a7a' }}>No symptom data yet to show progress</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-4 gap-4 mb-6">
            {improvements.map(({ key, before, after, delta }) => (
              <div key={key} className="rounded-xl p-4" style={{ background: '#ffffff', border: '1px solid #e0d8cc' }}>
                <p className="text-xs uppercase tracking-wider font-medium mb-2" style={{ color: '#8a8a7a' }}>{key}</p>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-bold" style={{ color: '#2c2c2c' }}>{after ?? '—'}</span>
                  <span className="text-sm mb-0.5" style={{ color: '#8a8a7a' }}>/ 10</span>
                </div>
                {delta != null && (
                  <p className="text-xs mt-1" style={{ color: delta >= 0 ? '#3d6b4f' : '#b91c1c' }}>
                    {delta >= 0 ? '↑' : '↓'} {Math.abs(delta).toFixed(1)} from start
                  </p>
                )}
              </div>
            ))}
          </div>

          <ProgressCharts symptoms={symptoms} />

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-xl p-5" style={{ background: '#e8f0eb', border: '1px solid #c8dfd0' }}>
              <p className="text-3xl font-bold" style={{ color: '#3d6b4f' }}>{symptoms.length}</p>
              <p className="text-sm mt-1" style={{ color: '#8a8a7a' }}>Weekly check-ins logged</p>
            </div>
            <div className="rounded-xl p-5" style={{ background: '#f5ebe0', border: '1px solid #e0d8cc' }}>
              <p className="text-3xl font-bold" style={{ color: '#c17a4a' }}>{appointments}</p>
              <p className="text-sm mt-1" style={{ color: '#8a8a7a' }}>Sessions completed</p>
            </div>
          </div>

          {records.length > 0 && (
            <div className="mt-6 rounded-xl p-6" style={{ background: '#ffffff', border: '1px solid #e0d8cc' }}>
              <h2 className="font-semibold mb-4" style={{ color: '#2c2c2c' }}>Session Timeline</h2>
              <div className="space-y-4">
                {records.map((r, i) => (
                  <div key={r.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full mt-1" style={{ background: '#3d6b4f' }} />
                      {i < records.length - 1 && <div className="w-0.5 flex-1 mt-1" style={{ background: '#e0d8cc' }} />}
                    </div>
                    <div className="pb-4 flex-1">
                      <p className="text-xs mb-1" style={{ color: '#8a8a7a' }}>
                        {format(r.createdAt, 'MMM d, yyyy')}
                      </p>
                      <p className="text-sm line-clamp-2" style={{ color: '#2c2c2c' }}>{r.notes}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
