'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface ConnectionType {
  connectionTypeCode: number
  connectionTypeName: string
}

interface ThreadType {
  threadTypeCode: number
  connectionTypeCode: number
  threadTypeName: string
}

interface ThreadSpec {
  threadSpecCode: number
  threadTypeCode: number
  threadSpecName: string
}

interface ThreadSize {
  threadSizeCode: number
  threadSpecCode: number
  threadSizeName: string
  degignator: string
  threadSizeOrd: number
}

export default function ThreadSizeManagementPage() {
  const [connectionTypes, setConnectionTypes] = useState<ConnectionType[]>([])
  const [selectedConnectionType, setSelectedConnectionType] = useState<ConnectionType | null>(null)
  const [threadTypes, setThreadTypes] = useState<ThreadType[]>([])
  const [selectedThreadType, setSelectedThreadType] = useState<ThreadType | null>(null)
  const [threadSpecs, setThreadSpecs] = useState<ThreadSpec[]>([])
  const [selectedThreadSpec, setSelectedThreadSpec] = useState<ThreadSpec | null>(null)
  const [threadSizes, setThreadSizes] = useState<ThreadSize[]>([])
  const [loading, setLoading] = useState(false)

  // Form state
  const [editingItem, setEditingItem] = useState<ThreadSize | null>(null)
  const [formData, setFormData] = useState({
    threadSizeName: '',
    degignator: '',
    threadSizeOrd: 0
  })
  const [isAdding, setIsAdding] = useState(false)

  // Fetch connection types
  useEffect(() => {
    fetch('/api/connection-types')
      .then(res => res.json())
      .then(data => setConnectionTypes(data.connectionTypes || []))
      .catch(console.error)
  }, [])

  // Fetch thread types when connection type is selected
  useEffect(() => {
    if (!selectedConnectionType) {
      setThreadTypes([])
      setSelectedThreadType(null)
      return
    }

    fetch(`/api/thread-types?connectionTypeCode=${selectedConnectionType.connectionTypeCode}`)
      .then(res => res.json())
      .then(data => {
        setThreadTypes(data.threadTypes || [])
        setSelectedThreadType(null)
        setThreadSpecs([])
        setSelectedThreadSpec(null)
        setThreadSizes([])
      })
      .catch(console.error)
  }, [selectedConnectionType])

  // Fetch thread specs when thread type is selected
  useEffect(() => {
    if (!selectedThreadType) {
      setThreadSpecs([])
      setSelectedThreadSpec(null)
      return
    }

    fetch(`/api/thread-specs?threadTypeCode=${selectedThreadType.threadTypeCode}`)
      .then(res => res.json())
      .then(data => {
        setThreadSpecs(data.threadSpecs || [])
        setSelectedThreadSpec(null)
        setThreadSizes([])
      })
      .catch(console.error)
  }, [selectedThreadType])

  // Fetch thread sizes when thread spec is selected
  useEffect(() => {
    if (!selectedThreadSpec) {
      setThreadSizes([])
      return
    }

    setLoading(true)
    fetch(`/api/admin/thread-sizes?threadSpecCode=${selectedThreadSpec.threadSpecCode}`)
      .then(res => res.json())
      .then(data => setThreadSizes(data.threadSizes || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [selectedThreadSpec])

  const handleAdd = () => {
    setIsAdding(true)
    setEditingItem(null)
    setFormData({ threadSizeName: '', degignator: '', threadSizeOrd: 0 })
  }

  const handleEdit = (item: ThreadSize) => {
    setEditingItem(item)
    setIsAdding(false)
    setFormData({
      threadSizeName: item.threadSizeName,
      degignator: item.degignator,
      threadSizeOrd: item.threadSizeOrd
    })
  }

  const handleCancel = () => {
    setEditingItem(null)
    setIsAdding(false)
    setFormData({ threadSizeName: '', degignator: '', threadSizeOrd: 0 })
  }

  const handleSave = async () => {
    if (!selectedThreadSpec || !formData.threadSizeName.trim()) return

    try {
      if (isAdding) {
        const res = await fetch('/api/admin/thread-sizes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            threadSpecCode: selectedThreadSpec.threadSpecCode,
            threadSizeName: formData.threadSizeName,
            degignator: formData.degignator,
            threadSizeOrd: formData.threadSizeOrd
          })
        })

        if (!res.ok) throw new Error('Failed to create')
      } else if (editingItem) {
        const res = await fetch('/api/admin/thread-sizes', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            threadSizeCode: editingItem.threadSizeCode,
            threadSpecCode: selectedThreadSpec.threadSpecCode,
            threadSizeName: formData.threadSizeName,
            degignator: formData.degignator,
            threadSizeOrd: formData.threadSizeOrd
          })
        })

        if (!res.ok) throw new Error('Failed to update')
      }

      // Refresh list
      const res = await fetch(`/api/admin/thread-sizes?threadSpecCode=${selectedThreadSpec.threadSpecCode}`)
      const data = await res.json()
      setThreadSizes(data.threadSizes || [])

      handleCancel()
    } catch (error) {
      console.error('Save error:', error)
      alert('저장에 실패했습니다.')
    }
  }

  const handleDelete = async (item: ThreadSize) => {
    if (!confirm(`"${item.threadSizeName}"을(를) 삭제하시겠습니까?`)) return

    try {
      const res = await fetch(`/api/admin/thread-sizes?threadSizeCode=${item.threadSizeCode}`, {
        method: 'DELETE'
      })

      if (!res.ok) throw new Error('Failed to delete')

      setThreadSizes(prev => prev.filter(t => t.threadSizeCode !== item.threadSizeCode))
    } catch (error) {
      console.error('Delete error:', error)
      alert('삭제에 실패했습니다.')
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">코드 관리</h1>

      {/* Navigation Tabs */}
      <div className="flex gap-2 mb-6">
        <Link
          href="/admin/thread-types"
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-t-lg hover:bg-gray-300 transition-colors"
        >
          Thread Type
        </Link>
        <Link
          href="/admin/thread-specs"
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-t-lg hover:bg-gray-300 transition-colors"
        >
          Thread Spec
        </Link>
        <span className="px-4 py-2 bg-dklok-blue text-white rounded-t-lg font-medium">
          Thread Size
        </span>
      </div>

      <div className="flex gap-3">
        {/* Left: Hierarchy Selection */}
        <div className="w-1/3 space-y-3">
          {/* Connection Type */}
          <div className="bg-white rounded-lg shadow-md p-3">
            <h2 className="text-sm font-semibold text-gray-700 mb-2">Connection Type</h2>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {connectionTypes.map(ct => (
                <div
                  key={ct.connectionTypeCode}
                  onClick={() => {
                    setSelectedConnectionType(ct)
                    handleCancel()
                  }}
                  className={`p-2 rounded cursor-pointer text-xs transition-all ${
                    selectedConnectionType?.connectionTypeCode === ct.connectionTypeCode
                      ? 'bg-dklok-blue text-white'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {ct.connectionTypeName}
                </div>
              ))}
            </div>
          </div>

          {/* Thread Type */}
          <div className="bg-white rounded-lg shadow-md p-3">
            <h2 className="text-sm font-semibold text-gray-700 mb-2">Thread Type</h2>
            {!selectedConnectionType ? (
              <div className="text-xs text-gray-500 py-2 text-center">
                Connection Type을 선택하세요.
              </div>
            ) : threadTypes.length === 0 ? (
              <div className="text-xs text-gray-500 py-2 text-center">
                Thread Type이 없습니다.
              </div>
            ) : (
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {threadTypes.map(tt => (
                  <div
                    key={tt.threadTypeCode}
                    onClick={() => {
                      setSelectedThreadType(tt)
                      handleCancel()
                    }}
                    className={`p-2 rounded cursor-pointer text-xs transition-all ${
                      selectedThreadType?.threadTypeCode === tt.threadTypeCode
                        ? 'bg-dklok-blue text-white'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {tt.threadTypeName}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Thread Spec */}
          <div className="bg-white rounded-lg shadow-md p-3">
            <h2 className="text-sm font-semibold text-gray-700 mb-2">Thread Spec</h2>
            {!selectedThreadType ? (
              <div className="text-xs text-gray-500 py-2 text-center">
                Thread Type을 선택하세요.
              </div>
            ) : threadSpecs.length === 0 ? (
              <div className="text-xs text-gray-500 py-2 text-center">
                Thread Spec이 없습니다.
              </div>
            ) : (
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {threadSpecs.map(ts => (
                  <div
                    key={ts.threadSpecCode}
                    onClick={() => {
                      setSelectedThreadSpec(ts)
                      handleCancel()
                    }}
                    className={`p-2 rounded cursor-pointer text-xs transition-all ${
                      selectedThreadSpec?.threadSpecCode === ts.threadSpecCode
                        ? 'bg-dklok-blue text-white'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {ts.threadSpecName}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Thread Size CRUD */}
        <div className="w-2/3 bg-white rounded-lg shadow-md p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700">
              Thread Size
              {selectedThreadSpec && (
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({selectedThreadSpec.threadSpecName})
                </span>
              )}
            </h2>
            {selectedThreadSpec && !isAdding && !editingItem && (
              <button
                onClick={handleAdd}
                className="px-4 py-2 bg-dklok-blue text-white rounded-lg hover:bg-dklok-light transition-colors"
              >
                + 추가
              </button>
            )}
          </div>

          {!selectedThreadSpec ? (
            <div className="text-center text-gray-500 py-12">
              왼쪽에서 Thread Spec을 선택하세요.
            </div>
          ) : loading ? (
            <div className="text-center text-gray-500 py-12">로딩 중...</div>
          ) : (
            <>
              {/* Add/Edit Form */}
              {(isAdding || editingItem) && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h3 className="font-medium text-gray-700 mb-3">
                    {isAdding ? '새 Thread Size 추가' : 'Thread Size 수정'}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block text-sm text-gray-600 mb-1">Thread Size Name</label>
                        <input
                          type="text"
                          value={formData.threadSizeName}
                          onChange={(e) => setFormData(prev => ({ ...prev, threadSizeName: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-dklok-light focus:border-transparent outline-none"
                          placeholder="예: 1/4 inch"
                        />
                      </div>
                      <div className="w-32">
                        <label className="block text-sm text-gray-600 mb-1">Degignator</label>
                        <input
                          type="text"
                          value={formData.degignator}
                          onChange={(e) => setFormData(prev => ({ ...prev, degignator: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-dklok-light focus:border-transparent outline-none"
                          placeholder="예: 4"
                        />
                      </div>
                      <div className="w-24">
                        <label className="block text-sm text-gray-600 mb-1">정렬</label>
                        <input
                          type="number"
                          value={formData.threadSizeOrd}
                          onChange={(e) => setFormData(prev => ({ ...prev, threadSizeOrd: parseInt(e.target.value) || 0 }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-dklok-light focus:border-transparent outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-dklok-blue text-white rounded-md hover:bg-dklok-light transition-colors"
                      >
                        저장
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Thread Size List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {threadSizes.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    등록된 Thread Size가 없습니다.
                  </div>
                ) : (
                  threadSizes.map(ts => (
                    <div
                      key={ts.threadSizeCode}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        editingItem?.threadSizeCode === ts.threadSizeCode
                          ? 'border-dklok-blue bg-blue-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div>
                        <div className="font-medium text-gray-800">{ts.threadSizeName}</div>
                        <div className="text-xs text-gray-500">
                          Code: {ts.threadSizeCode} | Degignator: {ts.degignator || '-'} | 순서: {ts.threadSizeOrd}
                        </div>
                      </div>
                      {!isAdding && !editingItem && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(ts)}
                            className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => handleDelete(ts)}
                            className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                          >
                            삭제
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
