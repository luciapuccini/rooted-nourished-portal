import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import Link from 'next/link'
import { Activity, Calendar, FileText, ClipboardList, TrendingUp, Mail, Phone, ArrowLeft } from 'lucide-react'

export default async function ClientOverviewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const client = await prisma.user.findUnique({
    where: { id, role: 'CLIENT' },
    select: {
      id: true, name: true, email: true, phone: true, createdAt: true,
      _count: {
        select: { clientAppointments: true, symptoms: true, forms: true, clientRecords: true },
      },
    },
  })

  if (!client) notFound()

  const [recentRecord, lastSymptom, intakeForm] = await Promise.all([
    prisma.record.findFirst({ where: { clientId: id }, orderBy: { createdAt: 'desc' } }),
    prisma.symptomEntry.findFirst({ where: { clientId: id }, orderBy: { weekDate: 'desc' } }),
    prisma.form.findFirst({ where: { clientId: id, type: 'INTAKE' } }),
  ])

  const tabs = [
    { href: `/coach/clients/${id}/symptoms`, label: 'Symptoms', icon: <Activity size={16} />, desc: `${client._count.symptoms} entries` },
    { href: `/coach/clients/${id}/progress`, label: 'Progress', icon: <TrendingUp size={16} />, desc: 'Charts & trends' },
    { href: `/coach/clients/${id}/forms`, label: 'Forms', icon: <FileText size={16} />, desc: `${client._count.forms} submitted` },
    { href: `/coach/clients/${id}/records`, label: 'Session Notes', icon: <ClipboardList size={16} />, desc: `${client._count.clientRecords} records` },
  ]

  return (
    <div className="p-8 max-w-5xl">
      <Link href="/coach/clients" className="flex items-center gap-1.5 text-sm mb-6"
        style={{ color: '#8a8a7a' }}>
        <ArrowLeft size={15} /> All Clients
      </Link>

      <div className="rounded-xl p-6 mb-6" style={{ background: '#ffffff', border: '1px solid #e0d8cc' }}>
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white flex-shrink-0"
            style={{ background: '#c17a4a' }}>
            {client.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold" style={{ color: '#2c2c2c' }}>{client.name}</h1>
            <div className="flex flex-wrap gap-4 mt-2">
              <span className="flex items-center gap-1.5 text-sm" style={{ color: '#8a8a7a' }}>
                <Mail size={14} /> {client.email}
              </span>
              {client.phone && (
                <span className="flex items-center gap-1.5 text-sm" style={{ color: '#8a8a7a' }}>
                  <Phone size={14} /> {client.phone}
                </span>
              )}
              <span className="text-sm" style={{ color: '#8a8a7a' }}>
                Joined {format(client.createdAt, 'MMMM d, yyyy')}
              </span>
            </div>
          </div>
          <Link href={`/coach/chat?with=${client.id}`}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white"
            style={{ background: '#3d6b4f' }}>
            Message
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {tabs.map((tab) => (
          <Link key={tab.href} href={tab.href}
            className="rounded-xl p-4 transition-shadow hover:shadow-md"
            style={{ background: '#ffffff', border: '1px solid #e0d8cc' }}>
            <div className="flex items-center gap-2 mb-2" style={{ color: '#3d6b4f' }}>
              {tab.icon}
              <span className="text-sm font-medium">{tab.label}</span>
            </div>
            <p className="text-xs" style={{ color: '#8a8a7a' }}>{tab.desc}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {lastSymptom && (
          <div className="rounded-xl p-5" style={{ background: '#ffffff', border: '1px solid #e0d8cc' }}>
            <h3 className="font-medium mb-3" style={{ color: '#2c2c2c' }}>Latest Symptom Entry</h3>
            <p className="text-xs mb-3" style={{ color: '#8a8a7a' }}>Week of {format(new Date(lastSymptom.weekDate), 'MMM d')}</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {([['Energy', lastSymptom.energy], ['Sleep', lastSymptom.sleep], ['Digestion', lastSymptom.digestion], ['Mood', lastSymptom.mood]] as [string, number | null][])
                .filter(([, v]) => v != null)
                .map(([label, val]) => (
                <div key={label} className="flex justify-between">
                  <span style={{ color: '#8a8a7a' }}>{label}</span>
                  <span className="font-medium" style={{ color: '#3d6b4f' }}>{val}/10</span>
                </div>
              ))}
            </div>
            <Link href={`/coach/clients/${id}/symptoms`} className="text-xs mt-3 block" style={{ color: '#3d6b4f' }}>
              View full history →
            </Link>
          </div>
        )}

        {recentRecord && (
          <div className="rounded-xl p-5" style={{ background: '#ffffff', border: '1px solid #e0d8cc' }}>
            <h3 className="font-medium mb-3" style={{ color: '#2c2c2c' }}>Last Session Note</h3>
            <p className="text-xs mb-2" style={{ color: '#8a8a7a' }}>
              {format(recentRecord.createdAt, 'MMM d, yyyy')}
            </p>
            <p className="text-sm line-clamp-3" style={{ color: '#2c2c2c' }}>{recentRecord.notes}</p>
            <Link href={`/coach/clients/${id}/records`} className="text-xs mt-3 block" style={{ color: '#3d6b4f' }}>
              View all records →
            </Link>
          </div>
        )}

        {intakeForm && (
          <div className="rounded-xl p-5" style={{ background: '#e8f0eb', border: '1px solid #c8dfd0' }}>
            <h3 className="font-medium mb-3" style={{ color: '#2c2c2c' }}>Intake Form</h3>
            <p className="text-xs" style={{ color: '#8a8a7a' }}>
              Submitted {format(intakeForm.submittedAt, 'MMM d, yyyy')}
            </p>
            <Link href={`/coach/clients/${id}/forms`} className="text-xs mt-3 block" style={{ color: '#3d6b4f' }}>
              View intake data →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
