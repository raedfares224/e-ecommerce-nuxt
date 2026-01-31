import { ref, onMounted } from 'vue'

interface InstallResult {
  ok: boolean
  reason?: string
}

export function useAppInstall() {
  const canInstall = ref(false)
  const isInstalling = ref(false)
  const deferredPrompt = ref<any | null>(null)

  onMounted(() => {
    if (!import.meta.client) return

    window.addEventListener('beforeinstallprompt', (event: any) => {
      event.preventDefault()
      deferredPrompt.value = event
      canInstall.value = true
    })

    window.addEventListener('appinstalled', () => {
      canInstall.value = false
      deferredPrompt.value = null
    })
  })

  const install = async (): Promise<InstallResult> => {
    if (!deferredPrompt.value) {
      return { ok: false, reason: 'no_prompt' }
    }

    try {
      isInstalling.value = true
      const promptEvent = deferredPrompt.value
      await promptEvent.prompt()
      const choiceResult = await promptEvent.userChoice

      if (choiceResult.outcome === 'accepted') {
        return { ok: true }
      }

      return { ok: false, reason: 'dismissed' }
    } finally {
      isInstalling.value = false
    }
  }

  return {
    canInstall,
    isInstalling,
    install,
  }
}
