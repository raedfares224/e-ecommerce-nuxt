<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod"
import { useForm } from "vee-validate"
import * as z from "zod"
import { ArrowLeft, Loader2 } from "lucide-vue-next"
import { ref } from "vue"
import { useI18n } from "vue-i18n"
import { toast } from "vue-sonner"

import { apiFetch } from "~/api/useApiFetch"

import { Button } from "@/components/ui/button"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
const isLoading = ref(false)
const emailSent = ref(false)
const { t } = useI18n()

const formSchema = toTypedSchema(z.object({
  username: z.string().min(1, t("validation.required")),
}))

const { isFieldDirty, handleSubmit } = useForm({
  validationSchema: formSchema,
})

const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true
  try {
    const { data, error } = await apiFetch<any>("/forgot", {
      method: "POST",
      body: {
        username: values.username,
      },
    })

    if (error) {
      throw new Error(error.message || t("auth.resetEmailFailed"))
    }

    if (data) {
      emailSent.value = true
      toast.success(t("auth.resetEmailSent"), {
        description: t("auth.resetEmailSentDescription"),
      })
    }
  } catch (error: any) {
    toast.error(t("auth.resetEmailFailed"), {
      description: error?.message || t("auth.resetEmailFailedDescription"),
    })
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br flex items-center justify-center p-4">
    <!-- Decorative elements -->
    <div class="absolute top-10 left-10 w-20 h-20 opacity-20">
      <svg viewBox="0 0 100 100" class="text-purple-400">
        <polygon points="50,10 90,90 10,90" stroke="currentColor" stroke-width="2" fill="none"/>
      </svg>
    </div>
    <div class="absolute top-8 left-16 w-3 h-3 bg-pink-400 rounded-full opacity-40"></div>
    <div class="absolute top-12 right-20 w-2 h-2 bg-blue-400 rounded-full opacity-40"></div>
    <div class="absolute bottom-20 left-32 w-2 h-2 bg-yellow-400 rounded-full opacity-40"></div>
    <div class="absolute top-1/4 right-10 w-3 h-3 bg-purple-400 rounded-full opacity-40"></div>

    <div class="w-full max-w-6xl grid  items-center">
      <!-- Form Section -->
      <div class="w-full max-w-md mx-auto lg:mx-0 p-8 lg:p-12 bg-white dark:bg-gray-800 rounded-3xl shadow-xl">
        <!-- Header -->
        <div class="mb-8">
          <h2 class="text-2xl lg:text-3xl font-bold text-gray-700 dark:text-gray-200 mb-2">
            {{ emailSent ? $t('auth.checkYourEmail') : $t('auth.forgotPasswordTitle') }}
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ emailSent ? $t('auth.resetEmailSentDescriptionShort') : $t('auth.forgotPasswordDescription') }}
          </p>
        </div>

        <!-- Success Message -->
        <div v-if="emailSent" class="space-y-6">
          <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div class="flex items-start">
              <div class="shrink-0">
                <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-green-800 dark:text-green-200">
                  {{ $t('auth.resetEmailSent') }}
                </h3>
                <p class="mt-2 text-sm text-green-700 dark:text-green-300">
                  {{ $t('auth.resetEmailSentFull') }}
                </p>
              </div>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            class="w-full h-12 text-base font-medium"
            @click="emailSent = false"
          >
            <ArrowLeft class="w-5 h-5 mr-2" />
            {{ $t('auth.sendAnotherEmail') }}
          </Button>

          <div class="text-center">
            <NuxtLink
              to="/auth/login"
              class="text-sm text-teal-600 dark:text-teal-400 hover:underline font-medium inline-flex items-center"
            >
              <ArrowLeft class="w-4 h-4 mr-1" />
              {{ $t('auth.backToLogin') }}
            </NuxtLink>
          </div>
        </div>

        <!-- Forgot Password Form -->
        <form v-else class="space-y-6" @submit="onSubmit">
          <FormField v-slot="{ componentField }" name="username" :validate-on-blur="!isFieldDirty">
            <FormItem>
              <FormLabel class="text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ $t('auth.emailOrUsername') }}
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  :placeholder="$t('auth.emailOrUsernamePlaceholder')"
                  class="h-11 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage class="text-red-500 text-xs" />
            </FormItem>
          </FormField>

          <Button
            type="submit"
            class="w-full h-12 bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-semibold"
            :disabled="isLoading"
          >
            <Loader2 v-if="isLoading" class="w-5 h-5 mr-2 animate-spin" />
            {{ isLoading ? $t('auth.sending') : $t('auth.sendResetLink') }}
          </Button>

          <div class="text-center">
            <NuxtLink
              to="/auth/login"
              class="text-sm text-teal-600 dark:text-teal-400 hover:underline font-medium inline-flex items-center"
            >
              <ArrowLeft class="w-4 h-4 mr-1" />
              Back to login
            </NuxtLink>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
