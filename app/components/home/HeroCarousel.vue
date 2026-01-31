<template>
    <section class="w-full">
        <!-- Loading skeleton when there are no slides yet -->
        <div
            v-if="!slides || slides.length === 0"
            class="relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 border border-slate-100 dark:border-slate-700 p-6 md:p-10 animate-pulse"
        >
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center">
                <!-- Text skeleton -->
                <div class="space-y-4">
                    <div class="h-6 w-24 rounded-full bg-slate-200/80 dark:bg-slate-700/80" />
                    <div class="h-8 md:h-10 w-3/4 rounded-lg bg-slate-200 dark:bg-slate-700" />
                    <div class="h-8 md:h-10 w-1/2 rounded-lg bg-slate-200/90 dark:bg-slate-700/90" />
                    <div class="h-4 w-full max-w-md rounded-lg bg-slate-200/80 dark:bg-slate-700/80" />
                    <div class="h-4 w-2/3 rounded-lg bg-slate-200/70 dark:bg-slate-700/70" />
                    <div class="mt-4 flex items-center gap-3">
                        <div class="h-10 w-32 rounded-full bg-emerald-400/80 dark:bg-emerald-500/80" />
                        <div class="h-10 w-24 rounded-full bg-slate-200/80 dark:bg-slate-700/80" />
                    </div>
                </div>

                <!-- Image skeleton -->
                <div class="relative flex justify-center md:justify-end">
                    <div class="h-48 w-48 md:h-64 md:w-64 rounded-full bg-slate-200/80 dark:bg-slate-700/80" />
                    <div class="absolute inset-4 rounded-full border-2 border-dashed border-slate-300/70 dark:border-slate-600/70" />
                    <div class="absolute -bottom-3 right-6 md:right-10 h-10 w-28 rounded-full bg-white/80 dark:bg-slate-800/90 shadow-md" />
                </div>
            </div>
        </div>

        <!-- Real carousel when slides are ready -->
        <BaseCarousel
            v-else
            :showButtons="false"
            :length="slides.length"
        >
            <CarouselItem v-for="(slide, index) in slides" :key="index">
                <HomeHeroSlide 
                    :image-src="slide.image"
                    :image-alt="`img-${slide.title}`"
                    :title="slide.title"
                    :url="slide.url"
                    :description="slide.description"
                    :button-text="slide.buttonText"
                    :discount="slide.discount"
                />
            </CarouselItem>
        </BaseCarousel>
    </section>
</template>

<script setup lang="ts">
import { CarouselItem } from '~/components/ui/carousel'

interface HeroSlide {
    image: string
    title?: string
    description?: string
    buttonText?: string
    discount?: number,
    url?: string
}

interface Props {
    slides: HeroSlide[]
}

defineProps<Props>()
</script>
