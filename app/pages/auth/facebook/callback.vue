<template>
  <div class="min-h-screen flex items-center justify-center px-4">
    <div v-if="loading" class="flex flex-col items-center justify-center text-center space-y-4">
      <div class="w-12 h-12 border-4 border-current border-t-transparent rounded-full animate-spin" />
      <p class="text-base font-medium">
        {{ $t('auth.facebookRedirecting') || $t('auth.redirecting') }}
      </p>
    </div>

    <div v-else class="w-full max-w-md">
      <div class="border rounded-xl p-6 shadow-sm space-y-3">
        <h1 class="text-lg font-semibold">
          {{ $t('auth.loginFailed') || 'فشل تسجيل الدخول' }}
        </h1>
        <p class="text-sm">
          {{ errorMessage || $t('auth.facebookAuthFailedDescription') || $t('auth.loginFailedDescription') }}
        </p>
        <div class="flex gap-3 mt-4">
          <button
            type="button"
            class="flex-1 inline-flex items-center justify-center px-4 py-2 rounded-md border text-sm font-medium transition hover:bg-gray-100"
            @click="retry"
          >
            {{ $t('common.retry') || 'إعادة المحاولة' }}
          </button>
          <NuxtLink
            to="/auth/login"
            class="flex-1 inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition hover:bg-gray-100 text-center"
          >
            {{ $t('auth.backToLogin') || 'العودة لتسجيل الدخول' }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// صفحة كول باك فيسبوك
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from '#app'
import { useI18n } from 'vue-i18n'
import { useFacebookAuth } from '~/composables/useFacebookAuth'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const { handleFacebookCallback } = useFacebookAuth()

const loading = ref(true)
const errorMessage = ref<string | null>(null)

const processCallback = async () => {
  try {
    const code = route.query.code as string | undefined

    if (!code) {
      throw new Error(t('auth.facebookMissingAuthorizationCode'))
    }

    await handleFacebookCallback(code)

    await router.push('/')
  } catch (error: any) {
    errorMessage.value = error?.message || t('auth.facebookAuthFailed')
  } finally {
    loading.value = false
  }
}

const retry = () => {
  loading.value = true
  errorMessage.value = null
  processCallback()
}

onMounted(() => {
  processCallback()
})
</script>
