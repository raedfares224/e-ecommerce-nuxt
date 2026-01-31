export interface CarouselResponse {
    data: string[]
    status: string
    message: string
}

export interface Brand {
    id: number
    name: string
    logo: string
    slug: string
}

export interface BrandsResponse {
    data: Brand[]
    status: string
    message: string
}

export interface TopCategory {
    id: number
    name: string
    slug: string
    image?: string
    imageUrl?: string
    products_count?: number
    products?: {
        data: Array<{ id: number }>
    }
    color?: string
}

export interface TopCategoriesResponse {
    data: TopCategory[] | { data: TopCategory[] }
    status: string
    message: string
}
