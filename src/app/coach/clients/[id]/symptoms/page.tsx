import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import ClientSymptomsChart from './ClientSymptomsChart'

export default async function ClientSymptomsPage({
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

  const entries = await prisma.symptomEntry.findMany({
    where: { clientId: id },
    orderBy: { weekDate: 'asc' },
  })

  return (
    <div className="p-8 max-w-5xl">
      <Link href={`/coach/clients/${id}`} className="flex items-center gap-1.5 text-sm mb-6"
        style={{ color: '#8a8a7a' }}>
        <ArrowLeft size={15} /> {client.name}
      </Link>
      <h1 className="text-2xl font-semibold mb-6" style={{ color: '#2c2c2c' }}>
        {client.name} — Symptom History
      </h1>

      {entries.length === 0 ? (
        <div className="rounded-xl p-12 text-center" style={{ background: '#ffffff', border: '1px solid #e0d8cc' }}>
          <p style={{ color: '#8a8a7a' }}>No symptom entries yet</p>
        </div>
      ) : (
        <>
          <ClientSymptomsChart entries={entries} />

          <div className="mt-6 rounded-xl overflow-hidden" style={{ border: '1px solid #e0d8cc' }}>
            <div className="px-6 py-3 text-xs font-semibold uppercase tracking-wider"
              style={{ background: '#f9f6f2', color: '#8a8a7a', borderBottom: '1px solid #e0d8cc' }}>
              All Entries
            </div>
            <table className="w-full text-sm" style={{ background: '#ffffff' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e0d8cc' }}>
                  {['Week', 'Energy', 'Sleep', 'Digestion', 'Mood', 'Stress', 'Bloating', 'Notes'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 font-medium text-xs" style={{ color: '#8a8a7a' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...entries].reverse().map((e) => (
                  <tr key={e.id} style={{ borderBottom: '1px solid #f0ebe4' }}>
                    <td className="px-4 py-3 text-xs" style={{ color: '#8a8a7a' }}>
                      {format(new Date(e.weekDate), 'MMM d')}
                    </td>
                    {[e.energy, e.sleep, e.digestion, e.mood, e.stress, e.bloating].map((v, i) => (
                      <td key={i} className="px-4 py-3 text-center">
                        <span className="font-semibold text-xs" style={{
                          color: v == null ? '#e0d8cc' : v >= 7 ? '#3d6b4f' : v >= 4 ? '#c17a4a' : '#b91c1c'
                        }}>
                          {v ?? '—'}
                        </span>
                      </td>
                    ))}
                    <td className="px-4 py-3 text-xs max-w-xs truncate" style={{ color: '#8a8a7a' }}>
                      {e.notes || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
