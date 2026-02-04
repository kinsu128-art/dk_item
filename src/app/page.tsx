'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Product } from '@/types/product'

export default function Home() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [category, setCategory] = useState<string>('all')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setLoading(true)
    setSearched(true)

    try {
      const params = new URLSearchParams({
        q: searchQuery,
        ...(category !== 'all' && { category }),
      })

      const res = await fetch(`/api/products?${params}`)
      const data = await res.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error('Search error:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const handleProductClick = (productCode: string) => {
    router.push(`/product/${encodeURIComponent(productCode)}`)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">제품 시리즈 검색</h2>

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="제품 시리즈를 입력하세요 (예: DMC, DFC)"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dklok-light focus:border-transparent outline-none"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dklok-light focus:border-transparent outline-none"
            >
              <option value="all">전체</option>
              <option value="Fittings">Fittings</option>
              <option value="Valves">Valves</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-dklok-blue hover:bg-dklok-light text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? '검색 중...' : '검색'}
          </button>
        </form>
      </div>

      {searched && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            검색 결과 {products.length > 0 && `(${products.length}건)`}
          </h3>

          {products.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              검색 결과가 없습니다.
            </p>
          ) : (
            <div className="space-y-3">
              {products.map((product) => (
                <div
                  key={product.productCode}
                  onClick={() => handleProductClick(product.productCode)}
                  className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-dklok-light hover:bg-gray-50 transition-all"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-lg text-dklok-blue">
                          {product.productCode}
                        </h4>
                        {product.endNum && product.endNum > 0 && (
                          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">
                            {product.endNum} End{product.endNum > 1 ? 's' : ''}
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          product.category === 'Fittings'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {product.category}
                        </span>
                      </div>
                      <p className="text-gray-600 mt-1">{product.productName}</p>
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
