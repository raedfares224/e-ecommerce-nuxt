<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 md:px-8">
    <div class="max-w-6xl mx-auto space-y-6">
      <!-- Header + Search Bar -->
      <div class="space-y-4">
        <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          {{ $t('common.search') }}
        </h1>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          {{ $t('home.discoverProducts') }}
        </p>

        <form
          class="flex flex-col sm:flex-row gap-3 mt-4"
          @submit.prevent="applySearch"
        >
          <input
            v-model="searchInput"
            type="text"
            :placeholder="$t('common.search')"
            class="flex-1 h-11 px-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-primary/70"
          />
          <Button
            type="submit"
            class="h-11 px-6 flex items-center justify-center"
          >
            {{ $t('common.search') }}
          </Button>
        </form>
      </div>

      <!-- Results Grid -->
      <CategoryProductGrid
        :products="products"
        :loading="loading"
        :current-page="currentPage"
        :total-pages="lastPage"
        :total-results="total"
        :per-page="perPage"
        @page-change="handlePageChange"
        @sort-change="handleSortChange"
      />

      <Pagination
        v-if="lastPage > 1 && total > 0"
        :total="total"
        :per-page="perPage"
        :initial-page="currentPage"
        @page-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from '#imports'
import { useI18n } from 'vue-i18n'

import { Button } from '@/components/ui/button'
import CategoryProductGrid from '@/components/category/ProductGrid.vue'
import Pagination from '~/components/pagination.vue'
import type { CategoryProduct } from '~/types/category'
import { apiFetch } from '@/api/useApiFetch'

interface ProductsResponseMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

interface ProductsResponse {
  data: CategoryProduct[]
  meta?: ProductsResponseMeta
}

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

// State
const products = ref<CategoryProduct[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const currentPage = ref(1)
const lastPage = ref(1)
const perPage = ref(20)
const total = ref(0)

const searchInput = ref<string>('')
const sortBy = ref<string>('default')

// Derived from route
const pageFromRoute = computed(() => {
  const raw = route.query.page
  const n = Array.isArray(raw) ? parseInt(raw[0] as string, 10) : parseInt((raw as string) || '1', 10)
  return Number.isNaN(n) || n <= 0 ? 1 : n
})

const queryFromRoute = computed(() => {
  const raw = route.query.query
  return Array.isArray(raw) ? (raw[0] as string) : ((raw as string) || '')
})

const searchFromRoute = computed(() => {
  const raw = route.query.search
  return Array.isArray(raw) ? (raw[0] as string) : ((raw as string) || '')
})

// Build params to send to API
const buildParams = (page: number) => {
  const params: Record<string, any> = {
    page,
    per_page: 20,
  }

  const query = queryFromRoute.value
  const search = searchFromRoute.value

  if (query) params.query = query
  if (search) params.search = search

  // Map sorting values similar to category page
  if (sortBy.value && sortBy.value !== 'default') {
    if (sortBy.value.startsWith('price-')) {
      const direction = sortBy.value.endsWith('asc') ? 'low-to-high' : 'high-to-low'
      params.sorting = direction
    } else if (sortBy.value === 'new' || sortBy.value === 'new-added') {
      params.sorting = 'new-added'
    } else if (sortBy.value === 'on-sale') {
      params.sorting = 'on-sale'
    } else {
      params.sorting = sortBy.value
    }
  }

  return params
}

const fetchProducts = async (page: number) => {
  loading.value = true
  error.value = null

  try {
    const { data, error: fetchError } = await apiFetch<ProductsResponse>('/products', {
      method: 'GET',
      params: buildParams(page),
    })

    if (fetchError) {
      throw new Error(fetchError.message || 'Failed to load products')
    }

    if (data && data.data) {
      products.value = data.data || []
      currentPage.value = data.meta?.current_page || page
      lastPage.value = data.meta?.last_page || 1
      perPage.value = data.meta?.per_page || perPage.value
      total.value = data.meta?.total || products.value.length
    } else {
      products.value = []
      currentPage.value = page
      lastPage.value = 1
      total.value = 0
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to load products'
    products.value = []
  } finally {
    loading.value = false
  }
}

const syncFromRoute = () => {
  currentPage.value = pageFromRoute.value
  // نستخدم إما query أو search لملء حقل الإدخال (نعطي أولوية لـ search)
  const s = searchFromRoute.value || queryFromRoute.value
  searchInput.value = s
}

// Handlers
const updateRoute = (page: number, searchValue?: string) => {
  const q = { ...route.query }

  q.page = String(page)

  if (searchValue !== undefined) {
    q.search = searchValue
  }

  router.push({
    path: '/products',
    query: q,
  })
}

const applySearch = () => {
  updateRoute(1, searchInput.value.trim())
}

const handlePageChange = (page: number) => {
  updateRoute(page)
}

const handleSortChange = (value: string) => {
  sortBy.value = value
  // إعادة الجلب من الصفحة الأولى مع الترتيب الجديد
  // ملاحظة: لو كنا بالفعل في الصفحة 1 فإن updateRoute(1) لن يغير الـroute
  // لذلك نستدعي fetchProducts(1) مباشرة مثل صفحة التصنيفات
  fetchProducts(1)
}

// Watch route changes
watch(
  () => route.query,
  () => {
    syncFromRoute()
    fetchProducts(pageFromRoute.value)
  },
  { deep: true }
)

onMounted(() => {
  syncFromRoute()
  fetchProducts(pageFromRoute.value)
})

// SEO
useHead({
  title: t('common.search'),
})
</script>
