<template>
    <section class="py-16 md:py-20 bg-gradient-to-b from-white via-gray-50/50 to-white dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900 relative overflow-hidden">
        <!-- Background decoration -->
        <div class="absolute inset-0 pointer-events-none">
            <div class="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
            <div class="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/3 rounded-full blur-3xl"></div>
        </div>
        
        <div class="container mx-auto px-4 relative z-10">
            <!-- Section Header -->
            <div class="text-center mb-12 md:mb-16">
                <div class="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 dark:bg-primary/20 rounded-full mb-4">
                    <span class="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                    <span class="text-sm font-medium text-primary">{{ $t('product.shopByCategory') || 'Shop by Category' }}</span>
                </div>
                <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                    {{ title2 || title || $t('product.popularOnTheShofiStore') }}
                </h2>
                <p class="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                    {{ $t('product.discoverCategory') || 'Discover our wide range of categories and find exactly what you need' }}
                </p>
            </div>
            
            <!-- Categories Carousel -->
            <BaseCarousel 
                :showButtons="showButton" 
                :length="categories.length"
                class="mb-8"
            >
                <CarouselItem 
                    v-for="(category, index) in categories" 
                    :key="category.id"
                    class="md:basis-1/2 lg:basis-1/3 xl:basis-1/5"
                    :style="{ animationDelay: `${index * 100}ms` }"
                >
                    <div class="px-2 category-item">
                        <HomeCategoryCard :category="category" :endpoint="endpoint" />
                    </div>
                </CarouselItem>
            </BaseCarousel>

            <!-- Decorative Line -->
            <div class="mt-16 max-w-lg mx-auto">
                <div class="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { CarouselItem } from '~/components/ui/carousel'
import type { Category } from '~/types/category'

interface Props {
    categories?: Category[],
    title?: string,
    showButton?: boolean,
    endpoint?: string
    title2?: string
}

const props = withDefaults(defineProps<Props>(), {
    categories: () => [
        {
            id: 1,
            name: 'Frozen Foods',
            slug: 'frozen-foods',
            image: '/images/categories/frozen-foods.png',
            itemsCount: 5,
            color: '#D4E8D4'
        },
        {
            id: 2,
            name: 'Meat and Fish',
            slug: 'meat-fish',
            image: '/images/categories/meat-fish.png',
            itemsCount: 2,
            color: '#F5D4E0'
        },
        {
            id: 3,
            name: 'Milk & Dairy',
            slug: 'milk-dairy',
            image: '/images/categories/milk-dairy.png',
            itemsCount: 2,
            color: '#F5EBD4'
        },
        {
            id: 4,
            name: 'Beverages',
            slug: 'beverages',
            image: '/images/categories/beverages.png',
            itemsCount: 5,
            color: '#D4E8D4'
        },
        {
            id: 5,
            name: 'Vegetables',
            slug: 'vegetables',
            image: '/images/categories/vegetables.png',
            itemsCount: 5,
            color: '#F5E6D4'
        },
        {
            id: 6,
            name: 'Fresh Fruits',
            slug: 'fresh-fruits',
            image: '/images/categories/fresh-fruits.png',
            itemsCount: 8,
            color: '#FFE4E1'
        },
        {
            id: 7,
            name: 'Bakery',
            slug: 'bakery',
            image: '/images/categories/bakery.png',
            itemsCount: 4,
            color: '#FFF8DC'
        },
        {
            id: 8,
            name: 'Snacks',
            slug: 'snacks',
            image: '/images/categories/snacks.png',
            itemsCount: 6,
            color: '#E6F3FF'
        }
    ],
    showButton: true
})
</script>
