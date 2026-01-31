<template>
  <TooltipProvider>
    <div>
      <!-- Page Progress Bar -->
      <BasePageProgress />
      
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
      <Toaster />
    <LoadingOverlay 
      :show="isLoading"
      :title="loadingTitle"
      :message="loadingMessage"
    />
    <!-- Global Loading Overlay 
    
    -->
    <!-- Test Component (Remove after testing) -->
    <!-- <ClientOnly>
      <TestLoaderTest />
    </ClientOnly> -->
    </div>
  </TooltipProvider>
</template>
<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useSiteSettingsStore } from '~/stores/siteSettings'
import { useAuthStore } from '~/stores/auth'
import { usePageSeo } from '~/composables/usePageSeo'

const siteSettingsStore = useSiteSettingsStore()

const authStore = useAuthStore()

await siteSettingsStore.fetchSettings()
await authStore.initialize()

const { siteTitle, settings } = storeToRefs(siteSettingsStore)
const cart = useCart();
const compare = useCompare();
// Global loading overlay
const { isLoading, loadingTitle, loadingMessage } = useLoadingOverlay()

const seoTitle = computed(() => siteTitle.value)
const seoDescription = computed(() => settings.value?.description || "")
const seoImage = computed(() =>
  settings.value?.logo ||
  settings.value?.favicon ||
  settings.value?.noImageUrl ||
  ""
)

// watchEffect(() => {
//     cart.initialize?.();
//     compare.loadCompare?.();
// })
watch(
  () => [authStore.isAuthenticated, authStore.user?.id ?? null],
  ([isAuthenticated]) => {
    if (isAuthenticated) {
      cart.initialize();
      compare.loadCompare();
    }
   
  },
  { immediate: true }
);
usePageSeo({
  title: () => seoTitle.value,
  description: () => seoDescription.value,
  image: () => seoImage.value,
});
useHead(() => {
  const links: any[] = [];
  const currentSettings = settings.value;
  const favicon = currentSettings?.favicon;
  const mapStylesheet = currentSettings?.google_map_url;

  if (favicon) {
    links.push({ rel: "icon", type: "image/x-icon", href: favicon });
  }

  if (mapStylesheet) {
    links.push({ rel: "stylesheet", href: mapStylesheet });
  }

  return {
    title: seoTitle.value,
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "description", content: seoDescription.value },
      { name: "format-detection", content: "telephone=no" },
    ],
    link: links,
  };
});
</script>
