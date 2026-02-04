export interface Product {
  productCode: string
  productName: string
  category: 'Fittings' | 'Valves'
  endNum?: number | null
  catalogUrl?: string | null
}
