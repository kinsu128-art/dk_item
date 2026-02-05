'use client'

import type { DecodedEnd } from '@/types/decoder'

interface DecodedEndDisplayProps {
  end: DecodedEnd
}

export default function DecodedEndDisplay({ end }: DecodedEndDisplayProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-dklok-blue">
      <h4 className="font-semibold text-dklok-blue mb-3">
        End {end.endNumber}: {end.degignator}
      </h4>
      <div className="space-y-2 text-sm">
        <div className="flex items-start gap-4">
          <span className="text-gray-600 w-32 flex-shrink-0">Connection:</span>
          <span className="text-gray-800">
            {end.connectionType.name}
          </span>
        </div>
        <div className="flex items-start gap-4">
          <span className="text-gray-600 w-32 flex-shrink-0">Thread Type:</span>
          <span className="text-gray-800">
            {end.threadType.name}
          </span>
        </div>
        <div className="flex items-start gap-4">
          <span className="text-gray-600 w-32 flex-shrink-0">Thread Spec:</span>
          <span className="text-gray-800">
            {end.threadSpec.name}
          </span>
        </div>
        <div className="flex items-start gap-4 pt-2 border-t border-gray-300">
          <span className="text-gray-600 w-32 flex-shrink-0">Thread Size:</span>
          <span className="text-gray-800 font-semibold">
            {end.threadSize.name}
          </span>
        </div>
      </div>
    </div>
  )
}
