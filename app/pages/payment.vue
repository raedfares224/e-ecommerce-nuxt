<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="container mx-auto px-4">
      <!-- Header -->
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {{ $t('payment.title', 'Complete Payment') }}
          </h1>
          <p class="text-gray-600 dark:text-gray-400">
            {{ $t('payment.subtitle', 'Please complete your payment in the secure form below') }}
          </p>
        </div>
        
        <Button 
          variant="outline" 
          @click="handleCancel"
          class="gap-2"
        >
          <ArrowLeft class="w-4 h-4" />
          {{ $t('common.cancel', 'Cancel') }}
        </Button>
      </div>

      <!-- Order Info Card -->
      <Card class="mb-6 shadow-sm">
        <CardContent class="p-4 md:p-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                {{ $t('payment.orderInfo', 'Order Information') }}
              </h3>
              <div class="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <span>{{ $t('payment.orderNumber', 'Order') }}: #{{ orderId }}</span>
                <span>•</span>
                <span>{{ $t('payment.amount', 'Amount') }}: {{ formatPrice(orderTotal) }}</span>
              </div>
            </div>
            
            <div class="text-right">
              <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">
                {{ $t('payment.paymentMethod', 'Payment Method') }}
              </div>
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 flex items-center justify-center">
                  <img 
                    v-if="paymentImageUrl" 
                    :src="paymentImageUrl" 
                    :alt="paymentMethod?.en_name || 'Payment Method'"
                    class="h-8 w-auto object-contain max-w-[100px]"
                    @error="handleImageError"
                  />
                  <div 
                    v-else
                    class="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center"
                  >
                    <CreditCard class="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </div>
                </div>
                <span class="font-medium text-gray-900 dark:text-white">
                  {{ locale === 'ar' ? paymentMethod?.ar_name : paymentMethod?.en_name }}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Payment Iframe Container -->
      <Card class="shadow-lg overflow-hidden">
        <CardContent class="p-0">
          <!-- Loading State -->
          <div v-if="loading" class="flex items-center justify-center h-[600px] bg-gray-50 dark:bg-gray-800">
            <div class="text-center space-y-4">
              <Loader2 class="w-12 h-12 text-primary animate-spin mx-auto" />
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {{ $t('payment.loadingPayment', 'Loading Payment Form...') }}
                </h3>
                <p class="text-gray-600 dark:text-gray-400">
                  {{ $t('payment.secureConnection', 'Establishing secure connection to payment gateway') }}
                </p>
              </div>
            </div>
          </div>

          <!-- Iframe Wrapper -->
          <div v-else class="relative bg-white dark:bg-gray-900">
            <!-- Iframe with proper sizing and attributes -->
            <iframe
              v-if="paymentUrl"
              :src="paymentUrl"
              class="w-full border-0 block"
              style="width: 100%; height: 100vh; min-height: 800px;"
              frameborder="0"
              scrolling="no"
              allow="payment *; clipboard-write *"
              sandbox="allow-same-origin allow-scripts allow-forms allow-top-navigation allow-popups-to-escape-sandbox allow-popups"
              @load="handleIframeLoad"
              @error="handleIframeError"
            />
            
            <!-- Overlay for loading/error states -->
            <div 
              v-if="iframeLoading || iframeError"
              class="absolute inset-0 bg-white dark:bg-gray-900 flex items-center justify-center z-10"
            >
              <div v-if="iframeLoading" class="text-center space-y-4">
                <Loader2 class="w-8 h-8 text-primary animate-spin mx-auto" />
                <p class="text-gray-600 dark:text-gray-400">
                  {{ $t('payment.loading', 'Loading...') }}
                </p>
              </div>
              
              <div v-else-if="iframeError" class="text-center space-y-4">
                <AlertTriangle class="w-12 h-12 text-red-500 mx-auto" />
                <div>
                  <h3 class="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">
                    {{ $t('payment.errorLoading', 'Error Loading Payment') }}
                  </h3>
                  <p class="text-gray-600 dark:text-gray-400 mb-4">
                    {{ $t('payment.tryAgain', 'Please try again or choose another payment method') }}
                  </p>
                  <div class="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button @click="retryPayment" class="gap-2">
                      <RefreshCw class="w-4 h-4" />
                      {{ $t('common.retry', 'Retry') }}
                    </Button>
                    <Button 
                      variant="outline" 
                      @click="openPaymentInNewWindow"
                      class="gap-2"
                      v-if="paymentUrl"
                    >
                      <ExternalLink class="w-4 h-4" />
                      {{ $t('payment.openInNewWindow', 'Open in New Window') }}
                    </Button>
                    <Button variant="outline" @click="handleCancel">
                      {{ $t('common.cancel', 'Cancel') }}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Security Notice -->
      <div class="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
        <div class="flex items-start gap-3">
          <Shield class="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
          <div class="text-sm">
            <h4 class="font-semibold text-blue-900 dark:text-blue-100 mb-1">
              {{ $t('payment.securePayment', 'Secure Payment') }}
            </h4>
            <p class="text-blue-700 dark:text-blue-300">
              {{ $t('payment.securityNote', 'Your payment information is encrypted and secure. We never store your card details.') }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowLeft, Loader2, AlertTriangle, RefreshCw, Shield, ExternalLink, CreditCard } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { useOrderSuccess } from '~/composables/useOrderSuccess'
import { useCurrency } from '~/composables/useCurrency'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: 'default',
  middleware: [
    function (to, from) {
      const { lastOrderData } = useOrderSuccess()
      if (!lastOrderData.value?.url) {
        return navigateTo('/checkout')
      }
    }
  ]
})

const { lastOrderData } = useOrderSuccess()
const { t, locale } = useI18n()
const { formatPrice } = useCurrency()
const router = useRouter()
const authStore = useAuthStore()

// Token backup key for localStorage
const TOKEN_BACKUP_KEY = 'payment_token_backup'
const USER_BACKUP_KEY = 'payment_user_backup'

// Backup token before iframe loads (iframe sandbox can affect cookies)
const backupAuthState = () => {
  if (typeof window === 'undefined') return
  
  if (authStore.token) {
    localStorage.setItem(TOKEN_BACKUP_KEY, authStore.token)
    console.log('Token backed up to localStorage')
  }
  if (authStore.user) {
    localStorage.setItem(USER_BACKUP_KEY, JSON.stringify(authStore.user))
    console.log('User data backed up to localStorage')
  }
}

// Restore token if it was lost
const restoreAuthState = () => {
  if (typeof window === 'undefined') return
  
  const backedUpToken = localStorage.getItem(TOKEN_BACKUP_KEY)
  const backedUpUser = localStorage.getItem(USER_BACKUP_KEY)
  
  // If token is missing but we have a backup, restore it
  if (!authStore.token && backedUpToken) {
    authStore.setToken(backedUpToken)
    console.log('Token restored from localStorage backup')
  }
  
  // If user is missing but we have a backup, restore it
  if (!authStore.user && backedUpUser) {
    try {
      authStore.setUser(JSON.parse(backedUpUser))
      console.log('User data restored from localStorage backup')
    } catch (e) {
      console.error('Failed to parse backed up user data')
    }
  }
}

// Clear backup after successful restoration or when no longer needed
const clearAuthBackup = () => {
  if (typeof window === 'undefined') return
  localStorage.removeItem(TOKEN_BACKUP_KEY)
  localStorage.removeItem(USER_BACKUP_KEY)
}

// State
const loading = ref(true)
const iframeLoading = ref(false)
const iframeError = ref(false)

// Computed properties
const paymentUrl = computed(() => lastOrderData.value?.url)
const orderId = computed(() => lastOrderData.value?.order?.id || lastOrderData.value?.order_id)
const orderTotal = computed(() => lastOrderData.value?.order?.total)
const paymentMethod = computed(() => lastOrderData.value?.payment_method)
const paymentImageUrl = computed(() => {
  const imagePath = paymentMethod.value?.payment_img
  if (!imagePath) return null
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath
  }
  
  // If it's a relative path, prepend the base URL
  const baseUrl = 'https://ecommerce.mtsc.tech/public/'
  return `${baseUrl}${imagePath}`
})

// Methods
const handleIframeLoad = () => {
  console.log('Iframe loaded successfully')
  iframeLoading.value = false
  iframeError.value = false
  
  // Add a small delay to ensure content is fully rendered
  setTimeout(() => {
    iframeLoading.value = false
  }, 500)
}

const handleIframeError = (error: Event) => {
  console.error('Iframe error:', error)
  iframeLoading.value = false
  iframeError.value = true
}

const retryPayment = () => {
  console.log('Retrying payment, URL:', paymentUrl.value)
  iframeLoading.value = true
  iframeError.value = false
  
  // Force reload by clearing and resetting the iframe
  nextTick(() => {
    const iframe = document.querySelector('iframe') as HTMLIFrameElement
    if (iframe && paymentUrl.value) {
      iframe.src = ''
      setTimeout(() => {
        iframe.src = paymentUrl.value
      }, 100)
    }
  })
}

const handleCancel = async () => {
  try {
    await router.push('/checkout')
  } catch (error) {
    console.error('Navigation error', error)
  }
}

const openPaymentInNewWindow = () => {
  if (paymentUrl.value) {
    window.open(paymentUrl.value, '_blank', 'noopener,noreferrer')
  }
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  // Hide the image and let the fallback icon show
  img.style.display = 'none'
}

// Initialize
onMounted(() => {
  console.log('Payment page mounted, URL:', paymentUrl.value)
  
  // Backup auth state before iframe loads
  backupAuthState()
  
  // Simulate loading time for better UX
  setTimeout(() => {
    loading.value = false
    iframeLoading.value = true
    
    // Add debugging info
    if (paymentUrl.value) {
      console.log('Payment URL found:', paymentUrl.value)
    } else {
      console.error('No payment URL found in order data')
      iframeError.value = true
      iframeLoading.value = false
    }
  }, 1000)
  
  // Listen for messages from iframe (for payment completion)
  window.addEventListener('message', handleIframeMessage)
  
  // Cleanup on unmount
  onUnmounted(() => {
    window.removeEventListener('message', handleIframeMessage)
  })
})

// Handle messages from iframe (optional, for payment completion detection)
const handleIframeMessage = (event: MessageEvent) => {
  // Only accept messages from trusted origins
  if (event.origin.includes('moyasar.com') || event.origin.includes('checkout.moyasar.com')) {
    console.log('Message from payment iframe:', event.data)
    
    // Handle payment completion or other events
    if (event.data?.type === 'payment_success') {
      // Redirect to success page
      router.push('/order-success')
    } else if (event.data?.type === 'payment_failed') {
      // Handle payment failure
      iframeError.value = true
      iframeLoading.value = false
    }
  }
}
</script>
