'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import ProductConfigurator from '@/components/ProductConfigurator'

interface Product {
  productCode: string
  productName: string
  category: string
  endNum: number | null
  catalogUrl: string | null
}

export default function ProductPage() {
  const params = useParams()
  const productCode = params.productCode as string
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products?q=${encodeURIComponent(productCode)}`)
        const data = await res.json()
        const found = data.products?.find((p: Product) => p.productCode === productCode)

        if (found) {
          setProduct(found)
        } else {
          setError('제품을 찾을 수 없습니다.')
        }
      } catch (err) {
        console.error(err)
        setError('제품 정보를 불러오는데 실패했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productCode])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500">로딩 중...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-red-500 mb-4">{error || '제품을 찾을 수 없습니다.'}</p>
          <button
            onClick={() => router.push('/')}
            className="text-dklok-light hover:underline"
          >
            ← 검색으로 돌아가기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="mb-4 text-dklok-light hover:underline flex items-center gap-1"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        검색 결과로 돌아가기
      </button>

      {/* Product Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-dklok-blue">{product.productCode}</h1>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                product.category === 'Fittings'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-green-100 text-green-800'
              }`}>
                {product.category}
              </span>
            </div>
            <p className="text-lg text-gray-700 mt-1">{product.productName}</p>
            {product.endNum && (
              <p className="text-sm text-gray-500 mt-1">{product.endNum} End Connection</p>
            )}
          </div>
          {product.catalogUrl && (
            <a
              href={product.catalogUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-dklok-light hover:underline"
            >
              카탈로그 PDF →
            </a>
          )}
        </div>
      </div>

      {/* Product Configurator */}
      {product.endNum && product.endNum > 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">제품 구성</h2>
          <ProductConfigurator
            productCode={product.productCode}
            endNum={product.endNum}
          />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
          이 제품은 추가 구성이 필요하지 않습니다.
        </div>
      )}
    </div>
  )
}
