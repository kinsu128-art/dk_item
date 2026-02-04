'use client'

import { useState, useEffect } from 'react'

interface ConnectionType {
  connectionTypeCode: number
  connectionTypeName: string
}

interface ThreadType {
  threadTypeCode: number
  threadTypeName: string
}

interface ThreadSpec {
  threadSpecCode: number
  threadSpecName: string
}

interface ThreadSize {
  threadSizeCode: number
  threadSizeName: string
  degignator: string
}

interface EndConnectionSelectorProps {
  endNumber: number
  onSelectionChange?: (selection: {
    connectionType: ConnectionType | null
    threadType: ThreadType | null
    threadSpec: ThreadSpec | null
    threadSize: ThreadSize | null
  }) => void
}

export default function EndConnectionSelector({ endNumber, onSelectionChange }: EndConnectionSelectorProps) {
  const [connectionTypes, setConnectionTypes] = useState<ConnectionType[]>([])
  const [threadTypes, setThreadTypes] = useState<ThreadType[]>([])
  const [threadSpecs, setThreadSpecs] = useState<ThreadSpec[]>([])
  const [threadSizes, setThreadSizes] = useState<ThreadSize[]>([])

  const [selectedConnectionType, setSelectedConnectionType] = useState<ConnectionType | null>(null)
  const [selectedThreadType, setSelectedThreadType] = useState<ThreadType | null>(null)
  const [selectedSpec, setSelectedSpec] = useState<ThreadSpec | null>(null)
  const [selectedSize, setSelectedSize] = useState<ThreadSize | null>(null)

  const [loadingThreadTypes, setLoadingThreadTypes] = useState(false)
  const [loadingSpecs, setLoadingSpecs] = useState(false)
  const [loadingSizes, setLoadingSizes] = useState(false)

  // Load connection types on mount
  useEffect(() => {
    fetch('/api/connection-types')
      .then(res => res.json())
      .then(data => setConnectionTypes(data.connectionTypes || []))
      .catch(console.error)
  }, [])

  // Load thread types when connection type changes
  useEffect(() => {
    if (!selectedConnectionType) {
      setThreadTypes([])
      setSelectedThreadType(null)
      return
    }

    setLoadingThreadTypes(true)
    fetch(`/api/thread-types?connectionTypeCode=${selectedConnectionType.connectionTypeCode}`)
      .then(res => res.json())
      .then(data => {
        setThreadTypes(data.threadTypes || [])
        setSelectedThreadType(null)
        setThreadSpecs([])
        setSelectedSpec(null)
        setThreadSizes([])
        setSelectedSize(null)
      })
      .catch(console.error)
      .finally(() => setLoadingThreadTypes(false))
  }, [selectedConnectionType])

  // Load thread specs when thread type changes
  useEffect(() => {
    if (!selectedThreadType) {
      setThreadSpecs([])
      setSelectedSpec(null)
      return
    }

    setLoadingSpecs(true)
    fetch(`/api/thread-specs?threadTypeCode=${selectedThreadType.threadTypeCode}`)
      .then(res => res.json())
      .then(data => {
        setThreadSpecs(data.threadSpecs || [])
        setSelectedSpec(null)
        setThreadSizes([])
        setSelectedSize(null)
      })
      .catch(console.error)
      .finally(() => setLoadingSpecs(false))
  }, [selectedThreadType])

  // Load thread sizes when spec changes
  useEffect(() => {
    if (!selectedSpec) {
      setThreadSizes([])
      setSelectedSize(null)
      return
    }

    setLoadingSizes(true)
    fetch(`/api/thread-sizes?threadSpecCode=${selectedSpec.threadSpecCode}`)
      .then(res => res.json())
      .then(data => {
        setThreadSizes(data.threadSizes || [])
        setSelectedSize(null)
      })
      .catch(console.error)
      .finally(() => setLoadingSizes(false))
  }, [selectedSpec])

  // Notify parent of selection changes
  useEffect(() => {
    onSelectionChange?.({
      connectionType: selectedConnectionType,
      threadType: selectedThreadType,
      threadSpec: selectedSpec,
      threadSize: selectedSize,
    })
  }, [selectedConnectionType, selectedThreadType, selectedSpec, selectedSize, onSelectionChange])

  const handleConnectionTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = parseInt(e.target.value)
    const type = connectionTypes.find(t => t.connectionTypeCode === code) || null
    setSelectedConnectionType(type)
  }

  const handleThreadTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = parseInt(e.target.value)
    const type = threadTypes.find(t => t.threadTypeCode === code) || null
    setSelectedThreadType(type)
  }

  const handleSpecChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = parseInt(e.target.value)
    const spec = threadSpecs.find(s => s.threadSpecCode === code) || null
    setSelectedSpec(spec)
  }

  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = parseInt(e.target.value)
    const size = threadSizes.find(s => s.threadSizeCode === code) || null
    setSelectedSize(size)
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
      <h5 className="font-medium text-gray-700">End Connection {endNumber}</h5>

      {/* Connection Type */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">Connection Type</label>
        <select
          value={selectedConnectionType?.connectionTypeCode || ''}
          onChange={handleConnectionTypeChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-dklok-light focus:border-transparent outline-none"
        >
          <option value="">-- Select Type --</option>
          {connectionTypes.map(type => (
            <option key={type.connectionTypeCode} value={type.connectionTypeCode}>
              {type.connectionTypeName}
            </option>
          ))}
        </select>
      </div>

      {/* Thread Type */}
      {selectedConnectionType && (
        <div>
          <label className="block text-sm text-gray-600 mb-1">Thread Type</label>
          <select
            value={selectedThreadType?.threadTypeCode || ''}
            onChange={handleThreadTypeChange}
            disabled={loadingThreadTypes}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-dklok-light focus:border-transparent outline-none disabled:bg-gray-100"
          >
            <option value="">{loadingThreadTypes ? 'Loading...' : '-- Select Thread Type --'}</option>
            {threadTypes.map(type => (
              <option key={type.threadTypeCode} value={type.threadTypeCode}>
                {type.threadTypeName}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Thread Spec */}
      {selectedThreadType && (
        <div>
          <label className="block text-sm text-gray-600 mb-1">Thread Spec</label>
          <select
            value={selectedSpec?.threadSpecCode || ''}
            onChange={handleSpecChange}
            disabled={loadingSpecs}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-dklok-light focus:border-transparent outline-none disabled:bg-gray-100"
          >
            <option value="">{loadingSpecs ? 'Loading...' : '-- Select Spec --'}</option>
            {threadSpecs.map(spec => (
              <option key={spec.threadSpecCode} value={spec.threadSpecCode}>
                {spec.threadSpecName}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Thread Size */}
      {selectedSpec && (
        <div>
          <label className="block text-sm text-gray-600 mb-1">Thread Size</label>
          <select
            value={selectedSize?.threadSizeCode || ''}
            onChange={handleSizeChange}
            disabled={loadingSizes}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-dklok-light focus:border-transparent outline-none disabled:bg-gray-100"
          >
            <option value="">{loadingSizes ? 'Loading...' : '-- Select Size --'}</option>
            {threadSizes.map(size => (
              <option key={size.threadSizeCode} value={size.threadSizeCode}>
                {size.threadSizeName} ({size.degignator})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Selection Summary */}
      {selectedSize && (
        <div className="mt-2 p-2 bg-dklok-blue/5 rounded text-sm text-gray-700">
          <span className="font-medium">Selected:</span>
          <div className="text-xs mt-1 space-y-0.5">
            <div>{selectedConnectionType?.connectionTypeName}</div>
            <div>→ {selectedThreadType?.threadTypeName}</div>
            <div>→ {selectedSpec?.threadSpecName}</div>
            <div>→ {selectedSize.threadSizeName} ({selectedSize.degignator})</div>
          </div>
        </div>
      )}
    </div>
  )
}
