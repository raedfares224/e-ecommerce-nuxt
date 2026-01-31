<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <!-- Breadcrumb Skeleton -->
      <div class="flex items-center space-x-2 mb-6 animate-pulse">
        <div class="h-4 w-16 bg-gray-200 rounded"></div>
        <div class="h-4 w-4 bg-gray-200 rounded"></div>
        <div class="h-4 w-24 bg-gray-200 rounded"></div>
        <div class="h-4 w-4 bg-gray-200 rounded"></div>
        <div class="h-4 w-32 bg-gray-200 rounded"></div>
      </div>

      <!-- Product Main Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <!-- Image Gallery Skeleton -->
        <div class="space-y-4 animate-pulse">
          <!-- Main Image -->
          <div class="aspect-square bg-gray-200 rounded-lg"></div>
          
          <!-- Thumbnail Gallery -->
          <div class="grid grid-cols-4 gap-2">
            <div v-for="i in 4" :key="i" class="aspect-square bg-gray-200 rounded-lg"></div>
          </div>
        </div>

        <!-- Product Info Skeleton -->
        <div class="space-y-6 animate-pulse">
          <!-- Category Badge -->
          <div class="h-4 w-24 bg-gray-200 rounded"></div>

          <!-- Product Name -->
          <div class="space-y-2">
            <div class="h-8 w-3/4 bg-gray-200 rounded"></div>
            <div class="h-8 w-1/2 bg-gray-200 rounded"></div>
          </div>

          <!-- Rating & Stock -->
          <div class="flex items-center gap-4">
            <div class="flex gap-1">
              <div v-for="i in 5" :key="i" class="w-5 h-5 bg-gray-200 rounded"></div>
            </div>
            <div class="h-6 w-20 bg-gray-200 rounded-full"></div>
          </div>

          <!-- Price -->
          <div class="flex items-baseline gap-3">
            <div class="h-10 w-32 bg-gray-200 rounded"></div>
            <div class="h-6 w-24 bg-gray-200 rounded"></div>
          </div>

          <!-- Description -->
          <div class="space-y-2">
            <div class="h-4 w-full bg-gray-200 rounded"></div>
            <div class="h-4 w-full bg-gray-200 rounded"></div>
            <div class="h-4 w-3/4 bg-gray-200 rounded"></div>
          </div>

          <!-- Product Meta -->
          <div class="space-y-2">
            <div class="h-4 w-48 bg-gray-200 rounded"></div>
            <div class="h-4 w-40 bg-gray-200 rounded"></div>
            <div class="h-4 w-56 bg-gray-200 rounded"></div>
          </div>

          <!-- Quantity & Actions -->
          <div class="space-y-4 pt-4">
            <div class="flex items-center gap-4">
              <div class="h-4 w-20 bg-gray-200 rounded"></div>
              <div class="h-10 w-32 bg-gray-200 rounded-lg"></div>
            </div>

            <div class="flex gap-3">
              <div class="h-12 flex-1 bg-gray-200 rounded-lg"></div>
              <div class="h-12 w-12 bg-gray-200 rounded-lg"></div>
            </div>

            <div class="h-12 w-full bg-gray-200 rounded-lg"></div>
          </div>

          <!-- Share -->
          <div class="flex items-center gap-3 pt-4">
            <div class="h-4 w-16 bg-gray-200 rounded"></div>
            <div class="flex gap-2">
              <div v-for="i in 3" :key="i" class="h-8 w-8 bg-gray-200 rounded"></div>
            </div>
          </div>

          <!-- Trust Badges -->
          <div class="space-y-3 pt-4">
            <div v-for="i in 3" :key="i" class="h-4 w-64 bg-gray-200 rounded"></div>
            <div class="flex gap-2 mt-2">
              <div v-for="i in 4" :key="i" class="h-6 w-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs Skeleton -->
      <div class="mb-12 animate-pulse">
        <div class="flex items-center gap-6 border-b border-gray-200 pb-3 mb-6">
          <div v-for="i in 3" :key="i" class="h-6 w-32 bg-gray-200 rounded"></div>
        </div>
        <div class="bg-white rounded-lg p-6 border border-gray-200">
          <div class="space-y-3">
            <div v-for="i in 4" :key="i" class="h-4 w-full bg-gray-200 rounded"></div>
            <div class="h-4 w-2/3 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>

      <!-- Related Products Skeleton -->
      <div class="mb-12 animate-pulse">
        <div class="h-8 w-48 bg-gray-200 rounded mb-6"></div>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <div v-for="i in 5" :key="i" class="space-y-3">
            <div class="aspect-square bg-gray-200 rounded-lg"></div>
            <div class="h-4 w-3/4 bg-gray-200 rounded"></div>
            <div class="h-4 w-1/2 bg-gray-200 rounded"></div>
            <div class="h-6 w-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No props or logic needed - pure skeleton UI
</script>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
