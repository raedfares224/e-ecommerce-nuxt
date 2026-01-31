<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 md:py-12">
        <div class="container mx-auto px-4">
            <!-- Header -->
            <div class="mb-8">
                <div class="flex items-center justify-between">
                    <div>
                        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                            {{ $t('nav.wishlist') }}
                        </h1>
                        <p class="text-gray-600 dark:text-gray-400">
                            {{ cart?.wishlistCount.value }} {{ $t('product.items') }}
                        </p>
                    </div>
                    <Button 
                        v-if="cart?.wishlistCount.value > 0"
                        @click="clearAllWishlist"
                        variant="outline"
                        size="lg"
                        class="gap-2"
                    >
                        <Trash2 class="w-4 h-4" />
                        {{ $t('common.clearAll') }}
                    </Button>
                </div>
            </div>

            <!-- Loading State -->
              <BaseLoading v-if="isLoading" />

            <!-- Empty State -->
            <div v-else-if="cart?.wishlistCount.value === 0" class="text-center py-16">
                <div class="flex justify-center mb-6">
                    <div class="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                        <Heart class="w-12 h-12 text-gray-400" />
                    </div>
                </div>
                <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                    {{ $t('wishlist.empty') }}
                </h2>
                <p class="text-gray-600 dark:text-gray-400 mb-6">
                    {{ $t('wishlist.emptyDescription') }}
                </p>
                <Button @click="navigateTo('/')" size="lg" class="gap-2">
                    <ShoppingBag class="w-5 h-5" />
                    {{ $t('common.continueShopping') }}
                </Button>
            </div>

            <!-- Wishlist Items -->
            <div v-else class="space-y-4">
                <Card 
                    v-for="item in paginatedWishlistItems" 
                    :key="item?.id"
                    class="overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                    <CardContent class="p-0">
                        <div class="flex flex-col md:flex-row gap-4 md:gap-6 p-4 md:p-6">
                            <!-- Product Image with Gallery -->
                            <div class="relative w-full md:w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden shrink-0">
                                <NuxtLink :to="`/products/${item.slug}`">
                                    <img 
                                        :src="item?.image" 
                                        :alt="item?.name"
                                        class="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                                    />
                                </NuxtLink>
                                
                                <!-- Multiple Images Indicator -->
                                <div 
                                    v-if="item?.images?.data?.length > 1"
                                    class="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full"
                                >
                                    +{{ item.images.data.length - 1 }}
                                </div>
                                
                                <!-- Product Label -->
                                <div 
                                    v-if="item?.label"
                                    class="absolute top-2 left-2 bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full"
                                >
                                    {{ item.label }}
                                </div>
                                
                                <!-- Stock Badge -->
                                <div 
                                    v-if="item?.inStock"
                                    class="absolute bottom-2 left-2 bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full"
                                >
                                    {{ $t('product.inStock') }}
                                </div>
                                <div 
                                    v-else
                                    class="absolute bottom-2 left-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full"
                                >
                                    {{ $t('product.outOfStock') }}
                                </div>
                            </div>

                            <!-- Product Info -->
                            <div class="flex-1 min-w-0">
                                <NuxtLink :to="`/products/${item.slug}`">
                                    <h3 class="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2 hover:text-primary transition-colors line-clamp-2 flex flex-wrap items-center gap-1">
                                        <span>{{ item?.name }}</span>
                                        <span
                                            v-if="item?.different"
                                            class="text-base font-semibold text-primary"
                                        >
                                            - {{ item.different }}
                                        </span>
                                    </h3>
                                </NuxtLink>
                                
                                <!-- Brand and Rating -->
                                <div class="flex items-center gap-3 mb-3">
                                    <span v-if="item?.brand" class="text-sm text-gray-600 dark:text-gray-400">
                                        {{ $t('product.brand') }}: {{ item.brand }}
                                    </span>
                                    <div v-if="item?.rating" class="flex items-center gap-1">
                                        <div class="flex items-center">
                                            <template v-for="i in 5" :key="i">
                                                <Star 
                                                    :class="[
                                                        'w-4 h-4',
                                                        i <= parseFloat(item.rating) 
                                                            ? 'text-yellow-400 fill-current' 
                                                            : 'text-gray-300 dark:text-gray-600'
                                                    ]"
                                                />
                                            </template>
                                        </div>
                                        <span class="text-sm text-gray-600 dark:text-gray-400 ml-1">
                                            ({{ item.rating }})
                                        </span>
                                    </div>
                                </div>

                                <!-- Categories -->
                                <div v-if="item?.categories?.data?.length" class="flex flex-wrap gap-1 mb-3">
                                    <span 
                                        v-for="category in item.categories.data.slice(0, 3)" 
                                        :key="category.id"
                                        class="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full"
                                    >
                                        {{ category.name }}
                                    </span>
                                    <span 
                                        v-if="item.categories.data.length > 3"
                                        class="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full"
                                    >
                                        +{{ item.categories.data.length - 3 }}
                                    </span>
                                </div>

                                <!-- Variant/Color -->
                                <div v-if="item?.different" class="mb-3">
                                    <div class="flex items-center gap-2">
                                        <!-- Product color swatch -->
                                        <div 
                                            v-if="item?.different"
                                            :style="{ backgroundColor: item.different }"
                                            class="w-6 h-6 rounded-full border-2 border-gray-300 shadow-sm"
                                        ></div>
                                        <!-- Fallback to variant name if no color -->
                                        <span class="text-sm text-gray-600 dark:text-gray-400">
                                            {{ $t('product.variant') }}: {{ item.different }}
                                        </span>
                                    </div>
                                </div>

                                <!-- Description -->
                                <div v-if="item?.description" class="mb-4">
                                    <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                                        {{ item.description }}
                                    </p>
                                </div>
                                
                                <!-- Price and Discount -->
                                <div class="flex items-center gap-3 mb-4">
                                    <span class="text-2xl font-bold text-primary">
                                        {{ formatPrice(getDiscountedPrice(item)) }}
                                    </span>
                                    <span 
                                        v-if="item?.discount && Number(item.discount) > 0"
                                        class="text-lg text-gray-400 line-through"
                                    >
                                        {{ formatPrice(item?.price) }}
                                    </span>
                                <!--     <span 
                                        v-if="item?.discount && Number(item.discount) > 0"
                                        class="bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 text-sm font-medium px-2 py-1 rounded"
                                    >
                                        -{{ getDiscountPercentage(item) }}%
                                    </span> -->
                                </div>

                                <!-- Stock Status -->
                                <div class="mb-4">
                                    <div v-if="item?.quantity && item.quantity > 0" class="flex items-center gap-2">
                                        <CheckCircle class="w-4 h-4 text-green-500" />
                                        <span class="text-sm text-green-600 dark:text-green-400">
                                            {{ $t('product.inStock') }} ({{ item.quantity }} {{ $t('product.available') }})
                                        </span>
                                    </div>
                                    <div v-else class="flex items-center gap-2">
                                        <XCircle class="w-4 h-4 text-red-500" />
                                        <span class="text-sm text-red-600 dark:text-red-400">
                                            {{ $t('product.outOfStock') }}
                                        </span>
                                    </div>
                                </div>

                                <!-- Accessories -->
                                <div v-if="item?.accessories?.data?.length" class="mb-4">
                                    <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">
                                        {{ $t('product.accessories') }}:
                                    </h4>
                                    <div class="space-y-1">
                                        <div 
                                            v-for="accessory in item.accessories.data.slice(0, 3)" 
                                            :key="accessory.id"
                                            class="flex items-center justify-between text-xs bg-gray-50 dark:bg-gray-800 p-2 rounded"
                                        >
                                            <div class="flex items-center gap-2">
                                                <Package class="w-3 h-3 text-gray-400" />
                                                <span class="text-gray-700 dark:text-gray-300">
                                                    {{ accessory.name }}
                                                </span>
                                                <span 
                                                    v-if="accessory.is_required === '1'"
                                                    class="text-red-500 font-medium"
                                                >
                                                    *
                                                </span>
                                            </div>
                                            <div class="flex items-center gap-2">
                                                <span class="text-gray-600 dark:text-gray-400">
                                                    {{ accessory.qty }}x
                                                </span>
                                                <template v-if="parseFloat(accessory.price) > 0">
                                                    <div class="flex items-center gap-1">
                                                        <!-- السعر بعد الخصم -->
                                                        <span class="text-primary font-medium">
                                                            {{
                                                                formatPrice(
                                                                    Number(accessory.price || 0) -
                                                                        Number(accessory.discount || 0)
                                                                )
                                                            }}
                                                        </span>
                                                        <!-- السعر الأصلي -->
                                                        <span
                                                            v-if="Number(accessory.discount || 0) > 0"
                                                            class="text-gray-400 line-through"
                                                        >
                                                            {{ formatPrice(Number(accessory.price || 0)) }}
                                                        </span>
                                                        <!-- نسبة الخصم -->
                                                        <span
                                                            v-if="Number(accessory.discount || 0) > 0 && Number(accessory.price || 0) > 0"
                                                            class="bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 font-semibold px-1.5 py-0.5 rounded-full"
                                                        >
                                                            -{{
                                                                Math.round(
                                                                    (Number(accessory.discount) / Number(accessory.price)) * 100
                                                                )
                                                            }}%
                                                        </span>
                                                    </div>
                                                </template>
                                                <span 
                                                    v-else
                                                    class="text-green-600 dark:text-green-400"
                                                >
                                                    {{ $t('common.free') }}
                                                </span>
                                            </div>
                                        </div>
                                        <div 
                                            v-if="item.accessories.data.length > 3"
                                            class="text-xs text-gray-500 dark:text-gray-400 text-center pt-1"
                                        >
                                            +{{ item.accessories.data.length - 3 }} {{ $t('product.moreAccessories') }}
                                        </div>
                                    </div>
                                </div>

                                <!-- Actions -->
                                <div class="flex flex-wrap gap-3">
                                    <Button 
                                        @click="viewProduct(item?.slug)"
                                        variant="outline"
                                        size="lg"
                                        class="gap-2 flex-1 md:flex-none"
                                    >
                                        <Eye class="w-4 h-4" />
                                        {{ $t('common.viewDetails') }}
                                    </Button>
                                </div>
                            </div>

                            <!-- Remove Button -->
                            <div class="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-2">
                                <Button
                                    @click="removeItem(item?.id)"
                                    variant="ghost"
                                    size="icon"
                                    class="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                                >
                                    <X class="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <!-- Pagination -->
                <BasePaginationLinks
                  v-if="wishlistTotalPages > 1"
                  :links="wishlistLinks"
                  :aria-label="t('nav.wishlist')"
                  @page-change="handleWishlistPageChange"
                />

                <!-- Bottom Actions -->
                <Card class="sticky bottom-4 shadow-xl">
                    <CardContent class="p-4 md:p-6">
                        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
                            <div class="text-center md:text-left">
                                <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    {{ $t('wishlist.totalItems') }}
                                </p>
                                <p class="text-2xl font-bold text-gray-900 dark:text-white">
                                    {{ cart?.wishlistCount }} {{ $t('product.items') }}
                                </p>
                            </div>
                            
                            <div class="flex gap-3 w-full md:w-auto">
                                <!-- <Button 
                                    @click="addAllToCart"
                                    size="lg"
                                    class="gap-2 flex-1 md:flex-none"
                                >
                                    <ShoppingCart class="w-5 h-5" />
                                    {{ $t('wishlist.addAllToCart') }}
                                </Button> -->
                                
                                <Button 
                                    @click="navigateTo('/')"
                                    variant="outline"
                                    size="lg"
                                    class="gap-2 flex-1 md:flex-none"
                                >
                                    <ShoppingBag class="w-5 h-5" />
                                    {{ $t('common.continueShopping') }}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Heart, ShoppingCart, Trash2, X, Eye, ShoppingBag, Star, CheckCircle, XCircle, Package } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { useCart } from '~/composables/useCart'
import { useWishlist } from '~/composables/useWishlist'
import { useI18n } from 'vue-i18n'

definePageMeta({
    layout: 'default'
})

useHead({
    title: 'Wishlist',
    meta: [
        { name: 'description', content: 'View and manage your wishlist items' }
    ]
})

const { t } = useI18n()
const { formatPrice } = useCurrency()
const cart = useCart()
const wishlist = useWishlist()
const toast = useToast()
const isLoading = ref(true)

// Wishlist pagination
const wishlistCurrentPage = ref(1)
const WISHLIST_PER_PAGE = 10

const wishlistItemsArray = computed(() => {
  return wishlist.wishlistItems.value
})

const wishlistTotalPages = computed(() => {
  if (!wishlistItemsArray.value.length) return 1
  return Math.max(1, Math.ceil(wishlistItemsArray.value.length / WISHLIST_PER_PAGE))
})

const paginatedWishlistItems = computed(() => {
  const start = (wishlistCurrentPage.value - 1) * WISHLIST_PER_PAGE
  const end = start + WISHLIST_PER_PAGE
  return wishlistItemsArray.value.slice(start, end)
})

const wishlistLinks = computed(() => {
  const links: { url: string | null; label: string; active: boolean }[] = []
  const total = wishlistTotalPages.value
  const current = wishlistCurrentPage.value

  // Previous
  links.push({
    url: current > 1 ? `/wishlist?page=${current - 1}` : null,
    label: '« Previous',
    active: false,
  })

  // Numbered pages
  for (let page = 1; page <= total; page++) {
    links.push({
      url: page === current ? null : `/wishlist?page=${page}`,
      label: String(page),
      active: page === current,
    })
  }

  // Next
  links.push({
    url: current < total ? `/wishlist?page=${current + 1}` : null,
    label: 'Next »',
    active: false,
  })

  return links
})

const handleWishlistPageChange = (page: number) => {
  if (page < 1 || page > wishlistTotalPages.value) return
  wishlistCurrentPage.value = page
}

// Initialize wishlist
onMounted(async () => {
    isLoading.value = true
    if(useAuthStore().isAuthenticated) {
        await wishlist.fetchWishlistFromAPI()
    } else {
        wishlist.loadWishlist()
    }
    isLoading.value = false
})

// Remove item from wishlist
const removeItem = async (itemId: number) => {
    const result = await wishlist.removeFromWishlist(itemId)
    if (result.success) {
        toast.success(t('messages.removedFromWishlist'))
    } else {
        toast.error(t('messages.error'), result.message)
    }
}

// Clear all wishlist
const clearAllWishlist = async () => {
    if (confirm(t('wishlist.confirmClearAll'))) {
        await wishlist.clearWishlist()
        toast.success(t('wishlist.clearedAll'))
    }
}

// Add to cart from wishlist
const addToCartFromWishlist = async (item: any) => {
    const cartItem = {
        id: item.id,
        slug: item.slug,
        name: item.name,
        price: item.price,
        image: item.image,
        maxStock: 99,
        quantity: 1
    }
    
    const result = cart.addToCart(cartItem)
    if (result.success) {
        toast.success(t('messages.addedToCart', { product: item.name }))
    } else {
        toast.error(t('messages.error'), result.message)
    }
}

// Add all to cart
const addAllToCart = () => {
    let successCount = 0
    let failCount = 0
    
    wishlist.wishlistItems.value.forEach((item) => {
        if (item.inStock) {
            const cartItem = {
                id: item.id,
                slug: item.slug,
                name: item.name,
                price: item.price,
                image: item.image,
                maxStock: 99,
                quantity: 1
            }
            
            const result = cart.addToCart(cartItem)
            if (result.success) {
                successCount++
            } else {
                failCount++
            }
        }
    })
    
    if (successCount > 0) {
        toast.success(t('wishlist.addedAllToCart'), `${successCount} ${t('product.items')}`)
    }
    
    if (failCount > 0) {
        toast.warning(t('wishlist.someItemsFailed'), `${failCount} ${t('product.items')}`)
    }
}

// View product
const viewProduct = (slug: string) => {
    navigateTo(`/products/${slug}`)
}

// Calculate discounted price
// Note: discount is stored as a direct value (e.g., 4.76), not a percentage
const getDiscountedPrice = (item: any) => {
    if (!item?.discount || Number(item.discount) <= 0) {
        return item?.price || 0
    }
    const originalPrice = Number(item?.price || 0)
    const discountValue = Number(item.discount || 0)
    return originalPrice - discountValue
}

// Calculate discount percentage for display
const getDiscountPercentage = (item: any) => {
    if (!item?.discount || Number(item.discount) <= 0 || !item?.price) {
        return 0
    }
    const originalPrice = Number(item.price)
    const discountValue = Number(item.discount)
    return Math.round((discountValue / originalPrice) * 100)
}
</script>
