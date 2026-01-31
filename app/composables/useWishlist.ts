// ~/composables/useWishlist.ts
import { ref, computed } from "vue";
import type { WishlistItem } from "~/types/cart";
import { useAuthStore } from "~/stores/auth";
import { apiFetch } from "~/api/useApiFetch";
import { useI18n } from "vue-i18n";

const WISHLIST_STORAGE_KEY = "guest_wishlist";

// Shared state (singleton) for wishlist
const wishlistItems = ref<WishlistItem[]>([]);
// Guard to ensure wishlist is initialized only once per session
const isWishlistInitialized = ref(false);
// Track in-flight API request so multiple callers share the same fetch
let wishlistFetchPromise: Promise<void> | null = null;

export const useWishlist = () => {
  const authStore = useAuthStore();
  const localeCookie = useCookie<"en" | "ar">("locale");
  const { t } = useI18n();

  const applyLocalizedNames = () => {
    const isAr = localeCookie.value === "ar";
    wishlistItems.value = wishlistItems.value.map((item: any) => {
      const en_name = item.en_name ?? item.name;
      const ar_name = item.ar_name ?? item.name;
      return {
        ...item,
        en_name,
        ar_name,
        name: isAr ? ar_name : en_name,
      } as WishlistItem & { en_name: string; ar_name: string };
    });
  };

  const fetchWishlistFromAPI = async () => {
    if (!authStore.isAuthenticated) return;
    // if (isWishlistInitialized.value) return;
    if (wishlistFetchPromise) return wishlistFetchPromise;

    wishlistFetchPromise = (async () => {
      const { data, error } = await apiFetch<{
        data: any[];
        status: string;
        message: string;
      }>("/wishlist");
      if (error) {
        console.error(t("error.failed_to_fetch_wishlist"), error);
        return;
      }

      wishlistItems.value =
        data?.data?.map((rawItem: any) => {
          const item = rawItem.product ?? rawItem;

          const rawId = item.id;
          const rawPrice = item.price ?? item.calculated_price;
          const rawQuantity = item.quantity;

          const en_name = item.en_name || item.name || item.ar_name;
          const ar_name = item.ar_name || item.name || item.en_name;
          const isAr = localeCookie.value === "ar";

          return {
            id: typeof rawId === "string" ? parseInt(rawId, 10) : Number(rawId),
            slug: item.slug,
            name: (isAr ? ar_name : en_name) ?? "",
            en_name: en_name ?? "",
            ar_name: ar_name ?? "",
            price:
              typeof rawPrice === "string"
                ? parseFloat(rawPrice)
                : Number(rawPrice ?? 0),
            image: item.imageUrl,
            inStock: Number(rawQuantity ?? 0) > 0,
            brand: item.brand,
            brand_id: item.brand_id,
            rating: item.rating,
            description: item.description,
            categories: item.categories,
            different: isAr ? item.ar_different : item.en_different,
            ar_different: item.ar_different,
            en_different: item.en_different,
            discount: item.discount,
            calculated_price: item.calculated_price,
            quantity: rawQuantity,
            label: item.label,
            accessories: item.accessories,
            images: item.images,
          };
        }) || [];

      applyLocalizedNames();
      isWishlistInitialized.value = true;
    })();

    try {
      await wishlistFetchPromise;
    } finally {
      wishlistFetchPromise = null;
    }
  };

  const loadWishlist = () => {
    if (isWishlistInitialized.value) return;

    if (typeof window !== "undefined" && !authStore.isAuthenticated) {
      try {
        // Read from unified key; also migrate any leftover per-locale keys from previous version
        let stored = localStorage.getItem(WISHLIST_STORAGE_KEY);

        if (!stored) {
          const storedEn = localStorage.getItem(`${WISHLIST_STORAGE_KEY}_en`);
          const storedAr = localStorage.getItem(`${WISHLIST_STORAGE_KEY}_ar`);

          if (storedEn || storedAr) {
            const items: any[] = [];
            if (storedEn) {
              try {
                items.push(...JSON.parse(storedEn));
              } catch {}
              localStorage.removeItem(`${WISHLIST_STORAGE_KEY}_en`);
            }
            if (storedAr) {
              try {
                items.push(...JSON.parse(storedAr));
              } catch {}
              localStorage.removeItem(`${WISHLIST_STORAGE_KEY}_ar`);
            }

            // Remove duplicates by id
            const uniqueById: Record<number, any> = {};
            for (const it of items) {
              if (!it || typeof it.id === "undefined") continue;
              uniqueById[Number(it.id)] = it;
            }
            wishlistItems.value = Object.values(uniqueById) as any[];
            localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistItems.value));
          }
        } else {
          wishlistItems.value = JSON.parse(stored);
        }

        applyLocalizedNames();
      } catch (error) {
        console.error(
          t("error.failed_to_load_wishlist_from_local_storage"),
          error,
        );
        wishlistItems.value = [];
      }
    }

    isWishlistInitialized.value = true;
  };

  const saveWishlist = () => {
    if (typeof window !== "undefined" && !authStore.isAuthenticated) {
      try {
        localStorage.setItem(
          WISHLIST_STORAGE_KEY,
          JSON.stringify(wishlistItems.value),
        );
      } catch (error) {
        console.error(
          t("error.failed_to_save_wishlist_to_local_storage"),
          error,
        );
      }
    }
  };

  const addToWishlist = async (item: WishlistItem) => {
    if (authStore.isAuthenticated) {
      const { error } = await apiFetch("/wishlist/add", {
        method: "POST",
        body: { product_id: item.id },
      });
      if (error) return { success: false, message: error.message };

      if (!wishlistItems.value.some((i) => i.id === item.id))
        wishlistItems.value.push(item);
      return { success: true, message: t("wishlist.item_added_to_wishlist") };
    }

    if (!wishlistItems.value.some((i) => i.id === item.id)) {
      wishlistItems.value.push(item);
      saveWishlist();
      return { success: true, message: t("wishlist.item_added_to_wishlist") };
    }

    return { success: false, message: t("wishlist.item_already_in_wishlist") };
  };

  const removeFromWishlist = async (itemId: number) => {
    if (authStore.isAuthenticated) {
      const { error } = await apiFetch("/wishlist/remove", {
        method: "POST",
        body: { product_id: itemId },
      });
      if (error) return { success: false, message: error.message };

      wishlistItems.value = wishlistItems.value.filter((i) => i.id !== itemId);
      return { success: true, message: t("wishlist.item_removed_from_wishlist") };
    }

    const index = wishlistItems.value.findIndex((i) => i.id === itemId);
    if (index !== -1) {
      wishlistItems.value.splice(index, 1);
      saveWishlist();
      return { success: true, message: t("wishlist.item_removed") };
    }

    return { success: false, message: t("wishlist.item_not_found") };
  };

  const toggleWishlist = async (item: WishlistItem) => {
    return wishlistItems.value.some((i) => i.id === item.id)
      ? removeFromWishlist(item.id)
      : addToWishlist(item);
  };

  const clearWishlist = async () => {
    if (authStore.isAuthenticated) {
      const { error } = await apiFetch("/wishlist/clear", { method: "POST" });
      if (!error) wishlistItems.value = [];
    } else {
      wishlistItems.value = [];
      saveWishlist();
    }
  };

  const isInWishlist = (itemId: number) =>
    wishlistItems.value.some((i) => i.id === itemId);

  const wishlistCount = computed(() => wishlistItems.value.length);

  return {
    wishlistItems,
    wishlistCount,
    fetchWishlistFromAPI,
    loadWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
    isInWishlist,
  };
};
