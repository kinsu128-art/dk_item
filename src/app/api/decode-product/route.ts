import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import type { DecodeResult, DecodedProduct, DecodedMaterial, DecodedEnd, DecodedAttribute } from '@/types/decoder'

interface ProductRow {
  ProdSeries: string
  ProdSeriesName: string
  kind: string
  EndNum: number
  catalog_url: string | null
}

interface MaterialRow {
  MaterialGroup_cd: string
  MaterialGroup_nm: string
}

interface ThreadHierarchyRow {
  threadSizeCode: number
  threadSizeName: string
  degignator: string
  threadSpecCode: number
  threadSpecName: string
  threadTypeCode: number
  threadTypeName: string
  connectionTypeCode: number
  connectionTypeName: string
}

interface AttributeRow {
  mark: string
  attributeSubName: string
  attributeCode: string
  attributeName: string
  ord: number
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.json(
      { success: false, inputCode: '', error: 'Product code is required', statusCode: 400 },
      { status: 400 }
    )
  }

  try {
    // Validate input format
    const sanitizedCode = code.toUpperCase().trim()
    if (!/^[A-Z0-9.-]+$/.test(sanitizedCode)) {
      return NextResponse.json(
        {
          success: false,
          inputCode: code,
          error: 'Invalid product code format. Only uppercase letters, numbers, hyphens, and periods are allowed.',
          statusCode: 400
        },
        { status: 400 }
      )
    }

    if (sanitizedCode.length > 100) {
      return NextResponse.json(
        { success: false, inputCode: code, error: 'Product code is too long (max 100 characters)', statusCode: 400 },
        { status: 400 }
      )
    }

    // Parse product code
    const parts = sanitizedCode.split('-')
    if (parts.length < 3) {
      return NextResponse.json(
        {
          success: false,
          inputCode: code,
          error: 'Invalid product code format. Expected: SERIES-END-MATERIAL_A',
          statusCode: 400
        },
        { status: 400 }
      )
    }

    // Extract material code (last part, remove 'A' suffix)
    const lastPart = parts[parts.length - 1]
    if (!lastPart.endsWith('A')) {
      return NextResponse.json(
        {
          success: false,
          inputCode: code,
          error: 'Product code must end with material code followed by "A" (e.g., "SA", "SSA")',
          statusCode: 400
        },
        { status: 400 }
      )
    }
    const materialCode = lastPart.slice(0, -1)

    // Extract product series
    const prodSeries = parts[0]

    // Remove material from parts for further processing
    const withoutMaterial = parts.slice(0, -1)

    // Query database to get product info and EndNum
    const products = await query<ProductRow>(
      `SELECT ProdSeries, ProdSeriesName, kind, EndNum, catalog_url
       FROM BK_ProductGroup
       WHERE ProdSeries = @prodSeries`,
      { prodSeries }
    )

    if (products.length === 0) {
      return NextResponse.json(
        {
          success: false,
          inputCode: code,
          error: `Product series "${prodSeries}" not found in database`,
          statusCode: 404
        },
        { status: 404 }
      )
    }

    const product = products[0]
    const endNum = product.EndNum

    // Extract ends (next EndNum parts after product series)
    const endDesignators = withoutMaterial.slice(1, 1 + endNum)

    if (endDesignators.length !== endNum) {
      return NextResponse.json(
        {
          success: false,
          inputCode: code,
          error: `Invalid number of end designators. Expected ${endNum}, got ${endDesignators.length}`,
          statusCode: 400
        },
        { status: 400 }
      )
    }

    // Remaining parts are attribute marks
    const attributeMarks = withoutMaterial.slice(1 + endNum)

    // Query material information
    const materials = await query<MaterialRow>(
      `SELECT MaterialGroup_cd, MaterialGroup_nm
       FROM b_MaterialGroup
       WHERE MaterialGroup_cd = @materialCode`,
      { materialCode }
    )

    if (materials.length === 0) {
      return NextResponse.json(
        {
          success: false,
          inputCode: code,
          error: `Material code "${materialCode}" not found in database`,
          statusCode: 422
        },
        { status: 422 }
      )
    }

    const material = materials[0]

    // Query thread hierarchy for each end designator
    const decodedEnds: DecodedEnd[] = []

    for (let i = 0; i < endDesignators.length; i++) {
      const designator = endDesignators[i]

      const threadHierarchy = await query<ThreadHierarchyRow>(
        `SELECT ts.threadSizeCode, RTRIM(ts.threadSizeName) as threadSizeName,
                ts.degignator, ts.threadSpecCode,
                tsp.threadSpecName, tsp.threadTypeCode,
                tt.threadTypeName, tt.connectionTypeCode,
                ct.connectionTypeName
         FROM A_ThreadSize ts
         INNER JOIN A_ThreadSpec tsp ON ts.threadSpecCode = tsp.threadSpecCode
         INNER JOIN A_ThreadType tt ON tsp.threadTypeCode = tt.threadTypeCode
         INNER JOIN A_ConnectionType ct ON tt.connectionTypeCode = ct.connectionTypeCode
         WHERE RTRIM(ts.degignator) = @designator`,
        { designator }
      )

      if (threadHierarchy.length === 0) {
        return NextResponse.json(
          {
            success: false,
            inputCode: code,
            error: `End designator "${designator}" (End ${i + 1}) not found in database`,
            statusCode: 422
          },
          { status: 422 }
        )
      }

      const threadInfo = threadHierarchy[0]

      decodedEnds.push({
        endNumber: i + 1,
        degignator: threadInfo.degignator,
        threadSize: {
          code: threadInfo.threadSizeCode,
          name: threadInfo.threadSizeName
        },
        threadSpec: {
          code: threadInfo.threadSpecCode,
          name: threadInfo.threadSpecName
        },
        threadType: {
          code: threadInfo.threadTypeCode,
          name: threadInfo.threadTypeName
        },
        connectionType: {
          code: threadInfo.connectionTypeCode,
          name: threadInfo.connectionTypeName
        }
      })
    }

    // Query attribute information for each mark
    const decodedAttributes: DecodedAttribute[] = []

    if (attributeMarks.length > 0) {
      for (const mark of attributeMarks) {
        const attributes = await query<AttributeRow>(
          `SELECT asub.mark, RTRIM(LTRIM(asub.attributeSubName)) as attributeSubName,
                  asub.attributeCode, RTRIM(LTRIM(a.attributeName)) as attributeName, a.ord
           FROM BK_AttributeSub asub
           INNER JOIN BK_Attribute a ON asub.attributeCode = a.atrributeCode
           WHERE RTRIM(LTRIM(asub.mark)) = @mark
             AND asub.isUse = 1
             AND a.isUse = 1`,
          { mark }
        )

        if (attributes.length === 0) {
          // Warn but continue - attribute mark not found
          console.warn(`Attribute mark "${mark}" not found in database`)
          continue
        }

        decodedAttributes.push({
          mark: attributes[0].mark,
          attributeSubName: attributes[0].attributeSubName,
          attributeName: attributes[0].attributeName,
          ord: attributes[0].ord
        })
      }

      // Sort attributes by ord column
      decodedAttributes.sort((a, b) => a.ord - b.ord)
    }

    // Return successful response
    return NextResponse.json({
      success: true,
      inputCode: sanitizedCode,
      product: {
        prodSeries: product.ProdSeries,
        prodSeriesName: product.ProdSeriesName,
        kind: product.kind,
        endNum: product.EndNum,
        catalogUrl: product.catalog_url
      },
      material: {
        code: material.MaterialGroup_cd,
        name: material.MaterialGroup_nm
      },
      ends: decodedEnds,
      attributes: decodedAttributes
    } as DecodeResult)
  } catch (error) {
    console.error('Decode error:', error)
    return NextResponse.json(
      {
        success: false,
        inputCode: code || '',
        error: 'An error occurred while decoding the product code',
        statusCode: 500
      },
      { status: 500 }
    )
  }
}
