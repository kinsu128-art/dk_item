import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

interface AttributeRow {
  attributeCode: string
  attributeName: string
  ord: number
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const prodSeries = searchParams.get('prodSeries')

  if (!prodSeries) {
    return NextResponse.json({ attributes: [] })
  }

  try {
    const attributes = await query<AttributeRow>(`
      SELECT
        pgs.attributeCode,
        RTRIM(LTRIM(REPLACE(REPLACE(a.attributeName, CHAR(13), ''), CHAR(10), ''))) as attributeName,
        a.ord
      FROM BK_ProductGroupSub pgs
      INNER JOIN BK_Attribute a ON pgs.attributeCode = a.atrributeCode
      WHERE pgs.ProdSeries = @prodSeries
        AND pgs.isUse = 1
        AND a.isUse = 1
      ORDER BY a.ord
    `, { prodSeries })

    return NextResponse.json({ attributes })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch attributes', attributes: [] },
      { status: 500 }
    )
  }
}
