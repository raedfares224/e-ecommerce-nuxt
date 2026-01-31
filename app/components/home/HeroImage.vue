<template>
    <div class="relative hero-image-enter">
        <!-- Decorative elements behind image -->
        <div class="absolute inset-0 -z-10">
            <!-- Animated rings -->
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] aspect-square rounded-full border-2 border-dashed border-primary/20 animate-spin-slow"></div>
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75%] aspect-square rounded-full border border-primary/10"></div>
            
            <!-- Floating dots -->
            <div class="absolute top-10 right-10 w-3 h-3 bg-primary/40 rounded-full animate-bounce-slow"></div>
            <div class="absolute bottom-20 left-10 w-2 h-2 bg-yellow-400/60 rounded-full animate-bounce-slower"></div>
            <div class="absolute top-1/3 right-5 w-4 h-4 bg-primary/20 rounded-full animate-pulse"></div>
        </div>

        <!-- Discount Badge -->
        <div 
            v-if="discount"
            class="absolute top-4 left-0 md:top-8 md:left-4 z-20 group"
        >
            <div class="relative">
                <!-- Modern discount badge -->
                <div class="relative bg-gradient-to-br from-primary via-primary to-primary/80 text-white rounded-2xl p-4 shadow-xl shadow-primary/30 transform hover:scale-105 transition-transform duration-300">
                    <div class="absolute inset-0 bg-white/10 rounded-2xl"></div>
                    <div class="relative text-center">
                        <span class="block text-xs font-medium uppercase tracking-wider opacity-90">{{ $t('product.discount') }}</span>
                        <span class="block text-4xl md:text-5xl font-bold">{{ discount }}%</span>
                        <span class="block text-xs font-medium uppercase tracking-wider opacity-90">{{ $t('product.off') }}</span>
                    </div>
                    <!-- Shine effect -->
                    <div class="absolute inset-0 rounded-2xl overflow-hidden">
                        <div class="absolute -inset-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 animate-shine"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Image Container -->
        <div class="relative">
            <!-- Glow effect behind image -->
            <div class="absolute inset-4 bg-primary/20 rounded-3xl blur-2xl"></div>
            
            <!-- Image wrapper with border -->
            <div class="relative bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-2 shadow-2xl">
                <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800">
                    <img 
                        loading="lazy"
                        decoding="async"
                        :src="imageSrc" 
                        :alt="imageAlt" 
                        class="w-full lg:w-[85%] ms-auto aspect-square object-cover rounded-2xl transform hover:scale-105 transition-transform duration-700"
                    />
                    
                    <!-- Overlay gradient -->
                    <div class="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none rounded-2xl"></div>
                </div>
            </div>
        </div>

        <!-- Floating product highlights -->
        <div class="absolute -bottom-4 -right-4 md:bottom-8 md:right-0 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-xl border border-gray-100 dark:border-gray-700 animate-float">
            <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Sparkles class="w-6 h-6 text-primary" />
                </div>
                <div>
                    <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ $t('home.freshDaily') }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ $t('home.qualityGuaranteed') }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Sparkles } from 'lucide-vue-next';

interface Props {
    imageSrc: string
    imageAlt?: string
    discount?: number
}

withDefaults(defineProps<Props>(), {
    imageAlt: 'Fresh Vegetables and Fruits',
    discount: 20
})
</script>

<style scoped>
.hero-image-enter {
    animation: fadeInScale 0.8s ease-out 0.2s both;
}

@keyframes fadeInScale {
    from {
        opacity: 0;
        transform: scale(0.95);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

@keyframes spin-slow {
    from { transform: translate(-50%, -50%) rotate(0deg); }
    to { transform: translate(-50%, -50%) rotate(360deg); }
}

@keyframes bounce-slow {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}

@keyframes bounce-slower {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-15px); }
}

@keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
}

@keyframes shine {
    from { transform: translateX(-100%) skewX(-12deg); }
    to { transform: translateX(200%) skewX(-12deg); }
}

.animate-spin-slow {
    animation: spin-slow 30s linear infinite;
}

.animate-bounce-slow {
    animation: bounce-slow 3s ease-in-out infinite;
}

.animate-bounce-slower {
    animation: bounce-slower 4s ease-in-out infinite;
}

.animate-float {
    animation: float 4s ease-in-out infinite;
}

.animate-shine {
    animation: shine 3s ease-in-out infinite;
}
</style>
