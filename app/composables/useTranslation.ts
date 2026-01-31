/**
 * Enhanced translation composable with common helpers
 * 
 * Usage:
 * const { t, tc, isRTL, switchLanguage } = useTranslation()
 */

import { useI18n } from "vue-i18n"

export const useTranslation = () => {
  const { t, locale } = useI18n()
  const { $setLocale } = useNuxtApp()
  
  /**
   * Check if current language is RTL
   */
  const isRTL = computed(() => locale.value === 'ar')
  
  /**
   * Check if current language is English
   */
  const isEnglish = computed(() => locale.value === 'en')
  
  /**
   * Check if current language is Arabic
   */
  const isArabic = computed(() => locale.value === 'ar')
  
  /**
   * Get current language code
   */
  const currentLanguage = computed(() => locale.value)
  
  /**
   * Switch to a specific language
   * @param lang - Language code ('en' or 'ar')
   * Note: This will trigger API refetch automatically via i18n plugin watcher
   */
  const switchLanguage = (lang: 'en' | 'ar') => {
    if (locale.value === lang) return // Skip if already in this language
    $setLocale(lang)
  }
  
  /**
   * Toggle between English and Arabic
   * Note: This will trigger API refetch automatically via i18n plugin watcher
   */
  const toggleLanguage = () => {
    const newLang = locale.value === 'en' ? 'ar' : 'en'
    $setLocale(newLang)
  }
  
  /**
   * Translate with choice (for pluralization)
   * @param key - Translation key
   * @param choice - Number for pluralization
   * @param values - Additional values
   */
  const tc = (key: string, choice: number, values?: Record<string, any>) => {
    return t(key, { count: choice, ...values })
  }
  
  /**
   * Common translation shortcuts
   */
  const common = {
    shopNow: computed(() => t('common.shopNow')),
    addToCart: computed(() => t('common.addToCart')),
    quickView: computed(() => t('common.quickView')),
    addToWishlist: computed(() => t('common.addToWishlist')),
    compare: computed(() => t('common.compare')),
    viewAll: computed(() => t('common.viewAll')),
    loading: computed(() => t('common.loading')),
    save: computed(() => t('common.save')),
    cancel: computed(() => t('common.cancel')),
    submit: computed(() => t('common.submit')),
  }
  
  /**
   * Auth translation shortcuts
   */
  const auth = {
    login: computed(() => t('auth.login')),
    register: computed(() => t('auth.register')),
    logout: computed(() => t('auth.logout')),
    profile: computed(() => t('auth.profile')),
    welcome: computed(() => t('auth.welcome')),
    hello: computed(() => t('auth.hello')),
    signIn: computed(() => t('auth.signIn')),
  }
  
  /**
   * Product translation shortcuts
   */
  const product = {
    featuredProducts: computed(() => t('product.featuredProducts')),
    allProducts: computed(() => t('product.allProducts')),
    topSelling: computed(() => t('product.topSelling')),
    topRated: computed(() => t('product.topRated')),
    bestSellers: computed(() => t('product.bestSellers')),
    price: computed(() => t('product.price')),
    inStock: computed(() => t('product.inStock')),
    outOfStock: computed(() => t('product.outOfStock')),
  }
  
  return {
    // Core i18n
    t,
    tc,
    locale,
    
    // Language info
    isRTL,
    isEnglish,
    isArabic,
    currentLanguage,
    
    // Language switching
    switchLanguage,
    toggleLanguage,
    
    // Shortcuts
    common,
    auth,
    product,
  }
}
