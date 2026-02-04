import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

interface AttributeValueRow {
  attributeSubCode: string
  attributeSubName: string
  mark: string
  ord: number
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const attributeCode = searchParams.get('attributeCode')

  if (!attributeCode) {
    return NextResponse.json({ values: [] })
  }

  try {
    const values = await query<AttributeValueRow>(`
      SELECT
        attributeSubCode,
        RTRIM(LTRIM(attributeSubName)) as attributeSubName,
        RTRIM(LTRIM(mark)) as mark,
        ord
      FROM BK_AttributeSub
      WHERE attributeCode = @attributeCode
        AND isUse = 1
      ORDER BY ord
    `, { attributeCode })

    return NextResponse.json({ values })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch attribute values', values: [] },
      { status: 500 }
    )
  }
}
