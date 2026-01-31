// ~/composables/useCompare.ts
import { ref, computed } from "vue"
import { useI18n } from "vue-i18n"
import { useToast } from "@/composables/useToast"

export interface CompareItem {
  id: number
  slug: string
  name: string
  en_name?: string
  ar_name?: string
  price: number
  image: string
  category?: string
  brand?: string
  rating?: number
  reviewsCount?: number
  quantity?: number
  inStock?: boolean
  oldPrice?: number
  discount?: number
}

const COMPARE_STORAGE_KEY = "compare_items"

// shared state
const compareItems = ref<CompareItem[]>([])

export const useCompare = () => {
  const localeCookie = useCookie<"en" | "ar">("locale")
  const { t } = useI18n()
  const toast = useToast()

  const applyLocalizedNames = () => {
    const isAr = localeCookie.value === "ar"
    compareItems.value = compareItems.value.map((item: any) => {
      const en_name = item.en_name ?? item.name
      const ar_name = item.ar_name ?? item.name
      return {
        ...item,
        en_name,
        ar_name,
        name: isAr ? ar_name : en_name,
      } as CompareItem & { en_name: string; ar_name: string }
    })
  }

  const loadCompare = () => {
    if (typeof window === "undefined") return
    try {
      let stored = localStorage.getItem(COMPARE_STORAGE_KEY)

      if (!stored) {
        const storedEn = localStorage.getItem(`${COMPARE_STORAGE_KEY}_en`)
        const storedAr = localStorage.getItem(`${COMPARE_STORAGE_KEY}_ar`)

        if (storedEn || storedAr) {
          const items: any[] = []
          if (storedEn) {
            try {
              items.push(...JSON.parse(storedEn))
            } catch {}
            localStorage.removeItem(`${COMPARE_STORAGE_KEY}_en`)
          }
          if (storedAr) {
            try {
              items.push(...JSON.parse(storedAr))
            } catch {}
            localStorage.removeItem(`${COMPARE_STORAGE_KEY}_ar`)
          }

          const uniqueById: Record<number, any> = {}
          for (const it of items) {
            if (!it || typeof it.id === "undefined") continue
            uniqueById[Number(it.id)] = it
          }
          compareItems.value = Object.values(uniqueById) as any[]
          localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(compareItems.value))
        }
      } else {
        compareItems.value = JSON.parse(stored)
      }

      applyLocalizedNames()
    } catch (error) {
      console.error("Failed to load compare items from localStorage", error)
      compareItems.value = []
    }
  }

  const saveCompare = () => {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(compareItems.value))
    } catch (error) {
      console.error("Failed to save compare items to localStorage", error)
    }
  }

  const addToCompare = (item: CompareItem) => {
    const exists = compareItems.value.some((i) => i.id === item.id)
    if (exists) {
      toast?.info?.(t("messages.alreadyInCompare") || "Product already in compare list", item.name)
      return { success: false, message: "already_in_compare" }
    }
    compareItems.value.push(item)
    saveCompare()
    toast?.success?.(t("messages.addedToCompare") || "Added to compare", item.name)
    return { success: true, message: "added_to_compare" }
  }

  const removeFromCompare = (itemId: number) => {
    const index = compareItems.value.findIndex((i) => i.id === itemId)
    if (index !== -1) {
      const [removed] = compareItems.value.splice(index, 1)
      saveCompare()
      toast?.success?.(
        t("messages.removedFromCompare") || "Removed from compare",
        removed?.name || ""
      )
      return { success: true, message: "removed_from_compare" }
    }
    return { success: false, message: "not_found" }
  }

  const clearCompare = () => {
    compareItems.value = []
    saveCompare()
  }

  const isInCompare = (itemId: number) =>
    compareItems.value.some((i) => i.id === itemId)

  const compareCount = computed(() => compareItems.value.length)

  return {
    compareItems,
    compareCount,
    loadCompare,
    addToCompare,
    removeFromCompare,
    clearCompare,
    isInCompare,
  }
}
