<template>
  <div
    class="flex min-h-dvh flex-col justify-center gap-8 !w-full items-center bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
  >
    <div class="relative">
      <!-- Animated background circles -->
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="w-64 h-64 bg-primary/10 rounded-full animate-pulse"></div>
      </div>
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="w-48 h-48 bg-primary/20 rounded-full animate-pulse animation-delay-200"></div>
      </div>
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="w-32 h-32 bg-primary/30 rounded-full animate-pulse animation-delay-400"></div>
      </div>
      
      <!-- Main loader container -->
      <div class="loader relative z-10">
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>

        <!-- Logo in center -->
        <div class="logo">
          <div class="logo-container">
            <img 
              v-if="siteSettingsStore?.settings?.logo" 
              :src="siteSettingsStore.settings.logo" 
              :alt="siteSettingsStore?.settings?.siteTitle || 'Loading'"
              class="w-20 h-20 object-contain animate-float"
            />
            <div v-else class="text-3xl font-bold text-primary animate-float">
              {{ siteSettingsStore?.settings?.siteTitle || 'Loading...' }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading text -->
    <div class="text-center space-y-2">
      <div class="text-lg font-medium text-gray-600 dark:text-gray-300 animate-pulse">
        {{ $t('common.loading') || 'Loading...' }}
      </div>
      <div class="flex items-center justify-center space-x-1">
        <div class="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
        <div class="w-2 h-2 bg-primary rounded-full animate-bounce animation-delay-100"></div>
        <div class="w-2 h-2 bg-primary rounded-full animate-bounce animation-delay-200"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const siteSettingsStore = useSiteSettingsStore()
</script>

<style scoped>
.loader { --size: 280px; --duration: 2s; height: var(--size); aspect-ratio: 1; position: relative; }
.loader .box { position: absolute; background: linear-gradient(135deg, color-mix(in srgb, var(--primary) 20%, transparent), color-mix(in srgb, var(--primary) 5%, transparent)); border-radius: 50%; border: 2px solid color-mix(in srgb, var(--primary) 30%, transparent); box-shadow: 0 0 20px color-mix(in srgb, var(--primary) 20%, transparent), inset 0 0 20px color-mix(in srgb, var(--primary) 10%, transparent); backdrop-filter: blur(10px); animation: ripple var(--duration) infinite ease-in-out; transition: all 0.3s ease; }
.loader .box:nth-child(1) { inset: 35%; z-index: 10; border-color: color-mix(in srgb, var(--primary) 60%, transparent); }
.loader .box:nth-child(2) { inset: 25%; z-index: 9; border-color: color-mix(in srgb, var(--primary) 50%, transparent); animation-delay: 0.2s; }
.loader .box:nth-child(3) { inset: 15%; z-index: 8; border-color: color-mix(in srgb, var(--primary) 40%, transparent); animation-delay: 0.4s; }
.loader .box:nth-child(4) { inset: 5%; z-index: 7; border-color: color-mix(in srgb, var(--primary) 30%, transparent); animation-delay: 0.6s; }
.loader .box:nth-child(5) { inset: -5%; z-index: 6; border-color: color-mix(in srgb, var(--primary) 20%, transparent); animation-delay: 0.8s; }
.loader .logo { position: absolute; inset: 0; display: grid; place-content: center; z-index: 100; }
.logo-container { animation: float 3s ease-in-out infinite; filter: drop-shadow(0 4px 20px color-mix(in srgb, var(--primary) 30%, transparent)); }
@keyframes ripple { 0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.8; } 50% { transform: scale(1.15) rotate(180deg); opacity: 1; } }
@keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
.animation-delay-100 { animation-delay: 100ms; }
.animation-delay-200 { animation-delay: 200ms; }
.animation-delay-400 { animation-delay: 400ms; }
* { transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease; }
</style>
