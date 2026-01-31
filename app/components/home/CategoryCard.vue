<template>
    <div 
        class="group block cursor-pointer"
        @mousedown="handleMouseDown"
        @mouseup="handleMouseUp"
        @touchstart="handleMouseDown"
        @touchend="handleMouseUp"
    >
        <div
            class="relative rounded-[30px] p-px bg-linear-to-br from-primary/70 via-primary/20 to-transparent transition-all duration-500 group-hover:from-primary group-hover:via-primary/40 group-hover:to-primary/10"
        >
            <div
                class="relative overflow-hidden rounded-[28px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm px-6 py-7 shadow-sm transition-all duration-500 group-hover:-translate-y-1"
                :style="{ borderColor: category.color }"
            >
                <!-- Decorative glow -->
                <span class="pointer-events-none absolute -right-10 top-6 h-24 w-24 rounded-full bg-primary/10 blur-2xl"></span>
                <span class="pointer-events-none absolute -left-8 -bottom-8 h-28 w-28 rounded-full bg-primary/5 blur-3xl"></span>

                <!-- Category badge -->
                <div class="flex items-center justify-between mb-6">
                    <span class="inline-flex items-center gap-1 rounded-full bg-gray-100/90 dark:bg-gray-800/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                        <!-- {{ category.itemsCount!=0 ? category.itemsCount : '' }}  -->
                        {{ $t('product.items') }}
                    </span>
                    <span class="text-[10px] font-medium tracking-[0.3em] text-gray-400 uppercase">{{ $t('common.explore') }}</span>
                </div>

                <!-- Category Info -->
                <div class="text-start mb-6">
                    <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
                        {{ category.name }}
                    </h3>
                    <p class="text-sm text-gray-500 dark:text-gray-300 line-clamp-2">
                        {{ $t('product.discoverCategory') || $t('product.shopByCategory') }}
                    </p>
                </div>

                <!-- Category Image -->
                <div class="relative h-36 flex items-center justify-center rounded-2xl bg-linear-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border border-dashed border-gray-100 dark:border-gray-800">
                    <img 
                        loading="lazy"
                        decoding="async"
                        :src="category.image || '/placeholder.png'" 
                        :alt="category.name"
                        class="w-32 h-32 object-contain rounded-lg transition-transform duration-500 group-hover:scale-110 pointer-events-none drop-shadow-xl"
                    />
                </div>

                <!-- CTA -->
                <div class="mt-6 flex items-center justify-between text-sm font-semibold text-primary">
                    <span class="tracking-wide">{{ $t('common.viewDetails') }}</span>
                    <ArrowUpRight class="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Category } from '~/types/category'
import { ArrowUpRight } from 'lucide-vue-next'

interface Props {
    category: Category,
    endpoint?: string
}

const props = defineProps<Props>()
const router = useRouter()

// Track mouse position to detect drag vs click
let startX = 0
let startY = 0
let isDragging = false

const handleMouseDown = (event: MouseEvent | TouchEvent) => {
    isDragging = false
    if (event instanceof MouseEvent) {
        startX = event.clientX
        startY = event.clientY
    } else if ('touches' in event && event.touches && event.touches.length > 0) {
        startX = event.touches[0]?.clientX || 0
        startY = event.touches[0]?.clientY || 0
    }
}

const handleMouseUp = (event: MouseEvent | TouchEvent) => {
    let endX = 0
    let endY = 0
    
    if (event instanceof MouseEvent) {
        endX = event.clientX
        endY = event.clientY
    } else if ('changedTouches' in event && event.changedTouches && event.changedTouches.length > 0) {
        endX = event.changedTouches[0]?.clientX || 0
        endY = event.changedTouches[0]?.clientY || 0
    }
    
    // Calculate distance moved
    const deltaX = Math.abs(endX - startX)
    const deltaY = Math.abs(endY - startY)
    
    // If moved less than 5px, consider it a click
    if (deltaX < 5 && deltaY < 5) {
        router.push(`${props.endpoint || '/categories'}/${props.category.slug}`)
    }
}
</script>
