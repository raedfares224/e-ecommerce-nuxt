<template>
    <section class="py-12 bg-gray-50">
        <div class="container mx-auto px-4">
            <!-- Section Header -->
            <div class="text-center mb-8">
                <h2 class="text-3xl font-bold text-gray-900 mb-2">
                    {{ $t('product.featuredProducts') }}
                </h2>
                <p class="text-gray-600">
                    {{ $t('home.discoverProducts') }}
                </p>
            </div>

            <!-- Products Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <HomeProductCard 
                    v-for="product in products" 
                    :key="product.id"
                    :product="product"
                />
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import type { Product } from '~/types/product'

interface Props {
    products: Product[]
}

defineProps<Props>()
</script>
