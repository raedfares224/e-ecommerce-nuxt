// plugins/theme.client.ts
import { defineNuxtPlugin } from '#app'
import { storeToRefs } from 'pinia'
import { useSiteSettingsStore } from '~/stores/siteSettings'

export default defineNuxtPlugin(() => {
  const store = useSiteSettingsStore()
  const { colors, settings } = storeToRefs(store)

  // ✅ شغّل بعد تهيئة Nuxt (بعد استعادة الـ state)
  onNuxtReady(() => {
    watch(colors, (newColors) => {
      if (!settings.value) return // لا تفعل شيء قبل وجود إعدادات فعلاً

      const root = document.documentElement
      for (const [key, value] of Object.entries(newColors)) {
        if (value) {
          if(key === 'website'){
            root.style.setProperty(`--primary`, value)
          }
          root.style.setProperty(`--color-${key}`, value)}
      }
    }, { immediate: true })
  })
})
