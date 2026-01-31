<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 md:py-12">
    <div class="container mx-auto px-4">
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {{ $t('checkout.title', 'Checkout') }}
          </h1>
          <p class="text-gray-600 dark:text-gray-400">
            {{ $t('checkout.subtitle', 'Review your order, select address and shipping, then confirm.') }}
          </p>
        </div>
      </div>

      <BaseLoading v-if="isLoading" />

      <div
        v-else-if="isUnauthorized"
        class="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-gray-300 bg-white/90 p-10 text-center text-gray-600 dark:border-gray-700 dark:bg-gray-900/70 dark:text-gray-300"
      >
        <div class="space-y-2">
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">
            {{ $t('checkout.loginRequiredTitle', 'Sign in to complete checkout') }}
          </h2>
          <p class="text-sm">
            {{ $t('checkout.loginRequiredDescription', 'Please login to continue to checkout.') }}
          </p>
        </div>
        <NuxtLink to="/auth/login">
          <Button size="lg" class="gap-2">
            <ShoppingCart class="w-5 h-5" />
            {{ $t('auth.loginButton', 'Login') }}
          </Button>
        </NuxtLink>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- عناوين الشحن -->
        <div class="lg:col-span-2 space-y-6">
          <Card class="shadow-sm">
            <CardContent class="p-4 md:p-6 space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                    {{ $t('checkout.shippingAddress', 'عنوان الشحن') }}
                  </h2>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ $t('checkout.chooseAddress', 'اختر العنوان الذي سيتم الشحن إليه') }}
                  </p>
                </div>
                
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    class="gap-2"
                    @click="createDialogOpen = true"
                >
                    <Navigation class="w-4 h-4" />
                    {{ $t('profile.addAddress', 'Add Address') }}
                </Button>

                <AddAddressDialog 
                  v-model:open="createDialogOpen" 
                  :default-is-default="true"
                  @success="handleAddressCreated" 
                />
              </div>

              <div
                v-if="addresses.length === 0"
                class="py-6 text-center text-gray-500 dark:text-gray-400"
              >
                {{ $t('checkout.noAddresses', 'لا توجد عناوين محفوظة.') }}
              </div>

              <div v-else class="space-y-3">
                <label
                  v-for="address in addresses"
                  :key="address.id"
                  class="flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition hover:border-primary/60 hover:bg-primary/5"
                  :class="{
                    'border-primary bg-primary/5 shadow-sm': selectedAddressId === address.id,
                    'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900': selectedAddressId !== address.id
                  }"
                >
                  <input
                    type="radio"
                    class="mt-1 h-4 w-4 text-primary focus:ring-primary"
                    name="address"
                    :value="address.id"
                    v-model="selectedAddressId"
                  />
                  <div class="flex-1 space-y-2">
                    <div class="flex flex-wrap items-center gap-2">
                      <p class="font-semibold text-gray-900 dark:text-white">
                        {{ address.label || address.country_name || $t('checkout.addressLabel', 'Address') }}
                      </p>
                      <span
                        class="inline-flex items-center gap-1 rounded-full border border-gray-200 dark:border-gray-700 px-2 py-0.5 text-[11px] uppercase tracking-wide text-gray-600 dark:text-gray-300"
                      >
                        <component :is="getBranchTypeIcon(address.branch_type)" class="w-3 h-3" />
                        <span>{{ $t(getBranchTypeLabelKey(address.branch_type)) }}</span>
                      </span>
                      <span
                        v-if="address.is_default"
                        class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                      >
                        {{ $t('checkout.default', 'افتراضي') }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-700 dark:text-gray-300">
                      {{ formatAddressDetails(address.address, address.branch_type) }}
                    </p>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-600 dark:text-gray-300">
                      <div class="flex items-center gap-2">
                        <MapPin class="w-4 h-4 text-gray-400" />
                        <span>
                          {{ address.country_name }} · {{ address.governorate_name }} · {{ address.city_name }}
                        </span>
                      </div>
                      <div v-if="address.ship_to_location" class="flex items-center gap-2">
                        <Package class="w-4 h-4 text-gray-400" />
                        <span>{{ address.ship_to_location }}</span>
                      </div>
                      <div v-if="address.postal_code" class="flex items-center gap-2">
                        <Mail class="w-4 h-4 text-gray-400" />
                        <span>{{ $t('profile.postalCode') }}: {{ address.postal_code }}</span>
                      </div>
                      <div v-if="address.nighbourhood_name || address.nighbourhood_id" class="flex items-center gap-2">
                        <Tag class="w-4 h-4 text-gray-400" />
                        <span>{{ address.nighbourhood_name || address.nighbourhood_id }}</span>
                      </div>
                    </div>
                    <p class="text-[11px] text-gray-400">
                      {{ $t('profile.lastUpdate') }}: {{ address.last_update }}
                    </p>
                  </div>
                </label>
              </div>
            </CardContent>
          </Card>

          <!-- طرق الشحن / الرسوم -->
          <Card class="shadow-sm">
            <CardContent class="p-4 md:p-6 space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                    {{ $t('checkout.shippingMethod', 'طريقة الشحن') }}
                  </h2>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ $t('checkout.chooseFee', 'اختر طريقة التوصيل المناسبة لك') }}
                  </p>
                </div>
              </div>

              <div
                v-if="fees.length === 0"
                class="py-4 text-sm text-gray-500 dark:text-gray-400"
              >
                {{ $t('checkout.noFees', 'لا توجد طرق شحن متاحة.') }}
              </div>

              <div v-else class="space-y-3">
                <label
                  v-for="fee in fees"
                  :key="fee.id"
                  class="flex items-center justify-between p-3 rounded-lg border cursor-pointer transition hover:border-primary hover:bg-primary/5"
                  :class="{
                    'border-primary bg-primary/5': selectedFeeId === fee.id,
                    'border-gray-200 dark:border-gray-700': selectedFeeId !== fee.id
                  }"
                >
                  <div class="flex items-center gap-3">
                    <input
                      type="radio"
                      class="h-4 w-4 text-primary focus:ring-primary"
                      name="fee"
                      :value="fee.id"
                      v-model="selectedFeeId"
                    />
                    <span class="font-medium text-gray-900 dark:text-white">
                      {{ fee.name }}
                    </span>
                  </div>
                  <span class="text-sm font-semibold text-primary">
                    {{ formatPrice(fee.value) }}
                  </span>
                </label>
              </div>
            </CardContent>
          </Card>

          <!-- طرق الدفع -->
          <Card class="shadow-sm">
            <CardContent class="p-4 md:p-6 space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                    {{ $t('checkout.paymentMethod', 'Payment Method') }}
                  </h2>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ $t('checkout.choosePayment', 'Choose your preferred payment method') }}
                  </p>
                </div>
              </div>

              <div
                v-if="paymentMethods.length === 0"
                class="py-4 text-sm text-gray-500 dark:text-gray-400"
              >
                {{ $t('checkout.noPaymentMethods', 'No payment methods available.') }}
              </div>

              <div v-else class="space-y-3">
                <div
                  v-for="method in paymentMethods"
                  :key="method.id"
                  class="rounded-lg border transition hover:border-primary hover:bg-primary/5"
                  :class="{
                    'border-primary bg-primary/5': selectedPaymentMethodId === method.id,
                    'border-gray-200 dark:border-gray-700': selectedPaymentMethodId !== method.id
                  }"
                >
                  <label class="flex items-center justify-between p-3 cursor-pointer">
                    <div class="flex items-center gap-3">
                      <input
                        type="radio"
                        class="h-4 w-4 text-primary focus:ring-primary"
                        name="paymentMethod"
                        :value="method.id"
                        v-model="selectedPaymentMethodId"
                      />
                      <span class="font-medium text-gray-900 dark:text-white">
                        {{ method.name }}
                      </span>
                    </div>
                    <img
                      v-if="method.image"
                      :src="method.image"
                      :alt="method.name"
                      class="h-8 w-auto object-contain"
                      @error="method.image = undefined"
                    />
                    <div
                      v-else
                      class="h-8 w-12 flex items-center justify-center rounded bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                    >
                      <CreditCard class="h-5 w-5" />
                    </div>
                  </label>
                  
                  <!-- Bank Transfer Details -->
                  <div
                    v-if="method.payment_method?.en_name === 'bank transfer' && selectedPaymentMethodId === method.id"
                    class="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800/50"
                  >
                    <div class="space-y-3">
                      <div class="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                        <Landmark class="w-4 h-4" />
                        {{ $t('checkout.bankDetails', 'Bank Transfer Details') }}
                      </div>
                      
                      <div class="bg-white dark:bg-gray-900 rounded-md p-3 border border-gray-200 dark:border-gray-700">
                        <pre class="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono">{{ 
                          locale.value === 'ar' ? method.ar_description : method.en_description 
                        }}</pre>
                      </div>
                      
                      <div class="text-xs text-gray-600 dark:text-gray-400">
                        <p>{{ $t('checkout.transferNote', 'Please transfer the total amount to the account above and keep the receipt as proof of payment.') }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- ملخص الطلب -->
        <div class="lg:col-span-1">
          <Card class="shadow-lg sticky top-24">
            <CardContent class="p-4 md:p-6 space-y-4">
              <div>
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                  {{ $t('checkout.orderSummary', 'ملخص الطلب') }}
                </h2>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ $t('cart.itemsCount', { count: cart.cartItemCount.value }) }}
                </p>
              </div>

              <!-- Product List -->
              <div class="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3 max-h-[300px] overflow-y-auto">
                <div
                  v-for="item in cart.cartItems.value"
                  :key="item.id"
                  class="pb-3 border-b border-gray-100 dark:border-gray-800 last:border-0"
                >
                  <div class="w-full">
                    <h4 class="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 mb-1">
                      {{ item.name }} <span v-if="item.different" class="text-gray-600 dark:text-gray-400">- {{ item.different }}</span>
                    </h4>
                    <div class="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <span>{{ $t('cart.quantity', 'الكمية') }}: {{ item.quantity }}</span>
                      <span>•</span>
                      <span class="font-semibold text-primary">{{ formatPrice(item.price) }}</span>
                    </div>
                    <!-- Accessories -->
                    <div
                      v-if="item.accessories && item.accessories.length > 0"
                      class="mt-2 space-y-1"
                    >
                      <p class="text-[10px] uppercase font-semibold text-gray-500 dark:text-gray-400">
                        {{ $t('product.accessories', 'الإكسسوارات') }}
                      </p>
                      <div class="flex flex-wrap gap-1">
                        <span
                          v-for="(accessory, idx) in getAccessoryNames(item.accessories)"
                          :key="idx"
                          class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] bg-linear-to-r from-emerald-500 to-teal-600 text-white font-medium shadow-sm border-0"
                        >
                          {{ accessory }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="space-y-2 text-sm text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700 pt-4">
                <div class="flex items-center justify-between">
                  <span>{{ $t('cart.subtotal', 'المجموع') }}</span>
                  <span class="font-medium">
                    {{ formatPrice(subtotal) }}
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <span>{{ $t('checkout.shipping', 'الشحن') }}</span>
                  <span class="font-medium">
                    {{ selectedFee ? formatPrice(selectedFee.value) : formatPrice(0) }}
                  </span>
                </div>
                <div v-if="couponDiscount > 0" class="flex items-center justify-between text-green-600 dark:text-green-400">
                  <span>{{ $t('checkout.discount', 'Discount') }}</span>
                  <span class="font-medium">- {{ formatPrice(couponDiscount) }}</span>
                </div>
              </div>

              <div
                class="border-t border-gray-200 dark:border-gray-700 pt-3 mt-2 flex items-center justify-between"
              >
                <span class="text-base font-semibold text-gray-900 dark:text-white">
                  {{ $t('cart.total', 'الإجمالي') }}
                </span>
                <span class="text-2xl font-bold text-primary">
                  {{ formatPrice(grandTotal) }}
                </span>
              </div>

              <div
                v-if="errorMessage"
                class="text-sm text-red-500 dark:text-red-400"
              >
                {{ errorMessage }}
              </div>

              <div class="space-y-4">
                <!-- Coupon & Points -->
                <div class="space-y-4 pt-2">
                  <div class="space-y-2">
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Ticket class="w-4 h-4" />
                      {{ $t('checkout.couponCode', 'Coupon Code') }}
                    </label>
                    <div class="flex gap-2">
                      <Input
                        v-model="coupon"
                        :placeholder="$t('checkout.enterCoupon', 'Enter coupon code')"
                        class="flex-1"
                      />
                      <Button 
                        type="button"
                        variant="outline" 
                        @click="applyCoupon"
                        :disabled="!coupon || isApplyingCoupon"
                      >
                        <Loader2 v-if="isApplyingCoupon" class="w-4 h-4 animate-spin" />
                        <span v-else>{{ $t('common.apply', 'Apply') }}</span>
                      </Button>
                    </div>
                    <p v-if="couponError" class="text-xs text-red-500">{{ couponError }}</p>
                    <p v-if="couponDiscount > 0" class="text-xs text-green-600">{{ $t('checkout.couponApplied', 'Coupon applied successfully') }}</p>
                  </div>

                  <div v-if="authStore.user?.points && authStore.user.points > 0" class="space-y-2">
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Coins class="w-4 h-4 text-yellow-500" />
                      {{ $t('checkout.points', 'Points') }}
                      <span class="text-xs text-gray-500">({{ authStore.user.points }} {{ $t('common.available', 'available') }})</span>
                    </label>
                    <Input
                      type="number"
                      v-model="pointsToUse"
                      :max="authStore.user.points"
                      min="0"
                      :placeholder="$t('checkout.enterPoints', 'Points to redeem')"
                    />
                  </div>
                </div>

                <div class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <Checkbox
                    id="terms"
                    v-model="hasAcceptedTerms"
                  />
                  <label
                    for="terms"
                    class="cursor-pointer select-none leading-snug"
                  >
                    {{ $t('checkout.acceptTermsLabel', 'I have read and agree to the terms and conditions') }}
                  </label>
                </div>

                <div class="space-y-2">
                  <label
                    for="order-note"
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    {{ $t('checkout.orderNote', 'Order Note') }}
                  </label>
                  <Textarea
                    id="order-note"
                    v-model="orderNote"
                    :placeholder="$t('checkout.orderNotePlaceholder', 'Any notes about your order (optional)...')"
                    class="min-h-[90px]"
                  />
                </div>

                <div class="space-y-3">
                <Button
                  class="w-full gap-2"
                  size="lg"
                  :disabled="!canSubmit"
                  @click="handleConfirmOrder"
                >
                  <Loader2 v-if="isSubmitting" class="w-5 h-5 animate-spin" />
                  <ShoppingCart v-else class="w-5 h-5" />
                  <span>
                    {{ $t('checkout.confirmOrder', 'تأكيد الطلب') }}
                  </span>
                </Button>

                <Button
                  class="w-full gap-2"
                  size="lg"
                  variant="outline"
                  @click="navigateTo('/cart')"
                >
                  <ShoppingBag class="w-5 h-5" />
                  {{ $t('checkout.backToCart', 'العودة لعربة التسوق') }}
                </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { ShoppingCart, ShoppingBag, Loader2, Home, Briefcase, MapPin, Package, Mail, Tag, CreditCard, Coins, Ticket, Navigation, Landmark } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { Checkbox } from '~/components/ui/checkbox'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { apiFetch } from '~/api/useApiFetch'
import { api } from '~/api/useApi'
import { useCart } from '~/composables/useCart'
import { useCreateOrder } from '~/composables/useCreateOrder'
import AddAddressDialog from '~/components/address/AddAddressDialog.vue'

definePageMeta({
  layout: 'default',
})

useHead({
  title: 'Checkout',
  meta: [
    {
      name: 'description',
      content: 'Choose address and shipping, then confirm your order.',
    },
  ],
})

const { t, locale } = useI18n()
const { formatPrice, currency } = useCurrency()
const cart = useCart()
const toast = useToast()
const authStore = useAuthStore()
const { createOrder } = useCreateOrder()
const { setOrderData } = useOrderSuccess()
interface FeeItem {
  id: number | string
  name: string
  value: number
  is_default: number
  shipping_company_id: number | string
  city_id: number | string
}

interface PaymentMethodItem {
  id: number | string
  name: string
  image?: string
  ar_description?: string
  en_description?: string
  payment_method?: {
    id: number
    ar_name: string
    en_name: string
    type: number
    payment_id?: string  // For payment gateways like Moyasar
    payment_secret?: string  // For payment gateways like Moyasar
    payment_type?: number
  }
}

interface AddressItem {
  id: number
  label: string | null
  address: string
  ship_to_location: string
  bill_to_location: string
  long: string | null
  lat: string | null
  is_default: boolean
  branch_type?: string | null
  country_db_id: string | number | null
  country_id: string
  country_name: string | null
  governorate_id: number
  governorate_name: string | null
  city_id: number
  city_name: string | null
  nighbourhood_id: number
  nighbourhood_name: string | null
  postal_code: string | null
  last_update: string
}

const branchIconMap: Record<string, any> = {
  home: Home,
  work: Briefcase,
  other: Tag,
}

const getBranchTypeIcon = (type?: string | null) => {
  if (!type) return branchIconMap.other
  return branchIconMap[type] || branchIconMap.other
}

const getBranchTypeLabelKey = (type?: string | null) => {
  if (type === 'home' || type === 'work' || type === 'other') {
    return `profile.${type}`
  }
  return 'profile.other'
}

const formatAddressDetails = (address?: string | null, branchType?: string | null) => {
  if (address && address.trim().length > 0) {
    const trimmed = address.trim()
    const normalized = trimmed.toLowerCase()
    if (normalized === 'home' || normalized === 'work' || normalized === 'other') {
      return t(`profile.${normalized}`)
    }
    return trimmed
  }
  const labelKey = getBranchTypeLabelKey(branchType)
  return t(labelKey)
}

const isLoading = ref(true)
const isUnauthorized = ref(false)
const isSubmitting = ref(false)
const fees = ref<FeeItem[]>([])
const paymentMethods = ref<PaymentMethodItem[]>([])
const addresses = ref<AddressItem[]>([])
const selectedFeeId = ref<number | string | null>(null)
const selectedPaymentMethodId = ref<number | string | null>(null)
const selectedAddressId = ref<number | null>(null)
const errorMessage = ref('')
const hasAcceptedTerms = ref(false)
const orderNote = ref('')
const coupon = ref('')
const pointsToUse = ref<number | ''>('')

const subtotal = computed(() => {
  if (authStore.isAuthenticated && cart.cartTotalFromApi.value) {
    return cart.cartTotalFromApi.value
  }
  return cart.cartTotal.value
})

const selectedFee = computed(
  () => fees.value.find((f) => f.id === selectedFeeId.value) || null
)

const selectedPaymentMethod = computed(
  () => paymentMethods.value.find((pm) => pm.id === selectedPaymentMethodId.value) || null
)

const couponDiscount = ref(0)
const isApplyingCoupon = ref(false)
const couponError = ref('')

const applyCoupon = async () => {
  if (!coupon.value) return

  isApplyingCoupon.value = true
  couponError.value = ''
  couponDiscount.value = 0

  try {
    const { data, error } = await apiFetch<any>('/coupons/cart_valid', {
      method: 'POST',
      body: { coupon: coupon.value }
    })

    if (error) throw error

    if (data?.status === 'success' && data?.data?.discount) {
      couponDiscount.value = Number(data.data.discount)
      toast.success(data.message || t('checkout.couponApplied', 'Coupon applied successfully'))
    } else {
       couponError.value = t('checkout.invalidCoupon', 'Invalid coupon')
       toast.error(t('checkout.invalidCoupon', 'Invalid coupon'))
    }
  } catch (err: any) {
    console.error(err)
    // Show the specific error message from API response
    let msg = err.data?.message || err.message || t('checkout.invalidCoupon', 'Invalid coupon')
    
    // Handle specific error case for "Coupon not exist"
    if (msg === 'Coupon not exist' || msg.includes('Coupon not exist')) {
      msg = t('checkout.couponNotExist', 'Coupon not exist')
    }
    
    couponError.value = msg
    toast.error(msg)
  } finally {
    isApplyingCoupon.value = false
  }
}

const grandTotal = computed(() => {
  const feeValue = selectedFee.value ? Number(selectedFee.value.value || 0) : 0
  const total = Number(subtotal.value || 0) + feeValue - couponDiscount.value
  return total > 0 ? total : 0
})

const canSubmit = computed(() => {
  return (
    hasAcceptedTerms.value
  )
})

// Helper function to get accessory names (for display purposes)
const getAccessoryNames = (accessories: number[] | any[]): string[] => {
  if (!accessories || !Array.isArray(accessories)) return []
  
  // If accessories are objects with name property
  if (accessories.length > 0 && typeof accessories[0] === 'object' && accessories[0].name) {
    return accessories.map((acc: any) => {
      const name = locale.value === 'ar' ? (acc.ar_name || acc.name) : (acc.en_name || acc.name)
      return name || acc.name || t('product.accessory', 'إكسسوار')
    })
  }
  
  // If accessories are just IDs, show generic labels
  return accessories.map((_, idx) => `${t('product.accessory', 'إكسسوار')} ${idx + 1}`)
}

const fetchPaymentMethods = async (cityId?: number | string | null) => {
  paymentMethods.value = []
  selectedPaymentMethodId.value = null

  if (!cityId) {
    return
  }

  const { data, error } = await apiFetch<{ data: any[] }>(`/payment_methods/city/${cityId}`)
  if (error) {
    console.error('Failed to fetch payment methods', error)
    return
  }

const methods = (data?.data || []).map((pm: any) => {
let imageUrl = pm.image || null
if (imageUrl && !imageUrl.startsWith('http')) {
imageUrl = `https://ecommerce.mtsc.tech/public/${imageUrl}`
}
return {
id: pm.id,
name: locale.value === 'ar' ? pm.ar_name : pm.en_name,
image: imageUrl,
ar_description: pm.ar_description,
en_description: pm.en_description,
payment_method: {
  id: pm.payment_method?.id,
  ar_name: pm.payment_method?.ar_name,
  en_name: pm.payment_method?.en_name,
  type: pm.payment_method?.type,
  payment_id: pm.payment_id,
  payment_secret: pm.payment_secret,
  payment_type: pm.payment_type
}
}
})

  paymentMethods.value = methods
  
  if (methods.length > 0) {
    selectedPaymentMethodId.value = methods[0].id
  }
}

const fetchShippingOptions = async (cityId?: number | string | null) => {
  fees.value = []
  selectedFeeId.value = null

  if (!cityId) {
    return
  }

  const { data, error } = await apiFetch<{ data: any[] }>(`/shipping_companies_city/${cityId}`)
  if (error) {
    console.error('Failed to fetch shipping companies', error)
    return
  }

  const companies = data?.data || []
  const normalizedCityId = String(cityId)
  const options: FeeItem[] = companies
    .map((company: any) => {
      const cityEntry = Array.isArray(company.cities)
        ? company.cities.find((c: any) => String(c.city_id) === normalizedCityId)
        : null

      if (!cityEntry) return null

      return {
        id: cityEntry.cl_organization_id || company.id,
        name: locale.value === 'ar' ? company.ar_name : company.en_name,
        value: Number(cityEntry.price || 0),
        is_default: company.is_default || 0,
        shipping_company_id: company.id,
        city_id: cityEntry.city_id,
      }
    })
    .filter(Boolean) as FeeItem[]

  fees.value = options

  const defaultOption = options.find((f) => f.is_default === 1) || options[0]
  selectedFeeId.value = defaultOption ? defaultOption.id : null
}

const fetchAddresses = async () => {
  const { data, error } = await apiFetch<{ data: AddressItem[] }>('/addresses')
  if (error) {
    console.error('Failed to fetch addresses', error)
    return
  }

  const list = data?.data || []
  // استبعاد السجل الفارغ اللي country_id = '0'
  const filtered = list.filter((a) => a.country_id !== '0')
  addresses.value = filtered

  const defaultAddress = filtered.find((a) => a.is_default)
  if (defaultAddress) {
    selectedAddressId.value = defaultAddress.id
    await fetchShippingOptions(defaultAddress.city_id)
    await fetchPaymentMethods(defaultAddress.city_id)
    return
  }

  if (filtered.length > 0) {
    selectedAddressId.value = filtered[0].id
    await fetchShippingOptions(filtered[0].city_id)
    await fetchPaymentMethods(filtered[0].city_id)
  }
}

const createDialogOpen = ref(false)

const handleAddressCreated = async (data: any) => {
  // Refresh addresses
  await fetchAddresses()
  
  // Select the new address if it has an ID
  if (data && data.id) {
    selectedAddressId.value = data.id
  }
}

onMounted(async () => {
  isLoading.value = true

  if (!authStore.isAuthenticated) {
    isUnauthorized.value = true
    isLoading.value = false
    return
  }

  await cart.fetchCartFromAPI()
  await fetchAddresses()

  isLoading.value = false
})

watch(
  () => selectedAddressId.value,
  (newId, oldId) => {
    if (newId === oldId) return
    const address = addresses.value.find((a) => a.id === newId)
    if (address) {
      fetchShippingOptions(address.city_id)
      fetchPaymentMethods(address.city_id)
    } else {
      fees.value = []
      selectedFeeId.value = null
      paymentMethods.value = []
      selectedPaymentMethodId.value = null
    }
  }
)

const handleConfirmOrder = async () => {
  if (!selectedAddressId.value || !selectedFeeId.value || !selectedPaymentMethodId.value || cart.cartItemCount.value === 0) {
    errorMessage.value = t(
      'checkout.fillAll',
      'من فضلك اختر العنوان وطريقة الشحن وطريقة الدفع أولاً.'
    )
    return
  }

  if (!hasAcceptedTerms.value) {
    errorMessage.value = t(
      'checkout.acceptTerms',
      'يجب أن توافق على الشروط والأحكام أولاً.'
    )
    return
  }

  errorMessage.value = ''
  isSubmitting.value = true

  try {
    const selectedAddress = addresses.value.find(
      (a) => a.id === selectedAddressId.value
    )
    const fee = fees.value.find((f) => f.id === selectedFeeId.value)
    const paymentMethod = paymentMethods.value.find((pm) => pm.id === selectedPaymentMethodId.value)

    if (!selectedAddress || !fee || !paymentMethod) {
      errorMessage.value = t(
        'checkout.fillAll',
        'من فضلك اختر العنوان وطريقة الشحن وطريقة الدفع أولاً.'
      )
      return
    }

    const items = cart.cartItems.value.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }))
    const shippingName = locale.value === 'ar' ? `شحن (${fee.name})` : `Shipping (${fee.name})`
    
    items.push({
      id: fee.id,
      name: shippingName,
      price: fee.value,
      quantity: 1,
    })
    const response = await createOrder({
      items,
      shipCostValue: fee.value,
      shipCostName: fee.name,
      userAddress: {
        id: selectedAddress.id,
        name:
          (authStore.user &&
            ((authStore.user.email as string) ||
              (authStore.user.name as string))) ||
          '',
        line1: selectedAddress.address,
        line2: '',
        city: selectedAddress.city_name || '',
        state: selectedAddress.governorate_name || '',
        postalCode: selectedAddress.postal_code || '',
        country: selectedAddress.country_name || '',
      },
      feeId: fee.id,
      paymentMethodId: paymentMethod.id,
      cityId: selectedAddress.city_id,
      shippingCompanyId: fee.shipping_company_id,
      coupon: coupon.value || undefined,
      points: pointsToUse.value ? Number(pointsToUse.value) : undefined,
      orderNote: orderNote.value || undefined,
    })

    console.log('create-order response', response)

    if (response.order?.id) {
      toast.success(
        t('checkout.confirmed', 'تم إنشاء الطلب بنجاح.')
      )

      if (response.url) {
        setOrderData(response)

        try {
          await navigateTo('/payment')
        } catch (error) {
          console.error('Navigation error', error)
          toast.error(t('messages.error', 'حدث خطأ أثناء الانتقال لصفحة الدفع'))
        }
      } else {
        try {
          setOrderData(response)
          await navigateTo('/order-success')
        } catch (error) {
          console.error('Navigation error', error)
          toast.error(t('messages.error', 'حدث خطأ أثناء الانتقال لصفحة النجاح'))
        }
      }
    } else {
      toast.error(t('messages.error', 'حدث خطأ ما أثناء إنشاء الطلب'))
    }
  } catch (error) {
    console.error(error)
    toast.error(t('messages.error', 'حدث خطأ ما'))
  } finally {
    isSubmitting.value = false
  }
}
</script>