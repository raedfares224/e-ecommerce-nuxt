// ~/composables/useCategory.ts
import { computed } from 'vue'
import type {
  CategoryDetail,
  CategoryDetailResponse,
  CategoryProduct,
  CategoryProductsResponse,
  FilterCategory,
  FilterBrand,
  CategoryFiltersResponse,
  BrandFiltersResponse,
  TopRatedProduct
} from '~/types/category'

export const useCategory = () => {
  const { get } = useApi()

  // State - Using useState to persist data across page refreshes
  const category = useState<CategoryDetail | null>('category-detail', () => null)
  const products = useState<CategoryProduct[]>('category-products', () => [])
  const topRatedProducts = useState<TopRatedProduct[]>('category-top-rated', () => [])
  const filterCategories = useState<FilterCategory[]>('category-filters', () => [])
  const filterBrands = useState<FilterBrand[]>('category-brands', () => [])
  
  const loading = useState<boolean>('category-loading', () => false)
  const productsLoading = useState<boolean>('category-products-loading', () => false)
  const error = useState<string | null>('category-error', () => null)
  
  // Pagination
  const currentPage = useState<number>('category-current-page', () => 1)
  const lastPage = useState<number>('category-last-page', () => 1)
  const perPage = useState<number>('category-per-page', () => 12)
  const total = useState<number>('category-total', () => 0)

  // Computed
  const hasProducts = computed(() => products.value.length > 0)
  const hasMorePages = computed(() => currentPage.value < lastPage.value)
  const totalResults = computed(() => total.value)

  /**
   * Fetch category details
   */
  const fetchCategoryDetails = async (slug: string) => {
    try {
      loading.value = true
      error.value = null

      const response = await get<CategoryDetailResponse>(`/categories/${slug}`, {
        page: 1
      })

      // API returns an array, get the first item
      if (response && response.data && Array.isArray(response.data)) {
        category.value = response.data[0] || null
      } else {
        category.value = null
        console.warn('Category details response is empty or invalid')
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to load category details'
      console.error('Error fetching category details:', err)
      category.value = null
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetch category products with filters
   */
  const fetchCategoryProducts = async (
    slug: string,
    page: number = 1,
    queryParams: Record<string, any> = {},
    search: string = ''
  ) => {
    try {
      productsLoading.value = true
      error.value = null

      const response = await get<CategoryProductsResponse>(
        `/categories/${slug}/products`,
        {
          page,
          ...queryParams,
          search
        }
      )

      if (response && response.data) {
        products.value = response.data || []
        currentPage.value = response.meta?.current_page || 1
        lastPage.value = response.meta?.last_page || 1
        perPage.value = response.meta?.per_page || 12
        total.value = response.meta?.total || 0
      } else {
        products.value = []
        console.warn('Category products response is empty or invalid')
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to load products'
      console.error('Error fetching category products:', err)
      products.value = []
    } finally {
      productsLoading.value = false
    }
  }

  /**
   * Fetch filter categories
   */
  const fetchFilterCategories = async () => {
    try {
      const response = await get<CategoryFiltersResponse>('/categories-filter', {
        filter: 1
      })

      if (response && response.data) {
        filterCategories.value = response.data || []
      } else {
        filterCategories.value = []
        console.warn('Filter categories response is empty')
      }
    } catch (err: any) {
      console.error('Error fetching filter categories:', err)
      filterCategories.value = []
    }
  }

  /**
   * Fetch filter brands
   */
  const fetchFilterBrands = async () => {
    try {
      const response = await get<BrandFiltersResponse>('/brands-filter', {
        filter: 1
      })

      if (response && response.data) {
        filterBrands.value = response.data || []
      } else {
        filterBrands.value = []
        console.warn('Filter brands response is empty')
      }
    } catch (err: any) {
      console.error('Error fetching filter brands:', err)
      filterBrands.value = []
    }
  }

  /**
   * Load all category data
   */
  const loadCategoryPage = async (
    slug: string,
    page: number = 1,
    queryParams: Record<string, any> = {},
    search: string = ''
  ) => {
    await Promise.all([
      fetchCategoryDetails(slug),
      fetchCategoryProducts(slug, page, queryParams, search),
      fetchFilterCategories(),
      fetchFilterBrands()
    ])
  }

  /**
   * Change page
   */
  const changePage = async (slug: string, page: number, queryParams: Record<string, any> = {}, search: string = '') => {
    await fetchCategoryProducts(slug, page, queryParams, search)
    
    // Scroll to top
    if (import.meta.client) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  /**
   * Clear all data
   */
  const clearCategoryData = () => {
    category.value = null
    products.value = []
    topRatedProducts.value = []
    filterCategories.value = []
    filterBrands.value = []
    currentPage.value = 1
    lastPage.value = 1
    total.value = 0
    error.value = null
  }

  return {
    // State
    category,
    products,
    topRatedProducts,
    filterCategories,
    filterBrands,
    loading,
    productsLoading,
    error,
    
    // Pagination
    currentPage,
    lastPage,
    perPage,
    total,
    
    // Computed
    hasProducts,
    hasMorePages,
    totalResults,
    
    // Methods
    fetchCategoryDetails,
    fetchCategoryProducts,
    fetchFilterCategories,
    fetchFilterBrands,
    loadCategoryPage,
    changePage,
    clearCategoryData
  }
}
