import { useSiteSettingsStore } from '~/stores/siteSettings'

export const useSiteTheme = async () => {
  const store = useSiteSettingsStore()

  if (!store.settings) {
    await store.fetchSettings()
  }

  const colors = store.colors
  return colors
}
