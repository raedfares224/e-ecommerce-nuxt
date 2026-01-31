/**
 * Plugin to automatically show page loader during route transitions
 */
export default defineNuxtPlugin((nuxtApp) => {
  const { startLoading, finishLoading } = usePageLoader()
  const router = useRouter()

  // Hook into router navigation events
  router.beforeEach((to, from) => {
    if (to.path !== from.path) {
      startLoading()
    }
  })

  router.afterEach(() => {
    finishLoading()
  })

  // Also hook into Nuxt page events as fallback
  nuxtApp.hook('page:start', () => {
    startLoading()
  })

  nuxtApp.hook('page:finish', () => {
    finishLoading()
  })

  // Handle errors
  nuxtApp.hook('vue:error', () => {
    finishLoading()
  })
})
