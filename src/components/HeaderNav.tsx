'use client'

import { usePathname } from 'next/navigation'
import Image from 'next/image'

export default function HeaderNav() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  const handleNavClick = (href: string) => {
    window.location.href = href
  }

  const navItems = [
    { href: '/search', label: '코드 찾기' },
    { href: '/decoder', label: '코드 디코더' },
    { href: '/admin/thread-types', label: '코드관리' },
  ]

  return (
    <header className="bg-dklok-blue text-white py-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <button onClick={() => handleNavClick('/')} className="flex items-center hover:opacity-90 transition-opacity border-0 bg-transparent p-0 cursor-pointer">
          <Image
            src="/images/dklok_logo.png"
            alt="DK-Lok"
            width={120}
            height={40}
            className="h-10 w-auto"
            priority
          />
        </button>
        <div className="flex items-center gap-4 pointer-events-auto">
          <span className="text-lg font-bold text-white hidden sm:block mr-2">Product Catalog</span>
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => handleNavClick(item.href)}
              className={`text-sm py-2 px-3 rounded transition-all whitespace-nowrap hidden sm:block cursor-pointer pointer-events-auto border-0 bg-transparent ${
                isActive(item.href)
                  ? 'text-white font-semibold bg-dklok-light bg-opacity-20 border-b-2 border-white'
                  : 'text-gray-300 hover:text-white hover:bg-white hover:bg-opacity-10'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}
