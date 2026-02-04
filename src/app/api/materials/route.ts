import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

interface Material {
  MaterialGroup_cd: string
  MaterialGroup_nm: string
  ord: number
}

export async function GET() {
  try {
    const materials = await query<Material>(`
      SELECT MaterialGroup_cd, RTRIM(LTRIM(REPLACE(REPLACE(MaterialGroup_nm, CHAR(13), ''), CHAR(10), ''))) as MaterialGroup_nm, ord
      FROM b_MaterialGroup
      ORDER BY ord
    `)

    return NextResponse.json({ materials })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch materials', materials: [] },
      { status: 500 }
    )
  }
}
