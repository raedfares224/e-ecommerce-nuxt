<template>
  <ClientOnly>
    <div v-if="!loading" class="min-h-screen bg-white dark:bg-gray-900">
      <!-- Error State -->
      <div v-if="error || !category" class="container mx-auto px-4 py-12">
        <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <h2 class="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">
            {{ $t('messages.brandNotFound') || 'Brand Not Found' }}
          </h2>
          <p class="text-red-600 dark:text-red-400 mb-4">
            {{ error || ($t('messages.brandNotFoundDescription') || 'The brand you are looking for does not exist or has been removed.') }}
          </p>
          <Button @click="navigateTo('/')" class="mt-4">
            {{ $t("nav.home") }}
          </Button>
        </div>
      </div>

      <!-- Main Content -->
      <div v-else class="container mx-auto px-4 py-8">
        <!-- Breadcrumb -->
        <BaseBreadcrumb />
        
        <!-- Brand Header -->
        <div v-if="category" class="mb-8">
          <div class="bg-linear-to-r from-primary opacity-70 to-primary-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 md:p-12 shadow-lg">
            <div class="grid md:grid-cols-2 gap-8 items-center">
              <!-- Text Content -->
              <div class="space-y-4">
                <h1
                  class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight"
                >
                  {{ category.name }}
                </h1>
                <p v-if="category.description" class="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  {{ category.description }}
                </p>
                <!-- Brand Stats -->
           
              </div>
              <!-- Brand Image -->
              <div v-if="category.imageUrl" class="relative">
                <div class="absolute inset-0 bg-linear-to-tr from-primary-200/20 to-primary-300/20 dark:from-gray-900/20 dark:to-gray-800/20 rounded-xl"></div>
                <img 
                  :src="category.imageUrl" 
                  :alt="category.name"
                  class="relative w-full h-64 md:h-80 object-contain mx-auto rounded-xl shadow-xl"
                  @error="(e) => { const target = e.target as HTMLImageElement; if (target) target.src = '/placeholder.png'; }"
                >
                <div class="absolute inset-0 rounded-xl ring-2 ring-white/20 dark:ring-gray-700/20"></div>
              </div>
              <!-- No Image Placeholder -->
              <div v-else class="flex items-center justify-center">
                <div class="w-full h-64 md:h-80 bg-linear-to-br from-primary-100 to-primary-200 dark:from-gray-700 dark:to-gray-800 rounded-xl flex items-center justify-center shadow-xl">
                  <div class="text-center">
                    <div class="w-24 h-24 mx-auto mb-4 bg-linear-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                      <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                    </div>
                    <p class="text-gray-500 dark:text-gray-400 font-medium">{{ category.name }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile Filter Toggle -->
        <div class="lg:hidden mb-4">
          <Button
            variant="outline"
            class="w-full"
            @click="mobileFiltersOpen = true"
          >
            <SlidersHorizontal class="h-4 w-4 mr-2" />
            {{ $t("category.filters") }}
          </Button>
        </div>

        <div class="flex flex-col lg:flex-row gap-8">
          <!-- Desktop Sidebar -->
          <div class="hidden lg:block w-64 shrink-0">
            <CategoryFilterSidebar
              :categories="filterCategories"
              :brands="filterBrands"
              :top-rated-products="topRatedProducts"
              :filters="filters"
              @update:filters="handleFiltersUpdate"
            />
          </div>

          <!-- Mobile Sidebar (Sheet) -->
          <Sheet v-model:open="mobileFiltersOpen">
            <SheetContent side="left" class="w-80 overflow-y-auto">
              <SheetHeader>
                <SheetTitle>{{ $t("category.filters") }}</SheetTitle>
              </SheetHeader>
              <div class="mt-6">
                <CategoryFilterSidebar
                  :categories="filterCategories"
                  :brands="filterBrands"
                  :top-rated-products="topRatedProducts"
                  :filters="filters"
                  @update:filters="handleFiltersUpdate"
                />
              </div>
            </SheetContent>
          </Sheet>

          <!-- Products Grid -->
          <div class="flex-1 min-w-0 space-y-6">
            <CategoryProductGrid
              :products="products"
              :loading="productsLoading"
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
      </div>
    </div>
    <BaseLoading v-else />
    <template #fallback>
      <BaseLoading />
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { SlidersHorizontal } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import CategoryFilterSidebar from "@/components/category/FilterSidebar.vue";
import CategoryProductGrid from "@/components/category/ProductGrid.vue";
import Pagination from "~/components/pagination.vue";
import { useBrand } from "~/composables/useBrand";
import type { TopRatedProduct } from "~/types/category";

// Route params
const route = useRoute();
const slug = computed(() => route.params.slug as string);

// Composables
const {
  category,
  products,
  topRatedProducts,
  filterCategories,
  filterBrands,
  loading,
  productsLoading,
  error,
  currentPage,
  lastPage,
  perPage,
  total,
  loadCategoryPage,
  changePage,
  clearCategoryData,
} = useBrand();

// State
const mobileFiltersOpen = ref(false);
const searchQuery = ref("");
const sortBy = ref("default");

interface Filters {
  onSale: boolean;
  inStock: boolean;
  selectedCategories: number[];
  selectedBrands: number[];
  priceRange: {
    min: number | null;
    max: number | null;
  };
}

const filters = ref<Filters>({
  onSale: false,
  inStock: false,
  selectedCategories: [],
  selectedBrands: [],
  priceRange: {
    min: null,
    max: null,
  },
});

// Mock top rated products (you can fetch these from API if available)
const mockTopRatedProducts: TopRatedProduct[] = [
  // {
  //   id: 1,
  //   name: 'Premium Product',
  //   slug: 'premium-product',
  //   price: 29.99,
  //   sale_price: 24.99,
  //   image: 'https://via.placeholder.com/150',
  //   rating: 5,
  //   reviews_count: 120
  // },
  // {
  //   id: 2,
  //   name: 'Quality Item',
  //   slug: 'quality-item',
  //   price: 39.99,
  //   image: 'https://via.placeholder.com/150',
  //   rating: 4,
  //   reviews_count: 85
  // },
  // {
  //   id: 3,
  //   name: 'Best Seller',
  //   slug: 'best-seller',
  //   price: 19.99,
  //   image: 'https://via.placeholder.com/150',
  //   rating: 5,
  //   reviews_count: 200
  // }
];

// Methods
const buildQueryParams = () => {
  const params: Record<string, any> = {};

  // Map on-sale to status=0 (products with discount)
  if (filters.value.onSale) params.status = 0;
  // Keep in-stock as is unless API requires different mapping
  if (filters.value.inStock) params.in_stock = 1;

  if (filters.value.selectedCategories.length > 0) {
    params.categories = filters.value.selectedCategories.join(",");
  }

  if (filters.value.selectedBrands.length > 0) {
    params.brands = filters.value.selectedBrands.join(",");
  }

  // Use minPrice/maxPrice naming
  if (filters.value.priceRange.min !== null) {
    params.minPrice = filters.value.priceRange.min;
  }

  if (filters.value.priceRange.max !== null) {
    params.maxPrice = filters.value.priceRange.max;
  }

  // Map sorting values to requested schema
  if (sortBy.value && sortBy.value !== "default") {
    // Expected incoming values from grid: 'price-asc', 'price-desc', 'name-asc', 'name-desc', or 'new'
    if (sortBy.value.startsWith("price-")) {
      const direction = sortBy.value.endsWith("asc")
        ? "low-to-high"
        : "high-to-low";
      params.sorting = direction;
    } else if (sortBy.value === "new" || sortBy.value === "new-added") {
      params.sorting = "new-added";
    } else if (sortBy.value === "on-sale") {
      // Treat on-sale as a sorting preset that prioritizes discounted products
      params.sorting = "on-sale";
    } else {
      // Fallback to pass-through for any other supported sort values
      params.sorting = sortBy.value;
    }
  }

  return params;
};

const categoryLinks = computed(() => {
  const links: { url: string | null; label: string; active: boolean }[] = [];
  const total = lastPage.value || 1;
  const current = currentPage.value || 1;

  // Previous
  links.push({
    url: current > 1 ? `/brand/${slug.value}?page=${current - 1}` : null,
    label: "« Previous",
    active: false,
  });

  // Numbered pages
  for (let page = 1; page <= total; page++) {
    links.push({
      url: page === current ? null : `/brand/${slug.value}?page=${page}`,
      label: String(page),
      active: page === current,
    });
  }

  // Next
  links.push({
    url:
      current < total ? `/brand/${slug.value}?page=${current + 1}` : null,
    label: "Next »",
    active: false,
  });

  return links;
});

const fetchProducts = async (page: number = 1) => {
  const queryParams = buildQueryParams();
  await changePage(slug.value, page, queryParams, searchQuery.value);

  // Close mobile filters after applying
  mobileFiltersOpen.value = false;
};

const handleFiltersUpdate = (newFilters: Filters) => {
  filters.value = newFilters;
  fetchProducts(1); // Reset to page 1 when filters change
};

const handlePageChange = (page: number) => {
  fetchProducts(page);
};

const handleSortChange = (newSortBy: string) => {
  sortBy.value = newSortBy;
  fetchProducts(1); // Reset to page 1 when sorting changes
};

if (!category.value || category.value.slug !== slug.value) {
  await loadCategoryPage(slug.value);
}
// Watch for slug changes
watch(slug, async (newSlug) => {
  clearCategoryData();
  topRatedProducts.value = mockTopRatedProducts;
  await loadCategoryPage(newSlug);
});

usePageSeo({
  title: () => category?.value?.name || "Brand",
  description: () => category?.value?.description || "Browse brand products",
})
</script>
