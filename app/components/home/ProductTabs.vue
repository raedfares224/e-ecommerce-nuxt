<template>
  <section class="py-16 md:py-24 bg-white dark:bg-gray-900">
    <div class="container mx-auto px-4">
      <!-- Header with Title -->
      <div class="text-center mb-12 md:mb-16">
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 dark:bg-primary/20 rounded-full mb-4">
          <Sparkles class="w-4 h-4 text-primary" />
          <span class="text-sm font-medium text-primary">{{ $t("product.featuredCollection") }}</span>
        </div>
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          {{ $t("product.featuredProducts") }}
        </h2>
        <p class="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          {{ $t("product.featuredDescription") }}
        </p>
      </div>

      <!-- Sections - Stacked -->
      <div v-if="tabs.length" class="w-full space-y-16 md:space-y-24">
        <div v-for="(tab, tabIndex) in tabs" :key="tab.value" class="relative">
          <!-- Section Header -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div class="flex items-center gap-4">
              <div class="w-1 h-8 bg-primary rounded-full"></div>
              <h3 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                {{ tab.label }}
              </h3>
          <!--    <span class="text-sm text-gray-500 dark:text-gray-400 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
                {{ getProductsByCategory(tab.slug).length }} {{ $t("product.items") || 'items' }}
              </span>r -->
            </div>
            <NuxtLink 
            v-if="tab.slug"
              :to="`/categories/${tab.slug}`"
              class="group inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all duration-300"
            >
              {{ $t("common.viewAll") }}
              <ArrowRight class="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </NuxtLink>
          </div>

          <!-- Product Grid -->
          <div
            :class="`grid grid-cols-1 sm:grid-cols-2 ${
              siteSettings.gridColsClass || 'md:grid-cols-3 lg:grid-cols-4'
            } gap-6 items-stretch`"
          >
            <div
              v-for="(product, index) in getProductsByCategory(tab.slug)"
              :key="product.id"
              class="product-card-enter h-full"
              :style="{ animationDelay: `${index * 50}ms` }"
            >
              <HomeProductCard
                :product="transformProduct(product)"
                class="h-full"
              />
            </div>
          </div>
          
          <!-- Empty State -->
          <div 
            v-if="getProductsByCategory(tab.slug).length === 0"
            class="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-2xl"
          >
            <Package class="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p class="text-gray-500 dark:text-gray-400">
              {{ $t("product.emptyCategoryMessage") || "No products found in this category." }}
            </p>
          </div>
          
          <!-- Section divider -->
          <div v-if="tabIndex < tabs.length - 1" class="mt-16 max-w-xs mx-auto">
            <div class="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent"></div>
          </div>
        </div>
      </div>
      
      <!-- Empty State for no tabs -->
      <div v-else class="text-center py-20 bg-gray-50 dark:bg-gray-800 rounded-3xl">
        <ShoppingBag class="w-20 h-20 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
        <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          {{ $t("product.noFeaturedCategories") || "No featured categories available" }}
        </h3>
        <p class="text-gray-500 dark:text-gray-400">
          {{ $t("product.checkBackLater") || "Check back later for new products" }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { Sparkles, ArrowRight, Package, ShoppingBag } from "lucide-vue-next";
import type { Product } from "~/types/product";
import type { Product as ShopProduct } from "~/types/shop";

interface Props {
  topSellingProducts: Product[];
  topRatedProducts: Product[];
}

defineProps<Props>();

const siteSettings = useSiteSettingsStore();
const { t } = useI18n();

// Dynamic tabs from featured categories (exclude all-products section)
const tabs = computed(() => {
  const featuredCategories = siteSettings.featured || [];

  return featuredCategories.slice(0, 4).map((category) => ({
    label: category.name,
    value: category.slug,
    slug: category.slug,
  }));
});

// Transform shop products to component product format
const transformProduct = (shopProduct: ShopProduct): Product => ({
  id: parseInt(shopProduct.id),
  name: shopProduct.name,
  en_name: shopProduct.en_name,
  ar_name: shopProduct.ar_name,
  slug: shopProduct.slug,
  price: parseFloat(shopProduct.calculated_price || shopProduct.price),
  oldPrice:
    shopProduct.discount > 0 ? parseFloat(shopProduct.price) : undefined,
  discount: shopProduct.discount,
  image: shopProduct.imageUrl,
  category: shopProduct.brand,
  rating: parseFloat(shopProduct.rating),
  inStock: shopProduct.quantity > 0,
  isFeatured: true,
  quantity: shopProduct.quantity || 0,
  brand: shopProduct.brand || "",
  different: shopProduct.different,
  label: shopProduct.label,
});

// Get products by category slug
const getProductsByCategory = (slug: string) => {
  const category = siteSettings.featured?.find((cat) => cat.slug === slug);
  return category?.products.data || [];
};
</script>
