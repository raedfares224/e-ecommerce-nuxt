<template>
  <div class="container mx-auto min-h-dvh px-4 py-12 md:py-16">
    <div class="max-w-2xl mx-auto">
      <div class="text-center">
        <!-- Success Icon -->
        <div class="w-20 h-20 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-once">
          <CheckCircle class="w-12 h-12 text-green-600 dark:text-green-400" />
        </div>

        <!-- Title -->
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {{ $t('thankYou.title', 'Thank You!') }}
        </h1>

        <!-- Order ID Badge -->
        <div v-if="orderId" class="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full mb-6">
          <Package class="w-5 h-5 text-primary" />
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ $t('thankYou.orderNumber', 'Order #') }}{{ orderId }}
          </span>
        </div>

        <!-- Message -->
        <p class="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
          {{ $t('thankYou.message', 'Your order has been successfully placed. We will send you a confirmation email shortly.') }}
        </p>

        <!-- Order Summary Card -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 text-left">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <ClipboardList class="w-5 h-5 text-primary" />
            {{ $t('thankYou.whatNext', "What's Next?") }}
          </h2>
          <ul class="space-y-3">
            <li class="flex items-start gap-3">
              <div class="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <span class="text-xs font-bold text-primary">1</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-sm">
                {{ $t('thankYou.step1', 'You will receive an order confirmation email with details of your order.') }}
              </p>
            </li>
            <li class="flex items-start gap-3">
              <div class="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <span class="text-xs font-bold text-primary">2</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-sm">
                {{ $t('thankYou.step2', 'We will notify you when your order is shipped.') }}
              </p>
            </li>
            <li class="flex items-start gap-3">
              <div class="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <span class="text-xs font-bold text-primary">3</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-sm">
                {{ $t('thankYou.step3', 'Track your order status from your account.') }}
              </p>
            </li>
          </ul>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <NuxtLink 
            to="/profile/orders" 
            class="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            <ClipboardList class="w-5 h-5" />
            {{ $t('thankYou.viewOrders', 'View Your Orders') }}
          </NuxtLink>
          <NuxtLink 
            to="/" 
            class="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium"
          >
            <ShoppingBag class="w-5 h-5" />
            {{ $t('thankYou.continueShopping', 'Continue Shopping') }}
          </NuxtLink>
        </div>

        <!-- Support Link -->
        <p class="mt-8 text-sm text-gray-500 dark:text-gray-400">
          {{ $t('thankYou.needHelp', 'Need help?') }}
          <NuxtLink to="/contact" class="text-primary hover:underline">
            {{ $t('thankYou.contactUs', 'Contact our support team') }}
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CheckCircle, Package, ClipboardList, ShoppingBag } from 'lucide-vue-next'

// Page meta
definePageMeta({
  layout: 'default'
})

// Get query parameters
const route = useRoute()
const orderId = computed(() => route.query.order_id as string | undefined)
const sessionId = computed(() => route.query.session_id as string | undefined)

// Clear cart after successful order
const cart = useCart()
onMounted(() => {
  // Clear the cart since order was successful
  cart.clearCart()
})

// SEO meta
useHead({
  title: orderId.value 
    ? `Order #${orderId.value} - Thank You` 
    : 'Thank You - Order Confirmation'
})
</script>

<style scoped>
@keyframes bounce-once {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.animate-bounce-once {
  animation: bounce-once 0.6s ease-in-out;
}
</style>