<template>
  <div class="fixed bottom-4 right-4 z-50 bg-white p-4 rounded-lg shadow-lg border border-gray-200">
    <h3 class="font-bold mb-2">Page Loader Test</h3>
    <div class="space-y-2">
      <button
        @click="testLoader"
        class="w-full px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
      >
        Test Loader (3s)
      </button>
      
      <div class="text-xs text-gray-600">
        <div>Loading: {{ isLoading }}</div>
        <div>Progress: {{ progress }}%</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { isLoading, progress, startLoading, finishLoading } = usePageLoader()

const testLoader = () => {
  startLoading('Testing loader...')
  
  setTimeout(() => {
    finishLoading()
  }, 3000)
}
</script>
