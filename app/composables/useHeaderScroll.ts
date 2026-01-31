import { ref, onMounted, watch } from 'vue'
import { useWindowScroll } from '@vueuse/core'

export function useHeaderScroll() {
  const headerRef = ref<HTMLElement | null>(null)
  const isHidden = ref(false)
  const isInitialDim = ref(true)
  const headerHeight = ref(0)
  const lastScrollY = ref(0)
  const { y } = useWindowScroll()

  onMounted(() => {
    if (headerRef.value) {
      headerHeight.value = headerRef.value.offsetHeight
    }

    // Initial fade effect: start hidden and then fade in smoothly
    setTimeout(() => {
      isInitialDim.value = false
    }, 150)

    // Header behavior:
    // - When scrolling down past header height: hide navbar (translate up)
    // - When scrolling slightly up: show navbar again
    // - Near top of page: navbar always visible
    watch(
      y,
      (currentY) => {
        if (!headerRef.value) return

        const delta = currentY - lastScrollY.value
        const threshold = 10 // minimum movement to consider direction change

        if (currentY <= headerHeight.value + 10) {
          // At top area: navbar visible
          isHidden.value = false
        } else {
          if (delta > threshold) {
            // Scrolling down -> hide navbar
            isHidden.value = true
          } else if (delta < -threshold) {
            // Scrolling up -> show navbar
            isHidden.value = false
          }
        }

        lastScrollY.value = currentY
      },
      { immediate: true }
    )
  })

  return {
    headerRef,
    isHidden,
    isInitialDim,
    headerHeight,
  }
}
