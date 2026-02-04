import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

interface ThreadSize {
  threadSizeCode: number
  threadSpecCode: number
  threadSizeName: string
  degignator: string
  threadSizeOrd: number
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const threadSpecCode = searchParams.get('threadSpecCode')

  if (!threadSpecCode) {
    return NextResponse.json({ threadSizes: [] })
  }

  try {
    const sizes = await query<ThreadSize>(`
      SELECT threadSizeCode, threadSpecCode, RTRIM(threadSizeName) as threadSizeName,
             RTRIM(degignator) as degignator, threadSizeOrd
      FROM A_ThreadSize
      WHERE threadSpecCode = @threadSpecCode
      ORDER BY threadSizeOrd, threadSizeName
    `, { threadSpecCode: parseInt(threadSpecCode) })

    return NextResponse.json({ threadSizes: sizes })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch thread sizes', threadSizes: [] },
      { status: 500 }
    )
  }
}
