
export interface Product {
  id: string
  name: string
  ar_name: string
  en_name: string
  slug: string
  price: string
  calculated_price: string
  discount: number
  label: string
  brand: string
  brand_id: number | string
  quantity: number
  rating: string
  imageUrl: string
  different: string
  ar_different: string
  en_different: string
  description: string
  seo_description: string
}

export interface Featured {
  id: number
  name: string
  slug: string
  description: string
  seo_description: string | null
  imageUrl: string
  products: {
    data: Product[]
  }
}

export interface FeaturedsResponse {
  data: Featured[]
  status: string
  message: string
}
