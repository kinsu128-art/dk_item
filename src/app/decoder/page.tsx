'use client'

import { useState } from 'react'
import type { DecodeResult } from '@/types/decoder'
import DecodedProductDisplay from '@/components/DecodedProductDisplay'

export default function DecoderPage() {
  const [inputCode, setInputCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<DecodeResult | null>(null)

  const handleDecode = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!inputCode.trim()) {
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const response = await fetch(
        `/api/decode-product?code=${encodeURIComponent(inputCode.toUpperCase())}`,
        { method: 'GET' }
      )

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Decode error:', error)
      setResult({
        success: false,
        inputCode: inputCode.toUpperCase(),
        error: 'An error occurred while decoding the product code',
        statusCode: 500
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          제품 코드 디코더
        </h1>
        <p className="text-gray-600">
          생성된 제품 코드를 입력하여 재질, Connection 설정, 특수사양을 확인하세요.
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleDecode} className="space-y-4">
          <div className="flex gap-4 flex-col sm:flex-row">
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              placeholder="제품 코드를 입력하세요 (예: DMC-4N-8N-SA)"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg
                       focus:ring-2 focus:ring-dklok-light focus:border-transparent
                       outline-none uppercase"
            />
            <button
              type="submit"
              disabled={loading || !inputCode.trim()}
              className="bg-dklok-blue hover:bg-dklok-light text-white
                       font-semibold py-3 px-8 rounded-lg transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {loading ? '분석 중...' : '디코드'}
            </button>
          </div>

          <p className="text-sm text-gray-500">
            예시: DMC-4N-8N-SA, DU-16-16-SA, NEMA-16-SA
          </p>
        </form>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2
                        border-dklok-blue mx-auto mb-4"></div>
          <p className="text-gray-600">제품 코드를 분석하는 중...</p>
        </div>
      )}

      {/* Error State */}
      {result && !result.success && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg
              className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h4 className="font-semibold text-red-800 mb-1">
                {result.statusCode === 404
                  ? 'Product Not Found'
                  : result.statusCode === 422
                    ? 'Invalid Product Code Component'
                    : 'Error Decoding Product Code'}
              </h4>
              <p className="text-red-700 text-sm">
                {result.error || 'An unknown error occurred'}
              </p>
              {result.statusCode === 400 && (
                <p className="text-red-600 text-xs mt-2">
                  제품 코드 형식: SERIES-END1[-END2...]-[ATTR...]-MATERIAL_A
                </p>
              )}
              {result.statusCode === 404 && (
                <a
                  href="/"
                  className="text-dklok-light hover:underline text-sm mt-2 inline-block"
                >
                  이용 가능한 제품 검색 →
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Success State - Display Results */}
      {result && result.success && (
        <DecodedProductDisplay data={result} />
      )}
    </div>
  )
}
