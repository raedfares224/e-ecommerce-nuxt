<template>
  <Dialog v-model:open="isDialogOpen">
    <HomeProductQuickView
      v-model:open="isQuickViewOpen"
      :product-slug="quickViewSlug"
      @open-cart-dialog="handleOpenCartFromQuickView"
    />
    <div
      class="group relative rounded-2xl transition-all duration-500 hover:shadow-xl hover:shadow-primary/10 bg-white dark:bg-gray-800 h-full"
      :class="[
        layout === 'list'
          ? 'flex flex-row gap-4 p-3 sm:p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md overflow-hidden'
          : 'flex flex-col border border-gray-100 dark:border-gray-700 hover:-translate-y-1',
      ]"
    >
      <!-- Product Image Container -->
      <div
        :class="[
          'bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl overflow-hidden relative',
          layout === 'list' 
            ? 'w-28 sm:w-36 md:w-44 shrink-0' 
            : 'shadow-lg hover:shadow-xl transition-all duration-300'
        ]"
      >
        <!-- Action Icons - Always visible on mobile, show on hover on larger screens -->
        <TooltipProvider>
          <div
            :class="[
              'absolute flex flex-col gap-1.5 sm:gap-2 transition-all duration-300 z-20',
              layout === 'list'
                ? 'right-1 top-1 opacity-100'
                : 'left-2 top-1/2 -translate-y-1/2 opacity-100 md:opacity-0 md:group-hover:opacity-100'
            ]"
          >
            <!-- Add to Cart -->
            <Tooltip>
              <TooltipTrigger as-child>
                <button
                  @click.prevent="addToCart"
                  :class="[
                    'bg-white disabled:opacity-70 disabled:bg-primary/10 rounded-full flex items-center justify-center shadow-md transition-colors',
                    layout === 'list' ? 'w-7 h-7 sm:w-8 sm:h-8' : 'w-10 h-10',
                    isAddButtonLoading
                      ? 'cursor-not-allowed opacity-70'
                      : 'hover:bg-primary hover:text-white',
                  ]"
                  :disabled="isAddButtonLoading || isConfirmLoading"
                >
                  <Loader2
                    v-if="isAddButtonLoading"
                    :class="layout === 'list' ? 'w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin' : 'w-5 h-5 animate-spin'"
                  />
                  <ShoppingCart v-else :class="layout === 'list' ? 'w-3.5 h-3.5 sm:w-4 sm:h-4' : 'w-5 h-5'" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{{ $t("common.addToCart") }}</p>
              </TooltipContent>
            </Tooltip>

            <!-- Quick View - Hidden in list view on mobile -->
            <Tooltip>
              <TooltipTrigger as-child>
                <button
                  @click.prevent="quickView"
                  :class="[
                    'bg-white rounded-full flex items-center justify-center shadow-md hover:bg-primary hover:text-white transition-colors',
                    layout === 'list' ? 'w-7 h-7 sm:w-8 sm:h-8 hidden sm:flex' : 'w-10 h-10'
                  ]"
                >
                  <Eye :class="layout === 'list' ? 'w-3.5 h-3.5 sm:w-4 sm:h-4' : 'w-5 h-5'" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{{ $t("common.quickView") }}</p>
              </TooltipContent>
            </Tooltip>

            <!-- Add to Wishlist -->
            <Tooltip>
              <TooltipTrigger as-child>
                <button
                  @click.prevent="toggleWishlist"
                  :class="[
                    'rounded-full flex items-center justify-center shadow-md transition-colors',
                    layout === 'list' ? 'w-7 h-7 sm:w-8 sm:h-8' : 'w-10 h-10',
                    cart.isInWishlist(product.id)
                      ? 'bg-primary text-white hover:bg-primary'
                      : 'bg-white hover:bg-primary hover:text-white',
                  ]"
                >
                  <Heart
                    :class="[
                      layout === 'list' ? 'w-3.5 h-3.5 sm:w-4 sm:h-4' : 'w-5 h-5',
                      cart.isInWishlist(product.id) ? 'fill-current' : '',
                    ]"
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>
                  {{
                    cart.isInWishlist(product.id)
                      ? $t("common.removeFromWishlist")
                      : $t("common.addToWishlist")
                  }}
                </p>
              </TooltipContent>
            </Tooltip>

            <!-- Compare - Hidden in list view on mobile -->
            <Tooltip>
              <TooltipTrigger as-child>
                <button
                  @click.prevent="addToCompare"
                  :class="[
                    'bg-white rounded-full flex items-center justify-center shadow-md hover:bg-primary hover:text-white transition-colors',
                    layout === 'list' ? 'w-7 h-7 sm:w-8 sm:h-8 hidden sm:flex' : 'w-10 h-10'
                  ]"
                >
                  <Repeat :class="layout === 'list' ? 'w-3.5 h-3.5 sm:w-4 sm:h-4' : 'w-5 h-5'" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{{ $t("common.compare") }}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>

        <!-- Product Image -->
        <NuxtLink :to="`/products/${product.slug}`" class="block">
          <div
            :class="[
              'relative flex items-center justify-center',
              layout === 'list' ? 'aspect-square' : 'aspect-[0.865702889]'
            ]"
          >
            <!-- Product Label Badge -->
            <div
              v-if="product?.label"
              class="absolute top-3 left-3 z-10 inline-flex items-center rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-white shadow-md"
            >
              <span class="truncate max-w-[80px]">
                {{ product?.label }}
              </span>
            </div>

            <img
              :src="product.image || '/placeholder.png'"
              loading="lazy"
              decoding="async"
              :alt="product.name"
              class="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </NuxtLink>
      </div>

      <!-- Product Info -->
      <div 
        :class="[
          'bg-white dark:bg-gray-800 flex-1 flex flex-col min-w-0',
          layout === 'list' ? 'py-1' : 'p-4'
        ]"
      >
        <!-- Category -->
        <p 
          :class="[
            'font-medium text-primary/70 dark:text-primary/80 uppercase tracking-wider',
            layout === 'list' ? 'text-[10px] sm:text-xs mb-1' : 'text-xs mb-1.5'
          ]"
        >
          {{ product.category || '---'}}
        </p>

        <!-- Product Name -->
        <NuxtLink :to="`/products/${product.slug}`">
          <h3
            :class="[
              'font-semibold text-gray-800 dark:text-gray-100 hover:text-primary transition-colors duration-200',
              layout === 'list' 
                ? 'text-sm sm:text-base mb-1 sm:mb-2 line-clamp-2' 
                : 'text-base mb-2 line-clamp-2 min-h-12'
            ]"
          >
            {{ product.name }}
          </h3>
        </NuxtLink>

        <!-- Rating -->
        <div 
          :class="[
            'flex items-center gap-1 sm:gap-2',
            layout === 'list' ? 'mb-1 sm:mb-2' : 'mb-3'
          ]"
        >
          <div class="flex gap-0.5">
            <Star
              v-for="i in 5"
              :key="i"
              :class="[
                i <= Number(product.rating || 0)
                  ? 'text-amber-400 fill-amber-400'
                  : 'text-gray-200 dark:text-gray-600',
                layout === 'list' ? 'w-3 h-3 sm:w-4 sm:h-4' : 'w-4 h-4'
              ]"
            />
          </div>
          <span 
            :class="[
              'text-gray-500 dark:text-gray-400',
              layout === 'list' ? 'text-[10px] sm:text-xs' : 'text-xs'
            ]"
          >
            ({{ product.rating || 0 }})
          </span>
        </div>

        <!-- Description (Visible in List View - hidden on mobile) -->
        <p
          v-if="layout === 'list' && product.description"
          class="hidden sm:block text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-2"
        >
          {{ product.description }}
        </p>

        <!-- Spacer to push price to bottom -->
        <div class="flex-1"></div>

        <!-- Price Section -->
        <div 
          :class="[
            'flex items-center justify-between mt-auto',
            layout === 'list' 
              ? 'flex-wrap gap-1 sm:gap-2' 
              : 'pt-2 border-t border-gray-100 dark:border-gray-700'
          ]"
        >
          <div class="flex items-baseline gap-1 sm:gap-2">
            <span 
              :class="[
                'font-bold text-gray-900 dark:text-white',
                layout === 'list' ? 'text-sm sm:text-base md:text-lg' : 'text-lg'
              ]"
            >
              {{
                formatPrice(Number(product.price) - Number(product.discount || 0))
              }}
            </span>
            <span
              v-if="product?.discount"
              :class="[
                'text-gray-400 line-through',
                layout === 'list' ? 'text-xs sm:text-sm' : 'text-sm'
              ]"
            >
              {{ formatPrice(Number(product.price)) }}
            </span>
          </div>
          
          <!-- Discount badge -->
          <span 
            v-if="product?.discount && Number(product.discount) > 0"
            :class="[
              'inline-flex items-center rounded-full font-semibold bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
              layout === 'list' ? 'px-1.5 py-0.5 text-[10px] sm:text-xs' : 'px-2 py-0.5 text-xs'
            ]"
          >
            -{{ Math.floor((Number(product.discount) / Number(product.price)) * 100) }}%
          </span>
        </div>
      </div>
    </div>

    <!-- Cart Dialog -->
    <DialogContent class="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle class="text-xl">{{ $t("common.addToCart") }}</DialogTitle>
        <DialogDescription class="text-base">
          {{ product.name }}
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-4">
        <!-- Product Image and Info -->
        <div class="flex gap-4 p-4 bg-primary/10 rounded-lg">
          <div
            class="w-28 h-28 bg-white rounded-lg overflow-hidden shrink-0 shadow-sm"
          >
            <img
              :src="displayImage"
              :alt="displayName"
              loading="lazy"
              decoding="async"
              class="w-full h-full object-contain"
            />
          </div>
          <div class="flex-1">
            <h4 class="font-semibold text-gray-900 mb-1 text-lg">
              {{ displayName }}
            </h4>
            <p
              v-if="displayVariantName"
              class="text-sm font-medium text-primary mb-1 flex items-center gap-1"
            >
              <span class="w-3 h-3 rounded-full bg-primary"></span>
              {{ displayVariantName }}
            </p>
            <p class="text-sm text-gray-500 mb-2">
              {{
                selectedVariant?.brand
                  ? selectedVariant.brand
                  : product.brand || product.category
              }}
            </p>
            <div class="flex flex-col">
              <div class="flex items-center gap-2">
                <p class="text-xl font-bold text-primary">{{ displayPrice }}</p>
                <span
                  v-if="
                    (selectedVariant &&
                      Number(selectedVariant.discount || 0) > 0) ||
                    Number(product.discount || 0) > 0
                  "
                  class="text-sm text-gray-400 line-through"
                >
                  {{
                    selectedVariant
                      ? formatPrice(Number(selectedVariant.price || 0))
                      : formatPrice(Number(product.price || 0))
                  }}
                </span>
              </div>
              <span
                v-if="
                  (selectedVariant &&
                    Number(selectedVariant.discount || 0) > 0) ||
                  Number(product.discount || 0) > 0
                "
                class="inline-flex self-start mt-1 items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-600"
              >
                -{{
                  Math.floor(
                    ((selectedVariant
                      ? Number(selectedVariant.discount)
                      : Number(product.discount)) /
                      (selectedVariant
                        ? Number(selectedVariant.price)
                        : Number(product.price))) *
                      100
                  )
                }}%
              </span>
            </div>
            <p
              v-if="selectedVariant && Number(selectedVariant.quantity) > 0"
              class="text-sm text-green-600 mt-1 font-medium"
            >
              ✓ {{ $t("product.inStock") || "متوفر" }}:
              {{ Number(selectedVariant.quantity) }}
            </p>
          </div>
        </div>

        <!-- Product Variants/Differents -->
        <div
          v-if="isLoadingVariants"
          class="flex flex-col items-center justify-center py-8 gap-3"
        >
          <div
            class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"
          ></div>
          <p class="text-sm text-gray-500">
            {{ $t("common.loading") || "جاري التحميل..." }}
          </p>
        </div>

        <div v-else-if="productDifferents.length > 0" class="space-y-3">
          <div class="flex items-center justify-between">
            <Label class="text-base font-semibold">{{
              $t("product.selectVariant") || "اختر النوع"
            }}</Label>
            <span class="text-sm text-gray-500"
              >{{ productDifferents.length }}
              {{ $t("product.options") || "خيارات" }}</span
            >
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <!-- Main / Basic product option -->
            <div
              @click="selectedVariant = null"
              :class="[
                'relative cursor-pointer rounded-lg border-2 p-3 transition-all hover:shadow-md',
                !selectedVariant
                  ? 'border-primary bg-primary/5 shadow-md'
                  : 'border-gray-200 hover:border-gray-300',
              ]"
            >
              <!-- Selected Indicator for main product -->
              <div
                v-if="!selectedVariant"
                class="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>

              <!-- Main Product Image -->
              <div
                class="aspect-square rounded-md mb-2 overflow-hidden bg-white flex items-center justify-center"
              >
                <img
                  :src="product.image || '/placeholder.png'"
                  :alt="product.name"
                  class="w-full h-full object-contain"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <!-- Main Product Info -->
              <div class="space-y-1">
                <p class="font-semibold text-sm line-clamp-1">
                  {{ product.different }}
                </p>

                <p class="text-sm font-semibold mt-1 text-primary">
                  {{
                    formatPrice(
                      Number(product.price) - Number(product.discount || 0)
                    )
                  }}
                </p>
              </div>
            </div>

            <div
              v-for="variant in productDifferents"
              :key="variant.id"
              @click="selectedVariant = variant"
              :class="[
                'relative cursor-pointer rounded-lg border-2 p-3 transition-all hover:shadow-md',
                selectedVariant?.id === variant.id
                  ? 'border-primary bg-primary/5 shadow-md'
                  : 'border-gray-200 hover:border-gray-300',
              ]"
            >
              <!-- Selected Indicator -->
              <div
                v-if="selectedVariant?.id === variant.id"
                class="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
              >
                <svg
                  class="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>

              <!-- Product Image -->
              <div
                class="aspect-square bg-gray-50 rounded-md mb-2 overflow-hidden"
              >
                <img
                  :src="variant.imageUrl || '/placeholder.png'"
                  :alt="
                    localeCookie === 'ar'
                      ? variant.ar_different
                      : variant.en_different
                  "
                  class="w-full h-full object-contain"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <!-- Product Info -->
              <div class="space-y-1">
                <p class="font-medium text-sm text-gray-900 line-clamp-1">
                  {{
                    localeCookie === "ar"
                      ? variant.ar_different
                      : variant.en_different
                  }}
                </p>
                <p
                  v-if="variant.price !== '0'"
                  class="text-sm font-semibold text-primary"
                >
                  {{ formatPrice(Number(variant.price)) }}
                </p>
                <div class="flex items-center justify-between">
                  <p
                    v-if="Number(variant.quantity) > 0"
                    class="text-xs text-green-600"
                  >
                    {{ $t("product.inStock") || "متوفر" }}:
                    {{ Number(variant.quantity) }}
                  </p>
                  <p v-else class="text-xs text-red-600 font-medium">
                    {{ $t("product.outOfStock") || "غير متوفر" }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Accessory Groups -->
        <div v-if="accessoryGroups.length > 0" class="space-y-3">
          <div class="flex items-center justify-between">
            <Label class="text-base font-semibold">
              {{ $t("product.accessories") }}
            </Label>
          </div>
          <div class="space-y-3">
            <div
              v-for="group in accessoryGroups"
              :key="group.id"
              class="rounded-lg border border-gray-200 bg-white"
            >
              <div
                class="px-3 py-2 border-b border-gray-200 flex items-center gap-2"
              >
                <h3 class="text-sm font-medium text-gray-800">
                  {{
                    $i18n.locale === "ar"
                      ? group.ar_name
                      : group.en_name || group.name
                  }}
                </h3>
                <span
                  v-if="group.is_required === '1'"
                  class="text-red-500 text-xs bg-red-50 px-1.5 py-0.5 rounded"
                >
                  {{ $t("product.required") }}
                </span>
              </div>
              <div class="px-3 py-2">
                <BaseButtonSelect
                  v-model="
                    selectedVariants[
                      group.is_required == 1 ? 'required' : 'optional'
                    ]
                  "
                  :options="group.accessories?.data || []"
                  :placeholder="
                    $i18n.locale === 'ar'
                      ? group.ar_name
                      : group.en_name || group.name
                  "
                  class="w-full"
                  valueKey="value"
                >
                  <!-- Selected Option Display -->
                  <template #selected="{ option }">
                    <span class="text-sm font-medium text-gray-900 truncate">
                      {{
                        $i18n.locale === "ar"
                          ? option.ar_name
                          : option.en_name || option.name
                      }}
                    </span>
                  </template>

                  <!-- Dropdown Option Display -->
                  <template #option="{ option }">
                    {{
                      $i18n.locale === "ar"
                        ? option.ar_name
                        : option.en_name || option.name
                    }}
                    <span
                      v-if="option.price || option.qty"
                      class="text-xs text-gray-500 ml-1 inline-flex items-center gap-1"
                    >
                      -
                      <!-- Price with discount support -->
                      <span v-if="option.price" class="inline-flex items-center gap-1">
                        <span class="font-semibold text-primary">
                          {{
                            formatPrice(
                              Number(option.price || 0) -
                                Number(option.discount || 0)
                            )
                          }}
                        </span>
                        <span
                          v-if="Number(option.discount || 0) > 0"
                          class="line-through text-[11px] text-gray-400"
                        >
                          {{ formatPrice(Number(option.price || 0)) }}
                        </span>
                        <span
                          v-if="Number(option.discount || 0) > 0 && Number(option.price || 0) > 0"
                          class="ml-1 rounded-full bg-red-100 text-red-600 px-1 py-0.5 text-[10px] font-bold"
                        >
                          -{{
                            Math.round(
                              (Number(option.discount) / Number(option.price)) * 100
                            )
                          }}%
                        </span>
                      </span>
                      <!-- Quantity info -->
                      <span v-if="option.qty">
                        <span v-if="option.price"> | </span>
                        {{ option.qty }}
                        {{ $t("product.quantityShort", "كمية") }}
                      </span>
                    </span>
                  </template>
                </BaseButtonSelect>
              </div>
            </div>
          </div>
        </div>

        <!-- Divider -->
        <div
          v-if="productDifferents.length > 0"
          class="border-t border-gray-200"
        ></div>

        <!-- Out of Stock Warning -->
        <div
          v-if="selectedVariant && Number(selectedVariant.quantity) <= 0"
          class="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2"
        >
          <svg
            class="w-5 h-5 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            ></path>
          </svg>
          <p class="text-sm text-red-600 font-medium">
            {{ $t("product.outOfStock") || "غير متوفر حالياً" }}
          </p>
        </div>

        <!-- Quantity Selector -->
        <div
          v-if="!selectedVariant || Number(selectedVariant.quantity) > 0"
          class="space-y-3"
        >
          <Label class="text-base font-semibold">{{
            $t("product.quantity") || "الكمية"
          }}</Label>
          <div class="flex items-center gap-2">
            <Button
              @click="decrementQuantity"
              type="button"
              variant="outline"
              size="icon"
              :disabled="quantity <= 1 || !product.inStock"
              class="h-9 w-9"
            >
              <Minus class="h-4 w-4" />
            </Button>
            <div class="flex-1 text-center">
              <input
                v-model.number="quantity"
                type="number"
                min="1"
                :max="maxQuantity"
                class="w-full h-9 text-center border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <Button
              @click="incrementQuantity"
              type="button"
              variant="outline"
              size="icon"
              :disabled="quantity >= maxQuantity || !product.inStock"
              class="h-9 w-9"
            >
              <Plus class="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <DialogFooter class="flex-col sm:flex-row gap-3 pt-4 border-t">
        <DialogClose as-child>
          <Button
            type="button"
            variant="outline"
            size="lg"
            class="w-full sm:w-auto sm:flex-1"
          >
            {{ $t("common.cancel") || "إلغاء" }}
          </Button>
        </DialogClose>
        <Button
          @click="confirmAddToCart()"
          type="button"
          size="lg"
          :disabled="
            (selectedVariant && selectedVariant.quantity === 0) ||
            (accessoryGroups.length > 0 &&
              accessoryGroups.some((g: any) => g.is_required === '1') &&
              !selectedVariants['required']) ||
            isConfirmLoading
          "
          :class="[
            'w-full sm:w-auto sm:flex-1 flex items-center justify-center',
            isConfirmLoading ? 'cursor-not-allowed opacity-80' : '',
          ]"
        >
          <Loader2 v-if="isConfirmLoading" class="w-5 h-5 mr-2 animate-spin" />
          <ShoppingCart v-else class="w-5 h-5 mr-2" />
          <span>
            {{
              isConfirmLoading
                ? $t("common.loading") || "Loading..."
                : $t("common.addToCart")
            }}
          </span>
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import {
  Star,
  ShoppingCart,
  Eye,
  Heart,
  Repeat,
  Plus,
  Minus,
  Loader2,
} from "lucide-vue-next";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { api } from "~/api/useApi";
import type { Product } from "~/types/product";
import { useI18n } from "vue-i18n";
import { useCompare } from "~/composables/useCompare";

interface ProductVariant {
  id: number;
  name: string;
  ar_name: string;
  en_name: string;
  slug: string;
  price: string;
  discount: string;
  label: string | null;
  brand: string | null;
  brand_id: number | null;
  quantity: number;
  rating: string;
  imageUrl: string;
  different: string;
  ar_different: string;
  en_different: string;
  description: string;
  seo_description: string;
  images: {
    data: any[];
  };
}

interface ApiResponse {
  data: ProductVariant[];
  status: string;
  message: string;
}

interface Props {
  product: Product;
  layout?: "grid" | "list";
}

const props = withDefaults(defineProps<Props>(), {
  layout: "grid",
});
const { formatPrice } = useCurrency();
const { t, locale } = useI18n();
const toast = useToast();
const localeCookie = useCookie<"en" | "ar">("locale");
const isDialogOpen = ref(false);
const quantity = ref(1);
const productDifferents = ref<ProductVariant[]>([]);
const selectedVariant = ref<ProductVariant | null>(null);
const isLoadingVariants = ref(false);
const isQuickViewOpen = ref(false);
const quickViewSlug = ref<string | null>(null);
const cart = useCart();
const useAuth = useAuthStore();
const compare = useCompare();
const accessoryGroups = ref<any[]>([]);
const selectedVariants = ref<Record<string, any>>({});
const isAddButtonLoading = ref(false);
const isConfirmLoading = ref(false);
// Initialize cart on component mount
onMounted(async () => {
  await cart.initialize();
});

// Computed properties
const displayName = computed(() => {
  if (!selectedVariant.value) return props.product?.name || '';
  return localeCookie.value === "ar"
    ? selectedVariant.value?.ar_name || selectedVariant.value?.name || ''
    : selectedVariant.value?.en_name || selectedVariant.value?.name || '';
});

const displayVariantName = computed(() => {
  if (!selectedVariant.value) return "";
  return localeCookie.value === "ar"
    ? selectedVariant.value?.ar_different || selectedVariant.value?.different || ''
    : selectedVariant.value?.en_different || selectedVariant.value?.different || '';
});

const displayPrice = computed(() => {
  // لو في variant مختار، نستخدم سعره مباشرة (حتى لو كان 0)
  if (selectedVariant.value) {
    const variantPrice = Number(selectedVariant.value?.price || 0);
    const variantDiscount = Number(selectedVariant.value?.discount || 0);
    return formatPrice(variantPrice - variantDiscount);
  }

  // بدون variant نستخدم سعر المنتج الأساسي بعد الخصم
  return formatPrice(
    Number(props.product?.price || 0) - Number(props.product?.discount || 0)
  );
});

const displayImage = computed(() => {
  // عند اختيار نوع (variant) نعرض صورة هذا النوع فقط أو placeholder
  if (selectedVariant.value) {
    return selectedVariant.value?.imageUrl || selectedVariant.value?.image || "/placeholder.png";
  }

  // في حالة عدم اختيار أي نوع، نعرض صورة المنتج الأساسية أو placeholder
  return props.product?.image || "/placeholder.png";
});

// أقصى كمية مسموحة:
// - لو في selectedVariant نستخدم quantity من ProductVariant
// - لو مافي selectedVariant لكن عندنا differents (صف واحد يمثل المنتج الرئيسي) نستخدم quantity من أول عنصر
// - وإلا نرجع مخزون المنتج الرئيسي إن وجد أو قيمة افتراضية
const maxQuantity = computed(() => {
  // عند اختيار variant
  if (selectedVariant.value) {
    return Number(selectedVariant.value?.quantity) || 0;
  }

  // لو الـ API رجّع differents لكن المستخدم ما اختار، ونفترض أن أول واحد هو المنتج الرئيسي
  if (productDifferents.value?.length === 1 && productDifferents.value[0]) {
    return Number(productDifferents.value[0]?.quantity) || 0;
  }

  // لو الـ API يرجع maxStock للمنتج الرئيسي نستخدمه هنا
  if (
    typeof props.product?.maxStock === "number" &&
    props.product.maxStock > 0
  ) {
    return props.product.maxStock;
  }

  // قيمة افتراضية في حال عدم توفر أي معلومة عن المخزون
  return 99;
});

const addToCart = async () => {
  if (isAddButtonLoading.value || isConfirmLoading.value) return;
  isAddButtonLoading.value = true;

  selectedVariants.value = {};
  quantity.value = 1;

  try {
    // Fetch both differents and accessories in parallel
    await Promise.all([fetchProductDifferents(), fetchAccessoryGroups()]);

    // Show popup if product has differents OR accessories_groups
    if (productDifferents.value.length > 0 || accessoryGroups.value.length > 0) {
      isDialogOpen.value = true;
      return;
    }

    // No differents and no accessories - add directly to cart
    await confirmAddToCart();
  } finally {
    isAddButtonLoading.value = false;
  }
};

const fetchProductDifferents = async () => {
  if (!props.product.slug) return;

  isLoadingVariants.value = true;
  try {
    const { data, error } = await api<ApiResponse>(
      `/products/${props.product.slug}/differents`
    );
    if (!error && data && data.status === "success" && data.data) {
      productDifferents.value = data.data;
      // لا نقوم باختيار أول نوع تلقائياً حتى يبقى المنتج الأساسي (main) هو الافتراضي
    }
  } catch (error) {
    console.error("Error fetching product variants:", error);
    productDifferents.value = [];
  } finally {
    isLoadingVariants.value = false;
  }
};

const fetchAccessoryGroups = async () => {
  if (!props.product.slug) return;

  accessoryGroups.value = [];

  try {
    const { data } = await api<any>(
      `/products/${props.product.slug}/accessories_groups`,
      {
        method: "GET",
        keySuffix: `accessories-${props.product.slug}-${locale.value}`,
      }
    );

    if (data?.data) {
      accessoryGroups.value = data.data;
    }
  } catch (err) {
    console.error("Error fetching accessory groups:", err);
  }
};

const incrementQuantity = () => {
  if (quantity.value < maxQuantity.value) {
    quantity.value++;
  }
};

const decrementQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

// Watch for variant changes to reset quantity if needed
watch(selectedVariant, (newVariant) => {
  // لا يوجد variant مختار → نرجع الكمية إلى 1 كافتراضي
  if (!newVariant) {
    quantity.value = 1;
    return;
  }

  const variantQty = Number(newVariant.quantity) || 0;

  // لو مخزون هذا النوع 0 أو أقل، لا نسمح للكمية أن تصبح 0 حتى لا ندخل في حلقة لا نهائية
  if (variantQty <= 0) {
    quantity.value = 1;
    return;
  }

  // لو الكمية الحالية أكبر من مخزون هذا النوع، نقللها إلى الحد الأقصى المتاح
  if (quantity.value > variantQty) {
    quantity.value = variantQty;
  }
});

// Ensure quantity never exceeds available stock أو goes below 1
watch(quantity, (newVal) => {
  // الحد الأدنى دائماً 1
  if (newVal < 1) {
    quantity.value = 1;
    return;
  }

  // لو maxQuantity صفر أو أقل (مثلاً variant غير متوفر)، لا نحاول ضبط الحد الأعلى
  if (maxQuantity.value <= 0) {
    return;
  }

  // لو المستخدم أدخل كمية أكبر من المخزون المتاح، نعيدها إلى الحد الأقصى
  if (newVal > maxQuantity.value) {
    quantity.value = maxQuantity.value;
  }
});

const confirmAddToCart = async () => {
  if (isConfirmLoading.value) return;
  isConfirmLoading.value = true;

  // لو في variant و كميته صفر نمنع الإضافة
  if (selectedVariant.value && Number(selectedVariant.value?.quantity) <= 0) {
    toast.error(
      t("messages.outOfStock") || "غير متوفر حالياً",
      displayName.value
    );
    isConfirmLoading.value = false;
    return;
  }

  const accessoriesObjects: any[] = [];
  if (selectedVariants.value) {
    Object.values(selectedVariants.value).forEach((variant: any) => {
      if (variant?.id) {
        accessoriesObjects.push({
          ...variant,
          qty: variant.qty || 1, // Ensure qty exists
        });
      }
    });
  }

  const maxStock = maxQuantity.value;

  // تأكيد أخير ألا تتجاوز الكمية المخزون المسموح
  if (quantity.value > maxStock) {
    quantity.value = maxStock;
    toast.error(
      t("messages.quantityExceedsStock") || "الكمية المطلوبة أكبر من المتوفر",
      `${t("product.inStock") || "المتوفر"}: ${maxStock}`
    );
    isConfirmLoading.value = false;
    return;
  }

  const cartItem = {
    id: selectedVariant.value ? selectedVariant.value?.id : props.product?.id,
    slug: props.product?.slug,
    name:
      localeCookie.value === "ar"
        ? props.product?.ar_name || props.product?.name || props.product?.en_name
        : props.product?.en_name || props.product?.name || props.product?.ar_name,
    en_name:
      props.product?.en_name || props.product?.name || props.product?.ar_name,
    ar_name:
      props.product?.ar_name || props.product?.name || props.product?.en_name,
    different: selectedVariant.value
      ? localeCookie.value === "ar"
        ? selectedVariant.value?.ar_different ||
          selectedVariant.value?.different
        : selectedVariant.value?.en_different ||
          selectedVariant.value?.different
      : localeCookie.value === "ar"
      ? // fallback to product-level different fields when no variant is selected
        (props.product as any)?.ar_different ||
        (props.product as any)?.different
      : (props.product as any)?.en_different ||
        (props.product as any)?.different,
    price: selectedVariant.value
      ? Number(selectedVariant.value?.price || 0) -
        Number(selectedVariant.value?.discount || 0)
      : Number(props.product?.price || 0) -
        Number(props.product?.discount || 0),
    image: displayImage.value,
    maxStock,
    quantity: quantity.value,
    accessories: accessoriesObjects,
  };
  let result;
  if (!useAuth.isAuthenticated) {
    result = await cart.addToCart(cartItem);
  } else {
    result = await cart.addToCartFromAPI(cartItem);
  }

  if (result?.success) {
    toast.success(t("messages.addedToCart"), displayName.value);
    isDialogOpen.value = false;
    quantity.value = 1; // Reset quantity
    selectedVariant.value = null;
    productDifferents.value = [];
  } else {
    toast.error(t("messages.error"), result.message);
  }
  isConfirmLoading.value = false;
};

const quickView = () => {
  quickViewSlug.value = props.product.slug;
  isQuickViewOpen.value = true;
};

const handleOpenCartFromQuickView = async (product: any) => {
  // فتح dialog السلة بعد الضغط على زر Add to Cart في Quick View
  isDialogOpen.value = true;
  await Promise.all([fetchProductDifferents(), fetchAccessoryGroups()]);
};

const toggleWishlist = async () => {
  try {
    console.log(props.product);
    const wishlistItem = {
      id: props.product?.id,
      slug: props.product?.slug,
      name:
        localeCookie.value === "ar"
          ? props.product?.ar_name || props.product?.name || props.product?.en_name
          : props.product?.en_name ||
            props.product?.name ||
            props.product?.ar_name,
      en_name:
        props.product?.en_name || props.product?.name || props.product?.ar_name,
      ar_name:
        props.product?.ar_name || props.product?.name || props.product?.en_name,
      price: props.product?.price,
      image: props.product?.image,
      inStock: true,
      brand: props.product?.brand,
      brand_id: props.product?.brand_id,
      rating: props.product?.rating,
      description: props.product?.description,
      categories: props.product?.categories,
      different: localeCookie.value === "ar" 
        ? props.product?.ar_different 
        : props.product?.en_different,
      ar_different: props.product?.ar_different,
      en_different: props.product?.en_different,
      discount: props.product?.discount,
      calculated_price: props.product?.calculated_price,
      quantity: props.product?.quantity,
      label: props.product?.label,
      accessories: props.product?.accessories,
      images: props.product?.images,
    };

    const result = await cart.toggleWishlist(wishlistItem);

    if (result.success) {
      const isInWishlist = cart.isInWishlist(props.product?.id);
      toast.success(
        isInWishlist
          ? t("messages.addedToWishlist")
          : t("messages.removedFromWishlist"),
        props.product?.name || ''
      );
    } else {
      toast.error(t("messages.error"), result.message);
    }
  } catch (error: any) {
    console.error("Wishlist error:", error);
    toast.error(
      t("messages.error"),
      error.message || "Failed to update wishlist"
    );
  }
};

const addToCompare = () => {
  const item = {
    id: props.product.id,
    slug: props.product.slug,
    name:
      localeCookie.value === "ar"
        ? props.product.ar_name || props.product.name || props.product.en_name
        : props.product.en_name || props.product.name || props.product.ar_name,
    en_name:
      props.product.en_name || props.product.name || props.product.ar_name,
    ar_name:
      props.product.ar_name || props.product.name || props.product.en_name,
    price: props.product.price,
    image: props.product.image,
    category: props.product.category,
    brand: props.product.brand,
    rating: props.product.rating,
    reviewsCount: props.product.reviewsCount,
    quantity: props.product.quantity,
    inStock: props.product.inStock,
    oldPrice: props.product.oldPrice,
    discount: props.product.discount,
  };

  const result = compare.addToCompare(item);
  if (!result.success) {
    // الرسائل تُدار داخل الكومبوزابل عبر التوست
    return;
  }
};
</script>
