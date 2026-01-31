/**
 * Composable for managing global loading overlay
 * 
 * Usage:
 * const { showLoading, hideLoading } = useLoadingOverlay()
 * showLoading('Loading...', 'Please wait')
 */

const isLoading = ref(false)
const loadingTitle = ref('Loading...')
const loadingMessage = ref('Please wait while we load your content')

export const useLoadingOverlay = () => {
  /**
   * Show loading overlay
   * @param title - Loading title
   * @param message - Loading message
   */
  const showLoading = (title?: string, message?: string) => {
    if (title) loadingTitle.value = title
    if (message) loadingMessage.value = message
    isLoading.value = true
  }

  /**
   * Hide loading overlay
   */
  const hideLoading = () => {
    isLoading.value = false
  }

  /**
   * Show loading with promise
   * Automatically hides when promise resolves/rejects
   * @param promise - Promise to wait for
   * @param title - Loading title
   * @param message - Loading message
   */
  const showLoadingWithPromise = async <T>(
    promise: Promise<T>,
    title?: string,
    message?: string
  ): Promise<T> => {
    showLoading(title, message)
    try {
      const result = await promise
      return result
    } finally {
      hideLoading()
    }
  }

  return {
    isLoading: readonly(isLoading),
    loadingTitle: readonly(loadingTitle),
    loadingMessage: readonly(loadingMessage),
    showLoading,
    hideLoading,
    showLoadingWithPromise
  }
}
