'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function HeaderNav() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <header className="bg-dklok-blue text-white py-4 shadow-lg">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
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
            href="/search"
            className={`text-sm transition-colors hidden sm:block ${
              isActive('/search')
                ? 'text-white font-semibold border-b-2 border-white pb-1'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            코드 찾기
          </Link>
          <Link
            href="/decoder"
            className={`text-sm transition-colors hidden sm:block ${
              isActive('/decoder')
                ? 'text-white font-semibold border-b-2 border-white pb-1'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            코드 디코더
          </Link>
          <Link
            href="/admin/thread-types"
            className={`text-sm transition-colors hidden sm:block ${
              isActive('/admin/thread-types')
                ? 'text-white font-semibold border-b-2 border-white pb-1'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            코드관리
          </Link>
        </div>
      </div>
    </header>
  )
}
