import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

interface ThreadSize {
  threadSizeCode: number
  threadSpecCode: number
  threadSizeName: string
  degignator: string
  threadSizeOrd: number
}

// GET - 특정 Thread Spec의 Thread Sizes 조회
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const threadSpecCode = searchParams.get('threadSpecCode')

  try {
    let sqlQuery = `
      SELECT threadSizeCode, threadSpecCode, RTRIM(threadSizeName) as threadSizeName,
             RTRIM(degignator) as degignator, threadSizeOrd
      FROM A_ThreadSize
    `

    if (threadSpecCode) {
      sqlQuery += ` WHERE threadSpecCode = @threadSpecCode`
    }

    sqlQuery += ` ORDER BY threadSizeOrd, threadSizeName`

    const params = threadSpecCode ? { threadSpecCode: parseInt(threadSpecCode) } : {}
    const threadSizes = await query<ThreadSize>(sqlQuery, params)

    return NextResponse.json({ threadSizes })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch thread sizes' },
      { status: 500 }
    )
  }
}

// POST - 새 Thread Size 추가
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { threadSpecCode, threadSizeName, degignator, threadSizeOrd } = body

    if (!threadSpecCode || !threadSizeName) {
      return NextResponse.json(
        { error: 'threadSpecCode and threadSizeName are required' },
        { status: 400 }
      )
    }

    await query(`
      INSERT INTO A_ThreadSize (threadSpecCode, threadSizeName, degignator, threadSizeOrd)
      VALUES (@threadSpecCode, @threadSizeName, @degignator, @threadSizeOrd)
    `, {
      threadSpecCode: parseInt(threadSpecCode),
      threadSizeName,
      degignator: degignator || '',
      threadSizeOrd: threadSizeOrd || 0
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to create thread size' },
      { status: 500 }
    )
  }
}

// PUT - Thread Size 수정
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { threadSizeCode, threadSpecCode, threadSizeName, degignator, threadSizeOrd } = body

    if (!threadSizeCode) {
      return NextResponse.json(
        { error: 'threadSizeCode is required' },
        { status: 400 }
      )
    }

    await query(`
      UPDATE A_ThreadSize
      SET threadSpecCode = @threadSpecCode,
          threadSizeName = @threadSizeName,
          degignator = @degignator,
          threadSizeOrd = @threadSizeOrd
      WHERE threadSizeCode = @threadSizeCode
    `, {
      threadSizeCode: parseInt(threadSizeCode),
      threadSpecCode: parseInt(threadSpecCode),
      threadSizeName,
      degignator: degignator || '',
      threadSizeOrd: threadSizeOrd || 0
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to update thread size' },
      { status: 500 }
    )
  }
}

// DELETE - Thread Size 삭제
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const threadSizeCode = searchParams.get('threadSizeCode')

    if (!threadSizeCode) {
      return NextResponse.json(
        { error: 'threadSizeCode is required' },
        { status: 400 }
      )
    }

    await query(`
      DELETE FROM A_ThreadSize
      WHERE threadSizeCode = @threadSizeCode
    `, {
      threadSizeCode: parseInt(threadSizeCode)
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to delete thread size' },
      { status: 500 }
    )
  }
}
