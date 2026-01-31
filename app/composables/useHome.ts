import type {
    CarouselResponse,
    BrandsResponse,
    Brand,
    TopCategoriesResponse,
    TopCategory,
} from "~/types/home"
import { useToast } from "@/composables/useToast"

export const useHome = () => {
    const { get } = useApi()
    const toast = useToast()

    // State
    const carouselData = ref<string[]>([])
    const brandsData = ref<Brand[]>([])
    const brandsData2 = ref<Brand[]>([])
    const topCategories = ref<TopCategory[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    // Fetch home data
    const fetchHomeData = async (force = false) => {
        if (!force && carouselData.value.length && brandsData.value.length) return

        loading.value = true
        error.value = null

        try {
            // Fetch carousel and brands concurrently with individual error handling
            const [carouselRes, brandsRes, brandsRes2, topCategoriesRes] = await Promise.allSettled([
                get<CarouselResponse>("/carousel",'',"home-carousel").catch(err => {
                    console.warn("Carousel fetch failed:", err)
                    return null
                }),
                get<BrandsResponse>("/categories/featured",'',"home-categories").catch(err => {
                    console.warn("Brands fetch failed:", err)
                    return null
                }),
                get<BrandsResponse>("/brands/featured",'',"home-brands").catch(err => {
                    console.warn("Brands fetch failed:", err)
                    return null
                }),
                get<TopCategoriesResponse>("/top-categories", { page: 1 }, "home-top-categories").catch(err => {
                    console.warn("Top categories fetch failed:", err)
                    return null
                })
            ])

            // Handle carousel data
            if (carouselRes.status === 'fulfilled' && carouselRes.value?.data) {
                carouselData.value = carouselRes.value.data
            }

            // Handle brands data
            if (brandsRes.status === 'fulfilled' && brandsRes.value?.data) {
                brandsData.value = brandsRes.value.data
            }

            // Handle brands data
            if (brandsRes2.status === 'fulfilled' && brandsRes2.value?.data) {
                brandsData2.value = brandsRes2.value.data
            }

            if (topCategoriesRes.status === 'fulfilled' && topCategoriesRes.value?.data) {
                const payload = Array.isArray(topCategoriesRes.value.data)
                    ? topCategoriesRes.value.data
                    : topCategoriesRes.value.data?.data
                topCategories.value = payload || []
            }

            // Only show error if both failed
            if (carouselRes.status === 'rejected' && brandsRes.status === 'rejected') {
                throw new Error("Failed to load home page data")
            }
        } catch (err: any) {
            error.value = err.message || "فشل في جلب بيانات الصفحة الرئيسية"
            console.error("Home data fetch error:", err)
            // Don't show toast for network errors - page will use fallback data
        } finally {
            loading.value = false
        }
    }

    // Clear data and refetch (useful for language changes)
    const refetchHomeData = async () => {
        carouselData.value = []
        brandsData.value = []
        brandsData2.value = []
        topCategories.value = []
        await fetchHomeData(true)
    }

    return {
        // State
        carouselData,
        brandsData,
        brandsData2,
        topCategories,
        loading,
        error,
        // Actions
        fetchHomeData,
        refetchHomeData,
    }
}
