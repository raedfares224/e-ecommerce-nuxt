<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300"
      leave-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="show"
        class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
        role="status"
        aria-live="polite"
        aria-label="Loading"
      >
        <div class="relative">
          <!-- Loading Card -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 min-w-[300px] max-w-md">
            <!-- Animated Icon -->
            <div class="flex justify-center mb-6">
              <div class="relative">
                <!-- Outer rotating ring -->
                <div class="w-20 h-20 border-4 border-primary/20 rounded-full animate-spin border-t-primary"></div>
                
                <!-- Inner pulsing circle -->
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="w-12 h-12 bg-primary/10 rounded-full animate-pulse"></div>
                </div>
                
                <!-- Center icon -->
                <div class="absolute inset-0 flex items-center justify-center">
                  <Languages class="w-8 h-8 text-primary animate-pulse" />
                </div>
              </div>
            </div>

            <!-- Loading Text -->
            <div class="text-center space-y-2">
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                {{ title }}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ message }}
              </p>
            </div>

            <!-- Progress Bar -->
            <div class="mt-6 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
              <div 
                class="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full animate-progress"
              ></div>
            </div>

            <!-- Animated Dots -->
            <div class="flex justify-center gap-1.5 mt-4">
              <div 
                v-for="i in 3" 
                :key="i"
                class="w-2 h-2 bg-primary rounded-full animate-bounce"
                :style="{ animationDelay: `${i * 0.15}s` }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { Languages } from 'lucide-vue-next'

interface Props {
  show?: boolean
  title?: string
  message?: string
}

withDefaults(defineProps<Props>(), {
  show: false,
  title: 'Loading...',
  message: 'Please wait while we load your content'
})
</script>

<style scoped>
@keyframes progress {
  0% {
    width: 0%;
  }
  50% {
    width: 70%;
  }
  100% {
    width: 100%;
  }
}

.animate-progress {
  animation: progress 2s ease-in-out infinite;
}
</style>
