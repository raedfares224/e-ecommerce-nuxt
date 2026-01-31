<template>
  <div class="rounded-2xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
    <!-- Image skeleton -->
    <div class="relative aspect-square bg-gray-100 dark:bg-gray-700 overflow-hidden">
      <div class="absolute inset-0 skeleton-shimmer"></div>
    </div>
    
    <!-- Content skeleton -->
    <div class="p-4 space-y-3">
      <!-- Category -->
      <div class="h-3 w-20 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div class="h-full skeleton-shimmer"></div>
      </div>
      
      <!-- Title -->
      <div class="space-y-2">
        <div class="h-4 w-full bg-gray-100 dark:bg-gray-700 rounded overflow-hidden">
          <div class="h-full skeleton-shimmer"></div>
        </div>
        <div class="h-4 w-3/4 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden">
          <div class="h-full skeleton-shimmer"></div>
        </div>
      </div>
      
      <!-- Rating -->
      <div class="flex gap-1">
        <div v-for="i in 5" :key="i" class="w-4 h-4 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden">
          <div class="h-full skeleton-shimmer"></div>
        </div>
      </div>
      
      <!-- Price -->
      <div class="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
        <div class="h-6 w-24 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden">
          <div class="h-full skeleton-shimmer"></div>
        </div>
        <div class="h-5 w-12 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div class="h-full skeleton-shimmer"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No props needed - this is a pure skeleton component
</script>
