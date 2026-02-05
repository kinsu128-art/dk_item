'use client'

import type { DecodeResult } from '@/types/decoder'
import DecodedMaterialDisplay from './DecodedMaterialDisplay'
import DecodedEndDisplay from './DecodedEndDisplay'
import DecodedAttributesDisplay from './DecodedAttributesDisplay'

interface DecodedProductDisplayProps {
  data: DecodeResult
}

export default function DecodedProductDisplay({ data }: DecodedProductDisplayProps) {
  if (!data.success || !data.product || !data.material || !data.ends) {
    return null
  }

  const { product, material, ends, attributes = [] } = data

  return (
    <div className="space-y-6">
      {/* Input Product Code Banner */}
      <div className="bg-dklok-blue text-white rounded-lg p-4">
        <p className="text-sm opacity-80 mb-1">입력된 제품 코드</p>
        <p className="text-2xl font-bold tracking-wide break-all">{data.inputCode}</p>
      </div>

      {/* Product Information Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          제품 정보 (Product Information)
        </h3>
        <div className="space-y-3">
          <div className="flex border-b pb-3">
            <span className="text-gray-600 w-40 flex-shrink-0">Product Series:</span>
            <span className="font-semibold text-dklok-blue">
              {product.prodSeries}
            </span>
          </div>
          <div className="flex border-b pb-3">
            <span className="text-gray-600 w-40 flex-shrink-0">Product Name:</span>
            <span className="text-gray-800">
              {product.prodSeriesName}
            </span>
          </div>
          <div className="flex border-b pb-3">
            <span className="text-gray-600 w-40 flex-shrink-0">Category:</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
              product.kind === 'F'
                ? 'bg-blue-100 text-blue-800'
                : product.kind === 'V'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
            }`}>
              {product.kind === 'F' ? 'Fittings' : product.kind === 'V' ? 'Valves' : product.kind}
            </span>
          </div>
          <div className="flex border-b pb-3">
            <span className="text-gray-600 w-40 flex-shrink-0">End Connections:</span>
            <span className="text-gray-800">
              {product.endNum}
            </span>
          </div>
          {product.catalogUrl && (
            <div>
              <a
                href={product.catalogUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-dklok-light hover:underline inline-flex items-center gap-1"
              >
                📄 View Catalog PDF →
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Material Display */}
      <DecodedMaterialDisplay material={material} />

      {/* End Connections */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          End Connections
        </h3>
        <div className={`grid gap-4 ${
          ends.length >= 3 ? 'md:grid-cols-3' :
          ends.length === 2 ? 'md:grid-cols-2' :
          'md:grid-cols-1'
        }`}>
          {ends.map(end => (
            <DecodedEndDisplay key={`end-${end.endNumber}`} end={end} />
          ))}
        </div>
      </div>

      {/* Attributes Display */}
      <DecodedAttributesDisplay attributes={attributes} />
    </div>
  )
}
