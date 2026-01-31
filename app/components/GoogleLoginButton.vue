<template>
  <button
    type="button"
    class="w-full inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
    @click="loginWithGoogle"
  >
    <img
      src="/google.png"
      alt="Google"
      width="18"
      height="18"
      class="shrink-0"
    />
    <span class="truncate">
      Google
    </span>
  </button>
</template>

<script setup lang="ts">
// زر تسجيل الدخول بجوجل
// تعليق عربي بسيط لشرح الوظيفة

import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGoogleAuth } from '~/composables/useGoogleAuth'

const props = defineProps<{ label?: string }>()

const { t } = useI18n()
const { getGoogleLoginUrl } = useGoogleAuth()

const label = computed(() => props.label || t('auth.loginWithGoogle') || 'Continue with Google')

const loginWithGoogle = async () => {
  try {
    const url = await getGoogleLoginUrl()
    // فتح رابط جوجل في نفس التبويب
    if (process.client) {
      window.location.href = url
    }
  } catch (error) {
    // يمكن لاحقاً إضافة توست أو تسجيل الخطأ
    console.error('Google login error', error)
  }
}
</script>
