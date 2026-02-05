import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

interface ThreadType {
  threadTypeCode: number
  connectionTypeCode: number
  threadTypeName: string
  threadTypeOrd: number
}

// GET - 특정 Connection Type의 Thread Types 조회
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const connectionTypeCode = searchParams.get('connectionTypeCode')

  try {
    let sqlQuery = `
      SELECT threadTypeCode, connectionTypeCode, RTRIM(threadTypeName) as threadTypeName, threadTypeOrd
      FROM A_ThreadType
    `

    if (connectionTypeCode) {
      sqlQuery += ` WHERE connectionTypeCode = @connectionTypeCode`
    }

    sqlQuery += ` ORDER BY threadTypeOrd, threadTypeName`

    const params = connectionTypeCode ? { connectionTypeCode: parseInt(connectionTypeCode) } : {}
    const threadTypes = await query<ThreadType>(sqlQuery, params)

    return NextResponse.json({ threadTypes })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch thread types' },
      { status: 500 }
    )
  }
}

// POST - 새 Thread Type 추가
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { connectionTypeCode, threadTypeName, threadTypeOrd } = body

    if (!connectionTypeCode || !threadTypeName) {
      return NextResponse.json(
        { error: 'connectionTypeCode and threadTypeName are required' },
        { status: 400 }
      )
    }

    await query(`
      INSERT INTO A_ThreadType (connectionTypeCode, threadTypeName, threadTypeOrd)
      VALUES (@connectionTypeCode, @threadTypeName, @threadTypeOrd)
    `, {
      connectionTypeCode: parseInt(connectionTypeCode),
      threadTypeName,
      threadTypeOrd: threadTypeOrd || 0
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to create thread type' },
      { status: 500 }
    )
  }
}

// PUT - Thread Type 수정
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { threadTypeCode, connectionTypeCode, threadTypeName, threadTypeOrd } = body

    if (!threadTypeCode) {
      return NextResponse.json(
        { error: 'threadTypeCode is required' },
        { status: 400 }
      )
    }

    await query(`
      UPDATE A_ThreadType
      SET connectionTypeCode = @connectionTypeCode,
          threadTypeName = @threadTypeName,
          threadTypeOrd = @threadTypeOrd
      WHERE threadTypeCode = @threadTypeCode
    `, {
      threadTypeCode: parseInt(threadTypeCode),
      connectionTypeCode: parseInt(connectionTypeCode),
      threadTypeName,
      threadTypeOrd: threadTypeOrd || 0
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to update thread type' },
      { status: 500 }
    )
  }
}

// DELETE - Thread Type 삭제
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const threadTypeCode = searchParams.get('threadTypeCode')

    if (!threadTypeCode) {
      return NextResponse.json(
        { error: 'threadTypeCode is required' },
        { status: 400 }
      )
    }

    await query(`
      DELETE FROM A_ThreadType
      WHERE threadTypeCode = @threadTypeCode
    `, {
      threadTypeCode: parseInt(threadTypeCode)
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to delete thread type' },
      { status: 500 }
    )
  }
}
