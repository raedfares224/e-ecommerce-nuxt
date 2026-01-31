<template>
  <Dialog v-model:open="isOpen">
    <DialogContent class="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle class="text-xl">{{ $t('common.quickView') }}</DialogTitle>
      </DialogHeader>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-red-600">{{ error }}</p>
      </div>

      <!-- Product Content -->
      <div v-else-if="productData" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Left: Image -->
        <div class="space-y-3">
          <div class="aspect-square bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
            <img 
              :src="productData.imageUrl" 
              loading="lazy"
              decoding="async"
              :alt="productName"
              class="w-full h-full object-contain p-4"
            />
          </div>
        </div>

        <!-- Right: Product Info -->
        <div class="space-y-4">
          <!-- Category -->
          <p v-if="productData.categories?.data?.[0]" class="text-sm text-gray-500">
            {{ productData.categories.data[0].name }}
          </p>

          <!-- Product Name -->
          <h2 class="text-2xl font-bold text-gray-900">{{ productName }}</h2>

          <!-- Rating -->
          <div v-if="productData.rating" class="flex items-center gap-2">
            <div class="flex">
              <Star 
                v-for="i in 5" 
                :key="i"
                :class="i <= Number(productData.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'"
                class="w-4 h-4"
              />
            </div>
            <span class="text-sm text-gray-600">({{ productData.rating }})</span>
          </div>

          <!-- Price -->
          <div class="flex flex-col gap-1">
            <div class="flex items-center gap-3">
              <span class="text-3xl font-bold text-primary">
                {{
                  formatPrice(
                    Number(productData.price) - Number(productData.discount || 0)
                  )
                }}
              </span>
              <span
                v-if="productData.discount && Number(productData.discount) > 0"
                class="text-xl text-gray-400 line-through"
              >
                {{ formatPrice(Number(productData.price)) }}
              </span>
            </div>
            <span
              v-if="productData.discount && Number(productData.discount) > 0"
              class="inline-flex self-start items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-600"
            >
              -{{
                Math.floor(
                  (Number(productData.discount) / Number(productData.price)) *
                    100
                )
              }}%
            </span>
          </div>

          <!-- Stock Status -->
          <div class="flex items-center gap-2">
            <div 
              class="w-3 h-3 rounded-full"
              :class="productData.quantity > 0 ? 'bg-green-500' : 'bg-red-500'"
            ></div>
            <span 
              class="text-sm font-medium"
              :class="productData.quantity > 0 ? 'text-green-600' : 'text-red-600'"
            >
              {{ productData.quantity > 0 ? `${$t('product.inStock')} (${productData.quantity})` : $t('product.outOfStock') }}
            </span>
          </div>

          <!-- Variant (Different) -->
          <div v-if="productData.different" class="flex items-center gap-2 text-sm">
            <span class="text-gray-500">{{ $t('product.variants') || 'النوع' }}:</span>
            <span class="font-medium text-gray-900">
              {{ localeCookie === 'ar' ? productData.ar_different : productData.en_different }}
            </span>
          </div>

          <!-- Brand -->
          <div v-if="productData.brand" class="flex items-center gap-2 text-sm">
            <span class="text-gray-500">{{ $t('product.brand') || 'العلامة التجارية' }}:</span>
            <span class="font-medium text-gray-900">{{ productData.brand }}</span>
          </div>

          <!-- Description -->
          <div v-if="productData.description" class="border-t pt-4">
            <h3 class="font-semibold text-gray-900 mb-2">{{ $t('product.description') || 'الوصف' }}</h3>
            <p class="text-gray-600 text-sm line-clamp-6 whitespace-pre-line">{{ productData.description }}</p>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3 pt-4 border-t">
            <Button 
              @click="openCartDialog"
              class="flex-1"
              size="lg"
              :disabled="productData.quantity === 0"
            >
              <ShoppingCart class="w-5 h-5 mr-2" />
              {{ $t('common.addToCart') }}
            </Button>
            <Button 
              @click="viewFullDetails"
              variant="outline"
              size="lg"
            >
              <Eye class="w-5 h-5 mr-2" />
              {{ $t('product.viewDetails') || 'عرض التفاصيل' }}
            </Button>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { Star, Eye, ShoppingCart } from 'lucide-vue-next'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { api } from '~/api/useApi'

interface Props {
  productSlug: string | null
  open: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:open': [value: boolean]
  'open-cart-dialog': [product: any]
}>()

const { formatPrice } = useCurrency()
const router = useRouter()
const localeCookie = useCookie<'en' | 'ar'>('locale')

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value)
})

const loading = ref(false)
const error = ref<string | null>(null)
const productData = ref<any>(null)

// Computed
const productName = computed(() => {
  if (!productData.value) return ''
  return localeCookie.value === 'ar' ? productData.value.ar_name : productData.value.en_name
})

// Watch for slug changes
watch(() => props.productSlug, async (newSlug) => {
  if (newSlug && props.open) {
    await fetchProduct(newSlug)
  }
}, { immediate: true })

watch(() => props.open, async (isOpen) => {
  if (isOpen && props.productSlug) {
    await fetchProduct(props.productSlug)
  }
})

// Fetch product details
const fetchProduct = async (slug: string) => {
  loading.value = true
  error.value = null
  
  try {
    const { data, error: apiError } = await api<any>(`/products/${slug}`)
    
    if (apiError || !data) {
      error.value = 'Failed to load product details'
      return
    }
    
    if (data.status === 'success' && data.data && data.data.length > 0) {
      productData.value = data.data[0]
    } else {
      error.value = data.message || 'Product not found'
    }
  } catch (err) {
    console.error('Error fetching product:', err)
    error.value = 'An error occurred while loading the product'
  } finally {
    loading.value = false
  }
}

// Actions
const viewFullDetails = () => {
  if (productData.value?.slug) {
    router.push(`/products/${productData.value.slug}`)
    isOpen.value = false
  }
}

const openCartDialog = () => {
  if (productData.value) {
    emit('open-cart-dialog', productData.value)
    isOpen.value = false
  }
}
</script>
