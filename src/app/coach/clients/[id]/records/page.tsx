import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import Link from 'next/link'
import { ArrowLeft, ClipboardList } from 'lucide-react'
import AddRecordForm from './AddRecordForm'

export default async function ClientRecordsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await getSession()
  if (!session) return null

  const client = await prisma.user.findUnique({
    where: { id, role: 'CLIENT' },
    select: { name: true },
  })
  if (!client) notFound()

  const [records, appointments] = await Promise.all([
    prisma.record.findMany({
      where: { clientId: id },
      include: { appointment: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.appointment.findMany({
      where: { clientId: id },
      orderBy: { date: 'desc' },
      take: 10,
    }),
  ])

  return (
    <div className="p-8 max-w-4xl">
      <Link href={`/coach/clients/${id}`} className="flex items-center gap-1.5 text-sm mb-6"
        style={{ color: '#8a8a7a' }}>
        <ArrowLeft size={15} /> {client.name}
      </Link>
      <div className="flex items-start justify-between mb-6">
        <h1 className="text-2xl font-semibold" style={{ color: '#2c2c2c' }}>
          {client.name} — Session Notes
        </h1>
      </div>

      <AddRecordForm clientId={id} appointments={appointments} />

      {records.length === 0 ? (
        <div className="rounded-xl p-12 text-center mt-6" style={{ background: '#ffffff', border: '1px solid #e0d8cc' }}>
          <ClipboardList size={40} color="#e0d8cc" className="mx-auto mb-3" />
          <p style={{ color: '#8a8a7a' }}>No session notes yet</p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {records.map((record) => (
            <div key={record.id} className="rounded-xl p-6"
              style={{ background: '#ffffff', border: '1px solid #e0d8cc' }}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-semibold" style={{ color: '#2c2c2c' }}>Session Notes</p>
                  <p className="text-xs mt-0.5" style={{ color: '#8a8a7a' }}>
                    {format(record.createdAt, 'MMMM d, yyyy')}
                    {record.appointment && ` · ${record.appointment.title}`}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-2"
                    style={{ color: '#3d6b4f' }}>Notes</p>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: '#2c2c2c' }}>
                    {record.notes}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-2"
                    style={{ color: '#c17a4a' }}>Recommendations</p>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: '#2c2c2c' }}>
                    {record.recommendations}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
