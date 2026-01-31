<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 md:px-8">
    <div class="max-w-5xl mx-auto space-y-8">
      <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="space-y-1">
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            {{ $t('profile.orders') }}
            <Badge variant="secondary" class="rounded-full px-3" v-if="ordersTotalItems > 0">
              {{ ordersTotalItems }}
            </Badge>
          </h1>
          <p class="text-muted-foreground text-sm sm:text-base">
            {{ $t('profile.overview') }}
          </p>
        </div>
        
        <Button variant="outline" size="sm" class="gap-2 w-full sm:w-auto" @click="refreshOrders" :disabled="ordersLoading">
          <RefreshCw :class="['w-4 h-4', ordersLoading ? 'animate-spin' : '']" />
          {{ $t('common.refresh') }}
        </Button>
      </header>

      <div v-if="ordersLoading" class="space-y-6">
        <Card v-for="i in 3" :key="i" class="overflow-hidden border-gray-200 dark:border-gray-800">
          <CardHeader class="bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800 space-y-0 pb-4">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
                <div class="space-y-2">
                  <div class="h-3 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                  <div class="h-3 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                </div>
              </div>
              <div class="flex flex-col items-end gap-2">
                <div class="h-6 w-24 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" />
                <div class="h-6 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              </div>
            </div>
          </CardHeader>
          <CardContent class="p-6">
            <div class="space-y-6">
              <div class="flex gap-4">
                <div class="w-20 h-20 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse shrink-0" />
                <div class="flex-1 space-y-2">
                  <div class="h-4 w-3/4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                  <div class="h-3 w-1/2 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div v-else-if="orders.length === 0" class="flex flex-col items-center justify-center py-16 text-center space-y-6 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl bg-white/50 dark:bg-gray-900/50">
        <div class="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <PackageX class="w-10 h-10 text-gray-400" />
        </div>
        <div class="space-y-2">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">{{ $t('profile.noOrders') }}</h3>
          <p class="text-muted-foreground max-w-xs mx-auto">{{ $t('profile.noOrdersDescription', 'You haven\'t placed any orders yet.') }}</p>
        </div>
        <Button size="lg" @click="navigateTo('/')">
          {{ $t('common.shopNow') }}
        </Button>
      </div>

      <div v-else class="space-y-6">
        <Card
          v-for="order in orders"
          :key="order.id"
          class="group overflow-hidden border-gray-200 dark:border-gray-800 hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md"
        >
          <CardHeader class="bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800 space-y-0 pb-4">
            <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div class="flex items-center gap-3 sm:gap-4">
                <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                  #{{ order.id }}
                </div>
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-2 text-sm text-muted-foreground mb-0.5">
                    <Calendar class="w-3.5 h-3.5 flex-shrink-0" />
                    <span class="truncate">{{ $t('profile.placedOn', { date: order.date }) }}</span>
                  </div>
                </div>
              </div>

              <div class="flex flex-row lg:flex-col items-center justify-between gap-2 lg:gap-1">
                <div class="flex items-center gap-2">
                  <Badge :class="getOrderStatusClasses(order.status)" variant="outline" class="capitalize px-3 py-1 text-xs sm:text-sm">
                     {{ getStatusLabel(order.status) }}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    @click="toggleOrderDetails(order.id)"
                    class="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                  >
                    <ChevronDown :class="['w-4 h-4 transition-transform', isOrderExpanded(order.id) ? 'rotate-180' : '']" />
                  </Button>
                </div>
                <div class="text-lg sm:text-xl font-bold text-primary">
                  {{ formatMoney(order.subtotal) }}
                </div>
              </div>
            </div>
          </CardHeader>

          <!-- Detailed View (Expandable) -->
          <div v-if="isOrderExpanded(order.id)" class="border-b border-gray-100 dark:border-gray-800">
            <div class="p-6 space-y-6 bg-blue-50/30 dark:bg-blue-900/10">
              <div class="flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-300 mb-4">
                <Info class="w-4 h-4" />
                {{ $t('profile.orderDetails', 'Order Details') }}
              </div>
              
              <!-- Order Items with Full Details -->
              <div class="space-y-4">
                <div
                  v-for="(item, itemIndex) in order.items"
                  :key="item.id || itemIndex"
                  class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
                >
                  <!-- Item Header -->
                  <div class="flex flex-col sm:flex-row gap-4 mb-4">
                    <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shrink-0 mx-auto sm:mx-0">
                      <img
                        :src="getItemImage(item)"
                        :alt="getItemName(item)"
                        class="w-full h-full object-contain p-1"
                        loading="lazy"
                        @error="onItemImageError"
                      />
                    </div>
                    <div class="flex-1 text-center sm:text-left">
                      <h4 class="font-semibold text-gray-900 dark:text-white mb-1">
                        {{ getItemName(item) }}
                      </h4>
                      <div v-if="getItemVariantLabel(item)" class="text-sm text-muted-foreground mb-2">
                        {{ $t('profile.variant', 'Variant') }}: {{ getItemVariantLabel(item) }}
                      </div>
                      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 text-sm">
                        <span class="text-muted-foreground">{{ $t('profile.quantity', 'Quantity') }}: {{ item.quantity }}</span>
                        <div class="text-right sm:text-left">
                          <div v-if="item.differents?.discount && Number(item.differents.discount) > 0" class="space-y-1">
                            <div class="text-sm text-muted-foreground line-through">
                              {{ formatMoney(item.differents.price) }}
                            </div>
                            <div class="font-semibold text-primary">
                              {{ formatMoney(Number(item.differents?.price || 0) - Number(item.differents?.discount || 0)) }}
                            </div>
                            <div class="text-xs text-green-600 dark:text-green-400">
                              {{ $t('profile.discount', 'Discount') }}: {{ formatMoney(item.differents.discount) }}
                            </div>
                          </div>
                          <div v-else class="font-semibold text-primary">
                            {{ formatMoney(Number(item.differents?.price || 0) - Number(item.differents?.discount || 0)) }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Accessories Details -->
                  <div v-if="item.accessories && item.accessories.length > 0" class="space-y-3">
                    <h5 class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <span class="w-2 h-2 bg-primary rounded-full"></span>
                      {{ $t('profile.includedAccessories', 'Included Accessories') }}
                    </h5>
                    <div class="space-y-2">
                      <div
                        v-for="(accessory, accIndex) in item.accessories"
                        :key="accIndex"
                        class="bg-gray-50 dark:bg-gray-800 rounded-md p-3 text-sm"
                      >
                        <div class="flex justify-between items-start gap-2">
                          <div class="flex-1">
                            <div class="font-medium text-gray-900 dark:text-white mb-1">
                              {{ getAccessoryGroupName(accessory) }}
                            </div>
                            <div class="text-muted-foreground">
                              {{ getAccessoryName(accessory) }}
                            </div>
                            <div v-if="accessory.accessory?.qty" class="text-xs text-muted-foreground mt-1">
                              {{ $t('profile.quantity', 'Quantity') }}: {{ accessory.accessory.qty }}
                            </div>
                          </div>
                          <div class="text-right">
                            <div v-if="accessory.accessory?.discount && Number(accessory.accessory.discount) > 0" class="space-y-1">
                              <div class="text-sm text-muted-foreground line-through">
                                {{ formatMoney(accessory.accessory.price) }}
                              </div>
                              <div class="font-semibold text-primary">
                                {{ formatMoney(Number(accessory.accessory.price) - Number(accessory.accessory.discount)) }}
                              </div>
                              <div class="text-xs text-green-600 dark:text-green-400">
                                {{ $t('profile.discount', 'Discount') }}: {{ formatMoney(accessory.accessory.discount) }}
                              </div>
                            </div>
                            <div v-else class="font-semibold text-primary">
                              {{ formatMoney(accessory.accessory?.price || 0) }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Item Total -->
                  <div class="pt-3 mt-3 border-t border-gray-200 dark:border-gray-700">
                    <div class="flex justify-between items-center">
                      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {{ $t('profile.itemTotal', 'Item Total') }}
                      </span>
                      <span class="font-bold text-primary">
                        {{ formatMoney(calculateItemTotal(item)) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Price Breakdown -->
              <div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <h5 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  {{ $t('profile.priceBreakdown', 'Price Breakdown') }}
                </h5>
                <div class="space-y-2">
                  <div class="flex justify-between text-sm">
                    <span class="text-muted-foreground">{{ $t('profile.subtotal') }}</span>
                    <span>{{ formatMoney(Number(order.subtotal) - Number(order.total)) }}</span>
                  </div>
                  <div v-if="order.fee && order.fee.value && Number(order.fee.value) > 0" class="flex justify-between text-sm">
                    <span class="text-muted-foreground">{{ order.fee.name || $t('profile.shippingFee') }}</span>
                    <span>{{ formatMoney(order.fee.value) }}</span>
                  </div>
                  <div v-if="order.total" class="flex justify-between text-sm font-semibold pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span>{{ $t('profile.total') }}</span>
                    <span class="text-primary"> {{ formatMoney(order.subtotal) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <CardContent class="p-0">
            <div class="divide-y divide-gray-100 dark:divide-gray-800">
              <div
                v-for="item in order.items"
                :key="item.id"
                class="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 group/item hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <!-- Item Image -->
                <div class="relative w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shrink-0 mx-auto sm:mx-0">
                  <img
                    :src="getItemImage(item)"
                    :alt="getItemName(item)"
                    class="w-full h-full object-contain p-1"
                    loading="lazy"
                    @error="onItemImageError"
                  />
                </div>

                <!-- Item Details -->
                <div class="flex-1 min-w-0">
                   <div class="flex flex-col gap-3">
                     <div class="space-y-1">
                       <NuxtLink :to="getProductLink(item)" class="font-semibold text-gray-900 dark:text-white hover:text-primary transition-colors line-clamp-2 text-center sm:text-left">
                         {{ getItemName(item) }}
                       </NuxtLink>
                       
                       <!-- Variants -->
                       <div v-if="getItemVariantLabel(item)" class="flex justify-center sm:justify-start">
                         <Badge variant="secondary" class="text-xs font-normal px-1.5 py-0 h-5">
                           {{ getItemVariantLabel(item) }}
                         </Badge>
                       </div>

                       <!-- Accessories -->
                       <div v-if="item.accessories?.length" class="pt-1">
                         <div class="flex flex-wrap justify-center sm:justify-start gap-2">
                           <Badge 
                              v-for="(accessory, idx) in item.accessories" 
                              :key="idx"
                              variant="outline" 
                              class="text-[10px] px-1.5 py-0 h-5 bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700"
                            >
                             {{ getAccessoryLabel(accessory) }}
                           </Badge>
                         </div>
                       </div>
                     </div>

                     <!-- Price & Qty -->
                     <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                       <div class="text-center sm:text-left">
                         <div class="text-xs text-muted-foreground mb-1">{{ $t('profile.quantity', 'Quantity') }}: {{ item.quantity }}</div>
                       </div>
                       <div class="text-center sm:text-right">
                         <!-- Original Price (with strikethrough if discounted) -->
                         <div v-if="item.discount_price" class="text-sm text-muted-foreground line-through mb-1">
                           {{ formatMoney(item.price) }}
                         </div>
                         <!-- Discounted Price or Regular Price -->
                         <div class="font-bold text-gray-900 dark:text-white mb-1">
                           {{ formatMoney(item.discount_price || item.price) }}
                         </div>
                         <!-- Discount Badge (if discounted) -->
                         <div v-if="item.discount_price" class="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs px-2 py-0.5 rounded-full inline-block mb-1">
                           {{ $t('profile.discounted', 'Discounted') }}
                         </div>
                       </div>
                     </div>
                   </div>
                </div>
              </div>
            </div>

            <!-- Order Footer Stats -->
             <div class="bg-gray-50/50 dark:bg-gray-900/50 p-4 border-t border-gray-100 dark:border-gray-800 text-sm">
               <div class="flex flex-col gap-4">
                 <div v-if="order.note" class="bg-yellow-50 dark:bg-yellow-900/10 text-yellow-700 dark:text-yellow-400 px-3 py-2 rounded-md border border-yellow-200 dark:border-yellow-900/30 text-xs">
                   <span class="font-semibold block mb-0.5">{{ $t('profile.orderNoteLabel') }}:</span>
                   {{ order.note }}
                 </div>

                 <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                   <div class="flex flex-col gap-1">
                      <div class="flex justify-between text-muted-foreground">
                        <span>{{ $t('profile.subtotal') }}</span>
                        <span>{{ formatMoney(Number(order.subtotal) - Number(order.total)) }}</span>
                      </div>
                   </div>
                   <div class="text-lg sm:text-xl font-bold text-primary">
                     {{ formatMoney(order.subtotal) }}
                   </div>
                 </div>
               </div>
             </div>
          </CardContent>
        </Card>

        <!-- Pagination -->
        <div class="flex justify-center py-8" v-if="ordersTotalPages > 1">
          <Pagination 
            v-slot="{ page }" 
            :total="ordersTotalItems" 
            :sibling-count="1" 
            :default-page="1"
            :items-per-page="15"
            :page="ordersPage"
            @update:page="changeOrdersPage"
            show-edges
          >
            <PaginationContent v-slot="{ items }" class="flex items-center gap-1">
              <PaginationFirst />
              <PaginationPrevious />

              <template v-for="(item, index) in items">
                <PaginationItem
                  v-if="item.type === 'page'"
                  :key="index"
                  :value="item.value"
                  :is-active="item.value === page"
                >
                  {{ item.value }}
                </PaginationItem>
                <PaginationEllipsis v-else :key="item.type" :index="index" />
              </template>

              <PaginationNext />
              <PaginationLast />
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Calendar, MapPin, PackageX, RefreshCw, ChevronDown, ChevronUp, Info } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationFirst,
  PaginationPrevious,
  PaginationNext,
  PaginationLast,
  PaginationEllipsis,
} from '@/components/ui/pagination'

import { useProfileOrders } from '~/composables/useProfileOrders'
import { useCurrency } from '~/composables/useCurrency'
import { useSiteSettingsStore } from '~/stores/siteSettings'
import { number } from 'zod'

const { t, locale } = useI18n()
const { formatPrice } = useCurrency()
const siteSettingsStore = useSiteSettingsStore()

const {
  orders,
  ordersLoading,
  ordersPage,
  ordersTotalPages,
  ordersTotalItems,
  fetchOrders,
  changeOrdersPage,
} = useProfileOrders()

// Expanded orders state
const expandedOrders = ref<Set<number>>(new Set())

const toggleOrderDetails = (orderId: number) => {
  const newExpanded = new Set(expandedOrders.value)
  if (newExpanded.has(orderId)) {
    newExpanded.delete(orderId)
  } else {
    newExpanded.add(orderId)
  }
  expandedOrders.value = newExpanded
}

const isOrderExpanded = (orderId: number) => {
  return expandedOrders.value.has(orderId)
}

const refreshOrders = () => {
  fetchOrders(ordersPage.value)
}

const formatMoney = (value: number | string | null | undefined) => {
  return formatPrice(value ?? 0)
}

const getPreferredText = (arText?: string | null, enText?: string | null, fallback?: string | null) => {
  const isArabic = locale.value.startsWith('ar')
  return (isArabic ? arText || enText : enText || arText) || fallback || ''
}

const getItemName = (item: any) => {
  const variant = item?.differents
  return (
    getPreferredText(variant?.ar_name || variant?.name, variant?.en_name || variant?.name, variant?.name) ||
    t('profile.orderItemFallback', 'Product')
  )
}

const getItemVariantLabel = (item: any) => {
  const variant = item?.differents
  const label = getPreferredText(variant?.ar_different, variant?.en_different, variant?.different)
  if (!label || label?.toLowerCase() === 'no') return ''
  return label
}

const getAccessoryGroupName = (accessory: any) => {
  const group = accessory?.group
  return group ? getPreferredText(group.ar_name || group.name, group.en_name || group.name, group.name) : ''
}

const getAccessoryName = (accessory: any) => {
  const acc = accessory?.accessory
  return acc ? getPreferredText(acc.ar_name || acc.name, acc.en_name || acc.name, acc.name) : ''
}

const calculateItemTotal = (item: any) => {
  // Return only the main item price * quantity
  // Accessories are already included in the main price based on the API response
  return Number(item.price || 0) * Number(item.quantity || 1)
}

const getAccessoryLabel = (selection: any) => {
  const groupName = selection?.group
    ? getPreferredText(selection.group.ar_name || selection.group.name, selection.group.en_name || selection.group.name, selection.group.name)
    : ''
  const accessoryName = selection?.accessory
    ? getPreferredText(selection.accessory.ar_name || selection.accessory.name, selection.accessory.en_name || selection.accessory.name, selection.accessory.name)
    : ''

  const price = selection?.accessory?.price ? Number(selection.accessory.price) : 0
  const priceText = price > 0 ? ` (${formatPrice(price)})` : ''

  if (groupName && accessoryName) {
    return `${groupName}: ${accessoryName}${priceText}`
  }

  return (accessoryName || groupName || '') + priceText
}

const getItemImage = (item: any) => {
  const variant = item?.differents
  const imageFromVariant = variant?.imageUrl || variant?.images?.data?.[0]
  return imageFromVariant || '/placeholder.png'
}

const onItemImageError = (event: Event) => {
  const target = event.target as HTMLImageElement | null
  if (!target) return
  if (target.src.endsWith('/placeholder.png')) return
  target.src = '/placeholder.png'
}

const getProductLink = (item: any) => {
  const slug = item?.differents?.slug || item?.differents?.name || ''
  return slug ? `/products/${encodeURIComponent(slug)}` : '/products'
}

const statusTranslationMap = {
  new: 'profile.status.new',
  pending: 'profile.status.pending',
  processing: 'profile.status.processing',
  completed: 'profile.status.completed',
  delivered: 'profile.status.delivered',
  canceled: 'profile.status.canceled',
  cancelled: 'profile.status.canceled',
  failed: 'profile.status.failed',
} as const

type StatusIdentifier = keyof typeof statusTranslationMap

const getStatusLabel = (status: string) => {
  const normalized = status.toLowerCase()
  const keys = Object.keys(statusTranslationMap) as StatusIdentifier[]
  const matchedKey = keys.find(identifier => normalized.includes(identifier))

  if (!matchedKey) {
    return status
  }

  const translationKey = statusTranslationMap[matchedKey]
  return t(translationKey)
}

const getOrderStatusClasses = (status: string) => {
  const normalized = status.toLowerCase()

  if (normalized.includes('pending') || normalized.includes('await') || normalized.includes('new')) {
    return 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 border-blue-200 dark:border-blue-800'
  }

  if (
    normalized.includes('processing') ||
    normalized.includes('in-progress') ||
    normalized.includes('progress')
  ) {
    return 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800'
  }

  if (
    normalized.includes('completed') ||
    normalized.includes('delivered') ||
    normalized.includes('done')
  ) {
    return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300 border-green-200 dark:border-green-800'
  }

  if (
    normalized.includes('cancel') ||
    normalized.includes('rejected') ||
    normalized.includes('failed')
  ) {
    return 'bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-red-400 border-destructive/20 dark:border-destructive/30'
  }

  return 'bg-gray-100 text-gray-700 dark:bg-gray-800/40 dark:text-gray-200 border-gray-200 dark:border-gray-700'
}

onMounted(() => {
  fetchOrders(1)
})

usePageSeo({
  title: () => t('profile.orders'),
  description: () => "View your order history and track your purchases.",
  image: () => "/placeholder.png",
  type: "website",
})
</script>
