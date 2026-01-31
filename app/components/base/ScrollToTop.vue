<template>
    <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 translate-y-4 scale-90"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0 scale-100"
        leave-to-class="opacity-0 translate-y-4 scale-90"
    >
        <button
            v-if="isVisible"
            @click="scrollToTop"
            class="group fixed bottom-6 right-6 z-50 w-14 h-14 flex items-center justify-center bg-primary hover:bg-primary/90 text-white rounded-2xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            :aria-label="$t('common.scrollToTop')"
        >
            <ChevronUp class="w-6 h-6 transition-transform group-hover:-translate-y-0.5" />
        </button>
    </Transition>
</template>

<script setup lang="ts">
import { ChevronUp } from 'lucide-vue-next'

const isVisible = ref(false)

// Show button when user scrolls down
const handleScroll = () => {
    isVisible.value = window.scrollY > 300
}

// Smooth scroll to top
const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    })
}

// Add scroll listener
onMounted(() => {
    window.addEventListener('scroll', handleScroll)
})

// Clean up
onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})
</script>
