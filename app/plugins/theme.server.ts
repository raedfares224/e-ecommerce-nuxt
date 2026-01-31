// plugins/theme.server.ts
import { defineNuxtPlugin, useHead } from '#app'
import { useSiteSettingsStore } from '~/stores/siteSettings'

export default defineNuxtPlugin(() => {
  const siteSettingsStore = useSiteSettingsStore()
  const colors = siteSettingsStore.colors?.value || {}
  const cssVars = Object.entries(colors)
    .map(([key, value]) => (value ? `--${key}: ${value};` : ''))
    .join(' ')

  if (cssVars) {
    useHead({
      style: [
        {
          children: `:root { ${cssVars} }`
        }
      ]
    })
  }
})
