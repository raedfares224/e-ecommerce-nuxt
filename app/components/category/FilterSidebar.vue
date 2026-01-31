<template>
  <aside class="space-y-6">
    <!-- Price Filter -->
    <div class="border-b border-gray-200 dark:border-gray-700 pb-6">
      <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        {{ $t('category.priceFilter') }}
      </h3>
      
      <div class="space-y-4">
        <!-- Price Range Display -->
        <div class="flex items-center justify-between text-sm" :class="[locale==='ar'?'flex-row-reverse':'']">
          <span class="text-gray-600 dark:text-gray-400">
            {{ formatPrice(sliderValue[0] ?? 0) }}
          </span>
          <span class="text-gray-600 dark:text-gray-400">
            {{ formatPrice(sliderValue[1] ?? 0) }}
          </span>
        </div>
        
        <!-- Slider -->
        <div class="px-1">
          <Slider
            :model-value="sliderValue"
            :min="MIN_PRICE"
            :max="MAX_PRICE"
            :step="10"
            class="w-full"
            @update:model-value="handleSliderChange"
          />
        </div>
        
        <!-- Number Inputs for Precise Control -->
        <div class="flex items-center gap-2" :class="[locale==='ar'?'flex-row-reverse':'']">
          <Input
            :model-value="localPriceRange.min?.toString() || ''"
            type="number"
            :placeholder="$t('category.min')"
            :min="MIN_PRICE"
            :max="MAX_PRICE"
            class="flex-1"
            @update:model-value="(val) => handleInputChange('min', val)"
          />
          <span class="text-gray-500">-</span>
          <Input
            :model-value="localPriceRange.max?.toString() || ''"
            type="number"
            :placeholder="$t('category.max')"
            :min="MIN_PRICE"
            :max="MAX_PRICE"
            class="flex-1"
            @update:model-value="(val) => handleInputChange('max', val)"
          />
        </div>
        <Button
          variant="outline"
          class=" w-full cursor-pointer bg-primary hover:bg-primary/80 hover:text-white text-white"
          @click="applyPriceFilter"
        >
          {{ $t('filters') }}
        </Button>
      </div>
    </div>

    <!-- Product Status -->
    <div class="border-b border-gray-200 dark:border-gray-700 pb-6">
      <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        {{ $t('category.productStatus') }}
      </h3>
      
      <RadioGroup :model-value="productStatusValue" @update:model-value="handleProductStatusChange">
        <div class="space-y-3">
          <div class="flex items-center space-x-2">
            <RadioGroupItem id="all" value="all" />
            <label
              for="all"
              class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              {{ $t('category.allProducts') }}
            </label>
          </div>
          
          <div class="flex items-center space-x-2">
            <RadioGroupItem id="on-sale" value="onSale" />
            <label
              for="on-sale"
              class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              {{ $t('category.onSale') }}
            </label>
          </div>
          
          <div class="flex items-center space-x-2">
            <RadioGroupItem id="in-stock" value="inStock" />
            <label
              for="in-stock"
              class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              {{ $t('category.inStock') }}
            </label>
          </div>
        </div>
      </RadioGroup>
    </div>

    <!-- Categories Filter -->
    <div v-if="categories.length > 0" class="border-b border-gray-200 dark:border-gray-700 pb-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ $t('category.categories') }}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          @click="toggleCategoriesExpanded"
        >
          <ChevronDown
            :class="[
              'h-4 w-4 transition-transform',
              categoriesExpanded ? 'rotate-180' : ''
            ]"
          />
        </Button>
      </div>
      
      <div v-show="categoriesExpanded" class="space-y-1 max-h-64 overflow-y-auto">
        <NuxtLink
          v-for="category in categories"
          :key="category.id"
          :to="`/categories/${category.slug}`"
          class="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
        >
          <span class="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
            {{ category.name }}
          </span>
          <span class="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
            {{ category.count }}
          </span>
        </NuxtLink>
      </div>
    </div>

    <!-- Brands Filter -->
    <div v-if="brands.length > 0" class="border-b border-gray-200 dark:border-gray-700 pb-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ $t('category.popularBrands') }}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          @click="toggleBrandsExpanded"
        >
          <ChevronDown
            :class="[
              'h-4 w-4 transition-transform',
              brandsExpanded ? 'rotate-180' : ''
            ]"
          />
        </Button>
      </div>
      
      <div v-show="brandsExpanded" class="space-y-2">
        <Select
          :model-value="selectedBrandValue"
          @update:model-value="handleBrandSelect"
        >
          <SelectTrigger class="w-full">
            <SelectValue :placeholder="$t('category.selectBrand')" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="brand in brands"
              :key="brand.id"
              :value="brand.id.toString()"
            >
              <div class="flex items-center justify-between w-full">
                <span class="text-sm">{{ brand.name }}</span>
                <span class="text-xs text-gray-500">{{ brand.count }}</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <!-- Top Rated Products -->
    <div v-if="topRatedProducts.length > 0">
      <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        {{ $t('category.topRatedProducts') }}
      </h3>
      
      <div class="space-y-4">
        <NuxtLink
          v-for="product in topRatedProducts"
          :key="product.id"
          :to="`/products/${product.slug}`"
          class="flex gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <img
            :src="product.image"
            :alt="product.name"
            loading="lazy"
            decoding="async"
            class="w-16 h-16 object-cover rounded"
          />
          <div class="flex-1 min-w-0">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
              {{ product.name }}
            </h4>
            <div class="flex items-center gap-1 mt-1">
              <div class="flex items-center">
                <Star
                  v-for="i in 5"
                  :key="i"
                  :class="[
                    'h-3 w-3',
                    i <= product.rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  ]"
                />
              </div>
              <span class="text-xs text-gray-500">({{ product.reviews_count }})</span>
            </div>
            <div class="flex items-center gap-2 mt-1">
              <span v-if="product.sale_price" class="text-sm font-semibold text-primary">
                {{ formatPrice(product.sale_price) }}
              </span>
              <span
                :class="[
                  'text-sm',
                  product.sale_price
                    ? 'line-through text-gray-400'
                    : 'font-semibold text-gray-900 dark:text-white'
                ]"
              >
                {{ formatPrice(product.price) }}
              </span>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>

    <!-- Reset Filter Button -->
    <Button
      variant="outline"
      class="w-full"
      @click="resetFilters"
    >
      {{ $t('category.resetFilter') }}
    </Button>
  </aside>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { ChevronDown, Star } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { useI18n } from 'vue-i18n';
const { locale } = useI18n();
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import type { FilterCategory, FilterBrand, TopRatedProduct } from '~/types/category'
import { useCurrency } from '~/composables/useCurrency'

const { formatPrice } = useCurrency()

interface Filters {
  onSale: boolean
  inStock: boolean
  selectedCategories: number[]
  selectedBrands: number[]
  priceRange: {
    min: number | null
    max: number | null
  }
}

interface Props {
  categories?: FilterCategory[]
  brands?: FilterBrand[]
  topRatedProducts?: TopRatedProduct[]
  filters: Filters
}

interface Emits {
  (e: 'update:filters', filters: Filters): void
}

const props = withDefaults(defineProps<Props>(), {
  categories: () => [],
  brands: () => [],
  topRatedProducts: () => []
})

const emit = defineEmits<Emits>()

// Local state
const localFilters = ref<Filters>({ ...props.filters })
const localPriceRange = ref({
  min: props.filters.priceRange.min || null,
  max: props.filters.priceRange.max || null
})

// Slider state (0-1000 range)
const MIN_PRICE = 0
const MAX_PRICE = 1000
const sliderValue = ref<number[]>([
  props.filters.priceRange.min || MIN_PRICE,
  props.filters.priceRange.max || MAX_PRICE
])

const categoriesExpanded = ref(true)
const brandsExpanded = ref(true)

// Computed value for radio group
const productStatusValue = computed(() => {
  if (localFilters.value.onSale) return 'onSale'
  if (localFilters.value.inStock) return 'inStock'
  return 'all'
})

// Computed value for selected brand (single select)
const selectedBrandValue = computed(() => {
  if (!localFilters.value.selectedBrands.length) return ''
  const first = localFilters.value.selectedBrands[0]
  return first != null ? first.toString() : ''
})

// Watch for external filter changes
watch(() => props.filters, (newFilters) => {
  localFilters.value = { ...newFilters }
  localPriceRange.value = {
    min: newFilters.priceRange.min,
    max: newFilters.priceRange.max
  }
  sliderValue.value = [
    newFilters.priceRange.min || MIN_PRICE,
    newFilters.priceRange.max || MAX_PRICE
  ]
}, { deep: true })

// Methods
const handleProductStatusChange = (value: string) => {
  localFilters.value.onSale = value === 'onSale'
  localFilters.value.inStock = value === 'inStock'
  emitFilters()
}

const updateFilter = (key: keyof Filters, value: any) => {
  localFilters.value[key] = value
  emitFilters()
}

const toggleCategory = (categoryId: number) => {
  const index = localFilters.value.selectedCategories.indexOf(categoryId)
  if (index > -1) {
    localFilters.value.selectedCategories.splice(index, 1)
  } else {
    localFilters.value.selectedCategories.push(categoryId)
  }
  emitFilters()
}

const handleBrandSelect = (value: any) => {
  const val = value == null ? null : String(value)

  if (!val) {
    localFilters.value.selectedBrands = []
  } else {
    const numericId = parseInt(val)
    if (Number.isNaN(numericId)) {
      localFilters.value.selectedBrands = []
    } else {
      localFilters.value.selectedBrands = [numericId]
    }
  }
  emitFilters()
}

const toggleBrand = (brandId: string | number) => {
  const numericId = typeof brandId === 'string' ? parseInt(brandId) : brandId
  const index = localFilters.value.selectedBrands.indexOf(numericId)
  if (index > -1) {
    localFilters.value.selectedBrands.splice(index, 1)
  } else {
    localFilters.value.selectedBrands.push(numericId)
  }
  emitFilters()
}

const handleSliderChange = (value: number[] | undefined) => {
  if (!value) return
  sliderValue.value = value
  localPriceRange.value.min = value[0] ?? null
  localPriceRange.value.max = value[1] ?? null
}

const handleInputChange = (type: 'min' | 'max', value: string | number) => {
  const numValue = value ? Number(value) : null
  
  if (type === 'min') {
    localPriceRange.value.min = numValue
    if (numValue !== null) {
      sliderValue.value = [numValue, sliderValue.value[1] ?? MAX_PRICE]
    }
  } else {
    localPriceRange.value.max = numValue
    if (numValue !== null) {
      sliderValue.value = [sliderValue.value[0] ?? MIN_PRICE, numValue]
    }
  }
}

const applyPriceFilter = () => {
  localFilters.value.priceRange = {
    min: localPriceRange.value.min,
    max: localPriceRange.value.max
  }
  emitFilters()
}

let debounceTimer: number | null = null
const debouncedPriceChange = () => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    applyPriceFilter()
  }, 500)
}

const toggleCategoriesExpanded = () => {
  categoriesExpanded.value = !categoriesExpanded.value
}

const toggleBrandsExpanded = () => {
  brandsExpanded.value = !brandsExpanded.value
}

const resetFilters = () => {
  localFilters.value = {
    onSale: false,
    inStock: false,
    selectedCategories: [],
    selectedBrands: [],
    priceRange: { min: null, max: null }
  }
  localPriceRange.value = { min: null, max: null }
  sliderValue.value = [MIN_PRICE, MAX_PRICE]
  emitFilters()
}

const emitFilters = () => {
  emit('update:filters', { ...localFilters.value })
}
</script>
