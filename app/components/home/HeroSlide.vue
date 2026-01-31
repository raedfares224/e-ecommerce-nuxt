<template>
    <div class="relative bg-gradient-to-br from-gray-50 via-white to-primary/5 dark:from-gray-900 dark:via-gray-800 dark:to-primary/10 overflow-hidden min-h-[500px] md:min-h-[600px]">
        <!-- Animated Background Elements -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
            <!-- Floating circles -->
            <div class="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float-slow"></div>
            <div class="absolute bottom-10 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float-slower"></div>
            <div class="absolute top-1/2 left-1/3 w-48 h-48 bg-yellow-300/10 rounded-full blur-2xl animate-pulse-slow"></div>
            
            <!-- Grid pattern overlay -->
            <div class="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:60px_60px] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]"></div>
        </div>

        <div class="container mx-auto px-4 py-16 md:py-24 relative z-10">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <!-- Left Content -->
                <HomeHeroContent 
                    :title="title"
                    :description="description"
                    :button-text="buttonText"
                    :url="url"
                />

                <!-- Right Content - Image -->
                <HomeHeroImage 
                    :image-src="imageSrc"
                    :image-alt="imageAlt"
                    :discount="discount"
                />
            </div>
        </div>

        <!-- Decorative corner elements -->
        <div class="absolute top-0 right-0 w-64 h-64 opacity-30">
            <svg viewBox="0 0 200 200" class="w-full h-full">
                <defs>
                    <linearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:var(--primary);stop-opacity:0.3" />
                        <stop offset="100%" style="stop-color:var(--primary);stop-opacity:0" />
                    </linearGradient>
                </defs>
                <circle cx="150" cy="50" r="80" fill="url(#heroGradient)" />
            </svg>
        </div>
        
        <!-- Bottom wave decoration -->
        <div class="absolute bottom-0 left-0 right-0 h-16 overflow-hidden">
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none" class="w-full h-full">
                <path d="M0,60 C300,120 600,0 900,60 C1050,90 1150,60 1200,60 L1200,120 L0,120 Z" 
                      fill="currentColor" class="text-white dark:text-gray-900 opacity-50"></path>
            </svg>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Props {
    imageSrc: string
    imageAlt?: string
    title?: string
    description?: string
    buttonText?: string
    discount?: number
    url?: string
}

const props = withDefaults(defineProps<Props>(), {
    imageAlt: 'Fresh Vegetables and Fruits',
    title: 'The Online\nGrocery Store',
    description: '',
    buttonText: 'Shop Now',
    url: '',
    showDiscount: true,
    discount: 20
})
</script>

<style scoped>
@keyframes float-slow {
    0%, 100% { transform: translateY(0) translateX(0); }
    50% { transform: translateY(-20px) translateX(10px); }
}

@keyframes float-slower {
    0%, 100% { transform: translateY(0) translateX(0); }
    50% { transform: translateY(15px) translateX(-15px); }
}

@keyframes pulse-slow {
    0%, 100% { opacity: 0.3; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(1.1); }
}

.animate-float-slow {
    animation: float-slow 8s ease-in-out infinite;
}

.animate-float-slower {
    animation: float-slower 12s ease-in-out infinite;
}

.animate-pulse-slow {
    animation: pulse-slow 6s ease-in-out infinite;
}
</style>
