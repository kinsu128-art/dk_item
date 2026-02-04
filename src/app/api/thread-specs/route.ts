import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

interface ThreadSpec {
  threadSpecCode: number
  threadTypeCode: number
  threadSpecName: string
  threadSpecOrd: number
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const threadTypeCode = searchParams.get('threadTypeCode')

  if (!threadTypeCode) {
    return NextResponse.json({ threadSpecs: [] })
  }

  try {
    const specs = await query<ThreadSpec>(`
      SELECT threadSpecCode, threadTypeCode, RTRIM(threadSpecName) as threadSpecName, threadSpecOrd
      FROM A_ThreadSpec
      WHERE threadTypeCode = @threadTypeCode
      ORDER BY threadSpecOrd, threadSpecName
    `, { threadTypeCode: parseInt(threadTypeCode) })

    return NextResponse.json({ threadSpecs: specs })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch thread specs', threadSpecs: [] },
      { status: 500 }
    )
  }
}
