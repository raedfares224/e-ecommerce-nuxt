<template>
  <Transition name="fade">
    <div v-if="isLoading" class="fixed inset-0 z-[9999] pointer-events-none">
      <!-- Top Progress Bar -->
      <div class="h-1 bg-gradient-to-r from-primary via-primary/80 to-primary overflow-hidden">
        <div 
          class="h-full bg-white/30 animate-shimmer"
          :style="{ width: `${progress}%` }"
        ></div>
      </div>
      
      <!-- Loading Overlay (Optional - can be removed for minimal look) -->
      <div class="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center">
        <div class="bg-white rounded-lg shadow-2xl p-6 flex flex-col items-center gap-4">
          <!-- Spinner -->
          <div class="relative w-16 h-16">
            <div class="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
            <div class="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
          
          <!-- Loading Text -->
          <div class="text-center">
            <p class="text-lg font-semibold text-gray-900">{{ $t('common.loading') }}</p>
            <p class="text-sm text-gray-500 mt-1">{{ loadingMessage }}</p>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const isLoading = ref(false)
const progress = ref(0)
const loadingMessage = ref('')

let progressInterval: NodeJS.Timeout | null = null

// Start loading
const startLoading = (message?: string) => {
  isLoading.value = true
  progress.value = 0
  loadingMessage.value = message || t('common.loading')
  
  // Simulate progress
  progressInterval = setInterval(() => {
    if (progress.value < 90) {
      progress.value += Math.random() * 10
    }
  }, 200)
}

// Finish loading
const finishLoading = () => {
  progress.value = 100
  
  setTimeout(() => {
    isLoading.value = false
    progress.value = 0
    if (progressInterval) {
      clearInterval(progressInterval)
      progressInterval = null
    }
  }, 300)
}

// Stop loading immediately
const stopLoading = () => {
  isLoading.value = false
  progress.value = 0
  if (progressInterval) {
    clearInterval(progressInterval)
    progressInterval = null
  }
}

// Expose methods
defineExpose({
  startLoading,
  finishLoading,
  stopLoading
})

// Cleanup on unmount
onUnmounted(() => {
  if (progressInterval) {
    clearInterval(progressInterval)
  }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(400%);
  }
}

.animate-shimmer {
  animation: shimmer 1.5s infinite;
}
</style>
