<template>
    <div class="space-y-8 z-10 relative">
        <!-- Animated Badge -->
        <div class="hero-badge-enter flex flex-col items-start gap-3">
            <div class="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 dark:bg-primary/20 rounded-full border border-primary/20">
                <span class="relative flex h-2 w-2">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span class="text-sm font-medium text-primary">{{ $t('home.todaysSpecial') }}</span>
            </div>
        </div>

        <!-- Main Heading with gradient -->
        <h1 class="hero-title-enter text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
            <span class="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 dark:from-white dark:via-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                {{ title }}
            </span>
        </h1>

        <!-- Description with better styling -->
        <p v-if="description" class="hero-desc-enter text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-lg leading-relaxed">
            {{ description }}
        </p>

        <!-- CTA Buttons -->
        <div class="hero-cta-enter flex flex-wrap items-center gap-4 pt-2">
            <Button 
                size="lg"
                class="group relative rounded-full text-lg px-8 py-6 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5"
                @click="handleShopNow"
            >
                <span class="relative z-10 flex items-center gap-2">
                    {{ buttonText }}
                    <ArrowRight class="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
            </Button>
            
            <Button 
                variant="outline"
                size="lg"
                class="rounded-full text-lg px-8 py-6 border-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
                @click="$router.push('/products')"
            >
                {{ $t('common.explore') }}
            </Button>
        </div>

        <!-- Trust badges -->
        <div class="hero-trust-enter flex flex-wrap items-center gap-6 pt-4 text-sm text-gray-500 dark:text-gray-400">
            <div class="flex items-center gap-2">
                <Truck class="w-5 h-5 text-primary" />
                <!-- <span>{{ $t('home.freeDelivery') }}</span> -->
            </div>
            <div class="flex items-center gap-2">
                <ShieldCheck class="w-5 h-5 text-primary" />
                <span>{{ $t('home.securePayment') }}</span>
            </div>
            <div class="flex items-center gap-2">
                <RefreshCw class="w-5 h-5 text-primary" />
                <!-- <span>{{ $t('home.easyReturns') }}</span> -->
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Button } from '../ui/button';
import { ArrowRight, Truck, ShieldCheck, RefreshCw } from 'lucide-vue-next';

interface Props {
    title?: string
    description?: string
    buttonText?: string
    url: string
}

const props = withDefaults(defineProps<Props>(), {
    title: 'The Online\nGrocery Store',
    description: '',
    buttonText: 'Shop Now',
    url: '/products'
})

const router = useRouter()

const handleShopNow = () => {
    router.push(`/products/${props.url}`)
}
</script>

<style scoped>
.hero-badge-enter {
    animation: slideInUp 0.6s ease-out;
}

.hero-title-enter {
    animation: slideInUp 0.6s ease-out 0.1s both;
}

.hero-desc-enter {
    animation: slideInUp 0.6s ease-out 0.2s both;
}

.hero-cta-enter {
    animation: slideInUp 0.6s ease-out 0.3s both;
}

.hero-trust-enter {
    animation: slideInUp 0.6s ease-out 0.4s both;
}

@keyframes slideInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
