import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import './globals.css'
import HeaderNav from '@/components/HeaderNav'

export const metadata: Metadata = {
  title: 'DK-Lok Product Catalog',
  description: 'Search DK-Lok Fittings and Valves by product code',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="bg-gray-50 min-h-screen flex flex-col">
        <HeaderNav />
        <main className="container mx-auto px-4 py-8 flex-grow">
          {children}
        </main>
        <footer className="bg-gray-800 text-gray-400 py-6">
          <div className="container mx-auto px-4 text-center text-sm">
            © {new Date().getFullYear()} DK-Lok Corporation. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  )
}
