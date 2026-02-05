// Decoded product information
export interface DecodedProduct {
  prodSeries: string
  prodSeriesName: string
  kind: string
  endNum: number
  catalogUrl: string | null
}

// Decoded material information
export interface DecodedMaterial {
  code: string
  name: string
}

// Thread size information
export interface ThreadSizeInfo {
  code: number
  name: string
}

// Thread spec information
export interface ThreadSpecInfo {
  code: number
  name: string
}

// Thread type information
export interface ThreadTypeInfo {
  code: number
  name: string
}

// Connection type information
export interface ConnectionTypeInfo {
  code: number
  name: string
}

// Decoded end connection information
export interface DecodedEnd {
  endNumber: number
  degignator: string
  threadSize: ThreadSizeInfo
  threadSpec: ThreadSpecInfo
  threadType: ThreadTypeInfo
  connectionType: ConnectionTypeInfo
}

// Decoded attribute information
export interface DecodedAttribute {
  mark: string
  attributeSubName: string
  attributeName: string
  ord: number
}

// Complete decode result
export interface DecodeResult {
  success: boolean
  inputCode: string
  product?: DecodedProduct
  material?: DecodedMaterial
  ends?: DecodedEnd[]
  attributes?: DecodedAttribute[]
  error?: string
  statusCode?: number
}
