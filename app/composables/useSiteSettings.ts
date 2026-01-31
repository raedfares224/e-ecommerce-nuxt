// ~/stores/useSiteSettingsStore.ts
import { defineStore } from "pinia"
import { useApi } from "~/composables/useApi"
import { useToast } from "@/composables/useToast"
import { readonly, ref, computed } from "vue"

import type { SiteSettingsResponse, SiteSettings } from "~/types/site-settings"
import type { MenuResponse, DropdownMenuItem } from "~/types/menu"

export const useSiteSettings = defineStore("siteSettings", () => {
  const { get } = useApi()
  const toast = useToast()

  // 🔹 State
  const settings = ref<SiteSettings | null>(null)
  const menudata = ref<DropdownMenuItem[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 🔹 Actions
  const fetchSettings = async () => {
    // ✅ Prevent re-fetch if already loaded
    if (settings.value && menudata.value.length) return

    loading.value = true
    error.value = null

    try {
      // Fetch settings + menu concurrently
      const [settingsRes, menuRes] = await Promise.all([
        get<SiteSettingsResponse>("/site-settings"),
        get<MenuResponse>("/menu"),
      ])

      if (!settingsRes?.data || !menuRes?.data) {
        throw new Error("No data returned from API")
      }

      settings.value = settingsRes.data
      menudata.value = menuRes.data
    } catch (err: any) {
      error.value = err.message || "فشل في جلب إعدادات الموقع"
      toast.error(error.value)
    } finally {
      loading.value = false
    }
  }

  // 🔹 Getters
  const siteTitle = computed(() => settings.value?.siteTitle ?? "My Store")

  const colors = computed(() => ({
    website: settings.value?.website_color,
    navbar: settings.value?.navbar_color,
    footer: settings.value?.footer_color,
    navbarText: settings.value?.navbar_text_color,
    menuHoverColor: settings.value?.placingColorWhenPlacingMouseOnTheTopMenu,
    prices: settings.value?.prices_color,
    pricesBackground: settings.value?.prices_background_color,
    categoryText: settings.value?.category_text_color,
    footerText: settings.value?.footer_text_color,
    hover: settings.value?.hover_color,
    categoryTextTitle: settings.value?.category_text_color_title,
    categoryBackgroundTitle: settings.value?.category_background_color_title,
  }))

  const socialMedia = computed(() => ({
    facebook: settings.value?.facebook,
    twitter: settings.value?.twitter,
    instagram: settings.value?.instagram,
  }))

  const communication = computed(() => ({
    phone: settings.value?.phone,
    email: settings.value?.email,
    address: settings.value?.address,
    whatsapp: settings.value?.whatsapp,
  }))

  // 🔹 Expose state, actions, getters
  return {
    // state (readonly for safety)
    settings: readonly(settings),
    menudata: readonly(menudata),
    loading: readonly(loading),
    error: readonly(error),

    // actions
    fetchSettings,

    // getters
    siteTitle,
    colors,
    socialMedia,
    communication,
  }
})
