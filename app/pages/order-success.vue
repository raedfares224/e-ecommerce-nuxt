<template>
  <div class="min-h-screen bg-gray-50/50 dark:bg-gray-950 py-12 flex items-center justify-center px-4">
    <Card class="w-full max-w-2xl shadow-xl border-t-4 border-t-primary animate-in fade-in zoom-in duration-500">
      <CardContent class="p-8 space-y-8">
        <!-- Success Header -->
        <div class="text-center space-y-4">
          <div class="mx-auto w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6 shadow-sm ring-8 ring-green-50 dark:ring-green-900/20">
            <CheckCircle class="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>

          <div class="space-y-2">
            <h1 class="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              {{ $t('orderSuccess.title', 'Order Placed Successfully') }}
            </h1>
            <p class="text-lg text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
              {{ $t('orderSuccess.thankYou', 'Thank you for your order!') }}
            </p>
          </div>

          <!-- Order Number Badge -->
          <div v-if="orderId" class="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-6 py-3 rounded-full mt-4 border border-gray-200 dark:border-gray-700">
            <span class="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">
              {{ $t('orderSuccess.orderNumber', 'Order Number') }}
            </span>
            <span class="text-xl font-mono font-bold text-primary">
              #{{ orderId }}
            </span>
          </div>
        </div>

        <!-- Order Details Card -->
        <div v-if="orderDetails" class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <div class="bg-gray-50/80 dark:bg-gray-800/50 px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2">
            <Package class="w-5 h-5 text-primary" />
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">
              {{ $t('orderSuccess.orderDetails', 'Order Details') }}
            </h3>
          </div>
          
          <div class="p-6 space-y-4">
            <!-- Status & Date Row -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
              <div class="space-y-1">
                <span class="text-sm text-gray-500 dark:text-gray-400 block">{{ $t('orderSuccess.status', 'Status') }}</span>
                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">
                  {{ orderDetails.status === 'new' ? $t('orderSuccess.statusNew', 'New') : orderDetails.status }}
                </span>
              </div>
              <div class="space-y-1 sm:text-end">
                <span class="text-sm text-gray-500 dark:text-gray-400 block">{{ $t('orderSuccess.date', 'Date') }}</span>
                <span class="font-medium text-gray-900 dark:text-white dir-ltr block">{{ formatDate(orderDetails.created_at) }}</span>
              </div>
            </div>
            
            <!-- Financials -->
            <div class="space-y-3 pt-2">
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-600 dark:text-gray-400">{{ $t('orderSuccess.subtotal', 'Subtotal') }}</span>
                <span class="font-medium text-gray-900 dark:text-white font-mono">{{ formatPrice(orderDetails.subtotal) }}</span>
              </div>
              
              <div class="flex justify-between items-center border-t border-dashed border-gray-200 dark:border-gray-700 pt-3 mt-3">
                <span class="text-base font-bold text-gray-900 dark:text-white">{{ $t('orderSuccess.total', 'Total') }}</span>
                <span class="text-2xl font-bold text-primary font-mono">{{ formatPrice(orderDetails.total) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Payment Method Section -->
        <div v-if="paymentMethod" class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <div class="bg-gray-50/80 dark:bg-gray-800/50 px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2">
            <CreditCard class="w-5 h-5 text-primary" />
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">
              {{ $t('orderSuccess.paymentMethod', 'Payment Method') }}
            </h3>
          </div>
          
          <div class="p-6 flex items-center gap-4">
            <div class="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center border border-blue-100 dark:border-blue-900/30 shrink-0">
              <img 
                v-if="paymentMethod.payment_img" 
                :src="paymentMethod.payment_img" 
                :alt="paymentMethod.en_name"
                class="w-10 h-10 object-contain"
                @error="(e) => (e.target as HTMLImageElement).style.display = 'none'"
              />
              <Wallet v-else class="w-7 h-7 text-primary" />
            </div>
            <div>
              <p class="font-bold text-lg text-gray-900 dark:text-white">
                {{ locale === 'ar' ? paymentMethod.ar_name : paymentMethod.en_name }}
              </p>
              <p v-if="paymentMethod.en_name === 'COD'" class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {{ $t('orderSuccess.codNote', 'Pay when you receive your order') }}
              </p>
            </div>
          </div>
        </div>

        <!-- Bank Details Section -->
        <div v-if="bankDetails" class="bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30 overflow-hidden">
          <div class="px-6 py-4 border-b border-blue-100 dark:border-blue-900/30 flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20">
            <Landmark class="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 class="text-lg font-bold text-blue-900 dark:text-blue-100">
              {{ $t('orderSuccess.bankDetails', 'Bank Account Details') }}
            </h3>
          </div>
          
          <div class="p-6">
            <div 
              v-if="typeof bankDetails === 'string'"
              class="prose prose-blue dark:prose-invert max-w-none text-sm whitespace-pre-wrap leading-relaxed"
              v-html="bankDetails"
            ></div>
            
            <div v-else class="space-y-3 text-sm">
              <div v-for="(value, key) in bankDetails" :key="key" class="flex flex-col sm:flex-row sm:justify-between border-b border-blue-200 dark:border-blue-800/50 last:border-0 pb-2 last:pb-0">
                <span class="font-medium text-gray-600 dark:text-gray-400 capitalize">{{ String(key).replace(/_/g, ' ') }}</span>
                <span class="font-bold text-gray-900 dark:text-white font-mono">{{ value }}</span>
              </div>
            </div>

            <div class="mt-6 flex items-start gap-3 bg-white dark:bg-gray-900 p-4 rounded-lg border border-blue-100 dark:border-blue-900/30">
              <Info class="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ $t('orderSuccess.note', 'Please include your order number in the payment reference.') }}
              </p>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" size="lg" class="min-w-[200px] h-12 text-base" @click="navigateTo('/profile/orders')">
            <ClipboardList class="w-5 h-5 me-2" />
            {{ $t('orderSuccess.viewOrders', 'View My Orders') }}
          </Button>
          <Button size="lg" class="min-w-[200px] h-12 text-base shadow-lg shadow-primary/20" @click="navigateTo('/')">
            <ShoppingBag class="w-5 h-5 me-2" />
            {{ $t('common.continueShopping', 'Continue Shopping') }}
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { CheckCircle, Landmark, Package, CreditCard, Wallet, ClipboardList, ShoppingBag, Info } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { useOrderSuccess } from '~/composables/useOrderSuccess'
import { useCurrency } from '~/composables/useCurrency'
import { useCart } from '~/composables/useCart'

definePageMeta({
  layout: 'default',
  middleware: [
    function (to, from) {
      const { lastOrderData } = useOrderSuccess()
      if (!lastOrderData.value) {
        return navigateTo('/')
      }
    }
  ]
})

const { lastOrderData } = useOrderSuccess()
const { t, locale } = useI18n()
const { formatPrice } = useCurrency()
const { clearCart,fetchCartFromAPI } = useCart()

// Clear cart after successful order
onMounted(() => {
  fetchCartFromAPI()
  console.log(lastOrderData.value,'dddddddddddddddddddddddddddddddd')
})

// Computed properties to safely extract data
const orderId = computed(() => {
  return lastOrderData.value?.order_id || lastOrderData.value?.order?.id || lastOrderData.value?.id || lastOrderData.value?.data?.id
})

const orderDetails = computed(() => {
  return lastOrderData.value?.order || null
})

const paymentMethod = computed(() => {
  return lastOrderData.value?.payment_method || null
})

const bankDetails = computed(() => {
  // Try to find bank details in various possible fields in the response
  if (!lastOrderData.value) return null
  
  const pm: any = lastOrderData.value.payment_method

  // Prefer explicit bank detail fields when available
  const explicitDetails =
    // Top-level fields
    lastOrderData.value.bank_details ||
    lastOrderData.value.bank_transfer_details ||
    lastOrderData.value.payment_info ||
    lastOrderData.value.data?.bank_details ||
    // Sometimes attached to order object
    lastOrderData.value.order?.bank_details ||
    lastOrderData.value.order?.bank_transfer_details ||
    // Or attached to payment method
    pm?.bank_details ||
    pm?.bank_transfer_details

  if (explicitDetails) return explicitDetails

  // Fallback: use payment method description text as bank details (contains account / IBAN)
  const desc = locale.value === 'ar'
    ? pm?.ar_description || pm?.en_description
    : pm?.en_description || pm?.ar_description

  return desc || null
})

// Format date - Force Gregorian calendar
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  // Use 'u-ca-gregory' extension key to force Gregorian calendar even for ar-SA locale
  const localeString = locale.value === 'ar' ? 'ar-SA-u-ca-gregory' : 'en-US'
  
  return date.toLocaleDateString(localeString, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}
</script>
