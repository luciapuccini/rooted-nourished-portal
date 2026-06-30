import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Rooted & Nourished | Client Portal',
  description: 'Your personalized nutrition and health coaching portal with Sophia Khosravi',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  )
}
