import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { ClientLayout } from '@/components/ui/Sidebar'

export default async function ClientPortalLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session) redirect('/login')
  if (session.role === 'COACH') redirect('/coach/dashboard')

  return <ClientLayout session={{ name: session.name, role: 'CLIENT' }}>{children}</ClientLayout>
}
