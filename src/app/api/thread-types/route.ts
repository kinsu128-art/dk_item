import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

interface ThreadType {
  threadTypeCode: number
  connectionTypeCode: number
  threadTypeName: string
  threadTypeOrd: number
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const connectionTypeCode = searchParams.get('connectionTypeCode')

  if (!connectionTypeCode) {
    return NextResponse.json({ threadTypes: [] })
  }

  try {
    const types = await query<ThreadType>(`
      SELECT threadTypeCode, connectionTypeCode, RTRIM(threadTypeName) as threadTypeName, threadTypeOrd
      FROM A_ThreadType
      WHERE connectionTypeCode = @connectionTypeCode
      ORDER BY threadTypeOrd, threadTypeName
    `, { connectionTypeCode: parseInt(connectionTypeCode) })

    return NextResponse.json({ threadTypes: types })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch thread types', threadTypes: [] },
      { status: 500 }
    )
  }
}
