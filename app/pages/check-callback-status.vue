<template>
  <div class="min-h-screen bg-gray-50/50 dark:bg-gray-950 py-12 flex items-center justify-center px-4">
    <Card class="w-full max-w-lg shadow-xl border-t-4" :class="statusClass">
      <CardContent class="p-8 space-y-6">
        <!-- Loading State -->
        <div v-if="loading" class="text-center space-y-4">
          <div class="mx-auto w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center animate-pulse">
            <Loader2 class="w-10 h-10 text-primary animate-spin" />
          </div>
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">
            {{ $t('checkCallback.checking', 'Checking Payment Status...') }}
          </h2>
          <p class="text-gray-500 dark:text-gray-400">
            {{ $t('checkCallback.pleaseWait', 'Please wait while we verify your payment') }}
          </p>
        </div>

        <!-- Success State -->
        <div v-else-if="status === 'success'" class="text-center space-y-4">
          <div class="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center ring-8 ring-green-50 dark:ring-green-900/20">
            <CheckCircle class="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ $t('checkCallback.paymentSuccess', 'Payment Successful') }}
          </h2>
          <p class="text-gray-600 dark:text-gray-400">
            {{ $t('checkCallback.paymentConfirmed', 'Your payment has been confirmed successfully') }}
          </p>
          
          <!-- Response Data -->
          <div v-if="responseData" class="mt-6 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-start">
            <div v-if="responseData.order_id" class="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <span class="text-gray-500 dark:text-gray-400">{{ $t('checkCallback.orderId', 'Order ID') }}</span>
              <span class="font-bold text-gray-900 dark:text-white">#{{ responseData.order_id }}</span>
            </div>
            <div v-if="responseData.message" class="py-2">
              <p class="text-gray-600 dark:text-gray-300">
                {{ $t(`checkCallback.${responseData.message.replace(/\s+/g, '')}`, responseData.message) }}
                {{ responseData.message.replace(/\s+/g, '') }}
              </p>
            </div>
          </div>
        </div>

        <!-- Failed State -->
        <div v-else-if="status === 'failed'" class="text-center space-y-4">
          <div class="mx-auto w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center ring-8 ring-red-50 dark:ring-red-900/20">
            <XCircle class="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ $t('checkCallback.paymentFailed', 'Payment Failed') }}
          </h2>
          <p class="text-gray-600 dark:text-gray-400">
            {{ errorMessage || $t('checkCallback.paymentError', 'There was an issue with your payment') }}
          </p>
        </div>

        <!-- Pending State -->
        <div v-else-if="status === 'pending'" class="text-center space-y-4">
          <div class="mx-auto w-20 h-20 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center ring-8 ring-yellow-50 dark:ring-yellow-900/20">
            <Clock class="w-10 h-10 text-yellow-600 dark:text-yellow-400" />
          </div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ $t('checkCallback.paymentPending', 'Payment Pending') }}
          </h2>
          <p class="text-gray-600 dark:text-gray-400">
            {{ $t('checkCallback.paymentProcessing', 'Your payment is being processed') }}
          </p>
        </div>

        <!-- Error State (No invoice_id) -->
        <div v-else-if="status === 'error'" class="text-center space-y-4">
          <div class="mx-auto w-20 h-20 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center ring-8 ring-orange-50 dark:ring-orange-900/20">
            <AlertTriangle class="w-10 h-10 text-orange-600 dark:text-orange-400" />
          </div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ $t('checkCallback.invalidRequest', 'Invalid Request') }}
          </h2>
          <p class="text-gray-600 dark:text-gray-400">
            {{ errorMessage || $t('checkCallback.missingInvoiceId', 'Missing invoice ID') }}
          </p>
        </div>

        <div class="pt-6 flex flex-col sm:flex-row gap-3 justify-center">
     <!--     <Button 
            v-if="status === 'success'" 
            size="lg" 
            class="min-w-[180px]"
            @click="navigateTo('/profile/orders')"
          >
            <ClipboardList class="w-5 h-5 me-2" />
            {{ $t('orderSuccess.viewOrders', 'View My Orders') }}
          </Button>-->
          
          <Button 
            v-if="status === 'failed' || status === 'error'"
            variant="outline"
            size="lg"
            class="min-w-[180px]"
            @click="retry"
          >
            <RefreshCw class="w-5 h-5 me-2" />
            {{ $t('common.retry', 'Retry') }}
          </Button>
<!--           
          <Button 
            variant="outline" 
            size="lg" 
            class="min-w-[180px]"
            @click="navigateTo('/')"
          >
            <Home class="w-5 h-5 me-2" />
            {{ $t('nav.home', 'Home') }}
          </Button> -->
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  Loader2, 
  ClipboardList, 
  RefreshCw, 
  Home 
} from 'lucide-vue-next'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { apiFetch } from '~/api/useApiFetch'
import { useCart } from '~/composables/useCart'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: 'none'
})

const route = useRoute()
const { t } = useI18n()
const { clearCart, fetchCartFromAPI } = useCart()
const authStore = useAuthStore()

// Token backup keys (same as payment.vue)
const TOKEN_BACKUP_KEY = 'payment_token_backup'
const USER_BACKUP_KEY = 'payment_user_backup'

// Restore token if it was lost during iframe payment
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

// Clear backup after successful restoration
const clearAuthBackup = () => {
  if (typeof window === 'undefined') return
  localStorage.removeItem(TOKEN_BACKUP_KEY)
  localStorage.removeItem(USER_BACKUP_KEY)
}

// State
const loading = ref(true)
const status = ref<'success' | 'failed' | 'pending' | 'error' | null>(null)
const errorMessage = ref<string | null>(null)
const responseData = ref<any>(null)

// Computed class for card border
const statusClass = computed(() => {
  switch (status.value) {
    case 'success':
      return 'border-t-green-500'
    case 'failed':
      return 'border-t-red-500'
    case 'pending':
      return 'border-t-yellow-500'
    case 'error':
      return 'border-t-orange-500'
    default:
      return 'border-t-primary'
  }
})

// Check callback status
async function checkStatus() {
  const invoiceId = route.query.invoice_id as string
  
  if (!invoiceId) {
    loading.value = false
    status.value = 'error'
    errorMessage.value = t('checkCallback.missingInvoiceId', 'Invoice ID is missing from the URL')
    return
  }

  loading.value = true
  errorMessage.value = null

  try {
    const { data, error } = await apiFetch<any>(`/check-callback-status?invoice_id=${invoiceId}`, {
      method: 'GET'
    })

    if (error) {
      status.value = 'failed'
      errorMessage.value = error.message || t('checkCallback.paymentError', 'Failed to check payment status')
      return
    }

    if (data) {
      responseData.value = data
      
      // Determine status from response
      // API response format examples:
      // Success: { "status": "success", "message": "Invoice exists and order is completed." }
      // Failed: { "status": "false", "message": "Invoice not found or order not completed." }
      if (data.status === 'success' || data.status === 'paid' || data.success === true) {
        status.value = 'success'
        // Refresh cart after successful payment
        if (authStore.isAuthenticated) {
          await fetchCartFromAPI()
        } else {
          clearCart()
        }
        // Clear auth backup after successful payment
        clearAuthBackup()
      } else if (data.status === 'pending' || data.status === 'processing') {
        status.value = 'pending'
      } else {
        status.value = 'failed'
        errorMessage.value = data.message || data.error || t('checkCallback.paymentFailed', 'Payment failed')
      }
    }
  } catch (err: any) {
    status.value = 'failed'
    errorMessage.value = err.message || t('checkCallback.paymentError', 'An error occurred')
  } finally {
    loading.value = false
  }
}

// Retry function
function retry() {
  checkStatus()
}

// Check status on mount
onMounted(() => {
  // Restore auth state first (in case token was lost during iframe payment)
  restoreAuthState()
  
  // Then check payment status
  checkStatus()
})
</script>
