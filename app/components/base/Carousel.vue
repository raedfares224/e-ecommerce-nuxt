<script setup lang="ts">
import Autoplay from "embla-carousel-autoplay"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

defineProps<{
  showButtons?: boolean,
  length?: number
}>()

// Get current locale for RTL support
const localeCookie = useCookie<'en' | 'ar'>('locale')
const isRTL = computed(() => localeCookie.value === 'ar')

// Create autoplay plugin with ref to track initialization
const plugin = ref<any>(null)

// Initialize plugin on mount
onMounted(() => {
  plugin.value = Autoplay({
    delay: 3000,
    stopOnMouseEnter: true,
    stopOnInteraction: false,
  })
})

// Safe handlers for mouse events
const handleMouseEnter = () => {
  if (plugin.value && typeof plugin.value.stop === 'function') {
    plugin.value.stop()
  }
}

const handleMouseLeave = () => {
  if (plugin.value && typeof plugin.value.play === 'function') {
    try {
      plugin.value.reset?.()
      plugin.value.play()
    } catch (error) {
      console.warn('Carousel autoplay error:', error)
    }
  }
}
</script>

<template>
  <Carousel
    v-if="plugin"
    :key="isRTL ? 'rtl' : 'ltr'"
    class="relative w-full"
    :plugins="[plugin]"
    :opts="{ loop: true, direction: isRTL ? 'rtl' : 'ltr' }"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <CarouselContent>
      <slot></slot>
    </CarouselContent>
    <!-- <CarouselPrevious
      v-if="showButtons !== false"
      class="hidden xl:flex"
    />
    <CarouselNext
      v-if="showButtons !== false"
      class="hidden xl:flex"
    /> -->
  </Carousel>
</template>