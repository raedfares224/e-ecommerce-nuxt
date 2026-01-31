<template>
  <div class="min-h-screen flex items-center justify-center bg-linear-to-br from-orange-50 via-red-50 to-pink-50 dark:from-gray-950 dark:via-orange-950 dark:to-red-950 p-4 relative overflow-hidden">
    <!-- Animated background elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-orange-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-red-400/20 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s"></div>
    </div>
    
    <FormForgotPassword />
  </div>
</template>

<script setup>
import FormForgotPassword from "@/components/auth/FormForgotPassword.vue"
import { useI18n } from "vue-i18n"

const { t } = useI18n()

useHead({
  title: t('auth.forgotPassword'),
  meta: [
    { name: 'description', content: t('auth.forgotPasswordMetaDescription') }
  ]
})
</script>
