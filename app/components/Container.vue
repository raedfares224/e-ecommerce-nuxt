<template>
  <section class="py-6">
    <div :class="parentClass" class="container-Nuxt mx-auto">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  parentClass?: string;
}>();
</script>

<style scoped>
.container-Nuxt {
  width: 100%;
  padding: 0 1rem;
}
@media (min-width: 640px) {
  .container-Nuxt {
    max-width: 620px;
  }
}
@media (min-width: 768px) {
  .container-Nuxt {
    max-width: 1400px;
  }
}
</style>
