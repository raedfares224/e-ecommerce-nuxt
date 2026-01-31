<template>
  <div class="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-950 dark:via-blue-950 dark:to-indigo-950 p-4 relative overflow-hidden">
    <!-- Animated background elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s"></div>
    </div>
    
    <FormLogin />
  </div>
</template>

<script setup>
import FormLogin from "@/components/auth/FormLogin.vue"
import { useI18n } from "vue-i18n"

const { t } = useI18n()

useHead({
  title: t('auth.login'),
  meta: [
    { name: 'description', content: t('auth.loginDescription') }
  ]
})
</script>