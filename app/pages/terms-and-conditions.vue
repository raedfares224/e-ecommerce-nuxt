<template>
  <div class="min-h-[90vh] py-10 md:py-16 bg-background">
    <div class="container mx-auto px-4 max-w-4xl">
      <Card class="shadow-sm border border-border/60 bg-card">
        <CardContent class="p-6 md:p-10">
          <div class="flex flex-col gap-4 md:gap-6">
            <div class="space-y-2 text-center md:text-start">
              <p
                v-if="pageData?.subtitle"
                class="text-xs md:text-sm uppercase tracking-[0.2em] text-muted-foreground"
              >
                {{ pageData.subtitle }}
              </p>
              <h1 class="text-2xl md:text-3xl font-bold tracking-tight">
                {{ pageData?.title || t('footer.termsConditions') }}
              </h1>
            </div>

            <div v-if="isLoading" class="flex justify-center items-center py-10">
              <Loader2 class="w-6 h-6 animate-spin text-primary" />
            </div>

            <div v-else-if="errorMessage" class="rounded-md bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive">
              {{ errorMessage }}
            </div>

            <div v-else class="prose max-w-none dark:prose-invert prose-sm md:prose-base leading-relaxed">
              <p v-if="!pageData?.description" class="text-muted-foreground">
                {{ t('messages.noContent', 'لا يوجد محتوى متاح حالياً.') }}
              </p>
              <p v-else v-html="pageData.description" />
            </div>

            <div class="pt-4 flex justify-end">
              <Button variant="outline" size="sm" @click="goBack">
                {{ t('common.back', 'رجوع') }}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { Loader2 } from 'lucide-vue-next'
import { Card, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { apiFetch } from '~/api/useApiFetch'

interface TermsResponse {
  data: {
    title: string
    subtitle: string | null
    image: string | null
    description: string
  }
}

const { t } = useI18n()
const router = useRouter()

const isLoading = ref(true)
const errorMessage = ref('')
const pageData = ref<TermsResponse['data'] | null>(null)

definePageMeta({
  layout: 'default',
})

useHead(() => ({
  title: pageData.value?.title || t('footer.termsConditions'),
}))

const fetchTerms = async () => {
  isLoading.value = true
  errorMessage.value = ''

  const { data, error } = await apiFetch<TermsResponse>('/terms-and-condions')

  if (error) {
    console.error('Failed to fetch terms and conditions', error)
    errorMessage.value =
      error.message || t('messages.error', 'حدث خطأ أثناء جلب البيانات')
  } else if (!data?.data) {
    errorMessage.value = t('messages.noContent', 'لا يوجد محتوى متاح حالياً.')
  } else {
    pageData.value = data.data
  }

  isLoading.value = false
}

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}

onMounted(() => {
  fetchTerms()
})
</script>
