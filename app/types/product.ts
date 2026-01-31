export interface Product {
    id: number
    name: string
    en_name?: string
    ar_name?: string
    slug: string
    price: number
    oldPrice?: number
    discount?: number
    image: string
    category?: string
    rating?: number
    reviewsCount?: number
    inStock?: boolean
    maxStock?: number
    isNew?: boolean
    isFeatured?: boolean
    quantity: number,
    brand:string,
    different:string,
    label?: string
    description?: string
    seo_description?: string
}

// Product Detail Types
export interface ProductCategory {
    id: number
    name: string
    slug: string
    description: string
    seo_description: string | null
    imageUrl: string
}

export interface ProductImage {
    id?: number
    url: string
    alt?: string
}

export interface ProductDetail {
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
    brand_id: number
    quantity: number
    rating: string
    imageUrl: string
    different: string
    ar_different: string
    en_different: string
    description: string
    seo_description: string
    categories: {
        data: ProductCategory[]
    }
    differents: {
        data: ProductDetail[]
    }
    accessories: {
        data: ProductDetail[]
    }
    related: {
        data: ProductDetail[]
    }
    images: {
        data: ProductImage[]
    }
}

export interface ProductDetailResponse {
    data: ProductDetail[]
    status: string
    message: string
}
