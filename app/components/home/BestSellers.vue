<template>
    <section class="py-12">
        <div class="container mx-auto px-4">
            <!-- Section Header -->
            <div class="text-center mb-8">
                <h2 class="text-3xl font-bold text-gray-900 mb-2">
                    {{ $t('home.bestSellers') }}
                </h2>
                <p class="text-gray-600">
                    {{ $t('home.bestSellersDescription') }}
                </p>
            </div>

            <!-- Products Grid -->
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
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
