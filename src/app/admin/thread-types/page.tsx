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
  threadTypeOrd: number
}

export default function ThreadTypeManagementPage() {
  const [connectionTypes, setConnectionTypes] = useState<ConnectionType[]>([])
  const [selectedConnectionType, setSelectedConnectionType] = useState<ConnectionType | null>(null)
  const [threadTypes, setThreadTypes] = useState<ThreadType[]>([])
  const [loading, setLoading] = useState(false)

  // Form state
  const [editingItem, setEditingItem] = useState<ThreadType | null>(null)
  const [formData, setFormData] = useState({
    threadTypeName: '',
    threadTypeOrd: 0
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
      return
    }

    setLoading(true)
    fetch(`/api/admin/thread-types?connectionTypeCode=${selectedConnectionType.connectionTypeCode}`)
      .then(res => res.json())
      .then(data => setThreadTypes(data.threadTypes || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [selectedConnectionType])

  const handleAdd = () => {
    setIsAdding(true)
    setEditingItem(null)
    setFormData({ threadTypeName: '', threadTypeOrd: 0 })
  }

  const handleEdit = (item: ThreadType) => {
    setEditingItem(item)
    setIsAdding(false)
    setFormData({
      threadTypeName: item.threadTypeName,
      threadTypeOrd: item.threadTypeOrd
    })
  }

  const handleCancel = () => {
    setEditingItem(null)
    setIsAdding(false)
    setFormData({ threadTypeName: '', threadTypeOrd: 0 })
  }

  const handleSave = async () => {
    if (!selectedConnectionType || !formData.threadTypeName.trim()) return

    try {
      if (isAdding) {
        // Create new
        const res = await fetch('/api/admin/thread-types', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            connectionTypeCode: selectedConnectionType.connectionTypeCode,
            threadTypeName: formData.threadTypeName,
            threadTypeOrd: formData.threadTypeOrd
          })
        })

        if (!res.ok) throw new Error('Failed to create')
      } else if (editingItem) {
        // Update existing
        const res = await fetch('/api/admin/thread-types', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            threadTypeCode: editingItem.threadTypeCode,
            connectionTypeCode: selectedConnectionType.connectionTypeCode,
            threadTypeName: formData.threadTypeName,
            threadTypeOrd: formData.threadTypeOrd
          })
        })

        if (!res.ok) throw new Error('Failed to update')
      }

      // Refresh list
      const res = await fetch(`/api/admin/thread-types?connectionTypeCode=${selectedConnectionType.connectionTypeCode}`)
      const data = await res.json()
      setThreadTypes(data.threadTypes || [])

      handleCancel()
    } catch (error) {
      console.error('Save error:', error)
      alert('저장에 실패했습니다.')
    }
  }

  const handleDelete = async (item: ThreadType) => {
    if (!confirm(`"${item.threadTypeName}"을(를) 삭제하시겠습니까?`)) return

    try {
      const res = await fetch(`/api/admin/thread-types?threadTypeCode=${item.threadTypeCode}`, {
        method: 'DELETE'
      })

      if (!res.ok) throw new Error('Failed to delete')

      // Refresh list
      setThreadTypes(prev => prev.filter(t => t.threadTypeCode !== item.threadTypeCode))
    } catch (error) {
      console.error('Delete error:', error)
      alert('삭제에 실패했습니다.')
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">코드 관리</h1>

      {/* Navigation Tabs */}
      <div className="flex gap-2 mb-6">
        <span className="px-4 py-2 bg-dklok-blue text-white rounded-t-lg font-medium">
          Thread Type
        </span>
        <Link
          href="/admin/thread-specs"
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-t-lg hover:bg-gray-300 transition-colors"
        >
          Thread Spec
        </Link>
        <Link
          href="/admin/thread-sizes"
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-t-lg hover:bg-gray-300 transition-colors"
        >
          Thread Size
        </Link>
      </div>

      <div className="flex gap-6">
        {/* Left: Connection Type List */}
        <div className="w-1/3 bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Connection Type</h2>
          <div className="space-y-2">
            {connectionTypes.map(ct => (
              <div
                key={ct.connectionTypeCode}
                onClick={() => {
                  setSelectedConnectionType(ct)
                  handleCancel()
                }}
                className={`p-3 rounded-lg cursor-pointer transition-all ${
                  selectedConnectionType?.connectionTypeCode === ct.connectionTypeCode
                    ? 'bg-dklok-blue text-white'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                }`}
              >
                <div className="font-medium">{ct.connectionTypeName}</div>
                <div className="text-xs opacity-70">Code: {ct.connectionTypeCode}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Thread Type CRUD */}
        <div className="w-2/3 bg-white rounded-lg shadow-md p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700">
              Thread Type
              {selectedConnectionType && (
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({selectedConnectionType.connectionTypeName})
                </span>
              )}
            </h2>
            {selectedConnectionType && !isAdding && !editingItem && (
              <button
                onClick={handleAdd}
                className="px-4 py-2 bg-dklok-blue text-white rounded-lg hover:bg-dklok-light transition-colors"
              >
                + 추가
              </button>
            )}
          </div>

          {!selectedConnectionType ? (
            <div className="text-center text-gray-500 py-12">
              왼쪽에서 Connection Type을 선택하세요.
            </div>
          ) : loading ? (
            <div className="text-center text-gray-500 py-12">로딩 중...</div>
          ) : (
            <>
              {/* Add/Edit Form */}
              {(isAdding || editingItem) && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h3 className="font-medium text-gray-700 mb-3">
                    {isAdding ? '새 Thread Type 추가' : 'Thread Type 수정'}
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Thread Type Name</label>
                      <input
                        type="text"
                        value={formData.threadTypeName}
                        onChange={(e) => setFormData(prev => ({ ...prev, threadTypeName: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-dklok-light focus:border-transparent outline-none"
                        placeholder="예: NPT Male Thread"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">정렬 순서</label>
                      <input
                        type="number"
                        value={formData.threadTypeOrd}
                        onChange={(e) => setFormData(prev => ({ ...prev, threadTypeOrd: parseInt(e.target.value) || 0 }))}
                        className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-dklok-light focus:border-transparent outline-none"
                      />
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

              {/* Thread Type List */}
              <div className="space-y-2">
                {threadTypes.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    등록된 Thread Type이 없습니다.
                  </div>
                ) : (
                  threadTypes.map(tt => (
                    <div
                      key={tt.threadTypeCode}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        editingItem?.threadTypeCode === tt.threadTypeCode
                          ? 'border-dklok-blue bg-blue-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div>
                        <div className="font-medium text-gray-800">{tt.threadTypeName}</div>
                        <div className="text-xs text-gray-500">
                          Code: {tt.threadTypeCode} | 순서: {tt.threadTypeOrd}
                        </div>
                      </div>
                      {!isAdding && !editingItem && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(tt)}
                            className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => handleDelete(tt)}
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
