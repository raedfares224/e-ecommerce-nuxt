<template>
  <div id="appId">
    <BaseMainHeader />
    <main class="pt-24">
      <slot />
    </main>
    
    <!-- Footer -->
    <BaseFooter />
    
    <!-- Scroll to Top Button -->
    <BaseScrollToTop />
  </div>
</template>
<script setup>
const cart = useCart();

onMounted(async () => {
  // Initialize cart and wishlist
  await cart.initialize();
});
</script>
