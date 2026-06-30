import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import Link from 'next/link'
import { ArrowLeft, FileText } from 'lucide-react'

function formatKey(key: string) {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())
}

export default async function ClientFormsPage({
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

  const forms = await prisma.form.findMany({
    where: { clientId: id },
    orderBy: { submittedAt: 'desc' },
  })

  return (
    <div className="p-8 max-w-4xl">
      <Link href={`/coach/clients/${id}`} className="flex items-center gap-1.5 text-sm mb-6"
        style={{ color: '#8a8a7a' }}>
        <ArrowLeft size={15} /> {client.name}
      </Link>
      <h1 className="text-2xl font-semibold mb-6" style={{ color: '#2c2c2c' }}>
        {client.name} — Forms
      </h1>

      {forms.length === 0 ? (
        <div className="rounded-xl p-12 text-center" style={{ background: '#ffffff', border: '1px solid #e0d8cc' }}>
          <FileText size={40} color="#e0d8cc" className="mx-auto mb-3" />
          <p style={{ color: '#8a8a7a' }}>No forms submitted yet</p>
        </div>
      ) : (
        <div className="space-y-6">
          {forms.map((form) => {
            let data: Record<string, unknown> = {}
            try { data = JSON.parse(form.data) } catch {}

            return (
              <div key={form.id} className="rounded-xl overflow-hidden"
                style={{ border: '1px solid #e0d8cc' }}>
                <div className="px-6 py-4 flex items-center justify-between"
                  style={{ background: '#f9f6f2', borderBottom: '1px solid #e0d8cc' }}>
                  <div className="flex items-center gap-2">
                    <FileText size={16} color="#3d6b4f" />
                    <h2 className="font-semibold" style={{ color: '#2c2c2c' }}>
                      {form.type === 'INTAKE' ? 'Initial Health Intake Form' : form.type}
                    </h2>
                  </div>
                  <span className="text-xs" style={{ color: '#8a8a7a' }}>
                    {format(form.submittedAt, 'MMMM d, yyyy')}
                  </span>
                </div>

                <div className="px-6 py-5" style={{ background: '#ffffff' }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    {Object.entries(data).map(([key, value]) => {
                      if (!value) return null
                      const displayVal = Array.isArray(value) ? value.join(', ') : String(value)
                      return (
                        <div key={key}>
                          <p className="text-xs font-semibold uppercase tracking-wider mb-1"
                            style={{ color: '#8a8a7a' }}>
                            {formatKey(key)}
                          </p>
                          <p className="text-sm" style={{ color: '#2c2c2c' }}>{displayVal}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
