export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore();

  // Initialize auth state from stored token on client side
  if (import.meta.client) {
    await authStore.initialize();
  }
});
