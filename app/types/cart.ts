export interface CartItem {
  id: number
  slug: string
  name: string
  en_name?: string
  ar_name?: string
  price: number
  quantity: number
  image: string
  maxStock: number
  accessories?: number[] | any[]
  different?: string
}

export interface Cart {
  items: CartItem[]
  total: number
  itemCount: number
}

export interface WishlistItem {
  id: number
  slug: string
  name: string
  en_name?: string
  ar_name?: string
  price: number
  image: string
  inStock: boolean
  brand?: string
  brand_id?: number
  rating?: string
  description?: string
  categories?: {
    data: Array<{
      id: number
      name: string
      slug: string
    }>
  }
  different?: string
  ar_different?: string
  en_different?: string
  discount?: number
  calculated_price?: number
  quantity?: number
  label?: string
  accessories?: {
    data: Array<{
      id: number
      name: string
      ar_name: string
      en_name: string
      is_required: string
      group_id: number
      group: string
      qty: number
      price: string
      discount: string
    }>
  }
  images?: {
    data: string[]
  }
}
