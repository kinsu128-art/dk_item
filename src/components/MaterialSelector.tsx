'use client'

import { useState, useEffect } from 'react'

interface Material {
  MaterialGroup_cd: string
  MaterialGroup_nm: string
}

interface MaterialSelectorProps {
  onSelect?: (material: Material | null) => void
}

export default function MaterialSelector({ onSelect }: MaterialSelectorProps) {
  const [materials, setMaterials] = useState<Material[]>([])
  const [selected, setSelected] = useState<Material | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/materials')
      .then(res => res.json())
      .then(data => {
        setMaterials(data.materials || [])
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value
    const material = materials.find(m => m.MaterialGroup_cd === code) || null
    setSelected(material)
    onSelect?.(material)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">재질 선택 (Material)</label>
      <select
        value={selected?.MaterialGroup_cd || ''}
        onChange={handleChange}
        disabled={loading}
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-dklok-light focus:border-transparent outline-none disabled:bg-gray-100"
      >
        <option value="">{loading ? 'Loading...' : '-- Select Material --'}</option>
        {materials.map(m => (
          <option key={m.MaterialGroup_cd} value={m.MaterialGroup_cd}>
            {m.MaterialGroup_nm} ({m.MaterialGroup_cd})
          </option>
        ))}
      </select>
      {selected && (
        <p className="mt-2 text-sm text-dklok-blue">
          선택됨: {selected.MaterialGroup_nm}
        </p>
      )}
    </div>
  )
}
