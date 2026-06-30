import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'
import Link from 'next/link'
import { Users, Calendar, Activity, FileText, ChevronRight, Search } from 'lucide-react'

export default async function ClientsPage() {
  const clients = await prisma.user.findMany({
    where: { role: 'CLIENT' },
    select: {
      id: true, name: true, email: true, phone: true, createdAt: true,
      _count: { select: { clientAppointments: true, symptoms: true, forms: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold" style={{ color: '#2c2c2c' }}>All Clients</h1>
        <p className="mt-1 text-sm" style={{ color: '#8a8a7a' }}>{clients.length} client{clients.length !== 1 ? 's' : ''} registered</p>
      </div>

      {clients.length === 0 ? (
        <div className="rounded-xl p-16 text-center" style={{ background: '#ffffff', border: '1px solid #e0d8cc' }}>
          <Users size={48} color="#e0d8cc" className="mx-auto mb-4" />
          <p className="font-medium text-lg" style={{ color: '#2c2c2c' }}>No clients yet</p>
          <p className="text-sm mt-2 mb-6" style={{ color: '#8a8a7a' }}>
            Share your signup link with clients:
          </p>
          <code className="px-4 py-2 rounded-lg text-sm" style={{ background: '#e8f0eb', color: '#3d6b4f' }}>
            {process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/signup
          </code>
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #e0d8cc' }}>
          <div className="px-6 py-4 border-b" style={{ background: '#f9f6f2', borderColor: '#e0d8cc' }}>
            <div className="flex items-center gap-3">
              <Search size={16} color="#8a8a7a" />
              <p className="text-sm" style={{ color: '#8a8a7a' }}>Showing all {clients.length} clients</p>
            </div>
          </div>
          <div className="divide-y" style={{ background: '#ffffff', borderColor: '#e0d8cc' }}>
            {clients.map((client) => (
              <Link key={client.id} href={`/coach/clients/${client.id}`}
                className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0"
                  style={{ background: '#c17a4a' }}>
                  {client.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium" style={{ color: '#2c2c2c' }}>{client.name}</p>
                  <p className="text-sm" style={{ color: '#8a8a7a' }}>{client.email}</p>
                </div>
                <div className="hidden md:flex items-center gap-6 text-xs" style={{ color: '#8a8a7a' }}>
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} /> {client._count.clientAppointments} sessions
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Activity size={13} /> {client._count.symptoms} entries
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FileText size={13} /> {client._count.forms} forms
                  </span>
                  <span>Joined {format(client.createdAt, 'MMM d, yyyy')}</span>
                </div>
                <ChevronRight size={16} color="#8a8a7a" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
