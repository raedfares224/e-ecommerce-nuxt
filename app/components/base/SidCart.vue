<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { ShoppingCart, Trash2, X } from "lucide-vue-next";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { useCart } from "~/composables/useCart";
import { Separator } from "~/components/ui/separator";
import { useAuthStore } from "~/stores/auth";
import { useCurrency } from "~/composables/useCurrency";
import { useI18n } from "vue-i18n";

const cart = useCart();
const authStore = useAuthStore();
const { formatPrice } = useCurrency();
const { locale } = useI18n();

const sheetSide = computed(() => (locale.value === "ar" ? "left" : "right"));

const loadingItemId = ref<number | null>(null);
const loadingAction = ref<"update" | "delete" | null>(null);

onMounted(() => {
  console.log("ddddddddddddd", cart.cartItems.value);
});

const handleRemoveItem = async (item: any) => {
  if (loadingItemId.value === item.id && loadingAction.value === "delete")
    return;
  loadingItemId.value = item.id;
  loadingAction.value = "delete";

  try {
    if (authStore.isAuthenticated) {
      const result = await cart.removeFromCartFromAPI(item.id);
      if (result?.success) {
        await cart.fetchCartFromAPI();
      }
    } else {
      cart.removeFromCart(item.id);
    }
  } finally {
    loadingItemId.value = null;
    loadingAction.value = null;
  }
};

const handleDecreaseQuantity = async (item: any) => {
  const newQuantity = item.quantity - 1;
  if (newQuantity < 1) return;
  if (loadingItemId.value === item.id && loadingAction.value === "update")
    return;

  loadingItemId.value = item.id;
  loadingAction.value = "update";

  try {
    if (authStore.isAuthenticated) {
      const result = await cart.updateQuantityFromAPI(item.id, newQuantity);
      if (result?.success) {
        await cart.fetchCartFromAPI();
      }
    } else {
      cart.updateQuantity(item.id, newQuantity);
    }
  } finally {
    loadingItemId.value = null;
    loadingAction.value = null;
  }
};

const handleIncreaseQuantity = async (item: any) => {
  const newQuantity = item.quantity + 1;
  if (newQuantity > item.maxStock) return;
  if (loadingItemId.value === item.id && loadingAction.value === "update")
    return;

  loadingItemId.value = item.id;
  loadingAction.value = "update";

  try {
    if (authStore.isAuthenticated) {
      const result = await cart.updateQuantityFromAPI(item.id, newQuantity);
      if (result?.success) {
        await cart.fetchCartFromAPI();
      }
    } else {
      cart.updateQuantity(item.id, newQuantity);
    }
  } finally {
    loadingItemId.value = null;
    loadingAction.value = null;
  }
};

const getItemTotal = (item: any) => {
  const quantity = Number(item.quantity) || 1;
  const itemPrice = Number(item.price) || 0;
  
  const accessoriesTotal = (item.accessories || []).reduce(
    (accSum: number, acc: any) => {
      const accPrice = Number(acc.price || 0);
      const accDiscount = Number(acc.discount || 0);
      const accQty = Number(acc.qty || 1);
      return accSum + (accPrice - accDiscount) * accQty;
    },
    0
  );
  
  return (itemPrice + accessoriesTotal) * quantity;
};
</script>

<template>
  <Sheet>
    <SheetTrigger as-child>
      <button
        class="relative inline-flex items-center justify-center w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 transition-all duration-200 hover:scale-105 active:scale-95"
        :aria-label="$t('nav.cart')"
        :style="{ color: 'var(--color-navbarText)' }"
      >
        <ShoppingCart class="w-[18px] h-[18px] lg:w-5 lg:h-5" />
        <span
          v-if="cart.cartItemCount?.value > 0"
          class="absolute -top-1 -end-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-in zoom-in duration-200 shadow-sm"
          :style="{ border: '2px solid var(--color-navbar)' }"
        >
          {{ cart.cartItemCount?.value > 9 ? "9+" : cart.cartItemCount?.value }}
        </span>
      </button>
    </SheetTrigger>
    <SheetContent :side="sheetSide" class="flex flex-col h-full sm:max-w-md w-full">
      <SheetHeader class="space-y-2.5 pr-6">
        <SheetTitle class="text-xl font-bold">{{ $t("nav.cart") }}</SheetTitle>
        <SheetDescription
          v-if="cart.cartItemCount?.value > 0"
          class="text-sm text-muted-foreground"
        >
          {{ $t("cart.itemsCount", { count: cart.cartItemCount?.value }) }}
        </SheetDescription>
      </SheetHeader>

      <Separator class="my-4" />

      <div class="flex-1 overflow-y-auto p-6 -mr-2">
        <!-- Empty State -->
        <div
          v-if="cart.cartItems?.value?.length === 0"
          class="flex flex-col items-center justify-center h-3/4 text-center space-y-6 p-4"
        >
          <div class="bg-muted/30 p-6 rounded-full">
            <ShoppingCart class="w-12 h-12 text-muted-foreground/50" />
          </div>
          <div class="space-y-2">
            <h3 class="font-semibold text-lg">{{ $t("cart.empty") }}</h3>
            <p class="text-muted-foreground text-sm max-w-[200px] mx-auto">
              {{ $t("cart.emptyDescription") }}
            </p>
          </div>
          <SheetClose as-child>
            <Button size="lg" class="w-full mt-4">
              {{ $t("cart.continueShopping") }}
            </Button>
          </SheetClose>
        </div>

        <!-- Cart Items -->
        <div v-else class="space-y-6">
          <div
            v-for="item in cart.cartItems?.value || []"
            :key="item.id"
            class="flex gap-4 group relative"
          >
            <!-- Product Image -->
            <div
              class="h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-border bg-muted/30"
            >
              <img
                :src="item.image || '/placeholder.png'"
                :alt="item.name"
                class="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            <!-- Product Info -->
            <div class="flex flex-1 flex-col justify-between py-1">
              <div class="space-y-1">
                <div class="flex justify-between items-start gap-2">
                  <h3
                    class="text-sm font-semibold text-foreground line-clamp-2 leading-snug"
                  >
                    <NuxtLink
                      :to="`/products/${item.slug}`"
                      class="hover:underline"
                    >
                      {{ item.name
                      }}<span v-if="item.different">
                        - {{ item.different }}</span
                      >
                    </NuxtLink>
                  </h3>

                  <button
                    type="button"
                    class="text-muted-foreground hover:text-destructive transition-colors p-1 -mr-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    :disabled="
                      loadingItemId === item.id && loadingAction === 'delete'
                    "
                    @click="handleRemoveItem(item)"
                  >
                    <Trash2 class="w-4 h-4" />
                    <span class="sr-only">{{ $t("cart.removeItem") }}</span>
                  </button>
                </div>
                <p class="text-sm font-bold text-primary mt-1">
                  {{ formatPrice(item?.differentPrice || item?.price) }}
                </p>
                <div
                  v-if="item.accessories && item.accessories.length > 0"
                  class="mt-2 rounded-md bg-muted/30 p-2 text-xs"
                >
                  <p class="mb-1.5 font-medium text-muted-foreground">
                    {{ $t("product.accessories") }}:
                  </p>
                  <ul class="space-y-2">
                    <li
                      v-for="(acc, idx) in item.accessories"
                      :key="acc.id || idx"
                      class="flex flex-col gap-1 border-l-2 border-primary/20 pl-2"
                    >
                      <div class="flex items-start justify-between gap-2">
                        <span
                          class="line-clamp-1 text-[11px] font-medium text-foreground"
                          :title="acc.name"
                        >
                          {{ acc.name }}
                        </span>
                      </div>
                      <div class="flex items-center justify-between gap-2">
                        <span class="text-[10px] text-muted-foreground">
                          {{ $t("cart.quantity") }}: {{ acc.qty || 1 }}
                        </span>
                        <div class="flex items-center gap-1.5">
                          <!-- Discount Badge -->
                          <span
                            v-if="Number(acc.discount || 0) > 0"
                            class="rounded-sm bg-red-100 px-1 py-0.5 text-[9px] font-bold text-red-600 dark:bg-red-900/30 dark:text-red-400"
                          >
                            -{{
                              Math.round(
                                (Number(acc.discount) / Number(acc.price)) * 100
                              )
                            }}%
                          </span>

                          <div class="flex flex-col items-end leading-none">
                            <span class="text-[11px] font-bold text-primary">
                              {{
                                formatPrice(
                                  Number(acc.price || 0) -
                                    Number(acc.discount || 0)
                                )
                              }}
                            </span>
                            <!-- Original Price -->
                            <span
                              v-if="Number(acc.discount || 0) > 0"
                              class="text-[9px] text-muted-foreground line-through"
                            >
                              {{ formatPrice(Number(acc.price || 0)) }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <div class="flex items-center justify-between mt-2 px-2">
                <div
                  class="flex items-center gap-2 bg-muted/50 px-2 py-1 rounded-md"
                >
                  <button
                    type="button"
                    class="w-7 h-7 flex items-center justify-center rounded-md border border-input bg-background text-foreground text-sm hover:bg-accent hover:text-accent-foreground disabled:opacity-40 disabled:cursor-not-allowed"
                    :disabled="
                      item.quantity <= 1 ||
                      (loadingItemId === item.id &&
                        (loadingAction === 'update' ||
                          loadingAction === 'delete'))
                    "
                    @click="handleDecreaseQuantity(item)"
                  >
                    -
                  </button>
                  <span class="text-sm text-muted-foreground">
                    {{ $t("cart.quantity") }}:
                    <span class="font-medium text-foreground ml-1">{{
                      item.quantity
                    }}</span>
                  </span>
                  <button
                    type="button"
                    class="w-7 h-7 flex items-center justify-center rounded-md border border-input bg-background text-foreground text-sm hover:bg-accent hover:text-accent-foreground disabled:opacity-40 disabled:cursor-not-allowed"
                    :disabled="
                      item.quantity >= item.maxStock ||
                      (loadingItemId === item.id &&
                        (loadingAction === 'update' ||
                          loadingAction === 'delete'))
                    "
                    @click="handleIncreaseQuantity(item)"
                  >
                    +
                  </button>
                </div>
                <p class="font-bold text-primary">
                  {{ formatPrice(getItemTotal(item)) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div
        v-if="cart.cartItems?.value?.length > 0"
        class="border-t bg-background p-6 mt-auto space-y-4"
      >
        <div class="space-y-1.5">
          <div
            class="flex justify-between text-base font-medium text-foreground"
          >
            <p>{{ $t("cart.subtotal") }}</p>
            <p class="font-bold">
              {{ formatPrice(cart.cartTotal?.value || 0) }}
            </p>
          </div>
          <p class="text-xs text-muted-foreground text-center">
            {{ $t("cart.shippingCalculatedAtCheckout") }}
          </p>
        </div>

        <div class="grid gap-3">
          <SheetClose as-child>
            <Button
              size="lg"
              class="w-full font-semibold"
              @click="$router.push('/checkout')"
            >
              {{ $t("cart.checkout") }}
            </Button>
          </SheetClose>

          <SheetClose as-child>
            <Button
              variant="outline"
              size="lg"
              class="w-full"
              @click="$router.push('/cart')"
            >
              {{ $t("cart.shoppingCart") }}
            </Button>
          </SheetClose>
        </div>
      </div>
    </SheetContent>
  </Sheet>
</template>
