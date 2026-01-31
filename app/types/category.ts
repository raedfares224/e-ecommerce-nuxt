export interface Category {
    id: number
    name: string
    slug: string
    image: string
    itemsCount: number
    color: string
}

export interface CategoryResponse {
    data: Category[]
}

// Category Detail Types
export interface SubCategory {
    id: number
    name: string
    slug: string
    description: string | null
    seo_description: string | null
    imageUrl: string
}

export interface CategoryDetail {
    id: number
    name: string
    slug: string
    description: string | null
    seo_description: string | null
    imageUrl: string
    sub_categories: {
        data: SubCategory[]
    }
}

export interface CategoryDetailResponse {
    data: CategoryDetail[]
    status: string
    message: string
}

// Product Types for Category Page
export interface CategoryProduct {
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
    differents: {
        data: any[]
    }
    related: {
        data: any[]
    }
    images: {
        data: string[]
    }
}

export interface CategoryProductsResponse {
    data: CategoryProduct[]
    links: {
        first: string
        last: string
        prev: string | null
        next: string | null
    }
    meta: {
        current_page: number
        from: number
        last_page: number
        links: Array<{
            url: string | null
            label: string
            active: boolean
        }>
        path: string
        per_page: number
        to: number
        total: number
    }
    status: string
    message: string
}

// Filter Types
export interface FilterCategory {
    id: number
    name: string
    slug: string
    description: string | null
    seo_description: string | null
    imageUrl: string
    count?: number
    sub_categories: {
        data: SubCategory[]
    }
}

export interface FilterBrand {
    id: string
    name: string
    slug: string
    description: string | null
    seo_description: string | null
    imageUrl: string
    count?: number
}

export interface CategoryFiltersResponse {
    data: FilterCategory[]
    status: string
    message: string
}

export interface BrandFiltersResponse {
    data: FilterBrand[]
    status: string
    message: string
}

// Top Rated Product Type
export interface TopRatedProduct {
    id: number
    name: string
    slug: string
    price: number
    sale_price?: number
    image: string
    rating: number
    reviews_count: number
}
