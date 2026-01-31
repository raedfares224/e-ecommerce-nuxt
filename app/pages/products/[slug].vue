<template>
  <div v-if="!loading" class="min-h-screen">
    <!-- Error State -->
    <div v-if="error" class="container mx-auto px-4 py-12">
      <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p class="text-red-600">{{ error }}</p>
        <Button @click="router.push('/')" class="mt-4">
          {{ $t("nav.home") }}
        </Button>
      </div>
    </div>

    <!-- Product Detail -->
    <div v-else-if="activeProduct" class="mx-auto pb-8">
      <!-- Breadcrumb -->
      <BaseBreadcrumb>
        <NuxtLink to="/" class="text-gray-600 hover:text-primary">
          {{ $t("nav.home") }}
        </NuxtLink>
        <ChevronRight
          class="w-4 h-4 text-gray-400"
          :class="{ 'rotate-180': $i18n.locale === 'ar' }"
        />
        <template v-if="activeProduct.categories?.data?.length > 0">
          <NuxtLink
            :to="`/categories/${activeProduct.categories?.data?.[0]?.slug}`"
            class="text-gray-600 hover:text-primary"
          >
            {{ activeProduct.categories?.data?.[0]?.name }}
          </NuxtLink>
          <ChevronRight
            class="w-4 h-4 text-gray-400"
            :class="{ 'rotate-180': $i18n.locale === 'ar' }"
          />
        </template>
        <span class="text-primary font-medium">{{ currentName }}</span>
      </BaseBreadcrumb>
      <div class="container mx-auto px-4 py-5">
        <!-- Product Main Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <!-- Image Gallery with Carousel -->
          <div class="space-y-4">
            <!-- Main Image Display -->
            <div
              class="aspect-square bg-white rounded-lg overflow-hidden border border-gray-200 relative group"
            >
              <img
                :src="selectedImage || '/placeholder.png'"
                :alt="currentName"
                loading="lazy"
                decoding="async"
                class="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-110"
              />
              <!-- Image counter badge -->
              <div
                v-if="allImages.length > 1"
                class="absolute bottom-4 right-4 bg-gray-900/80 text-white px-3 py-1 rounded-full text-sm font-medium"
              >
                {{ selectedImageIndex + 1 }} / {{ allImages.length }}
              </div>
            </div>

            <!-- Thumbnail Carousel -->
            <ClientOnly>
              <Carousel
                v-if="allImages.length > 1 && product"
                :key="`carousel-${product.id}`"
                class="w-full"
                :opts="{
                  align: 'start',
                  loop: false,
                  watchDrag: true,
                }"
                :plugins="[]"
              >
                <CarouselContent class="-ml-2">
                  <CarouselItem
                    v-for="(image, index) in allImages"
                    :key="index"
                    class="pl-2 mt-2 basis-1/4 md:basis-1/5"
                  >
                    <button
                      @click="
                        () => {
                          selectedImage = image;
                          selectedImageIndex = index;
                        }
                      "
                      class="aspect-square bg-white rounded-lg overflow-hidden transition-all w-full"
                      :class="
                        selectedImageIndex === index
                          ? 'border-gray-900 ring-2 ring-gray-900 ring-offset-2'
                          : 'border-gray-200'
                      "
                    >
                      <img
                        loading="lazy"
                        decoding="async"
                        :src="image || '/placeholder.png'"
                        :alt="`${currentName} ${index + 1}`"
                        class="w-full h-full object-contain p-2"
                      />
                    </button>
                  </CarouselItem>
                </CarouselContent>
                <CarouselPrevious class="hidden md:flex -left-2 h-8 w-8" />
                <CarouselNext class="hidden md:flex -right-2 h-8 w-8" />
              </Carousel>
              <template #fallback>
                <!-- Fallback for SSR -->
                <div v-if="allImages.length > 1" class="grid grid-cols-4 gap-2">
                  <button
                    v-for="(image, index) in allImages.slice(0, 4)"
                    :key="index"
                    @click="
                      () => {
                        selectedImage = image;
                        selectedImageIndex = index;
                      }
                    "
                    class="aspect-square bg-white rounded-lg overflow-hidden border-2 transition-all hover:border-gray-400"
                    :class="
                      selectedImageIndex === index
                        ? 'border-gray-900'
                        : 'border-gray-200'
                    "
                  >
                    <img
                      :src="image || '/placeholder.png'"
                      loading="lazy"
                      decoding="async"
                      :alt="`${currentName} ${index + 1}`"
                      class="w-full h-full object-contain p-2"
                    />
                  </button>
                </div>
              </template>
            </ClientOnly>
          </div>

          <!-- Product Info -->
          <div class="space-y-6">
            <!-- Category Badge -->
            <div
              v-if="activeProduct.categories?.data?.length > 0"
              class="text-sm text-gray-600"
            >
              {{ activeProduct.categories?.data?.[0]?.name }}
            </div>

            <!-- Product Name with current color -->
            <h1 class="text-3xl md:text-4xl font-bold text-gray-900 flex flex-wrap items-center gap-2">
              <span>{{ activeProduct.name }}</span>
              <span
                v-if="activeProduct?.ar_different || activeProduct?.en_different"
                class="text-lg font-semibold text-primary"
              >
                -
                {{
                  $i18n.locale === 'ar'
                    ? activeProduct.ar_different || activeProduct.en_different
                    : activeProduct.en_different || activeProduct.ar_different
                }}
              </span>
            </h1>

            <!-- Rating & Stock -->
            <div class="flex items-center gap-4 flex-wrap">
              <div class="flex items-center gap-1">
                <Star
                  v-for="i in 5"
                  :key="i"
                  class="w-5 h-5"
                  :class="
                    i <= Math.floor(Number(activeProduct.rating))
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  "
                />
                <span class="text-sm text-gray-600 ml-2">
                  ({{ activeProduct.rating }} {{ $t("product.review") }})
                </span>
              </div>

              <Badge
                :variant="
                  activeProduct.quantity > 0 ? 'default' : 'destructive'
                "
              >
                {{
                  activeProduct.quantity > 0
                    ? $t("product.inStock")
                    : $t("product.outOfStock")
                }}
              </Badge>
            </div>

            <!-- Price -->
            <div class="flex items-baseline gap-3">
              <span class="text-4xl font-bold text-gray-900">
                {{
                  formatPrice(
                    Number(activeProduct.price) - Number(activeProduct.discount)
                  )
                }}
              </span>
              <span
                v-if="activeProduct.discount > 0"
                class="text-2xl text-gray-400 line-through"
              >
                {{ formatPrice(activeProduct.price) }}
              </span>
              <Badge
                v-if="activeProduct.discount > 0"
                variant="destructive"
                class="text-sm"
              >
                -{{ activeProduct.discount }}
              </Badge>
            </div>

            <!-- Description -->
            <div class="prose prose-sm max-w-none">
              <p class="text-gray-600 whitespace-pre-line">
                {{ activeProduct.description }}
              </p>
            </div>

            <!-- Product Meta -->
            <div class="space-y-2 text-sm">
              <div class="flex items-center gap-2">
                <span class="font-semibold text-gray-700"
                  >{{ $t("product.sku") }}:</span
                >
                <span class="text-gray-600">{{ activeProduct.id }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="font-semibold text-gray-700"
                  >{{ $t("product.brand") }}:</span
                >
                <NuxtLink
                  v-if="brandDetails"
                  :to="`/brand/${brandDetails.slug}`"
                  class="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
                >
                  <Avatar class="w-20 h-20 bg-gray-50 border">
                    <AvatarImage
                      v-if="brandDetails.imageUrl"
                      :src="brandDetails.imageUrl"
                      :alt="brandDetails.name"
                      class="object-contain p-0.5"
                    />
                    <AvatarFallback class="text-[10px] uppercase bg-gray-100">
                      {{ brandDetails.name.substring(0, 2) }}
                    </AvatarFallback>
                  </Avatar>
                  <span>{{ brandDetails.name }}</span>
                </NuxtLink>
                <span v-else class="text-gray-600">{{ activeProduct.brand }}</span>
              </div>
              <div
                v-if="activeProduct.categories?.data?.length > 0"
                class="flex items-center gap-2"
              >
                <span class="font-semibold text-gray-700"
                  >{{ $t("product.category") }}:</span
                >
                <div class="flex flex-wrap gap-2">
                  <NuxtLink
                    v-for="category in activeProduct.categories.data"
                    :key="category.id"
                    :to="`/categories/${category.slug}`"
                  >
                    <Badge
                      variant="outline"
                      class="hover:bg-primary hover:text-white transition-colors cursor-pointer"
                    >
                      {{ category.name }}
                    </Badge>
                  </NuxtLink>
                </div>
              </div>
            </div>
            <div class="flex flex-col gap-2">
              <!-- العنوان -->
              <span class="text-gray-700 font-medium">{{
                $t("product.selectColors")
              }}</span>

              <!-- أزرار الألوان -->
              <div
                class="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4"
              >
                <!-- المنتج الأساسي -->
                <Card
                  @click="selectedDiff = null"
                  class="cursor-pointer transition-all duration-300 rounded-xl p-4 flex flex-col items-center gap-3 border"
                  :class="
                    !selectedDiff
                      ? 'border-primary shadow-lg scale-105 bg-primary/5'
                      : 'border-gray-200 hover:shadow-md hover:scale-105'
                  "
                >
                  <!-- الصورة -->
                  <div class="w-24 h-24 flex items-center justify-center">
                    <img
                      class="w-full h-full object-contain"
                      :src="product.imageUrl || '/placeholder.png'"
                      :alt="product.name"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>

                  <!-- الاسم -->
                  <p
                    class="text-center text-sm font-medium leading-tight line-clamp-1"
                  >
                    {{
                      $i18n.locale === "ar"
                        ? product.ar_name || product.ar_different
                        : product.en_name || product.en_different
                    }}
                  </p>

                  <!-- اللون -->
                  <span
                    class="text-xs px-2 py-1 rounded-full bg-gray-100 border line-clamp-1"
                  >
                    {{
                      $i18n.locale === "ar"
                        ? product.ar_different
                        : product.en_different
                    }}
                  </span>

                  <!-- السعر -->
                  <div class="flex items-center gap-2 mt-2">
                    <!-- السعر بعد الخصم -->
                    <span
                      v-if="Number(product.discount) > 0"
                      class="text-primary text-xs font-semibold"
                    >
                      {{
                        formatPrice(
                          Number(product.price) - Number(product.discount)
                        )
                      }}
                    </span>

                    <!-- السعر الأصلي -->
                    <span
                      :class="
                        Number(product.discount) > 0
                          ? 'line-through text-gray-400 text-sm'
                          : 'text-primary text-xs font-semibold'
                      "
                    >
                      {{ formatPrice(product.price) }}
                    </span>
                  </div>
                </Card>

                <!-- المنتجات المختلفة (differentProducts) -->
                <Card
                  v-for="diff in differentProducts"
                  :key="diff.id"
                  variant="outline"
                  @click="selectedDiff = diff"
                  class="cursor-pointer transition-all duration-300 rounded-xl p-4 flex flex-col items-center gap-3 border"
                  :class="
                    selectedDiff?.id === diff.id
                      ? 'border-primary shadow-lg scale-105 bg-primary/5'
                      : 'border-gray-200 hover:shadow-md hover:scale-105'
                  "
                >
                  <!-- الصورة -->
                  <div class="w-24 h-24 flex items-center justify-center">
                    <img
                      class="w-full h-full object-contain"
                      :src="diff.imageUrl || '/placeholder.png'"
                      :alt="diff.name"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>

                  <!-- الاسم -->
                  <p
                    class="text-center text-sm font-medium leading-tight line-clamp-2"
                  >
                    {{
                      $i18n.locale === "ar"
                        ? diff.ar_name || diff.ar_different
                        : diff.en_name || diff.en_different
                    }}
                  </p>

                  <!-- اللون -->
                  <span
                    class="text-xs px-2 py-1 rounded-full bg-gray-100 border"
                  >
                    {{
                      $i18n.locale === "ar"
                        ? diff.ar_different
                        : diff.en_different
                    }}
                  </span>

                  <!-- السعر -->
                  <div class="flex items-center gap-2 mt-2">
                    <!-- السعر بعد الخصم -->
                    <span
                      v-if="Number(diff.discount) > 0"
                      class="text-primary text-xs font-semibold"
                    >
                      {{
                        formatPrice(Number(diff.price) - Number(diff.discount))
                      }}
                    </span>

                    <!-- السعر الأصلي -->
                    <span
                      :class="
                        Number(diff.discount) > 0
                          ? 'line-through text-gray-400 text-sm'
                          : 'text-primary text-xs font-semibold'
                      "
                    >
                      {{ formatPrice(diff.price) }}
                    </span>
                  </div>
                </Card>
              </div>
            </div>

            <div v-if="accessoryGroups.length > 0" class="mb-8">
              <h2
                class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200"
              >
                {{ $t("product.accessories") }}
              </h2>
              <!-- {{ localeCookie === 'ar' ? group.ar_different : group.en_different }} -->
              <div class="space-y-4">
                <div
                  v-for="group in accessoryGroups"
                  :key="group.id"
                  class="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                >
                  <!-- Header -->
                  <div
                    class="px-4 py-3 border-b border-gray-200 dark:border-gray-700"
                  >
                    <h3
                      class="text-base font-medium text-gray-800 dark:text-gray-100 flex items-center gap-2"
                    >
                      {{
                        $i18n.locale === "ar"
                          ? group.ar_name
                          : group.en_name || group.name
                      }}

                      <span
                        v-if="group.is_required === '1'"
                        class="text-red-500 text-xs bg-red-50 dark:bg-red-900/40 px-1.5 py-0.5 rounded"
                      >
                        {{ $t("product.required") }}
                      </span>
                    </h3>
                  </div>

                  <!-- Select Section -->
                  <div class="px-4 py-3">
                    <BaseButtonSelect
                      v-model="selectedVariants[group.id]"
                      :options="group.accessories?.data || []"
                      :placeholder="
                        $i18n.locale === 'ar'
                          ? group.ar_name
                          : group.en_name || group.name
                      "
                      class="w-full"
                      valueKey="value"
                    >
                      <!-- كيف يظهر النص داخل الحقل بعد الاختيار (اسم فقط بشكل نظيف) -->
                      <template #selected="{ option }">
                        <span class="text-sm font-medium text-gray-900 truncate">
                          {{
                            $i18n.locale === 'ar'
                              ? option.ar_name
                              : option.en_name || option.name
                          }}
                        </span>
                      </template>

                      <!-- كيف تظهر العناصر داخل القائمة المنسدلة -->
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
                          <!-- السعر مع دعم الخصم -->
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
                          <!-- معلومات الكمية -->
                          <span v-if="option.qty">
                            <span v-if="option.price"> | </span>
                            {{ option.qty }}
                            {{ $t('product.quantityShort', 'كمية') }}
                          </span>
                        </span>
                      </template>
                    </BaseButtonSelect>
                  </div>
                </div>
              </div>
            </div>

            <!-- Quantity & Actions -->
            <div class="space-y-4 pt-4 border-t border-gray-200">
              <div class="flex items-center gap-4">
                <label class="font-semibold text-gray-700"
                  >{{ $t("product.quantity") }}:</label
                >
                <div
                  class="flex items-center border border-gray-300 rounded-lg"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    @click="quantity = Math.max(1, quantity - 1)"
                    :disabled="quantity <= 1"
                  >
                    <Minus class="w-4 h-4" />
                  </Button>
                  <span class="px-4 py-2 font-semibold">{{ quantity }}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    @click="quantity++"
                    :disabled="quantity >= activeProduct.quantity"
                  >
                    <Plus class="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div class="flex gap-3">
                <Button
                  size="lg"
                  class="flex-1"
                  @click="addToCart"
                  :disabled="
                    addToCartLoading ||
                    isMissingRequiredAccessories ||
                    activeProduct.quantity === 0
                  "
                >
                  <Spinner v-if="addToCartLoading" />
                  <ShoppingCart class="w-5 h-5 mr-2" />
                  {{ $t("common.addToCart") }}
                </Button>
                <Button size="lg" variant="outline" @click="addToWishlist">
                  <Heart
                    class="w-5 h-5"
                    :class="
                      cart.isInWishlist(Number(activeProduct.id))
                        ? 'text-red-500'
                        : 'text-gray-500'
                    "
                  />
                </Button>
              </div>
<!-- 
              <Button
                size="lg"
                variant="secondary"
                class="w-full"
                :disabled="
                  addToCartLoading||
                   differentProducts.length>0 ? selectedVariants['required']==null : addToCartLoading ||
                  activeProduct.quantity === 0 
                "
                @click="buyNow"
              >
                {{ $t("product.buyNow") }}
              </Button> -->
            </div>

            <!-- Share -->
            <div class="flex items-center gap-3 pt-4 border-t border-gray-200">
              <span class="font-semibold text-gray-700"
                >{{ $t("product.share") }}:</span
              >
              <div class="flex gap-2">
                <Button variant="outline" size="sm">
                  <Facebook class="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Twitter class="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Linkedin class="w-4 h-4" />
                </Button>
              </div>
            </div>

            <!-- Trust Badges -->
            <div class="grid grid-cols-1 gap-3 pt-4 border-t border-gray-200">
              <div class="flex items-center gap-3 text-sm">
                <CheckCircle class="w-5 h-5 text-green-600" />
                <span class="text-gray-600">{{
                  $t("product.daysEasyReturns")
                }}</span>
              </div>
              <div class="flex items-center gap-3 text-sm">
                <CheckCircle class="w-5 h-5 text-green-600" />
                <span class="text-gray-600">{{
                  $t("product.orderYoursBefore")
                }}</span>
              </div>
              <div class="flex items-center gap-3 text-sm">
                <div class="flex items-center gap-1">
                  <span class="font-semibold text-gray-700">{{
                    $t("product.guaranteedSafe")
                  }}</span>
                  <span class="text-gray-600">{{
                    $t("product.secureCheckout")
                  }}</span>
                </div>
              </div>
              <div class="flex items-center gap-2 mt-2">
                <img
                  src="/images/Stripe_Logo,_revised_2016.svg"
                  alt="Stripe"
                  class="h-6"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Accessory Groups Section -->

        <!-- Product Details Tabs -->
        <div class="mb-12">
          <!-- Horizontal Tabs with Sliding Indicator -->
          <div class="mb-6 md:mb-8 border-b border-gray-200">
            <div
              class="flex items-center gap-6 lg:gap-8 overflow-x-auto scrollbar-hide relative"
            >
              <button
                v-for="(tab, index) in productTabs"
                :key="tab.value"
                :ref="(el) => setTabRef(el, tab.value)"
                @click="activeProductTab = tab.value"
                :class="[
                  'pb-3 px-1 text-sm lg:text-base font-medium transition-colors whitespace-nowrap shrink-0',
                  activeProductTab === tab.value
                    ? 'text-gray-900'
                    : 'text-gray-400 hover:text-gray-600',
                ]"
              >
                <span
                  v-if="index !== 0"
                  class="bg-gray-600/50 inline-block w-2 h-2 rounded-full mr-2"
                ></span>
                {{ tab.label }}
              </button>
              <!-- Sliding Active Indicator -->
              <span
                class="absolute bottom-0 h-0.5 bg-gray-900 transition-all duration-300 ease-out"
                :style="{
                  left: `${tabIndicatorLeft}px`,
                  width: `${tabIndicatorWidth}px`,
                }"
              />
            </div>
          </div>

          <!-- Tab Content -->
          <div class="mt-6">
            <!-- Description Tab -->
            <div v-show="activeProductTab === 'description'">
              <div class="bg-white rounded-lg p-6 border border-gray-200">
                <div class="prose prose-sm max-w-none">
                  <p class="text-gray-600 whitespace-pre-line leading-relaxed">
                    {{ product.description }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Additional Information Tab -->
            <div v-show="activeProductTab === 'additional'">
              <div class="bg-white rounded-lg p-6 border border-gray-200">
                <div class="space-y-4">
                  <div
                    class="grid grid-cols-2 gap-4 py-3 border-b border-gray-200"
                  >
                    <span class="font-semibold text-gray-700">{{
                      $t("product.sku")
                    }}</span>
                    <span class="text-gray-600">{{ product.id }}</span>
                  </div>
                  <div
                    class="grid grid-cols-2 gap-4 py-3 border-b border-gray-200"
                  >
                    <span class="font-semibold text-gray-700">{{
                      $t("product.brand")
                    }}</span>
                    <span class="text-gray-600">{{ product.brand }}</span>
                  </div>
                  <div
                    class="grid grid-cols-2 gap-4 py-3 border-b border-gray-200"
                  >
                    <span class="font-semibold text-gray-700">{{
                      $t("product.category")
                    }}</span>
                    <span class="text-gray-600">
                      {{
                        product.categories?.data
                          ?.map((c) => c.name)
                          .join(", ") || "-"
                      }}
                    </span>
                  </div>
                  <div
                    class="grid grid-cols-2 gap-4 py-3 border-b border-gray-200"
                  >
                    <span class="font-semibold text-gray-700">{{
                      $t("product.rating")
                    }}</span>
                    <div class="flex items-center gap-1">
                      <Star
                        v-for="i in 5"
                        :key="i"
                        class="w-4 h-4"
                        :class="
                          i <= Math.floor(Number(product.rating))
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        "
                      />
                      <span class="text-sm text-gray-600 ml-2"
                        >({{ product.rating }})</span
                      >
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-4 py-3">
                    <span class="font-semibold text-gray-700">{{
                      $t("cart.quantity")
                    }}</span>
                    <span class="text-gray-600"
                      >{{ product.quantity }} {{ $t("product.inStock") }}</span
                    >
                  </div>
                </div>
              </div>
            </div>

            <!-- Reviews Tab -->
            <div v-show="activeProductTab === 'reviews'">
              <div
                class="bg-white rounded-lg p-6 border border-gray-200 space-y-6"
              >
                <!-- Overall Rating Summary -->
                <div class="text-center py-8 border-b border-gray-200">
                  <div class="flex items-center justify-center gap-1 mb-4">
                    <Star
                      v-for="i in 5"
                      :key="i"
                      class="w-8 h-8"
                      :class="
                        i <= Math.floor(Number(product.rating))
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      "
                    />
                  </div>
                  <h3 class="text-2xl font-bold text-gray-900 mb-2">
                    {{ product.rating }} {{ $t("product.rating") }}
                  </h3>
                  <p class="text-gray-600 mb-4" v-if="reviewsList.length === 0">
                    {{ $t("product.noReviews") }}
                  </p>
                  <p class="text-gray-600 mb-4" v-else>
                     {{ reviewsList.length }} {{ $t("product.reviews") }}
                  </p>
                </div>

                <!-- Add Review Form -->
                <div class="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 class="text-lg font-bold text-gray-900 mb-4">{{ $t('product.writeReview') }}</h3>
                  
                  <div v-if="!authStore.isAuthenticated" class="text-center py-4">
                     <p class="text-gray-600 mb-4">{{ $t('product.loginToReview') }}</p>
                     <Button @click="router.push('/auth/login')">{{ $t('auth.login') }}</Button>
                  </div>

                  <div v-else class="space-y-4">
                    <!-- Rating -->
                    <div class="flex items-center gap-2">
                       <span class="text-sm font-medium text-gray-700">{{ $t('product.yourRating') }}:</span>
                       <div class="flex items-center" @mouseleave="hoverRating = 0">
                          <button 
                            v-for="i in 5" 
                            :key="i"
                            type="button"
                            @mouseenter="hoverRating = i"
                            @click="newReview.rating = i"
                            class="focus:outline-none transition-colors p-1"
                          >
                            <Star 
                              class="w-6 h-6" 
                              :class="i <= (hoverRating || newReview.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'"
                            />
                          </button>
                       </div>
                    </div>

                    <!-- Comment -->
                    <div class="space-y-2">
                      <label class="text-sm font-medium text-gray-700">{{ $t('product.yourReview') }}</label>
                      <textarea
                        v-model="newReview.comment"
                        rows="4"
                        class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        :placeholder="$t('product.reviewPlaceholder')"
                      ></textarea>
                    </div>

                    <Button @click="submitReview" :disabled="submittingReview || newReview.rating === 0">
                      <Spinner v-if="submittingReview" class="mr-2" />
                      {{ $t('product.submitReview') }}
                    </Button>
                  </div>
                </div>

                <!-- Reviews List -->
                <div class="space-y-6" v-if="reviewsList.length > 0">
                  <div
                    v-for="review in reviewsList"
                    :key="review.id"
                    class="border-b border-gray-200 pb-4 last:border-b-0"
                  >
                    <!-- Review Header -->
                    <div class="flex items-center justify-between mb-2">
                      <div class="flex items-center gap-2">
                        <span
                          class="font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded"
                        >
                          {{ review.user }}
                        </span>
                        <div class="flex items-center gap-1">
                          <Star
                            v-for="i in 5"
                            :key="i"
                            class="w-4 h-4"
                            :class="
                              i <= Math.floor(Number(review.rating))
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            "
                          />
                        </div>
                        <span class="text-sm text-gray-500 ml-2"
                          >({{ review.rating }})</span
                        >
                      </div>
                      <span class="text-sm text-gray-400">{{
                        review.date
                      }}</span>
                    </div>

                    <!-- Review Comment -->
                    <p class="text-gray-600">{{ review.comment }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Variants Section -->
        <div v-if="product.differents?.data?.length > 0" class="mb-12">
          <h2 class="text-2xl font-bold mb-6">{{ $t("product.variants") }}</h2>
          <div
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
          >
            <ProductCard
              v-for="variant in product.differents.data"
              :key="variant.id"
              :product="transformProduct(variant)"
            />
          </div>
        </div>

        <!-- Related Products Section -->
        <div v-if="relatedProducts.length > 0" class="mb-12">
          <h2 class="text-2xl font-bold mb-6">
            {{ $t("product.relatedProducts") }}
          </h2>
          <div
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
          >
            <ProductCard
              v-for="related in relatedProducts"
              :key="related.id"
              :product="transformProduct(related)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="h-dvh" v-else>
    <BaseLoading />
  </div>
</template>

<script setup lang="ts">
import {
  ChevronRight,
  Star,
  ShoppingCart,
  Heart,
  Minus,
  Plus,
  Facebook,
  Twitter,
  Linkedin,
  CheckCircle,
} from "lucide-vue-next";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Card } from "~/components/ui/card";
import { Spinner } from "~/components/ui/spinner";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import ProductCard from "~/components/home/ProductCard.vue";
import type { ProductDetail, ProductDetailResponse } from "~/types/product";
import type { Product } from "~/types/product";
import { toast } from "vue-sonner";
import { useI18n } from "vue-i18n";
import { api } from "~/api/useApi";
import { usePageSeo } from "~/composables/usePageSeo";
import { useAuthStore } from "~/stores/auth";
import { useBrand } from "~/composables/useBrand";

const selectedDiff = ref<ProductDetail | null>(null);
const route = useRoute();
const router = useRouter();
const { t, locale } = useI18n();
const { formatPrice } = useCurrency();
const authStore = useAuthStore();
const { filterBrands, fetchFilterBrands } = useBrand();
const cart = useCart();
const selectedVariants = ref<Record<string | number, any>>({});
const quantity = ref(1);
const selectedImage = ref("");
const selectedImageIndex = ref(0);

// Product tabs state
const activeProductTab = ref("description");
const productTabs = computed(() => [
  { label: t("product.description"), value: "description" },
  { label: t("product.additionalInformation"), value: "additional" },
  { label: t("product.reviews"), value: "reviews" },
]);

// Tab refs for sliding indicator
const tabRefs = ref<Record<string, HTMLElement>>({});
const tabIndicatorLeft = ref(0);
const tabIndicatorWidth = ref(0);

// Set tab ref
const setTabRef = (el: any, value: string) => {
  if (el) {
    tabRefs.value[value] = el;
  }
};

// Update indicator position
const updateTabIndicator = () => {
  nextTick(() => {
    const activeTabEl = tabRefs.value[activeProductTab.value];
    if (activeTabEl) {
      tabIndicatorLeft.value = activeTabEl.offsetLeft;
      tabIndicatorWidth.value = activeTabEl.offsetWidth;
    }
  });
};

// Watch for active tab changes
watch(activeProductTab, () => {
  updateTabIndicator();
});
const localeCookie = useCookie<"en" | "ar">("locale");
// SSR-friendly data fetching
const slug = computed(() => route.params.slug as string);
const loading = ref(true);
const error = ref<string | null>(null);
const productResponse = ref<ProductDetailResponse | null>(null);
const relatedProducts = ref<any[]>([]);
const differentProducts = ref<any[]>([]);
const reviewsList = ref<any[]>([]);
const accessoryGroups = ref<any[]>([]);
const loadingRelated = ref(false);

// Fetch related products
const fetchRelatedProducts = async (productSlug: string) => {
  try {
    loadingRelated.value = true;
    const { data } = await api<any>(`/products/${productSlug}/related`, {
      method: "GET",
      keySuffix: `related-${productSlug}-${locale.value}`,
    });
    const { data: differents } = await api<any>(
      `/products/${productSlug}/differents`,
      {
        method: "GET",
        keySuffix: `differents-${productSlug}-${locale.value}-${localeCookie.value}`,
      }
    );
    const { data: reviews } = await api<any>(
      `/products/${productSlug}/reviews`,
      {
        method: "GET",
        keySuffix: `reviews-${productSlug}-${locale.value}-${localeCookie.value}`,
      }
    );
    if (data?.data) {
      relatedProducts.value = data.data;
    }
    if (differents?.data) {
      differentProducts.value = differents.data;
    }
    if (reviews?.data) {
      reviewsList.value = reviews.data;
    }
  } catch (err) {
    console.error("Error fetching related products:", err);
  } finally {
    loadingRelated.value = false;
  }
};

// Review submission
const newReview = ref({
  rating: 0,
  comment: "",
});
const submittingReview = ref(false);
const hoverRating = ref(0);

const submitReview = async () => {
  if (!authStore.isAuthenticated) {
    toast.error(t("auth.loginRequired"));
    router.push("/auth/login");
    return;
  }

  if (newReview.value.rating === 0) {
    toast.error(t("product.ratingRequired"));
    return;
  }
  submittingReview.value = true;
  try {
    const { data, error } = await api<any>(`/products/${activeProduct.value.id}/reviews`, {
      method: "POST",
      body: {
        rating: newReview.value.rating,
        comment: newReview.value.comment,
      },
    });

    if (error) {
      toast.error(error.message || t("common.error"));
      return;
    }

    toast.success(t("product.reviewSubmitted"));
    newReview.value = { rating: 0, comment: "" };
    // Refresh reviews
    const { data: reviews } = await api<any>(
      `/products/${slug.value}/reviews`,
      {
        method: "GET",
      }
    );
    if (reviews?.data) {
      reviewsList.value = reviews.data;
    }
  } catch (err) {
    toast.error(t("common.error"));
  } finally {
    submittingReview.value = false;
  }
};

// Fetch accessory groups
const fetchAccessoryGroups = async (productSlug: string) => {
  try {
    const { data } = await api<any>(
      `/products/${productSlug}/accessories_groups`,
      {
        method: "GET",
        keySuffix: `accessories-${productSlug}-${locale.value}`,
      }
    );

    if (data?.data) {
      accessoryGroups.value = data.data;
    }
  } catch (err) {
    console.error("Error fetching accessory groups:", err);
  }
};

// Fetch product data using useApi
const fetchProduct = async () => {
  loading.value = true;
  error.value = null;

  try {
    const { data, error: apiError } = await api<ProductDetailResponse>(
      `/products/${slug.value}`,
      {
        method: "GET",
        keySuffix: `product-${slug.value}-${locale.value}`,
      }
    );
    await Promise.all([
      fetchRelatedProducts(slug.value),
      fetchAccessoryGroups(slug.value),
      fetchFilterBrands(),
    ]);
    if (apiError) {
      error.value = apiError.message || "Failed to fetch product";
    } else if (!data) {
      error.value = "Product not found";
    } else if (data.status !== "success" || data.data.length === 0) {
      error.value = "Product not found";
    } else {
      productResponse.value = data;
      // Initialize image and quantity
      if (data.data[0]) {
        selectedImage.value = data.data[0].imageUrl;
        selectedImageIndex.value = 0;
        quantity.value = 1;

        // Fetch related products and accessory groups
      }
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : "An error occurred";
  } finally {
    loading.value = false;
  }
};

// Initialize cart on mount
onMounted(() => {
  cart.initialize();
});

// Initial fetch
fetchProduct();

// Watch for slug or locale changes
watch([slug, locale], () => {
  fetchProduct();
});

// Extract product from response
const product = computed<ProductDetail | null>(
  () => productResponse.value?.data?.[0] || null
);

// Active product = base product or selected different (color/variant)
const activeProduct = computed<ProductDetail | null>(() => {
  return (selectedDiff.value as ProductDetail | null) || product.value;
});

const brandDetails = computed(() => {
  if (!activeProduct.value || !filterBrands.value) return null;
  const brandId = activeProduct.value.brand_id;
  return filterBrands.value.find((b) => String(b.id) === String(brandId));
});

// Initialize selected image when base product loads
watch(
  product,
  (newProduct) => {
    if (newProduct) {
      selectedImage.value = newProduct.imageUrl;
      selectedImageIndex.value = 0;
      quantity.value = 1;
    }
  },
  { immediate: true }
);

// Update image when activeProduct (color) changes
watch(activeProduct, (newProd) => {
  if (newProd) {
    selectedImage.value = newProd.imageUrl;
    selectedImageIndex.value = 0;
    quantity.value = 1;
  }
});

// Clean up selections when accessory groups change
watch(accessoryGroups, (groups) => {
  const validIds = new Set(groups.map((group: any) => String(group.id)));
  Object.keys(selectedVariants.value).forEach((key) => {
    if (!validIds.has(String(key))) {
      delete selectedVariants.value[key as any];
    }
  });
});

const isMissingRequiredAccessories = computed(() => {
  if (!accessoryGroups.value?.length) return false;
  return accessoryGroups.value.some((group: any) => {
    if (group.is_required !== "1") return false;
    const selection = selectedVariants.value[group.id];
    return !selection || !selection.id;
  });
});

// Initialize tab indicator on mount
onMounted(() => {
  updateTabIndicator();
});

// Computed properties
const currentName = computed(() => {
  if (!activeProduct.value) return "";
  return locale.value === "ar"
    ? activeProduct.value.ar_name
    : activeProduct.value.en_name;
});

const allImages = computed(() => {
  if (!activeProduct.value) return [] as string[];
  const images: string[] = [activeProduct.value.imageUrl];
  if (activeProduct.value?.images?.data?.length > 0) {
    images.push(...activeProduct.value.images.data);
  }

  return images;
});

// Transform ProductDetail to Product for ProductCard component
const transformProduct = (detail: ProductDetail): Product => {
  return {
    id: parseInt(detail.id),
    name: locale.value === "ar" ? detail.ar_name : detail.en_name,
    slug: detail.slug,
    price: parseFloat(detail.calculated_price || detail.price),
    oldPrice: detail.discount > 0 ? parseFloat(detail.price) : undefined,
    discount: detail.discount > 0 ? detail.discount : undefined,
    image: detail.imageUrl,
    category: detail.brand,
    rating: parseFloat(detail.rating),
    inStock: detail.quantity > 0,
    isFeatured: true,
  };
};
const { addToCartFromAPI, loading: addToCartLoading } = useCart();
// Actions
const addToCart = async () => {
  if (!activeProduct.value) return;

  // تحضير الإكسسوارات من selectedVariants (يشمل جميع المجموعات المختارة)
  const accessoriesObjects: any[] = [];
  if (selectedVariants.value) {
    Object.values(selectedVariants.value).forEach((variant: any) => {
      if (variant?.id) {
        accessoriesObjects.push({
          ...variant,
          qty: variant.qty || 1,
        });
      }
    });
  }

  // Check if user is authenticated
  if (authStore.isAuthenticated) {
    const { success, message } = await addToCartFromAPI({
      id: activeProduct.value.id,
      slug: activeProduct.value.slug,
      name: currentName.value,
      en_name: activeProduct.value.en_name || activeProduct.value.name,
      ar_name: activeProduct.value.ar_name || activeProduct.value.name,
      different: locale.value === "ar" 
        ? activeProduct.value.ar_different || activeProduct.value.different
        : activeProduct.value.en_different || activeProduct.value.different,
      price: Number(activeProduct.value.price) - Number(activeProduct.value.discount || 0),
      image: activeProduct.value.imageUrl,
      maxStock: activeProduct.value.quantity,
      quantity: quantity.value,
      accessories: accessoriesObjects,
    });

    if (success) {
      toast.success(t("messages.addedToCart"), {
        description: `${currentName.value} x ${quantity.value}`,
      });
    } else {
      toast.error(message);
    }
  } else {
    // Add to localStorage for guest users
    const result = cart.addToCart({
      id: parseInt(activeProduct.value.id),
      slug: activeProduct.value.slug,
      name: currentName.value,
      price: Number(activeProduct.value.price) - Number(activeProduct.value.discount || 0),
      image: activeProduct.value.imageUrl,
      maxStock: activeProduct.value.quantity,
      quantity: quantity.value,
      accessories: accessoriesObjects,
      different:activeProduct.value.different,
    });

    if (result.success) {
      toast.success(t("messages.addedToCart"), {
        description: `${currentName.value} x ${quantity.value}`,
      });
    } else {
      toast.error(result.message);
    }
  }
};

const addToWishlist = async () => {
  if (!activeProduct.value) return;

  const wishlistItem = {
    id: Number(activeProduct.value.id),
    slug: activeProduct.value.slug,
    name: currentName.value,
    en_name: activeProduct.value.en_name || activeProduct.value.name,
    ar_name: activeProduct.value.ar_name || activeProduct.value.name,
    price: Number(
      activeProduct.value.calculated_price || activeProduct.value.price
    ),
    image: activeProduct.value.imageUrl,
    inStock: activeProduct.value.quantity > 0,
    brand: activeProduct.value.brand,
    brand_id: activeProduct.value.brand_id,
    rating: activeProduct.value.rating,
    description: activeProduct.value.description,
    categories: activeProduct.value.categories,
    // Use current i18n locale to choose the displayed variant/colour name
    different: locale.value === 'ar'
      ? activeProduct.value.ar_different
      : activeProduct.value.en_different,
    ar_different: activeProduct.value.ar_different,
    en_different: activeProduct.value.en_different,
    discount: activeProduct.value.discount,
    calculated_price: activeProduct.value.calculated_price,
    quantity: activeProduct.value.quantity,
    label: activeProduct.value.label,
    accessories: activeProduct.value.accessories,
    images: activeProduct.value.images,
  };

  const wasInWishlist = cart.isInWishlist(wishlistItem.id);
  const result = await cart.toggleWishlist(wishlistItem);

  if (result.success) {
    if (!wasInWishlist) {
      toast.success(t("messages.addedToWishlist"), {
        description: currentName.value,
      });
    } else {
      toast.success(t("messages.removedFromWishlist"), {
        description: currentName.value,
      });
    }
  } else {
    toast.error(result.message);
  }
};

const buyNow = () => {
  if (!activeProduct.value) return;

  // Add to cart and redirect to checkout
  addToCart();
  router.push("/checkout");
};
// SEO
usePageSeo({
  title: () => (activeProduct.value ? currentName.value : "Product"),
  description: () =>
    activeProduct.value?.seo_description ||
    activeProduct.value?.description ||
    "",
  image: () =>
    activeProduct.value?.imageUrl || selectedImage.value || "/placeholder.png",
  type: "article",
});
</script>
