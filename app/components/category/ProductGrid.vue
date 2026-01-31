<template>
  <div class="space-y-6">
    <!-- Header with view toggle and sorting -->
    <div
      class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-700"
    >
      <div class="flex items-center gap-4">
        <!-- View Toggle -->
        <div
          class="flex items-center gap-1 border border-gray-300 dark:border-gray-600 rounded-md p-1"
        >
          <Button
            variant="ghost"
            size="sm"
            :class="[
              'h-8 w-8 p-0',
              viewMode === 'grid'
                ? 'bg-primary text-white hover:bg-primary/80 '
                : '',
            ]"
            @click="viewMode = 'grid'"
          >
            <LayoutGrid class="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            :class="[
              'h-8 w-8 p-0',
              viewMode === 'list'
                ? 'bg-primary text-white hover:bg-primary/80 '
                : '',
            ]"
            @click="viewMode = 'list'"
          >
            <List class="h-4 w-4" />
          </Button>
        </div>

        <!-- Results count -->
        <p class="text-sm text-gray-600 dark:text-gray-400">
          {{
            $t("category.showingResults", {
              from: fromResult,
              to: toResult,
              total: totalResults,
            })
          }}
        </p>
      </div>

      <!-- Sorting -->
      <div class="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="outline" class="w-full sm:w-auto">
              {{ currentSortLabel }}
              <ChevronDown class="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" class="w-56">
            <DropdownMenuItem
              v-for="option in sortOptions"
              :key="option.value"
              @click="changeSorting(option.value)"
            >
              <Check v-if="sortBy === option.value" class="mr-2 h-4 w-4" />
              <span :class="sortBy !== option.value ? 'ml-6' : ''">
                {{ option.label }}
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <!-- Sort Direction Toggle -->
        <Button
          v-if="sortBy !== 'default'"
          variant="outline"
          size="icon"
          @click="toggleSortDirection"
          :title="
            sortDirection === 'asc'
              ? $t('category.ascending')
              : $t('category.descending')
          "
        >
          <ArrowUpDown
            class="h-4 w-4"
            :class="sortDirection === 'desc' ? 'rotate-180' : ''"
          />
        </Button>
      </div>
    </div>

    <!-- Products Grid/List -->
    <div v-if="!loading && products.length > 0">
      <!-- Grid View -->
      <div
        v-if="viewMode === 'grid'"
        :class="`grid grid-cols-1 ${gridColsClass} gap-6`"
      >
        <HomeProductCard
          v-for="product in products"
          :key="product.id"
          :product="{
            id: parseInt(product.id),
            name: product.name,
            slug: product.slug,
            price: parseFloat(product.calculated_price),
            oldPrice:
              product.discount > 0 ? parseFloat(product.price) : undefined,
            discount: product.discount,
            image: product.imageUrl,
            rating: parseFloat(product.rating),
            inStock: product.quantity > 0,
            maxStock: product.quantity,
            description: product.description,
            seo_description: product.seo_description
          }"
        />
      </div>

      <!-- List View -->
      <div v-else class="flex flex-col gap-4">
        <HomeProductCard
          v-for="product in products"
          :key="product.id"
          layout="list"
          :product="{
            id: parseInt(product.id),
            name: product.name,
            slug: product.slug,
            price: parseFloat(product.calculated_price),
            oldPrice:
              product.discount > 0 ? parseFloat(product.price) : undefined,
            discount: product.discount,
            image: product.imageUrl,
            rating: parseFloat(product.rating),
            inStock: product.quantity > 0,
            maxStock: product.quantity,
            description: product.description,
            seo_description: product.seo_description
          }"
        />
      </div>
    </div>

    <!-- Loading State -->
    <div
      v-else-if="loading"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <div v-for="i in 8" :key="i" class="animate-pulse">
        <div class="bg-gray-200 dark:bg-gray-700 h-64 rounded-lg mb-4"></div>
        <div class="bg-gray-200 dark:bg-gray-700 h-4 rounded w-3/4 mb-2"></div>
        <div class="bg-gray-200 dark:bg-gray-700 h-4 rounded w-1/2"></div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <Package class="h-16 w-16 mx-auto text-gray-400 mb-4" />
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {{ $t("category.noProducts") }}
      </h3>
      <p class="text-gray-600 dark:text-gray-400">
        {{ $t("category.tryDifferentFilters") }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import {
  LayoutGrid,
  List,
  ChevronDown,
  Check,
  ArrowUpDown,
  Package,
} from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import HomeProductCard from "@/components/home/ProductCard.vue";
import type { CategoryProduct } from "~/types/category";
import { useI18n } from "vue-i18n";
import { useSiteSettingsStore } from "~/stores/siteSettings";

const { gridColsClass } = useSiteSettingsStore();

interface Props {
  products: CategoryProduct[];
  loading?: boolean;
  currentPage: number;
  totalPages: number;
  totalResults: number;
  perPage: number;
}

interface Emits {
  (e: "page-change", page: number): void;
  (e: "sort-change", sortBy: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const emit = defineEmits<Emits>();

// Composables
const { t } = useI18n();

// State
const viewMode = ref<"grid" | "list">("grid");
const sortBy = ref("default");
const sortDirection = ref<"asc" | "desc">("asc");

// Sort options
const sortOptions = computed(() => [
  { value: "default", label: t("category.defaultSorting") },
  { value: "price", label: t("category.sortByPrice") },
  { value: "name", label: t("category.sortByName") },
]);

const currentSortLabel = computed(() => {
  const [field] = sortBy.value.split("-");
  const option = sortOptions.value.find((opt) => opt.value === field);
  return option?.label || t("category.defaultSorting");
});

const fromResult = computed(() => {
  return props.totalResults > 0
    ? (props.currentPage - 1) * props.perPage + 1
    : 0;
});

const toResult = computed(() => {
  return Math.min(props.currentPage * props.perPage, props.totalResults);
});

// Methods
const changePage = (page: number) => {
  emit("page-change", page);
};

const changeSorting = (value: string) => {
  if (value === "default") {
    sortBy.value = value;
    emit("sort-change", value);
  } else {
    const newSortValue = `${value}-${sortDirection.value}`;
    sortBy.value = newSortValue;
    emit("sort-change", newSortValue);
  }
};

const toggleSortDirection = () => {
  sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  const [field] = sortBy.value.split("-");
  const newSortValue = `${field}-${sortDirection.value}`;
  sortBy.value = newSortValue;
  emit("sort-change", newSortValue);
};
</script>
