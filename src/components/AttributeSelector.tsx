'use client'

import { useState, useEffect } from 'react'

interface Attribute {
  attributeCode: string
  attributeName: string
  ord: number
}

interface AttributeValue {
  attributeSubCode: string
  attributeSubName: string
  mark: string
  ord: number
}

interface AttributeSelectorProps {
  productCode: string
  onSelectionsChange?: (selections: Record<string, AttributeValue | null>) => void
}

export default function AttributeSelector({ productCode, onSelectionsChange }: AttributeSelectorProps) {
  const [attributes, setAttributes] = useState<Attribute[]>([])
  const [attributeValues, setAttributeValues] = useState<Record<string, AttributeValue[]>>({})
  const [selections, setSelections] = useState<Record<string, AttributeValue | null>>({})
  const [loading, setLoading] = useState(true)
  const [loadingValues, setLoadingValues] = useState<Record<string, boolean>>({})

  // Fetch attributes for the product
  useEffect(() => {
    setLoading(true)
    fetch(`/api/product-attributes?prodSeries=${encodeURIComponent(productCode)}`)
      .then(res => res.json())
      .then(data => {
        setAttributes(data.attributes || [])
        setSelections({})
        setAttributeValues({})
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [productCode])

  // Fetch values for each attribute
  useEffect(() => {
    attributes.forEach(attr => {
      if (!attributeValues[attr.attributeCode]) {
        setLoadingValues(prev => ({ ...prev, [attr.attributeCode]: true }))
        fetch(`/api/attribute-values?attributeCode=${encodeURIComponent(attr.attributeCode)}`)
          .then(res => res.json())
          .then(data => {
            setAttributeValues(prev => ({
              ...prev,
              [attr.attributeCode]: data.values || []
            }))
          })
          .catch(console.error)
          .finally(() => {
            setLoadingValues(prev => ({ ...prev, [attr.attributeCode]: false }))
          })
      }
    })
  }, [attributes, attributeValues])

  // Notify parent of selection changes
  useEffect(() => {
    onSelectionsChange?.(selections)
  }, [selections, onSelectionsChange])

  const handleSelectionChange = (attributeCode: string, value: string) => {
    const values = attributeValues[attributeCode] || []
    const selected = values.find(v => v.attributeSubCode === value) || null
    setSelections(prev => ({
      ...prev,
      [attributeCode]: selected
    }))
  }

  if (loading) {
    return (
      <div className="text-gray-500 text-sm py-2">
        특수사양 로딩 중...
      </div>
    )
  }

  if (attributes.length === 0) {
    return null
  }

  return (
    <div className="space-y-3">
      <h5 className="text-sm font-medium text-gray-700">특수사양 (Options)</h5>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {attributes.map(attr => (
          <div key={attr.attributeCode} className="bg-gray-50 rounded-lg p-3">
            <label className="block text-sm text-gray-600 mb-1">
              {attr.attributeName}
            </label>
            <select
              value={selections[attr.attributeCode]?.attributeSubCode || ''}
              onChange={(e) => handleSelectionChange(attr.attributeCode, e.target.value)}
              disabled={loadingValues[attr.attributeCode]}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-dklok-light focus:border-transparent outline-none disabled:bg-gray-100"
            >
              <option value="">
                {loadingValues[attr.attributeCode] ? 'Loading...' : '-- Select --'}
              </option>
              {(attributeValues[attr.attributeCode] || []).map(val => (
                <option key={val.attributeSubCode} value={val.attributeSubCode}>
                  {val.attributeSubName} {val.mark && val.mark !== val.attributeSubName ? `(${val.mark})` : ''}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  )
}
