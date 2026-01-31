<template>
  <div class="min-h-screen flex items-center justify-center px-4">
    <div v-if="loading" class="flex flex-col items-center justify-center text-center space-y-4">
      <!-- واجهة تحميل بسيطة -->
      <div class="w-12 h-12 border-4 border-current border-t-transparent rounded-full animate-spin" />
      <p class="text-base font-medium">
        {{ $t('auth.redirecting') || 'جارٍ إكمال تسجيل الدخول...' }}
      </p>
    </div>

    <div v-else class="w-full max-w-md">
      <!-- بطاقة خطأ ودية -->
      <div class="border rounded-xl p-6 shadow-sm space-y-3">
        <h1 class="text-lg font-semibold">
          {{ $t('auth.loginFailed') || 'فشل تسجيل الدخول' }}
        </h1>
        <p class="text-sm">
          {{ errorMessage || $t('auth.loginFailedDescription') || 'حدث خطأ أثناء التحقق من حساب جوجل، حاول مرة أخرى.' }}
        </p>
        <div class="flex gap-3 mt-4">
          <button
            type="button"
            class="flex-1 inline-flex items-center justify-center px-4 py-2 rounded-md border text-sm font-medium transition hover:bg-gray-100"
            @click="retry"
          >
            <!-- إعادة المحاولة -->
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
// صفحة كول باك جوجل
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from '#app'
import { useI18n } from 'vue-i18n'
import { useGoogleAuth } from '~/composables/useGoogleAuth'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const { handleGoogleCallback } = useGoogleAuth()

const loading = ref(true)
const errorMessage = ref<string | null>(null)

// محاولة معالجة الكود القادم من جوجل
const processCallback = async () => {
  try {
    const code = route.query.code as string | undefined

    if (!code) {
      throw new Error(t('auth.missingAuthorizationCode'))
    }

    // نحاول إتمام تسجيل الدخول عبر Google
    await handleGoogleCallback(code)

    // في حالة النجاح نوجه المستخدم للصفحة الرئيسية
    await router.push('/')
  } catch (error: any) {
    errorMessage.value = error?.message || t('auth.googleAuthFailed')
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
