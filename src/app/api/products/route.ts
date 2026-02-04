import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

interface ProductRow {
  ProdSeries: string
  kind: string
  ProdSeriesName: string
  EndNum: number | null
  catalog_url: string | null
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const q = searchParams.get('q') || ''
  const category = searchParams.get('category')

  if (!q.trim()) {
    return NextResponse.json({ products: [] })
  }

  try {
    let sqlQuery = `
      SELECT TOP 100
        ProdSeries,
        kind,
        ProdSeriesName,
        EndNum,
        catalog_url
      FROM BK_ProductGroup
      WHERE ProdSeries LIKE @searchTerm OR ProdSeriesName LIKE @searchTerm
    `

    if (category === 'Fittings') {
      sqlQuery += ` AND kind = 'F'`
    } else if (category === 'Valves') {
      sqlQuery += ` AND kind = 'V'`
    }

    sqlQuery += ` ORDER BY ProdSeries`

    const params: Record<string, unknown> = {
      searchTerm: `%${q}%`,
    }

    const rows = await query<ProductRow>(sqlQuery, params)

    const products = rows.map((row) => ({
      productCode: row.ProdSeries,
      productName: row.ProdSeriesName,
      category: row.kind === 'F' ? 'Fittings' : 'Valves',
      endNum: row.EndNum,
      catalogUrl: row.catalog_url,
    }))

    return NextResponse.json({ products })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to search products', products: [] },
      { status: 500 }
    )
  }
}
