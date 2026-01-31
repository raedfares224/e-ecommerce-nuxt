<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 md:py-12">
    <div class="container mx-auto px-4">
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {{ $t('nav.cart') }}
            </h1>
            <p class="text-gray-600 dark:text-gray-400">
              {{ cart.cartItemCount.value }} {{ $t('product.items') }}
            </p>
          </div>

          <Button
            v-if="cart.cartItemCount.value > 0"
            @click="handleClearCart"
            variant="outline"
            size="lg"
            class="gap-2"
          >
            <Trash2 class="w-4 h-4" />
            {{ $t('common.clearAll') }}
          </Button>
        </div>
      </div>

      <BaseLoading v-if="isLoading" />

      <div v-else-if="cart.cartItemCount.value === 0" class="text-center py-16">
        <div class="flex justify-center mb-6">
          <div class="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <ShoppingCart class="w-12 h-12 text-gray-400" />
          </div>
        </div>
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          {{ $t('cart.empty') }}
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          {{ $t('cart.emptyDescription') }}
        </p>
        <Button @click="navigateTo('/')" size="lg" class="gap-2">
          <ShoppingBag class="w-5 h-5" />
          {{ $t('common.continueShopping') }}
        </Button>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-6">
          <Card
            v-for="item in cart.cartItems.value"
            :key="item.id"
            class="group overflow-hidden border-gray-200 dark:border-gray-800 hover:border-primary/50 transition-all duration-300"
          >
            <CardContent class="p-6">
              <div class="flex flex-col sm:flex-row gap-6">
                <!-- Product Image -->
                <div class="relative w-full sm:w-32 h-32 bg-gray-50 dark:bg-gray-800/50 rounded-xl overflow-hidden shrink-0 border border-gray-100 dark:border-gray-800">
                  <NuxtLink :to="`/products/${item.slug}`">
                    <img
                      :src="item.image || '/placeholder.png'"
                      :alt="item.name"
                      class="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-500"
                    />
                  </NuxtLink>
                </div>

                <!-- Product Details -->
                <div class="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div class="flex justify-between items-start gap-4 mb-2">
                      <NuxtLink :to="`/products/${item.slug}`" class="flex-1">
                        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1 hover:text-primary transition-colors line-clamp-2">
                          {{ item.name }}
                        </h3>
                        <div v-if="item.different" class="mb-2">
                           <Badge variant="secondary" class="font-normal">
                             {{ item.different }}
                           </Badge>
                        </div>
                      </NuxtLink>
                      
                      <!-- Remove Button (Desktop) -->
                      <Button
                        variant="ghost"
                        size="icon"
                        class="text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 -mt-1 -mr-2 hidden sm:flex"
                        :disabled="isRemovingItem(item.id) || isUpdatingItem(item.id)"
                        @click="handleRemoveItem(item)"
                      >
                        <Loader2 v-if="isRemovingItem(item.id)" class="w-4 h-4 animate-spin" />
                        <X v-else class="w-4 h-4" />
                      </Button>
                    </div>

                    <!-- Accessories -->
                    <div
                      v-if="item.accessories && item.accessories.length > 0"
                      class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 mb-4 text-sm"
                    >
                      <p class="font-medium text-gray-900 dark:text-white text-xs mb-2 flex items-center gap-2">
                        {{ $t('product.accessories') }}
                      </p>
                      <div class="space-y-2">
                        <div
                          v-for="(acc, idx) in item.accessories"
                          :key="acc.id || idx"
                          class="flex items-start justify-between text-xs border-b border-gray-100 dark:border-gray-800/50 last:border-0 pb-2 last:pb-0"
                        >
                          <div class="flex flex-col gap-1">
                            <span class="font-medium text-gray-700 dark:text-gray-300">{{ acc.name }}</span>
                            <span v-if="acc.groupName" class="text-gray-500 text-[10px]">{{ acc.groupName }}</span>
                          </div>
                          <div class="text-right">
                            <div class="flex flex-col items-end gap-0.5">
                                <div class="flex items-center gap-1.5">
                                  <span
                                    v-if="Number(acc.discount || 0) > 0"
                                    class="rounded-sm bg-red-100 px-1 py-0.5 text-[9px] font-bold text-red-600 dark:bg-red-900/30 dark:text-red-400"
                                  >
                                    -{{ Math.round((Number(acc.discount) / Number(acc.price)) * 100) }}%
                                  </span>
                                  <div class="font-medium text-primary">
                                    {{ formatPrice(Number(acc.price || 0) - Number(acc.discount || 0)) }}
                                  </div>
                                </div>
                                <div v-if="Number(acc.discount || 0) > 0" class="text-[10px] text-gray-400 line-through">
                                  {{ formatPrice(Number(acc.price || 0)) }}
                                </div>
                                <div class="text-gray-500 text-[10px]">x{{ acc.qty || 1 }}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Price & Quantity Actions -->
                  <div class="flex flex-wrap items-center justify-between gap-4 mt-2">
                    <div class="flex flex-col items-start gap-1">
                       <div class="flex items-center gap-2">
                        <span class="text-xl font-bold text-primary">
                          {{ formatPrice(item.differentPrice || item.price) }}
                        </span>
                         <!-- Discount Badge & Original Price for Main Item -->
                         <span
                            v-if="item.differentPrice && item.differentPrice < item.price"
                            class="rounded-sm bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-600 dark:bg-red-900/30 dark:text-red-400"
                          >
                            -{{ Math.round(((item.price - item.differentPrice) / item.price) * 100) }}%
                          </span>
                          <span
                            v-if="item.differentPrice && item.differentPrice < item.price"
                            class="text-sm text-gray-400 line-through"
                          >
                            {{ formatPrice(item.price) }}
                          </span>
                       </div>
                       
                      <span v-if="item.quantity > 1 || (item.accessories && item.accessories.length > 0)" class="text-sm text-gray-500 dark:text-gray-400 font-medium">
                         {{ $t('cart.total') }}: {{ formatPrice(getItemTotal(item)) }}
                      </span>
                    </div>

                    <div class="flex items-center gap-4">
                       <!-- Quantity Controls -->
                      <div class="flex items-center bg-gray-50 dark:bg-gray-800 rounded-full p-1 border border-gray-200 dark:border-gray-700">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          class="h-8 w-8 rounded-full hover:bg-white dark:hover:bg-gray-700 shadow-sm"
                          :disabled="isUpdatingItem(item.id) || item.quantity <= 1"
                          @click="changeQuantity(item, item.quantity - 1)"
                        >
                          <Minus class="w-3 h-3" />
                        </Button>
                        <span class="w-10 text-center font-medium text-sm">{{ item.quantity }}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          class="h-8 w-8 rounded-full hover:bg-white dark:hover:bg-gray-700 shadow-sm"
                          :disabled="isUpdatingItem(item.id)"
                          @click="changeQuantity(item, item.quantity + 1)"
                        >
                          <Plus class="w-3 h-3" />
                        </Button>
                      </div>

                      <!-- Mobile Remove Button -->
                       <Button
                        variant="ghost"
                        size="icon"
                        class="text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 sm:hidden"
                        :disabled="isRemovingItem(item.id) || isUpdatingItem(item.id)"
                        @click="handleRemoveItem(item)"
                      >
                        <Loader2 v-if="isRemovingItem(item.id)" class="w-4 h-4 animate-spin" />
                        <Trash2 v-else class="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div class="lg:col-span-1">
          <div class="sticky top-24">
            <Card class="border-gray-200 dark:border-gray-800 shadow-lg dark:shadow-none overflow-hidden">
              <div class="bg-gray-50 dark:bg-gray-800/50 p-4 border-b border-gray-100 dark:border-gray-800">
                <h2 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  {{ $t('cart.orderSummary') }}
                  <Badge variant="secondary" class="ml-auto">
                    {{ cart.cartItemCount.value }} {{ $t('product.items') }}
                  </Badge>
                </h2>
              </div>
              
              <CardContent class="p-6 space-y-6">
                <div class="space-y-3">
                   <div class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>{{ $t('cart.subtotal') }}</span>
                    <span class="font-medium text-gray-900 dark:text-white">
                      {{ formatPrice(authStore.isAuthenticated ? cart.cartTotalFromApi.value : cart.cartTotal.value) }}
                    </span>
                  </div>
                  <!-- You could add tax/shipping estimates here later -->
                </div>

                <Separator />

                <div class="flex items-center justify-between">
                  <span class="text-lg font-bold text-gray-900 dark:text-white">
                    {{ $t('cart.total') }}
                  </span>
                  <span class="text-2xl font-bold text-primary">
                    {{ formatPrice(authStore.isAuthenticated ? cart.cartTotalFromApi.value : cart.cartTotal.value) }}
                  </span>
                </div>

                <div class="space-y-3 pt-2">
                  <Button
                    class="w-full h-12 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                    size="lg"
                    :disabled="isAnyActionLoading"
                    @click="proceedToCheckout"
                  >
                    {{ $t('cart.proceedToCheckout') }}
                    <ArrowRight class="w-5 h-5 ml-2" />
                  </Button>

                  <Button
                    class="w-full"
                    size="lg"
                    variant="outline"
                    :disabled="isAnyActionLoading"
                    @click="navigateTo('/')"
                  >
                    {{ $t('common.continueShopping') }}
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <!-- Trust Badges / Info (Optional) -->
            <!-- <div class="mt-6 grid grid-cols-2 gap-4 text-center">
              <div class="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-800">
                 <div class="text-xs font-medium text-gray-500 dark:text-gray-400">Secure Checkout</div>
              </div>
               <div class="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-800">
                 <div class="text-xs font-medium text-gray-500 dark:text-gray-400">Fast Delivery</div>
              </div>
            </div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ShoppingCart, ShoppingBag, Trash2, X, Loader2, ArrowRight, Minus, Plus } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Separator } from '~/components/ui/separator'
import { useCart } from '~/composables/useCart'

definePageMeta({
  layout: 'default',
})

useHead({
  title: 'Cart',
  meta: [
    { name: 'description', content: 'View and manage your cart items' },
  ],
})

const { t } = useI18n()
const { formatPrice } = useCurrency()
const cart = useCart()
const toast = useToast()
const authStore = useAuthStore()
const isLoading = ref(true)
const removingItemId = ref<number | null>(null)
const updatingItemId = ref<number | null>(null)
const isClearing = ref(false)

const isAnyActionLoading = computed(() => {
  return isClearing.value || removingItemId.value !== null || updatingItemId.value !== null
})

onMounted(async () => {
  isLoading.value = true

  if (authStore.isAuthenticated) {
    await cart.fetchCartFromAPI()
  } else {
    cart.loadCart()
  }

  isLoading.value = false
})

const isRemovingItem = (id: number) => removingItemId.value === id
const isUpdatingItem = (id: number) => updatingItemId.value === id

const getItemTotal = (item: any) => {
  const quantity = Number(item.quantity) || 1;
  const itemPrice = Number(item.price) || 0;
  
  const accessoriesTotal = (item.accessories || []).reduce(
    (accSum: number, acc: any) => {
      const accPrice = Number(acc.price || 0);
      const accDiscount = Number(acc.discount || 0);
      const accQty = Number(acc.qty || 1);
      return accSum + (accPrice - accDiscount) * accQty;
    },
    0
  );
  
  return (itemPrice + accessoriesTotal) * quantity;
};

const handleRemoveItem = async (item: any) => {
  if (isAnyActionLoading.value) return
  removingItemId.value = item.id

  try {
    if (authStore.isAuthenticated) {
      const result = await cart.removeFromCartFromAPI(item.id)
      if (result.success) {
        await cart.fetchCartFromAPI()
        toast.success(t('messages.removedFromCart'))
      } else {
        toast.error(t('messages.error'), result.message)
      }
    } else {
      const result = cart.removeFromCart(item.id)
      if (result.success) {
        toast.success(t('messages.removedFromCart'))
      } else {
        toast.error(t('messages.error'), result.message)
      }
    }
  } finally {
    removingItemId.value = null
  }
}

const changeQuantity = async (item: any, newQuantity: number) => {
  if (isAnyActionLoading.value) return

  if (newQuantity < 1) {
    await handleRemoveItem(item)
    return
  }

  const previousQuantity = item.quantity
  const diff = newQuantity - previousQuantity

  updatingItemId.value = item.id

  try {
    if (authStore.isAuthenticated) {
      const result = await cart.updateQuantityFromAPI(item.id, newQuantity)
      if (result.success) {
        item.quantity = newQuantity
        
        const accessoriesTotal = (item.accessories || []).reduce(
          (accSum: number, acc: any) => {
            const accPrice = Number(acc.price || 0);
            const accDiscount = Number(acc.discount || 0);
            const accQty = Number(acc.qty || 1);
            return accSum + (accPrice - accDiscount) * accQty;
          },
          0
        );
        const unitPriceWithAccessories = (Number(item.price) || 0) + accessoriesTotal;

        if (typeof cart.cartTotalFromApi.value === 'number') {
          cart.cartTotalFromApi.value = cart.cartTotalFromApi.value + unitPriceWithAccessories * diff
        }
        toast.success(t('messages.quantityUpdated'))
      } else {
        toast.error(t('messages.error'), result.message)
      }
    } else {
      const result = cart.updateQuantity(item.id, newQuantity)
      if (result?.success) {
        toast.success(t('messages.quantityUpdated'))
      } else if (result) {
        toast.error(t('messages.error'), result.message)
      }
    }
  } finally {
    updatingItemId.value = null
  }
}

const handleClearCart = async () => {
  if (!confirm(t('cart.confirmClearAll'))) return
  if (isAnyActionLoading.value) return

  isClearing.value = true

  try {
    if (authStore.isAuthenticated) {
      const result = await cart.clearCartFromAPI()
      if (result.success) {
        await cart.fetchCartFromAPI()
      } else {
        toast.error(t('messages.error'), result.message)
        return
      }
    } else {
      cart.clearCart()
    }

    toast.success(t('cart.clearedAll'))
  } finally {
    isClearing.value = false
  }
}

const proceedToCheckout = () => {
  // toast.info(t('cart.checkoutNotImplemented'))
  if(cart.cartItemCount.value === 0) {
    toast.info(t('cart.emptyCart'))
    return
  }
  navigateTo('/checkout')
}
usePageSeo({
    title: () => ("Cart "),
    description: () => "Review your cart items and proceed to checkout.",
  image: () => "/placeholder.png",
  type: "website",
});
</script>
