// plugins/i18n.ts
import { createI18n } from "vue-i18n";
import en from "@/locales/en.json";
import ar from "@/locales/ar.json";

export default defineNuxtPlugin((nuxtApp) => {
  // 1. Grab (or create) our locale cookie; default must be a function
  const localeCookie = useCookie<"en" | "ar">("locale", {
    default: () => "en",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });

  // 2. Resolve initial locale
  let initialLocale = localeCookie.value!;
  if (typeof window !== "undefined" && !localeCookie.value) {
    // only runs if cookie truly unset (on client)
    initialLocale = navigator.language.startsWith("ar") ? "ar" : "en";
    localeCookie.value = initialLocale;
  }

  // 3. Create vue-i18n
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: initialLocale,
    fallbackLocale: "en",
    messages: { en, ar },
  });
  nuxtApp.vueApp.use(i18n);

  // 4. Emit correct <html> attrs during SSR/hydration
  useHead({
    htmlAttrs: {
      lang: initialLocale,
      dir: initialLocale === "ar" ? "rtl" : "ltr",
    },
  });

  // 5. Watch cookie on client to update both i18n and DOM
  if (typeof window !== "undefined") {
    watch(
      () => localeCookie.value,
      async (newLocale, oldLocale) => {
        if (!newLocale) return;
        
        // Update i18n and DOM
        i18n.global.locale.value = newLocale;
        document.documentElement.lang = newLocale;
        document.documentElement.dir = newLocale === "ar" ? "rtl" : "ltr";
        
        // Refetch API data when language changes (skip on initial load)
        if (oldLocale && oldLocale !== newLocale) {
          
          // Show loading overlay
          const { showLoading } = useLoadingOverlay();
          const loadingTitle = newLocale === 'ar' ? 'جاري التحميل...' : 'Loading...';
          const loadingMessage = newLocale === 'ar' 
            ? 'جاري تحميل المحتوى باللغة العربية...' 
            : 'Loading content in English...';
          
          showLoading(loadingTitle, loadingMessage);
          
          // Get stores and refetch data
          const siteSettingsStore = useSiteSettingsStore();
          
          try {
            // Refetch site settings, menu, and featured categories
            await siteSettingsStore.refetchSettings();
            
            // Small delay to show loading animation
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Reload the page to refetch all data with new language
            // This ensures all components get fresh data
            window.location.reload();
          } catch (error) {
            console.error("Failed to refetch data after language change:", error);
            // Hide loading on error
            const { hideLoading } = useLoadingOverlay();
            hideLoading();
          }
        }
      },
    );
  }

  // 6. Provide a helper to switch locale
  return {
    provide: {
      setLocale: (loc: "en" | "ar") => {
        localeCookie.value = loc;
      },
    },
  };
});
