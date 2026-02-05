import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

interface ThreadSpec {
  threadSpecCode: number
  threadTypeCode: number
  threadSpecName: string
  threadSpecOrd: number
}

// GET - 특정 Thread Type의 Thread Specs 조회
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const threadTypeCode = searchParams.get('threadTypeCode')

  try {
    let sqlQuery = `
      SELECT threadSpecCode, threadTypeCode, RTRIM(threadSpecName) as threadSpecName, threadSpecOrd
      FROM A_ThreadSpec
    `

    if (threadTypeCode) {
      sqlQuery += ` WHERE threadTypeCode = @threadTypeCode`
    }

    sqlQuery += ` ORDER BY threadSpecOrd, threadSpecName`

    const params = threadTypeCode ? { threadTypeCode: parseInt(threadTypeCode) } : {}
    const threadSpecs = await query<ThreadSpec>(sqlQuery, params)

    return NextResponse.json({ threadSpecs })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch thread specs' },
      { status: 500 }
    )
  }
}

// POST - 새 Thread Spec 추가
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { threadTypeCode, threadSpecName, threadSpecOrd } = body

    if (!threadTypeCode || !threadSpecName) {
      return NextResponse.json(
        { error: 'threadTypeCode and threadSpecName are required' },
        { status: 400 }
      )
    }

    await query(`
      INSERT INTO A_ThreadSpec (threadTypeCode, threadSpecName, threadSpecOrd)
      VALUES (@threadTypeCode, @threadSpecName, @threadSpecOrd)
    `, {
      threadTypeCode: parseInt(threadTypeCode),
      threadSpecName,
      threadSpecOrd: threadSpecOrd || 0
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to create thread spec' },
      { status: 500 }
    )
  }
}

// PUT - Thread Spec 수정
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { threadSpecCode, threadTypeCode, threadSpecName, threadSpecOrd } = body

    if (!threadSpecCode) {
      return NextResponse.json(
        { error: 'threadSpecCode is required' },
        { status: 400 }
      )
    }

    await query(`
      UPDATE A_ThreadSpec
      SET threadTypeCode = @threadTypeCode,
          threadSpecName = @threadSpecName,
          threadSpecOrd = @threadSpecOrd
      WHERE threadSpecCode = @threadSpecCode
    `, {
      threadSpecCode: parseInt(threadSpecCode),
      threadTypeCode: parseInt(threadTypeCode),
      threadSpecName,
      threadSpecOrd: threadSpecOrd || 0
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to update thread spec' },
      { status: 500 }
    )
  }
}

// DELETE - Thread Spec 삭제
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const threadSpecCode = searchParams.get('threadSpecCode')

    if (!threadSpecCode) {
      return NextResponse.json(
        { error: 'threadSpecCode is required' },
        { status: 400 }
      )
    }

    await query(`
      DELETE FROM A_ThreadSpec
      WHERE threadSpecCode = @threadSpecCode
    `, {
      threadSpecCode: parseInt(threadSpecCode)
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to delete thread spec' },
      { status: 500 }
    )
  }
}
