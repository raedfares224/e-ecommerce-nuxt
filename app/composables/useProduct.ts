import { api } from '~/api/useApi'
import type { ProductDetail, ProductDetailResponse } from '~/types/product'

export const useProduct = () => {
  const product = ref<ProductDetail | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchProduct = async (slug: string) => {
    loading.value = true
    error.value = null
    
    try {
      const { data: response, error: apiError } = await api<ProductDetailResponse>(`/products/${slug}`)
      
      if (apiError) {
        error.value = apiError.message || 'Failed to fetch product'
        return
      }
      
      if (response && response.status === 'success' && response.data.length > 0) {
        product.value = response.data[0]
      } else {
        error.value = 'Product not found'
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch product'
      console.error('Error fetching product:', err)
    } finally {
      loading.value = false
    }
  }

  const clearProduct = () => {
    product.value = null
    error.value = null
  }

  return {
    product,
    loading,
    error,
    fetchProduct,
    clearProduct
  }
}
