import { defineStore } from "pinia";
import { apiFetch } from "~/api/useApiFetch";
import { useToast } from "@/composables/useToast";
import type { SiteSettingsResponse, SiteSettings } from "~/types/site-settings";
import type {MenuResponse,DropdownMenuItem} from "~/types/menu"
import type { FeaturedsResponse, Featured } from "~/types/shop";
export const useSiteSettingsStore = defineStore("siteSettings", () => {
  const toast = useToast()
  const settings = ref<SiteSettings | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const menudata = ref<DropdownMenuItem[]>([])
  const featured = ref<Featured[]>()

  const fetchSettings = async (force = false) => {
       if (!force && settings.value && menudata.value.length) return;
    loading.value = true;
    error.value = null;

    try {
      if(settings.value) return;
      const [response,responseMenu,responseFeatured] =await Promise.all([
         apiFetch<SiteSettingsResponse>("/site-settings"),
         apiFetch<MenuResponse>('/menu'),
         apiFetch<FeaturedsResponse>('/categories/featured')
      ])

      settings.value = response.data?.data || null;
      menudata.value = responseMenu.data?.data || [];
      featured.value = responseFeatured.data?.data || undefined
    } catch (err: any) {
      error.value = err.message || "فشل في جلب إعدادات الموقع";
      toast.error(error.value as string)
    } finally {
      loading.value = false;
    }
  };

  // Clear data and refetch (useful for language changes)
  const refetchSettings = async () => {
    loading.value = true;
    settings.value = null;
    menudata.value = [];
    featured.value = undefined;
    
    try {
      await fetchSettings(true);
    } finally {
      loading.value = false;
    }
  };

  // 🔹 getter لتسهيل الوصول للقيم
  const siteTitle = computed(() => settings.value?.siteTitle ?? "My Store");
  const colors = computed(() => ({
    website: settings.value?.website_color,
    navbar: settings.value?.navbar_color,
    footer: settings.value?.footer_color,
    navbarText:settings.value?.navbar_text_color,
    menuHoverColor:settings.value?.placingColorWhenPlacingMouseOnTheTopMenu,
    prices:settings.value?.prices_color,
    pricesBackground:settings.value?.prices_background_color,
    categoryText:settings.value?.category_text_color,
    footerText:settings.value?.footer_text_color,
    hover:settings.value?.hover_color,
    categoryTextTitle:settings.value?.category_text_color_title,
    categoryBackgroundTitle:settings.value?.category_background_color_title

  }));
  const socialMedia = computed(()=>({
    facebook:settings.value?.facebook,
    twitter:settings.value?.twitter,
    instagram:settings.value?.instagram,
  }))
  const communication = computed(()=>({
    phone:settings.value?.phone,
    email:settings.value?.email,
    address:settings.value?.address,
    whatsapp:settings.value?.whatsapp
    
  }))

  // Featured products getters
  const featuredProducts = computed(() => {
    if (!featured.value) return []
    // Extract all products from all featured categories
    return featured.value.flatMap(category => category.products.data)
  })

  const getFeaturedByCategory = computed(() => (categorySlug: string) => {
    if (!featured.value) return []
    const category = featured.value.find(cat => cat.slug === categorySlug)
    return category?.products.data || []
  })

  const topSellingProducts = computed(() => {
    // Get first 8 featured products
    return featuredProducts.value.slice(0, 8)
  })

  const topRatedProducts = computed(() => {
    // Get products with high ratings (rating >= 4)
    return featuredProducts.value.filter(product => parseFloat(product.rating) >= 4)
  })
  const gridColsClass = computed(() => {
    const perRow = settings.value?.perRow || 3
  
    switch (perRow) {
      case 1:
        return "lg:grid-cols-1"
      case 2:
        return "lg:grid-cols-2"
      case 3:
        return "lg:grid-cols-3"
      case 4:
        return "lg:grid-cols-4"
      case 5:
        return "lg:grid-cols-5 "
      case 6:
        return "lg:grid-cols-6 "
      default:
        return "lg:grid-cols-3 "
    }
  })

  return {
    // state
    settings:readonly(settings),
    menudata:readonly(menudata),
    featured:readonly(featured),
    loading:readonly(loading),
    error:readonly(error),

    // actions
    fetchSettings,
    refetchSettings,

    // getters
    siteTitle,
    colors,
    socialMedia,
    communication,
    featuredProducts,
    getFeaturedByCategory,
    topSellingProducts,
    topRatedProducts,
    gridColsClass
  };
});
