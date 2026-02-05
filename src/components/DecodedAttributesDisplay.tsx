'use client'

import type { DecodedAttribute } from '@/types/decoder'

interface DecodedAttributesDisplayProps {
  attributes: DecodedAttribute[]
}

export default function DecodedAttributesDisplay({ attributes }: DecodedAttributesDisplayProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        특수사양 (Special Attributes)
      </h3>
      {attributes.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
          표준 사양 (No special attributes)
        </div>
      ) : (
        <div className="space-y-3">
          {attributes.map((attr, idx) => (
            <div
              key={idx}
              className="bg-gray-50 rounded-lg p-4 border-l-4 border-dklok-light"
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <p className="font-medium text-gray-800">
                    {attr.attributeName}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {attr.attributeSubName}
                  </p>
                </div>
                <span className="bg-dklok-blue text-white px-2 py-1 rounded text-sm font-mono flex-shrink-0">
                  {attr.mark}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
