'use client'

import type { DecodedMaterial } from '@/types/decoder'

interface DecodedMaterialDisplayProps {
  material: DecodedMaterial
}

export default function DecodedMaterialDisplay({ material }: DecodedMaterialDisplayProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        재질 (Material)
      </h3>
      <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-dklok-blue">
        <p className="text-lg font-semibold text-gray-800">
          {material.name}
        </p>
        <p className="text-sm text-gray-600 mt-1">
          Code: {material.code}
        </p>
      </div>
    </div>
  )
}
