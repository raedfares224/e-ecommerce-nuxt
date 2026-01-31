/**
 * Composable for managing global page loading state
 * 
 * Usage:
 * const { startLoading, finishLoading, stopLoading } = usePageLoader()
 * 
 * startLoading('Loading product...')
 * // ... async operation
 * finishLoading()
 */

export const usePageLoader = () => {
  const isLoading = useState<boolean>('pageLoader:isLoading', () => false)
  const progress = useState<number>('pageLoader:progress', () => 0)
  const message = useState<string>('pageLoader:message', () => '')

  let progressInterval: NodeJS.Timeout | null = null

  const startLoading = (loadingMessage?: string) => {
    isLoading.value = true
    progress.value = 0
    message.value = loadingMessage || 'Loading...'
    
    // Simulate progress
    if (progressInterval) clearInterval(progressInterval)
    
    progressInterval = setInterval(() => {
      if (progress.value < 90) {
        progress.value += Math.random() * 10
      }
    }, 200)
  }

  const finishLoading = () => {
    progress.value = 100
    
    setTimeout(() => {
      isLoading.value = false
      progress.value = 0
      message.value = ''
      
      if (progressInterval) {
        clearInterval(progressInterval)
        progressInterval = null
      }
    }, 300)
  }

  const stopLoading = () => {
    isLoading.value = false
    progress.value = 0
    message.value = ''
    
    if (progressInterval) {
      clearInterval(progressInterval)
      progressInterval = null
    }
  }

  return {
    isLoading: readonly(isLoading),
    progress: readonly(progress),
    message: readonly(message),
    startLoading,
    finishLoading,
    stopLoading
  }
}
