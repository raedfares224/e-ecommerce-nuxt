<template>
  <div class="min-h-screen bg-white dark:bg-gray-950">
    <BaseBreadcrumb>
        <NuxtLink to="/">
          {{ $t('nav.home') }}
        </NuxtLink>
       
        <span>
        /   {{ $t('common.compare') }}
        </span>
    </BaseBreadcrumb>
    <div class="container mx-auto px-4 py-8">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {{ $t('common.compare') }}
          </h1>
          <p class="text-gray-600 dark:text-gray-400" v-if="compareCount > 0">
            {{ $t('product.items') }}: {{ compareCount }}
          </p>
        </div>
        <Button
          v-if="compareCount > 0"
          variant="outline"
          size="sm"
          @click="clearCompare"
        >
          {{ $t('common.clearAll') }}
        </Button>
      </div>

      <div v-if="compareCount === 0" class="flex flex-col items-center justify-center py-16 text-center">
        <div
          class="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center mb-4"
        >
          <Repeat class="w-8 h-8 text-gray-500" />
        </div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {{ $t('messages.emptyCompare') || 'لا توجد منتجات في المقارنة بعد' }}
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
          {{ $t('messages.emptyCompareDescription') || 'أضف بعض المنتجات إلى المقارنة من صفحة المنتجات لمقارنتها هنا.' }}
        </p>
        <Button @click="goToShop">
          {{ $t('common.shopNow') }}
        </Button>
      </div>

      <div v-else class="w-full overflow-x-auto">
        <Table
          class="min-w-[900px] bg-white/95 dark:bg-gray-900/95 rounded-3xl shadow-xl border border-gray-100/80 dark:border-gray-800/80 overflow-hidden text-sm md:text-base"
        >
          <TableHeader>
            <TableRow>
              <TableHead
                class="w-48 text-xs md:text-sm font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur sticky left-0 z-10"
              >
                {{ $t('common.compare') }}
              </TableHead>
              <TableHead
                v-for="item in compareItems"
                :key="item.id"
                class="text-center align-middle bg-gray-50/80 dark:bg-gray-900/80"
              >
                <div class="flex flex-col items-center gap-3 py-4">
                  <div
                    class="relative w-32 h-32 bg-white dark:bg-gray-950 rounded-2xl flex items-center justify-center overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 transition-transform duration-200 hover:scale-105"
                  >
                    <img
                      :src="item.image"
                      :alt="item.name"
                      loading="lazy"
                      decoding="async"
                      class="w-full h-full object-contain p-3"
                    />
                    <button
                      @click.stop="remove(item.id)"
                      class="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-white/95 dark:bg-gray-900/95 flex items-center justify-center text-gray-500 hover:text-red-500 shadow-md transition-colors"
                    >
                      <X class="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button
                    class="text-xs md:text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 hover:text-primary transition-colors max-w-[170px]"
                    @click="viewProduct(item.slug)"
                  >
                    {{ item.name }}
                  </button>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <!-- Brand & Category -->
            <TableRow class="bg-gray-50/60 dark:bg-gray-900/60">
              <TableCell
                class="font-semibold text-xs md:text-sm text-gray-700 dark:text-gray-200 sticky left-0 z-10 bg-gray-50/60 dark:bg-gray-900/60"
              >
                {{ $t('product.brand') }}/{{ $t('product.category') }}
              </TableCell>
              <TableCell
                v-for="item in compareItems"
                :key="item.id + '-brand'"
                class="text-xs md:text-sm text-gray-700 dark:text-gray-200 text-center"
              >
                <div class="flex flex-col items-center gap-0.5">
                  <span v-if="item.brand" class="font-medium">
                    {{ item.brand }}
                  </span>
                  <span v-if="item.category" class="text-gray-400">
                    {{ item.category }}
                  </span>
                </div>
              </TableCell>
            </TableRow>

            <!-- Price -->
            <TableRow>
              <TableCell
                class="font-semibold text-xs md:text-sm text-gray-700 dark:text-gray-200 sticky left-0 z-10 bg-white/95 dark:bg-gray-900/95"
              >
                {{ $t('product.price') }}
              </TableCell>
              <TableCell
                v-for="item in compareItems"
                :key="item.id + '-price'"
                class="text-base md:text-lg text-center align-middle"
              >
                <div class="flex flex-col items-center gap-1">
                  <span class="text-primary font-bold">
                    {{ formatPrice(item.price) }}
                  </span>
                  <span
                    v-if="item.oldPrice && item.oldPrice > item.price"
                    class="text-xs text-gray-400 line-through"
                  >
                    {{ formatPrice(item.oldPrice) }}
                  </span>
                </div>
              </TableCell>
            </TableRow>

            <!-- Rating -->
            <TableRow class="bg-gray-50/60 dark:bg-gray-900/60">
              <TableCell
                class="font-semibold text-[11px] text-gray-700 dark:text-gray-200 sticky left-0 z-10 bg-gray-50/60 dark:bg-gray-900/60"
              >
                {{ $t('product.rating') }}
              </TableCell>
              <TableCell
                v-for="item in compareItems"
                :key="item.id + '-rating'"
                class="text-xs md:text-sm text-center align-middle"
              >
                <div v-if="item.rating" class="flex flex-col items-center gap-1">
                  <div class="flex">
                    <svg
                      v-for="i in 5"
                      :key="i"
                      class="w-3.5 h-3.5"
                      :class="i <= item.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.37 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.679-5.293z" />
                    </svg>
                  </div>
                  <span v-if="item.reviewsCount" class="text-[11px] text-gray-500">
                    ({{ item.reviewsCount }})
                  </span>
                </div>
                <span v-else class="text-gray-400 text-[11px]">
                  -
                </span>
              </TableCell>
            </TableRow>

            <!-- Stock -->
            <TableRow>
              <TableCell
                class="font-semibold text-[11px] text-gray-700 dark:text-gray-200 sticky left-0 z-10 bg-white/95 dark:bg-gray-900/95"
              >
                {{ $t('product.inStock') }}
              </TableCell>
              <TableCell
                v-for="item in compareItems"
                :key="item.id + '-stock'"
                class="text-xs md:text-sm text-center"
              >
                <span
                  v-if="item.quantity !== undefined"
                  :class="[
                    'inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[11px] font-medium',
                    item.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  ]"
                >
                  {{ item.inStock ? $t('product.inStock') : $t('product.outOfStock') }}
                  <span v-if="item.quantity && item.inStock" class="ml-1">({{ item.quantity }})</span>
                </span>
                <span v-else class="text-gray-400 text-[11px]">-</span>
              </TableCell>
            </TableRow>

            <!-- Actions -->
            <TableRow class="bg-gray-50/60 dark:bg-gray-900/60">
              <TableCell
                class="font-semibold text-[11px] text-gray-700 dark:text-gray-200 sticky left-0 z-10 bg-gray-50/60 dark:bg-gray-900/60"
              >
                {{ $t('common.actions') || 'Actions' }}
              </TableCell>
              <TableCell
                v-for="item in compareItems"
                :key="item.id + '-actions'"
                class="text-center"
              >
                <div class="flex flex-col items-center gap-2">
                  <Button
                    class="w-full max-w-[140px]"
                    size="sm"
                    @click="viewProduct(item.slug)"
                  >
                    {{ $t('common.viewDetails') }}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    class="w-full max-w-[140px]"
                    @click="remove(item.id)"
                  >
                    {{ $t('common.remove') || 'Remove' }}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Repeat, X } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { useCompare } from '~/composables/useCompare'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const router = useRouter()
const { formatPrice } = useCurrency()
const { compareItems, compareCount, loadCompare, removeFromCompare, clearCompare } = useCompare()

onMounted(() => {
  loadCompare()
})

const viewProduct = (slug: string) => {
  router.push(`/products/${slug}`)
}

const remove = (id: number) => {
  removeFromCompare(id)
}

const goToShop = () => {
  router.push('/')
}
</script>
