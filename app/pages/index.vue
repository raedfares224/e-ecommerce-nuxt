<template>
  <div class="min-h-dvh" v-if="!loading">
    <HomeHeroCarousel :slides="carouselData" />
    <HomePopularCategories :categories="popularCategories" />
    <HomePopularCategories
      :categories="topCategoriesList"
      :title="$t('product.top-categories')"
      :title2="$t('product.bestSellers')"
      
      :endpoint="'/categories'"
    />
    <HomeProductTabs
      :top-selling-products="topSellingProducts"
      :top-rated-products="topRatedProducts"
    />

    <HomePopularCategories
      :categories="brands2"
      :title="$t('home.shopByBrands')"
      :endpoint="'/brand'"
    />
  </div>
  <div v-else class="h-dvh">
    <BaseLoading />
  </div>
</template>

<script setup lang="ts">
import type { Product } from "~/types/product";
import type { Product as ShopProduct } from "~/types/shop";
import type { Category } from "~/types/category";

const {
  carouselData,
  brandsData,
  brandsData2,
  topCategories,
  fetchHomeData,
  loading,
} = useHome();
const siteSettings = useSiteSettingsStore();

// Fetch home data (non-blocking - page will render with fallback data if API fails)
fetchHomeData().catch((err) => {
  console.error("Failed to fetch home data:", err);
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
  label: shopProduct.label,
});

// Transform carousel data to hero slides format
const brands2 = computed(() =>
  brandsData2.value.map((brand: ShopProduct) => ({
    id: brand.id,
    name: brand.name,
    slug: brand.slug,
    image: brand.imageUrl,
    itemsCount: 0,
    color: "#D4E8D4",
  }))
);

// Transform featured categories to popular categories format
const popularCategories = computed<Category[]>(() => {
  if (!brandsData.value || brandsData.value.length === 0) {
    // Fallback data if API hasn't loaded yet
    return [
      {
        id: 1,
        name: "Frozen Foods",
        slug: "frozen-foods",
        image: "/images/categories/frozen-foods.png",
        itemsCount: 5,
        color: "#D4E8D4",
      },
      {
        id: 2,
        name: "Meat and Fish",
        slug: "meat-fish",
        image: "/images/categories/meat-fish.png",
        itemsCount: 2,
        color: "#F5D4E0",
      },
      {
        id: 3,
        name: "Milk & Dairy",
        slug: "milk-dairy",
        image: "/images/categories/milk-dairy.png",
        itemsCount: 2,
        color: "#F5EBD4",
      },
    ];
  }

  // Generate random pastel colors for categories
  const pastelColors = [
    "#D4E8D4",
    "#F5D4E0",
    "#F5EBD4",
    "#E6F3FF",
    "#F5E6D4",
    "#FFE4E1",
    "#FFF8DC",
    "#E8D4F5",
  ];

  return brandsData.value.map((category, index) => ({
    id: category.id,
    name: category?.name,
    slug: category?.slug,
    image: category?.imageUrl,
    itemsCount: category?.products.data.length,
    color: pastelColors[index % pastelColors.length] || "#D4E8D4",
  }));
});

// Get products from store and transform them
const topSellingProducts = computed(() =>
  siteSettings.topSellingProducts.map(transformProduct)
);
const topRatedProducts = computed(() =>
  siteSettings.topRatedProducts.map(transformProduct)
);
const topCategoriesList = computed<Category[]>(() => {
  const source = topCategories.value;
  if (!source || source.length === 0) {
    return popularCategories.value;
  }

  const pastelColors = [
    "#D4E8D4",
    "#F5D4E0",
    "#F5EBD4",
    "#E6F3FF",
    "#F5E6D4",
    "#FFE4E1",
    "#FFF8DC",
    "#E8D4F5",
  ];

  return source.map((category, index) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    image:
      category?.imageUrl || category?.image || "",
    itemsCount: category.products_count ?? category.products?.data?.length ?? 0,
    color: pastelColors[index % pastelColors.length] || "#D4E8D4",
  }));
});

// Testimonials
const testimonials = ref([
  {
    id: 1,
    name: "Theodore Handle",
    role: "Verified Customer",
    review:
      "I have been shopping from shofi for the past few months and am loving the experience. Have been shopping from here have recommended my relatives too.",
    rating: 5,
  },
  {
    id: 2,
    name: "Shahnewaz Sakil",
    role: "Regular Customer",
    review:
      "They've usually had some experience with this company, including a purchase, use, or a conversation with their customer service team.",
    rating: 5,
  },
  {
    id: 3,
    name: "Sarah Johnson",
    role: "Happy Customer",
    review:
      "The tool X has really automated some of our company's processes. We now spend less time doing manual work. It's making everything very easy for us.",
    rating: 4,
  },
]);
usePageSeo({
  title: () => "Home",
  description: () =>
    "Welcome to Shofi, your one-stop shop for all your needs. Discover amazing products at great prices.",
  image: () => "/placeholder.png",
  type: "website",
});
</script>
