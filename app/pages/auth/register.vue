<template>
  <div class="min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-950 dark:via-green-950 dark:to-emerald-950 p-4 relative overflow-hidden">
    <!-- Animated background elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-green-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s"></div>
    </div>
    
    <FormRegister />
  </div>
</template>

<script setup>
import FormRegister from "@/components/auth/FormRegister.vue"
import { useI18n } from "vue-i18n"

const { t } = useI18n()

useHead({
  title: t('auth.register'),
  meta: [
    { name: 'description', content: t('auth.registerDescription') }
  ]
})
</script>
