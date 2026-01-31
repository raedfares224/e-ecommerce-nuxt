<template>
  <Sheet v-model:open="isOpen">
    <SheetTrigger as-child>
      <button
        class="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 transition-all duration-200 hover:scale-105 active:scale-95"
        aria-label="Open menu"
      >
        <Menu class="w-5 h-5 transition-transform" :style="{ color: 'var(--color-navbarText)' }" />
      </button>
    </SheetTrigger>
    <SheetContent side="left" class="w-[85vw] sm:w-[400px] overflow-y-auto p-0 border-r-0">
      <div class="flex flex-col h-full bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <!-- Header -->
        <div class="relative flex items-center justify-between gap-3 p-6 pb-4 border-b border-gray-100 dark:border-gray-800">
          <!-- Background decoration -->
          <div class="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-transparent"></div>
          <div class="relative flex items-center gap-3">
            <img
              :src="siteSettings.settings?.logo"
              loading="lazy"
              decoding="async"
              alt="logo"
              class="h-10 w-auto object-contain"
            />
            <div class="flex flex-col">
              <span class="text-sm font-bold text-gray-900 dark:text-white">{{ siteSettings.siteTitle }}</span>
              <span class="text-xs text-gray-500 dark:text-gray-400">{{ $t('common.menu') || 'Menu' }}</span>
            </div>
          </div>
        </div>

        <!-- Scrollable Content -->
        <div class="flex-1 overflow-y-auto px-4 py-6">
          <!-- Search -->
          <div class="mb-6">
            <InputsSearch class="w-full" />
          </div>

          <!-- Navigation Menu Items with Dropdowns -->
          <nav class="flex flex-col gap-1 mb-6">
            <template v-for="item in menuItems" :key="item.title">
              <!-- Items with dropdown -->
              <!-- <div v-if="item.drop_down" class="flex flex-col">
                <button
                  @click="toggleSubmenu(item.title)"
                  class="flex items-center justify-between w-full px-4 py-3 text-left rounded-lg hover:bg-accent/50 active:bg-accent transition-all duration-200 font-medium"
                >
                  <span>{{ item.title }}</span>
                  <ChevronDown
                    :class="[
                      'w-4 h-4 transition-transform duration-300',
                      openSubmenus.includes(item.title) ? 'rotate-180' : ''
                    ]"
                  />
                </button>
                <Transition
                  enter-active-class="transition-all duration-300 ease-out"
                  enter-from-class="opacity-0 max-h-0"
                  enter-to-class="opacity-100 max-h-[500px]"
                  leave-active-class="transition-all duration-200 ease-in"
                  leave-from-class="opacity-100 max-h-[500px]"
                  leave-to-class="opacity-0 max-h-0"
                >
                  <div
                    v-show="openSubmenus.includes(item.title)"
                    class="overflow-hidden"
                  >
                    <div class="flex flex-col gap-1 pl-4 py-2">
                      <NuxtLink
                        v-for="subItem in item.dropdown_menus?.data"
                        :key="subItem.title"
                        :to="subItem.link"
                        @click="isOpen = false"
                        class="px-4 py-2.5 text-sm rounded-lg hover:bg-accent/50 active:bg-accent transition-all duration-200 text-muted-foreground hover:text-foreground"
                      >
                        {{ subItem.title }}
                      </NuxtLink>
                    </div>
                  </div>
                </Transition>
              </div> -->

              <!-- Items without dropdown
              <NuxtLink
                v-else
                :to="item.link"
                @click="isOpen = false"
                class="px-4 py-3 rounded-lg hover:bg-accent/50 active:bg-accent transition-all duration-200 font-medium"
              >
                {{ item.title }}
              </NuxtLink> -->
            </template>
             <NuxtLink
              to="/"
              @click="isOpen = false"
              class="px-4 py-3 rounded-lg hover:bg-accent/50 active:bg-accent transition-all duration-200 font-medium"
            >
              {{ $t("nav.home") }}
            </NuxtLink>
             <NuxtLink
              to="/profile/orders"
              @click="isOpen = false"
              class="px-4 py-3 rounded-lg hover:bg-accent/50 active:bg-accent transition-all duration-200 font-medium"
            >
              {{ $t("nav.order") }}
            </NuxtLink>

            <!-- Categories with Expandable Subcategories -->
            <div class="flex flex-col">
              <button
                @click="toggleSubmenu('categories')"
                class="flex items-center justify-between w-full px-4 py-3 text-start rounded-lg hover:bg-accent/50 active:bg-accent transition-all duration-200 font-medium"
              >
                <span class="flex items-center gap-2">
                  <LayoutGrid class="w-4 h-4" />
                  {{ $t("nav.categories") }}
                </span>
                <ChevronDown
                  :class="[
                    'w-4 h-4 transition-transform duration-300',
                    openSubmenus.includes('categories') ? 'rotate-180' : ''
                  ]"
                />
              </button>
              <Transition
                enter-active-class="transition-all duration-300 ease-out"
                enter-from-class="opacity-0 max-h-0"
                enter-to-class="opacity-100 max-h-[1000px]"
                leave-active-class="transition-all duration-200 ease-in"
                leave-from-class="opacity-100 max-h-[1000px]"
                leave-to-class="opacity-0 max-h-0"
              >
                <div
                  v-show="openSubmenus.includes('categories')"
                  class="overflow-hidden"
                >
                  <div class="flex flex-col gap-2 ps-4 py-2">
                    <!-- Each Category -->
                    <div v-for="category in featuredCategories" :key="category.id" class="flex flex-col">
                      <!-- Category Header -->
                      <NuxtLink
                        :to="`/categories/${category.slug || category.id}`"
                        @click="isOpen = false"
                        class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent/50 transition-colors group"
                      >
                        <div class="w-8 h-8 z-50 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                          <img
                            v-if="category.imageUrl"
                            :src="category.imageUrl"
                            :alt="category.name"
                            class="w-full h-full object-cover"
                          />
                          <Package v-else class="w-4 h-4 text-black" />
                        </div>
                        <span class="font-semibold text-sm text-gray-800 dark:text-gray-200 group-hover:text-primary transition-colors">
                          {{ category.name }}
                        </span>
                      </NuxtLink>
                      
                      <!-- Products under this category -->
                      <div class="flex flex-col gap-1 ps-4 mt-1">
                        <NuxtLink
                          v-for="product in category.products?.data?.slice(0, 4)"
                          :key="product.id"
                          :to="`/products/${product.slug}`"
                          @click="isOpen = false"
                          class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent/30 transition-colors"
                        >
                          <div class="w-7 h-7 rounded-md bg-white border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                            <img
                              v-if="product.imageUrl"
                              :src="product.imageUrl"
                              :alt="product.name"
                              class="w-full h-full object-cover"
                            />
                          </div>
                          <span class="text-sm text-gray-600 dark:text-gray-400 truncate">
                            {{ product.name }}
                          </span>
                        </NuxtLink>
                      </div>
                    </div>
                  </div>
                </div>
              </Transition>
            </div>
            
            <NuxtLink
              to="/privacy-policy"
              @click="isOpen = false"
              class="px-4 py-3 rounded-lg hover:bg-accent/50 active:bg-accent transition-all duration-200 font-medium"
            >
              {{ $t('footer.privacyPolicy') }}
            </NuxtLink>
            <NuxtLink
              to="/terms-and-conditions"
              @click="isOpen = false"
              class="px-4 py-3 rounded-lg hover:bg-accent/50 active:bg-accent transition-all duration-200 font-medium"
            >
              {{ $t('footer.termsConditions') }}
            </NuxtLink>

          </nav>
        </div>

        <!-- Footer Actions -->
        <div class="border-t border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-4">
          <div class="flex items-center justify-between gap-3 mb-4">
            <!-- User Profile -->
            <div class="flex items-center gap-3 p-1.5 pe-4 rounded-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex-1 min-w-0">
              <BaseAuthDropdown />
              <div class="flex flex-col min-w-0">
                <span class="text-sm font-bold truncate text-gray-900 dark:text-white">
                  {{ useAuthStore().user?.name || $t('auth.guest') }}
                </span>
                <span class="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {{ useAuthStore().user?.email || $t('auth.welcome') }}
                </span>
              </div>
            </div>

            <!-- Language Switcher -->
            <button 
              @click="toggleLanguage"
              class="shrink-0 w-11 h-11 rounded-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
              :aria-label="$t('common.switchLanguage')"
            >
              <Languages class="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-primary transition-colors" />
              <span class="sr-only">{{ locale === 'en' ? 'Arabic' : 'English' }}</span>
            </button>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <NuxtLink 
              to="/wishlist" 
              @click="isOpen = false"
              class="group inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-gradient-to-r from-pink-50 to-red-50 dark:from-pink-900/20 dark:to-red-900/20 hover:from-pink-100 hover:to-red-100 dark:hover:from-pink-900/30 dark:hover:to-red-900/30 transition-all duration-300 border border-pink-100 dark:border-pink-800/30"
            >
              <Heart class="w-5 h-5 text-pink-500 group-hover:scale-110 transition-transform" />
              <span class="text-sm font-medium text-pink-700 dark:text-pink-300">{{ $t('footer.wishlist') }}</span>
            </NuxtLink>
            <NuxtLink 
              to="/cart" 
              @click="isOpen = false"
              class="group inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 hover:from-primary/20 hover:to-primary/10 transition-all duration-300 border border-primary/20"
            >
              <ShoppingCart class="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
              <span class="text-sm font-medium text-primary">{{ $t('nav.cart') }}</span>
            </NuxtLink>
          </div>
          
          <!-- App download hint -->
          <div class="mt-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Smartphone class="w-5 h-5 text-primary" />
              </div>
              <div class="flex-1">
                <p class="text-xs font-medium text-gray-900 dark:text-white">{{ $t('common.downloadApp') || 'Get the App' }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ $t('common.betterExperience') || 'For a better experience' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SheetContent>
  </Sheet>
</template>

<script setup lang="ts">
  const { $setLocale } = useNuxtApp();
import { Sheet, SheetContent, SheetTrigger } from '~/components/ui/sheet'
import { Menu, ChevronDown, Heart, ShoppingCart, Smartphone, LayoutGrid, Package, Languages } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import type { Featured } from '~/types/shop'

const siteSettings = useSiteSettingsStore()
const { locale } = useI18n()

const isOpen = ref(false)
const openSubmenus = ref<string[]>([])

const menuItems = computed(() => siteSettings.menudata)

const toggleLanguage = () => {
  $setLocale(locale.value === 'en' ? 'ar' : 'en');
}

const featuredCategories = computed<Featured[]>(() => {
  if (!siteSettings.featured) return []
  return siteSettings.featured.map((item) => ({
    ...item,
    products: {
      ...item.products,
      data: item.products?.data ? [...item.products.data] : [],
    },
  }))
})

const toggleSubmenu = (title: string) => {
  const index = openSubmenus.value.indexOf(title)
  if (index > -1) {
    openSubmenus.value.splice(index, 1)
  } else {
    openSubmenus.value.push(title)
  }
}

const route = useRoute()

watch(
  () => route.fullPath,
  () => {
    if (isOpen.value) {
      isOpen.value = false
    }
  }
)
</script>
