import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

interface ConnectionType {
  connectionTypeCode: number
  connectionTypeName: string
  connectionTyeOrd: number
}

export async function GET() {
  try {
    const types = await query<ConnectionType>(`
      SELECT connectionTypeCode, RTRIM(connectionTypeName) as connectionTypeName, connectionTyeOrd
      FROM A_ConnectionType
      ORDER BY connectionTyeOrd
    `)

    return NextResponse.json({ connectionTypes: types })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch connection types', connectionTypes: [] },
      { status: 500 }
    )
  }
}
