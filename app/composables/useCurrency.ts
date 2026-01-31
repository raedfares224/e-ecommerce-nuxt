/**
 * Composable for managing currency formatting across the application
 * 
 * Usage:
 * const { formatPrice, currency, currencySymbol } = useCurrency()
 * formatPrice(19.99) // Returns: "$19.99"
 */

import { useI18n } from "vue-i18n"

 
export const useCurrency = () => {
  const { locale} = useI18n()
  const siteSettingsStore = useSiteSettings()
  const currency = computed(() => {
    const settings = siteSettingsStore.settings
    
    // 1. Check for explicit symbol from API
    const apiSymbol = (settings as any)?.currency_symbol || (settings as any)?.currencySymbol
    if (apiSymbol) return apiSymbol

    // 2. Check currency code from settings and map to symbol
    const code = settings?.currency?.toUpperCase()
    
    if (code) {
      // Common Currency Symbols Map
      const symbols: Record<string, string> = {
        USD: '$',
        EUR: '€',
        GBP: '£',
        JPY: '¥',
        RUB: '₽',
        TRY: '₺',
        INR: '₹',
        SAR: locale.value === 'ar' ? '﷼' : 'SAR',
        AED: locale.value === 'ar' ? 'د.إ' : 'AED',
        KWD: locale.value === 'ar' ? 'د.ك' : 'KWD',
        BHD: locale.value === 'ar' ? 'د.ب' : 'BHD',
        OMR: locale.value === 'ar' ? 'ر.ع' : 'OMR',
        QAR: locale.value === 'ar' ? 'ر.ق' : 'QAR',
        EGP: locale.value === 'ar' ? '£' : 'EGP',
        JOD: locale.value === 'ar' ? 'د.أ' : 'JOD',
      }

      // If locale is Arabic, we can return common symbols for western currencies too if desired,
      // but usually $ and € are used globally.
      
      if (symbols[code]) {
        return symbols[code]
      }
      
      // Return the code itself if no symbol found (e.g. 'AUD')
      return code
    }

    // 3. Fallback if no settings
    return locale.value === 'ar' ? '﷼' : 'SAR'
  })

  // Centralized currency symbol derived from settings or fallback
  const currencySymbol = computed(() => {
    return `${currency.value} `
  })
  
  /**
   * Format a price with the current currency symbol
   * @param price - The price to format (number or string)
   * @param decimals - Number of decimal places (default: 2)
   * @returns Formatted price string with currency symbol
   */
  const formatPrice = (price: number | string, decimals: number = 2): string => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price
    if (isNaN(numPrice)) return `${currencySymbol.value}0.00`
    return `${currencySymbol.value}${numPrice.toFixed(decimals)}`
  }
  
  /**
   * Format a price range (e.g., for min-max prices)
   * @param minPrice - Minimum price
   * @param maxPrice - Maximum price
   * @param decimals - Number of decimal places (default: 2)
   * @returns Formatted price range string
   */
  const formatPriceRange = (minPrice: number, maxPrice: number, decimals: number = 2): string => {
    return `${formatPrice(minPrice, decimals)} - ${formatPrice(maxPrice, decimals)}`
  }
  
  /**
   * Change the currency (useful for multi-currency support)
   * @param newCurrency - Currency code (e.g., 'USD', 'EUR', 'GBP')
   * @param newSymbol - Currency symbol (e.g., '$', '€', '£')
   */
  const setCurrency = (newCurrency: string, newSymbol: string) => {
    // Note: currency is a computed value derived from site settings.
    // To fully support runtime currency switching, integrate this with
    // the site settings store instead of mutating computed refs here.
    console.warn('[useCurrency] setCurrency is not implemented for mutating settings. Please update site settings store to change currency to', newCurrency, 'with symbol', newSymbol)
  }
  
  return {
    currency: readonly(currency),
    currencySymbol: readonly(currencySymbol),
    formatPrice,
    formatPriceRange,
    setCurrency
  }
}
