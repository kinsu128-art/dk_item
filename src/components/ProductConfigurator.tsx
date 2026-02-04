'use client'

import { useState, useCallback } from 'react'
import MaterialSelector from './MaterialSelector'
import EndConnectionSelector from './EndConnectionSelector'
import AttributeSelector from './AttributeSelector'

interface Material {
  MaterialGroup_cd: string
  MaterialGroup_nm: string
}

interface EndSelection {
  degignator: string | null
}

interface AttributeValue {
  attributeSubCode: string
  attributeSubName: string
  mark: string
}

interface ProductConfiguratorProps {
  productCode: string
  endNum: number
}

export default function ProductConfigurator({ productCode, endNum }: ProductConfiguratorProps) {
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null)
  const [endSelections, setEndSelections] = useState<EndSelection[]>(
    Array.from({ length: endNum }, () => ({ degignator: null }))
  )
  const [attributeSelections, setAttributeSelections] = useState<Record<string, AttributeValue | null>>({})

  const handleMaterialSelect = useCallback((material: Material | null) => {
    setSelectedMaterial(material)
  }, [])

  const handleEndSelectionChange = useCallback((endIndex: number, selection: {
    threadSize: { degignator: string } | null
  }) => {
    setEndSelections(prev => {
      const newSelections = [...prev]
      newSelections[endIndex] = {
        degignator: selection.threadSize?.degignator || null
      }
      return newSelections
    })
  }, [])

  const handleAttributeSelectionsChange = useCallback((selections: Record<string, AttributeValue | null>) => {
    setAttributeSelections(selections)
  }, [])

  // Check if basic selections are complete (material + all end connections)
  const basicSelectionsComplete = selectedMaterial && endSelections.every(s => s.degignator !== null)

  // Get selected attribute marks (exclude NIL values)
  const selectedAttributeMarks = Object.values(attributeSelections)
    .filter((v): v is AttributeValue => v !== null)
    .map(v => v.mark)
    .filter(mark => mark && mark.trim() !== '' && mark.toUpperCase() !== 'NIL')

  // Generate product code (material at the end, then A without hyphen)
  const generatedCode = basicSelectionsComplete
    ? (() => {
        // Get all end designators
        const designators = endSelections.map(s => s.degignator)

        // Check if all end designators are the same
        const allSame = designators.every(d => d === designators[0])

        // If all same, show only once; otherwise show all
        const endPart = allSame
          ? designators[0]
          : designators.join('-')

        return [
          productCode,
          endPart,
          ...selectedAttributeMarks,
          selectedMaterial.MaterialGroup_cd + 'A'
        ].join('-')
      })()
    : null

  return (
    <div className="space-y-4">
      {/* Generated Product Code */}
      {generatedCode && (
        <div className="bg-dklok-blue text-white rounded-lg p-4">
          <p className="text-sm opacity-80 mb-1">생성된 제품코드</p>
          <p className="text-2xl font-bold tracking-wide break-all">{generatedCode}</p>
        </div>
      )}

      {/* Material Selection */}
      <MaterialSelector onSelect={handleMaterialSelect} />

      {/* Connection Settings */}
      <div>
        <h5 className="text-sm font-medium text-gray-700 mb-3">
          Connection 설정
        </h5>
        <div className={`grid gap-4 ${endNum >= 3 ? 'md:grid-cols-3' : endNum === 2 ? 'md:grid-cols-2' : 'md:grid-cols-1'}`}>
          {Array.from({ length: endNum }, (_, i) => (
            <EndConnectionSelector
              key={`${productCode}-end-${i + 1}`}
              endNumber={i + 1}
              onSelectionChange={(selection) => handleEndSelectionChange(i, selection)}
            />
          ))}
        </div>
      </div>

      {/* Attribute/Options Settings */}
      <div className="border-t border-gray-200 pt-4">
        <AttributeSelector
          productCode={productCode}
          onSelectionsChange={handleAttributeSelectionsChange}
        />
      </div>
    </div>
  )
}
