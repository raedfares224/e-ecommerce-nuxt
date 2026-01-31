// ~/composables/useCart.ts
import { ref, computed } from "vue";
import type { CartItem } from "~/types/cart";
import { useAuthStore } from "~/stores/auth";
import { apiFetch } from "~/api/useApiFetch";
import { useI18n } from "vue-i18n";
import { useWishlist } from "~/composables/useWishlist";

const CART_STORAGE_KEY = "guest_cart";

// Shared state (singleton)
const cartItems = ref<CartItem[]>([]);
const cartSubtotalFromApi = ref(0);
const cartTotalFromApi = ref(0);
// Guards to prevent multiple cart initializations/API calls
const isCartInitialized = ref(false);
const lastInitMode = ref<"guest" | "auth" | null>(null);
let cartFetchPromise: Promise<void> | null = null;

export const useCart = () => {
  const authStore = useAuthStore();
  const localeCookie = useCookie<"en" | "ar">("locale");
  const loading = ref(false);
  const { t } = useI18n();
  const {
    wishlistItems,
    wishlistCount,
    fetchWishlistFromAPI,
    loadWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
    isInWishlist,
  } = useWishlist();

  const applyLocalizedNames = () => {
    const isAr = localeCookie.value === "ar";
    cartItems.value = cartItems.value.map((item: any) => {
      const en_name = item.en_name ?? item.name;
      const ar_name = item.ar_name ?? item.name;
      return {
        ...item,
        en_name,
        ar_name,
        name: isAr ? ar_name : en_name,
        price: Number(item.price),
        image: item.image,
        quantity: Number(item.quantity),
        maxStock: Number(item.maxStock),
        different: item.different,
      } as CartItem & { en_name: string; ar_name: string };
    });
  };
  // --------------------------
  // Cart Methods
  // --------------------------
  const loadCart = () => {
    if (typeof window === "undefined") return;
    if (!authStore.isAuthenticated) {
      try {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        if (stored) {
          cartItems.value = JSON.parse(stored);
          applyLocalizedNames();
        }
      } catch (error) {
        console.error(t("error.failed_to_load_cart_from_local_storage"), error);
        cartItems.value = [];
      }
    }
  };

  const saveCart = () => {
    if (typeof window === "undefined") return;
    if (!authStore.isAuthenticated) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems.value));
      } catch (error) {
        console.error(t("error.failed_to_save_cart_to_local_storage"), error);
      }
    }
  };

  const addToCart = (
    item: Omit<CartItem, "quantity"> & { quantity?: number }
  ) => {
    const existingItem = cartItems.value.find((i) => i.id === item.id);
    if (existingItem) {
      const newQuantity = existingItem.quantity + (item.quantity || 1);
      if (newQuantity <= existingItem.maxStock) {
        existingItem.quantity = newQuantity;
      } else {
        existingItem.quantity = existingItem.maxStock;
        return { success: false, message: t("cart.max_stock_reached") };
      }
    } else {
      cartItems.value.push({ ...item, quantity: item.quantity || 1 });
    }
    saveCart();
    return { success: true, message: t("cart.item_added_to_cart") };
  };

  const removeFromCart = (itemId: number) => {
    const index = cartItems.value.findIndex((i) => i.id === itemId);
    if (index !== -1) {
      cartItems.value.splice(index, 1);
      saveCart();
      return { success: true, message: t("cart.item_removed_from_cart") };
    }
    return { success: false, message: t("cart.item_not_found") };
  };

  const updateQuantity = (itemId: number, quantity: number) => {
    const item = cartItems.value.find((i) => i.id === itemId);
    if (!item) return { success: false, message: t("cart.item_not_found") };

    if (quantity <= 0) {
      removeFromCart(itemId);
    } else if (quantity <= item.maxStock) {
      item.quantity = quantity;
      saveCart();
      return { success: true, message: t("cart.quantity_updated") };
    } else {
      item.quantity = item.maxStock;
      saveCart();
      return { success: false, message: t("cart.max_stock_reached") };
    }
  };

  const clearCart = () => {
    cartItems.value = [];
    saveCart();
  };

  const getCartItem = (itemId: number) =>
    cartItems.value.find((i) => i.id === itemId);
  const isInCart = (itemId: number) =>
    cartItems.value.some((i) => i.id === itemId);
  const fetchCartFromAPI = async () => {
    if (!authStore.isAuthenticated) return;
    if (cartFetchPromise) return cartFetchPromise;

    cartFetchPromise = (async () => {
      const { data, error } = await apiFetch<{
        data: {
          subtotal?: number | string;
          total?: number | string;
          cartItems?: any[];
        };
      }>("/cart");
      if (error) {
        console.error(t("error.failed_to_fetch_cart"), error);
        return;
      }

      const payload = data?.data;
      cartSubtotalFromApi.value = Number(payload?.subtotal ?? 0);
      cartTotalFromApi.value = Number(payload?.total ?? 0);

      const items = payload?.cartItems ?? [];

      cartItems.value = items.map((rawItem: any) => {
        const product = rawItem.differents ?? {};
        const rawPrice =
          rawItem.price ?? product.price ?? product.calculated_price;
        const rawQuantity = rawItem.quantity;
        const rawStock = product.quantity;

        const en_name = product.en_name || product.name || product.ar_name;
        const ar_name = product.ar_name || product.name || product.en_name;
        const isAr = localeCookie.value === "ar";

        // variant / different (e.g. color) for display in cart
        const en_different = product.en_different || product.different;
        const ar_different = product.ar_different || product.different;
        const different = isAr ? ar_different : en_different;
        const differentPrice =
          Number(product?.price) - Number(product?.discount);

        // accessories from API:
        // - primary shape: rawItem.accessories: array of { group, accessory }
        // - fallback shape: rawItem.groups[*].accessories.data: array of accessories per group
        let accessoriesFromApi: { accessory: any; group: any }[] = [];

        if (
          Array.isArray(rawItem.accessories) &&
          rawItem.accessories.length > 0
        ) {
          accessoriesFromApi = rawItem.accessories.map((entry: any) => ({
            accessory: entry?.accessory ?? {},
            group: entry?.group ?? {},
          }));
        } else if (Array.isArray(rawItem.groups)) {
          accessoriesFromApi = rawItem.groups.flatMap((grp: any) => {
            const groupMeta = grp || {};
            const accList = grp?.accessories?.data ?? [];
            return accList.map((acc: any) => ({
              accessory: acc,
              group: groupMeta,
            }));
          });
        }

        const normalizedAccessories = accessoriesFromApi.map((entry: any) => {
          const acc = entry?.accessory ?? {};
          const group = entry?.group ?? {};

          const accEnName = acc.en_name || acc.name || acc.ar_name;
          const accArName = acc.ar_name || acc.name || acc.en_name;
          const accName = isAr ? accArName : accEnName;

          const groupEnName = group.en_name || group.name || group.ar_name;
          const groupArName = group.ar_name || group.name || group.en_name;
          const groupName = isAr ? groupArName : groupEnName;

          return {
            id:
              typeof acc.id === "string"
                ? parseInt(acc.id, 10)
                : Number(acc.id),
            name: accName ?? "",
            en_name: accEnName ?? "",
            ar_name: accArName ?? "",
            groupName: groupName ?? "",
            qty:
              typeof acc.qty === "string"
                ? parseInt(acc.qty, 10)
                : Number(acc.qty ?? 1),
            price:
              typeof acc.price === "string"
                ? parseFloat(acc.price)
                : Number(acc.price ?? 0),
            discount:
              typeof acc.discount === "string"
                ? parseFloat(acc.discount)
                : Number(acc.discount ?? 0),
          };
        });

        // Calculate total accessories price for this item
        const totalAccessoriesPrice = normalizedAccessories.reduce(
          (sum, acc) => sum + (acc.price - acc.discount) * acc.qty,
          0
        );

        // Raw price from API includes accessories, so subtract them to get base unit price
        // Note: rawPrice is usually total unit price (base + accessories)
        // We need base price because cartTotal computation adds accessories again.
        const basePrice =
          (typeof rawPrice === "string"
            ? parseFloat(rawPrice)
            : Number(rawPrice ?? 0)) - totalAccessoriesPrice;

        return {
          id:
            typeof rawItem.id === "string"
              ? parseInt(rawItem.id, 10)
              : Number(rawItem.id),
          slug: product.slug,
          name: (isAr ? ar_name : en_name) ?? "",
          en_name: en_name ?? "",
          ar_name: ar_name ?? "",
          different: different ?? "",
          differentPrice: differentPrice ?? 0,
          price: basePrice,
          image: product.imageUrl,
          inStock: Number(rawStock ?? 0) > 0,
          maxStock: Number(rawStock ?? 0) || 99,
          quantity:
            typeof rawQuantity === "string"
              ? parseInt(rawQuantity, 10)
              : Number(rawQuantity ?? 1),
          accessories: normalizedAccessories,
        };
      });

      applyLocalizedNames();
    })();

    try {
      await cartFetchPromise;
    } finally {
      cartFetchPromise = null;
    }
  };
  const addToCartFromAPI = async (
    item: CartItem & { accessories?: any[] }
  ) => {
    const formData = new FormData();
    loading.value = true;

    formData.append("product_id", String(item.id));
    formData.append("price", String(item.price));
    formData.append("quantity", String(item.quantity ?? 1));

    if (item.accessories && item.accessories.length > 0) {
      item.accessories.forEach((acc, index) => {
        // Handle both number[] (IDs) and object[] (full accessories)
        const accId = typeof acc === "object" ? acc.id : acc;
        formData.append(`accessories[${index}]`, String(accId));
      });
    }

    const { error, data } = await apiFetch("/cart/add", {
      method: "POST",
      body: formData,
    });
console.log(data,'ddddddddddddddddddd')
    if (error) {
      console.log("API Error:", error); // Log the full error object
      loading.value = false;
      const specificErrorMessage = error.data?.errors?.quantity?.[0];
      
      // Check if it's a stock quantity error and use translation
      if (specificErrorMessage && specificErrorMessage.includes("Requested quantity exceeds available stock")) {
        // Extract available and inCart values from the error message
        const match = specificErrorMessage.match(/Available: (-?\d+), Already in cart: (\d+)/);
        if (match) {
          const available = match[1];
          const inCart = match[2];
          return { 
            success: false, 
            message: t("cart.quantity_exceeds_available_stock", { available, inCart }) 
          };
        }
      }
      
      return { success: false, message: specificErrorMessage || error.message };
    }

    // بعد نجاح الإضافة في الـ API، حدّث حالة السلة المشتركة حتى يتحدث العداد فوراً
    await fetchCartFromAPI();

    loading.value = false;
    return { success: true, message: t("cart.item_added_to_cart") };
  };
  const removeFromCartFromAPI = async (itemId: number) => {
    const { error } = await apiFetch("/cart/remove", {
      method: "POST",
      body: { product_id: itemId, id: itemId },
    });
    if (error) return { success: false, message: error.message };
    return { success: true, message: t("cart.item_removed_from_cart") };
  };
  const clearCartFromAPI = async () => {
    const { error } = await apiFetch("/cart/clear", {
      method: "POST",
    });
    if (error) return { success: false, message: error.message };
    return { success: true, message: t("cart.clearedAll") };
  };
  const updateQuantityFromAPI = async (itemId: number, quantity: number) => {
    const formData = new FormData();
    formData.append("quantity", String(quantity));

    const { error } = await apiFetch(`/cart/${itemId}`, {
      method: "POST",
      body: formData,
    });

    if (error) return { success: false, message: error.message };
    return { success: true, message: t("cart.quantity_updated") };
  };
  // --------------------------
  // Initialize
  // --------------------------
  const initialize = async () => {
    if (typeof window === "undefined") return;

    const mode: "guest" | "auth" = authStore.isAuthenticated ? "auth" : "guest";
    if (isCartInitialized.value && lastInitMode.value === mode) return;

    if (!authStore.isAuthenticated) {
      loadCart();
      loadWishlist();
      isCartInitialized.value = true;
      lastInitMode.value = mode;
      return;
    }

    await fetchCartFromAPI();
    await fetchWishlistFromAPI();
    isCartInitialized.value = true;
    lastInitMode.value = mode;
  };

  // --------------------------
  // Computed
  // --------------------------
  const cartTotal = computed(() =>
    cartItems.value.reduce((sum, i) => {
      const itemTotal = i.price * i.quantity;
      const accessoriesTotal = (i.accessories || []).reduce(
        (accSum: number, acc: any) => {
          if (typeof acc === "object") {
            const accPrice = Number(acc.price || 0);
            const accDiscount = Number(acc.discount || 0);
            const accQty = Number(acc.qty || 1);
            // Assuming accessory quantity is total, NOT per item unit
            // If backend treats it as per item, we should multiply by i.quantity.
            // Based on screenshot "Quantity: 2" and SidCart logic, it seems independent or pre-calculated.
            // However, usually accessories are attached to the item.
            // If I buy 2 phones, and add "Charger", usually it means 2 chargers.
            // But if the user manually selected "2 Chargers" in the dropdown...
            // Let's stick to adding (price * qty) of the accessory itself.
            return accSum + (accPrice - accDiscount) * accQty;
          }
          return accSum;
        },
        0
      );
      return sum + itemTotal + (accessoriesTotal * i.quantity);
    }, 0)
  );

  const cartItemCount = computed(() =>
    cartItems.value.reduce((sum, i) => sum + i.quantity, 0)
  );

  return {
    cartItems,
    wishlistItems,
    cartTotal,
    cartItemCount,
    wishlistCount,
    cartSubtotalFromApi,
    cartTotalFromApi,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartItem,
    isInCart,
    addToCartFromAPI,
    removeFromCartFromAPI,
    clearCartFromAPI,
    fetchCartFromAPI,
    updateQuantityFromAPI,

    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    clearWishlist,

    initialize,
    loadCart,
    loadWishlist,
    fetchWishlistFromAPI,
  };
};
