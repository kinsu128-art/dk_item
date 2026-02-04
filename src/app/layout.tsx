import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import './globals.css'

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
        <header className="bg-dklok-blue text-white py-4 shadow-lg">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/dklok_logo.png"
                alt="DK-Lok"
                width={120}
                height={40}
                className="h-10 w-auto"
                priority
              />
            </Link>
            <div className="flex items-center gap-6">
              <span className="text-lg font-bold text-white hidden sm:block">Product Catalog</span>
              <Link
                href="/admin/thread-types"
                className="text-sm text-gray-300 hover:text-white transition-colors hidden sm:block"
              >
                코드관리
              </Link>
            </div>
          </div>
        </header>
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
