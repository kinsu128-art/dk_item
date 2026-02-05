'use client'

import Link from 'next/link'

export default function Home() {

  return (
    <div>
      {/* Hero Banner */}
      <div className="relative w-full h-96 bg-gradient-to-r from-dklok-blue to-dklok-light rounded-lg overflow-hidden mb-12 shadow-lg">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            DK-Lok 제품 카탈로그
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl">
            고품질의 Fittings과 Valves 제품을 검색하고 관리하세요
          </p>
        </div>
      </div>

      {/* Quick Menu Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {/* 제품카탈로그 */}
        <a
          href="https://dklok.com/product-introduction/product-classification/all-product"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer border-t-4 border-dklok-blue group block"
        >
          <div className="text-4xl mb-3 text-dklok-blue group-hover:scale-110 transition-transform">
            📦
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">제품카탈로그</h3>
          <p className="text-sm text-gray-600 mb-4">
            모든 DK-Lok 제품을 검색하고 상세 정보를 확인하세요
          </p>
          <div className="text-dklok-light text-sm font-medium">바로가기 →</div>
        </a>

        {/* 코드찾기 */}
        <Link
          href="/search"
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer border-t-4 border-dklok-light group block"
        >
          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
            🔍
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">코드찾기</h3>
          <p className="text-sm text-gray-600 mb-4">
            원하는 제품의 정확한 제품 코드를 찾으세요
          </p>
          <div className="text-dklok-light text-sm font-medium">바로가기 →</div>
        </Link>

        {/* 코드디코더 */}
        <Link
          href="/decoder"
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer border-t-4 border-blue-500 group block"
        >
          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
            🔐
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">코드디코더</h3>
          <p className="text-sm text-gray-600 mb-4">
            제품 코드를 입력하여 상세 정보를 디코드하세요
          </p>
          <div className="text-dklok-light text-sm font-medium">바로가기 →</div>
        </Link>

        {/* 코드관리 */}
        <Link
          href="/admin/thread-types"
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer border-t-4 border-blue-400 group block"
        >
          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
            ⚙️
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">코드관리</h3>
          <p className="text-sm text-gray-600 mb-4">
            제품 코드 정보를 관리하고 업데이트하세요
          </p>
          <div className="text-dklok-light text-sm font-medium">바로가기 →</div>
        </Link>
      </div>

    </div>
  )
}
