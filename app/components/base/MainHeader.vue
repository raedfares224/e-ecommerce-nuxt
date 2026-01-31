<template>
  <header
    ref="headerRef"
    :class="[
      'fixed left-0 right-0 top-0 z-50 transition-all duration-500 ease-out',
      isHidden ? '-translate-y-full' : 'translate-y-0',
      isInitialDim ? 'opacity-0' : 'opacity-100',
    ]"
    v-if="useSiteSettings.settings"
  >
    <!-- Main Navigation Bar -->
    <nav
      class="relative shadow-lg backdrop-blur-sm"
      :style="{ backgroundColor: 'var(--color-navbar)' }"
    >
      <div class="max-w-[1920px] mx-auto px-4 lg:px-6">
        <div class="flex items-center justify-center h-16 lg:h-[70px] gap-3 xl:gap-6">
          <!-- Mobile Menu -->
          <BaseMobileNav class="lg:hidden" />

          <!-- Logo -->
          <NuxtLink
            to="/"
            class="flex items-center gap-2.5 shrink-0 me-2 lg:me-4 group"
          >
            <div class="relative">
              <img
                :src="useSiteSettings.settings?.logo"
                loading="lazy"
                decoding="async"
                alt="logo"
                class="h-9 lg:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div class="hidden sm:flex flex-col">
              <span class="text-base lg:text-lg font-bold leading-tight tracking-tight" :style="{ color: 'var(--color-navbarText)' }">
                {{ useSiteSettings.siteTitle }}
              </span>
            </div>
          </NuxtLink>

          <!-- Search Bar - Center -->
          <div class="hidden lg:flex flex-1 max-w-xl">
            <div class="relative w-full group">
              <div 
                class="absolute inset-0 rounded-full bg-white/5 group-focus-within:bg-white transition-all duration-300"
                :class="searchFocused ? 'shadow-lg ring-2 ring-white/30' : ''"
              ></div>
              <Input
                v-model="searchQuery"
                class="relative w-full h-11 bg-transparent border-0 placeholder:text-white/60 rounded-full ps-5 pe-14 focus:text-gray-900 focus:placeholder:text-gray-400 transition-all duration-300 focus:ring-0 focus:outline-none"
                :style="{ color: searchFocused ? '#111827' : 'var(--color-navbarText)' }"
                :placeholder="$t('search.placeholder')"
                @keydown.enter.prevent="handleSearchSubmit"
                @focus="searchFocused = true"
                @blur="searchFocused = false"
              />
              <button
                @click="handleSearchSubmit"
                class="absolute end-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
                :class="searchFocused ? 'bg-primary hover:bg-primary/90 text-white shadow-md' : 'bg-white/15 hover:bg-white/25 text-white'"
              >
                <Search class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Desktop Navigation Links -->
          <div class="hidden xl:flex items-center gap-0.5">
            <NuxtLink
              v-for="link in navLinks"
              :key="link.to"
              :to="link.to"
              :style="{ color: 'var(--color-navbarText)' }"
              class="relative px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-white/10"
              :class="isActiveLink(link.to) ? 'bg-white/15' : ''"
            >
              {{ link.label }}
              <span 
                v-if="isActiveLink(link.to)" 
                class="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white"
              ></span>
            </NuxtLink>
            
            <!-- Categories Dropdown -->
            <DropdownMenu>
              <DropdownMenuTrigger
                :style="{ color: 'var(--color-navbarText)' }"
                class="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium hover:bg-white/10 rounded-lg transition-all duration-200 group"
              >
                <LayoutGrid class="w-4 h-4 transition-transform duration-200 group-hover:rotate-90" />
                {{ $t("nav.categories") }}
                <ChevronDown class="w-3.5 h-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" class="w-[85vw] max-w-5xl p-6 shadow-2xl border-0 rounded-2xl">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div
                    v-for="category in featuredMenuItems.slice(0, 3)"
                    :key="category.id"
                    class="space-y-3"
                  >
                    <!-- Category Header -->
                    <NuxtLink
                      :to="`/categories/${category.slug || category.id}`"
                      class="flex items-center gap-3 p-2 -mx-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 group"
                    >
                      <div class="w-10 h-10 rounded-xl bg-linear-to-br from-primary/10 to-primary/5 flex items-center justify-center overflow-hidden shrink-0 border border-primary/10 group-hover:border-primary/30 group-hover:shadow-md transition-all duration-200">
                        <img
                          v-if="category.imageUrl"
                          :src="category.imageUrl"
                          :alt="category.name"
                          class="w-full h-full object-cover"
                        />
                        <Package v-else class="w-5 h-5 text-primary/60 group-hover:text-primary transition-colors" />
                      </div>
                      <span class="font-bold text-base text-gray-900 dark:text-white">{{ category.name }}</span>
                      <ArrowRight class="w-4 h-4 ms-auto text-gray-400 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200" />
                    </NuxtLink>

                    <!-- Products List -->
                    <ul class="space-y-1">
                      <li v-for="product in category.products?.data?.slice(0, 4)" :key="product.id">
                        <NuxtLink
                          :to="`/products/${product.slug}`"
                          class="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 group/item"
                        >
                          <div class="w-12 h-12 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 flex items-center justify-center overflow-hidden shrink-0 group-hover/item:shadow-md transition-all duration-200">
                            <img
                              v-if="product.imageUrl"
                              :src="product.imageUrl || '/placeholder.png'"
                              :alt="product.name"
                              class="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div class="flex flex-col min-w-0 flex-1">
                            <span class="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover/item:text-primary truncate transition-colors">
                              {{ product.name }}
                            </span>
                            <span class="text-xs font-semibold text-primary">
                              {{ product.price }}
                            </span>
                          </div>
                        </NuxtLink>
                      </li>
                    </ul>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <!-- Right Actions -->
          <div class="flex items-center gap-1.5 lg:gap-2 ms-auto lg:ms-0 shrink-0">
            <!-- Mobile Search -->
            <button
              :style="{ color: 'var(--color-navbarText)' }"
              class="lg:hidden header-action-btn"
              @click.stop="expandSearch"
              :aria-label="$t('search.placeholder')"
            >
              <Search class="w-[18px] h-[18px]" />
            </button>

            <!-- Desktop Auth & Lang -->
            <div class="hidden lg:flex items-center gap-1.5 pe-2 me-1 border-e border-white/15">
               <BaseAuthDropdown />
               <BaseLanguageSwitcher />
            </div>

            <!-- Mobile Auth -->
            <div class="lg:hidden flex items-center justify-center">
              <BaseAuthDropdown />
            </div>

            <!-- Wishlist -->
            <Tooltip>
              <TooltipTrigger as-child>
                <button
                  :style="{ color: 'var(--color-navbarText)' }"
                  class="header-action-btn"
                  @click="$router.push('/wishlist')"
                  :aria-label="$t('nav.wishlist')"
                >
                  <Heart class="w-[18px] h-[18px] lg:w-5 lg:h-5" />
                  <span
                    v-if="cart.wishlistCount.value > 0"
                    class="header-badge"
                  >
                    {{ cart.wishlistCount.value > 9 ? "9+" : cart.wishlistCount.value }}
                  </span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" :sideOffset="8">{{ $t("nav.wishlist") }}</TooltipContent>
            </Tooltip>

            <!-- Cart -->
            <SheetCom />

            <!-- Compare -->
            <Tooltip>
              <TooltipTrigger as-child>
                <button
                  :style="{ color: 'var(--color-navbarText)' }"
                  @click="$router.push('/repeat')"
                  class="header-action-btn"
                  :aria-label="$t('common.compare')"
                >
                  <ArrowLeftRight class="w-[18px] h-[18px] lg:w-5 lg:h-5" />
                  <span
                    v-if="compare.compareCount.value > 0"
                    class="header-badge"
                  >
                    {{ compare.compareCount.value > 9 ? "9+" : compare.compareCount.value }}
                  </span>
                </button>
              </TooltipTrigger>
         
              <TooltipContent side="bottom" :sideOffset="8">{{ $t("common.repeatOrder") }}</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>

      <!-- Bottom gradient line -->
      <div class="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-white/25 to-transparent"></div>

      <!-- Expanded Search Overlay (Mobile) -->
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="isSearchExpanded"
          ref="searchOverlayRef"
          class="absolute inset-x-0 top-0 h-full flex items-center gap-3 px-3 shadow-xl"
          :style="{ backgroundColor: 'var(--color-navbar)' }"
        >
          <button
            :style="{ color: 'var(--color-navbarText)' }"
            class="shrink-0 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 flex items-center justify-center transition-all duration-200"
            @click="closeExpandedSearch"
          >
            <X class="w-5 h-5" />
          </button>
          <div class="flex-1 relative">
            <Input
              ref="searchInputRef"
              v-model="searchQuery"
              class="w-full bg-white text-gray-900 h-11 rounded-full ps-5 pe-14 shadow-lg border-0 focus:ring-2 focus:ring-primary/30"
              :placeholder="$t('search.placeholder')"
              @keydown.enter.prevent="handleSearchSubmit"
            />
            <button
              @click="handleSearchSubmit"
              class="absolute end-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-primary hover:bg-primary/90 active:scale-95 flex items-center justify-center transition-all duration-200 shadow-md"
            >
              <Search class="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </Transition>
    </nav>
  </header>
</template>

<script setup lang="ts">
import {
  ArrowLeftRight,
  ArrowRight,
  ChevronDown,
  Heart,
  LayoutGrid,
  Package,
  Phone,
  Repeat,
  Search,
  X,
} from "lucide-vue-next";
import { onMounted, onBeforeUnmount, ref, computed, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useHeaderScroll } from "~/composables/useHeaderScroll";
import { useCart } from "~/composables/useCart";
import { useCompare } from "~/composables/useCompare";
import Input from "~/components/ui/input/Input.vue";
import SheetCom from "~/components/base/SidCart.vue";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import type { Featured } from "~/types/shop";

const route = useRoute();
const useSiteSettings = useSiteSettingsStore();
const cart = useCart();
const compare = useCompare();
const { headerRef, isHidden, isInitialDim } = useHeaderScroll();
const { t } = useI18n();
const router = useRouter();

const navLinks = computed(() => [
  { to: "/", label: t("nav.home") },
  { to: "/profile/orders", label: t("nav.order") },
  { to: "/wishlist", label: t("nav.wishlist") },
  { to: "/privacy-policy", label: t("footer.privacyPolicy") },
]);

const featuredMenuItems = computed<Featured[]>(() => {
  if (!useSiteSettings.featured) return [];
  return useSiteSettings.featured.map((item) => ({
    ...item,
    products: {
      ...item.products,
      data: item.products?.data ? [...item.products.data] : [],
    },
  }));
});

const isActiveLink = (path: string) => {
  if (!route?.path) return false;
  if (path === "/") return route.path === "/";
  return route.path.startsWith(path);
};

const isSearchExpanded = ref(false);
const searchQuery = ref("");
const searchFocused = ref(false);
const searchOverlayRef = ref<HTMLElement | null>(null);
const searchInputRef = ref<HTMLInputElement | null>(null);

const closeExpandedSearch = () => {
  isSearchExpanded.value = false;
  searchQuery.value = "";
};

const expandSearch = () => {
  if (isSearchExpanded.value) return;
  isSearchExpanded.value = true;
  nextTick(() => {
    searchInputRef.value?.focus();
  });
};

const handleSearchSubmit = () => {
  if (!searchQuery.value.trim()) {
    closeExpandedSearch();
    return;
  }

  router.push({
    path: "/products",
    query: { search: searchQuery.value.trim() },
  });
  closeExpandedSearch();
};

const handleClickOutside = (event: MouseEvent) => {
  if (!isSearchExpanded.value) return;
  if (!searchOverlayRef.value) return;
  const target = event.target as HTMLElement;

  if (!searchOverlayRef.value.contains(target)) {
    closeExpandedSearch();
  }
};

onMounted(() => {
  window.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  window.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
/* Unified action button styles */
.header-action-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 9999px;
  background-color: rgb(255 255 255 / 0.1);
  transition: all 0.2s ease;
}

.header-action-btn:hover {
  background-color: rgb(255 255 255 / 0.2);
  transform: scale(1.05);
}

.header-action-btn:active {
  background-color: rgb(255 255 255 / 0.3);
  transform: scale(0.95);
}

@media (min-width: 1024px) {
  .header-action-btn {
    width: 2.5rem;
    height: 2.5rem;
  }
}

/* Badge styles with RTL support */
.header-badge {
  position: absolute;
  top: -0.25rem;
  inset-inline-end: -0.25rem;
  min-width: 18px;
  height: 18px;
  padding-inline: 0.25rem;
  background-color: rgb(239 68 68);
  color: white;
  font-size: 10px;
  font-weight: 700;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  border: 2px solid var(--color-navbar);
  animation: zoom-in 0.2s ease;
}

@keyframes zoom-in {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
