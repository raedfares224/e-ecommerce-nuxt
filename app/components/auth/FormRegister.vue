<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod"
import { useForm } from "vee-validate"
import * as z from "zod"
import { Facebook, Loader2, Eye, EyeOff } from "lucide-vue-next"
import { ref } from "vue"
import { useI18n } from "vue-i18n"
import { toast } from "vue-sonner"
import { useRouter } from "#app"
import { useAuthStore } from "~/stores/auth"
import { apiFetch } from "~/api/useApiFetch"

import { Button } from "@/components/ui/button"
import GoogleLoginButton from "~/components/GoogleLoginButton.vue"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const isLoading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const { t } = useI18n()
const authStore = useAuthStore()
const router = useRouter()

const formSchema = toTypedSchema(z.object({
  name: z.string().min(1, t("validation.required")),
  email: z.string().min(1, t("validation.required")).email(t("validation.email")),
  mobile: z.string().min(1, t("validation.required")),
  password: z.string().min(1, t("validation.required")),
  confirmPassword: z.string().min(1, t("validation.required")),
}).refine((data) => data.password === data.confirmPassword, {
  message: t("validation.passwordsDontMatch"),
  path: ["confirmPassword"],
}))

const { isFieldDirty, handleSubmit } = useForm({
  validationSchema: formSchema,
})

const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true
  try {
    const payload = {
      name: values.name,
      email: values.email,
      mobile: values.mobile,
      password: values.password,
      username: values.name,
    }

    const { data, error } = await apiFetch<any>("/register", {
      method: "POST",
      body: payload,
    })

    if (error) {
      throw new Error(error.message || "Registration failed")
    }

    if (data && (data as any).data) {
      const userData = (data as any).data
      authStore.setToken(userData.token)
      authStore.setUser(userData)

      toast.success(t("messages.registerSuccess"), {
        description: t("auth.welcomeAboard"),
      })

      await router.push("/")
    }
  } catch (error: any) {
    toast.error(t("auth.registerFailed"), {
      description: error?.message || t("auth.registerFailedDescription"),
    })
  } finally {
    isLoading.value = false
  }
})

const registerWithGoogle = () => {
  toast.info({
    title: t("common.comingSoon"),
    description: t("auth.socialLoginComingSoon"),
  })
}

const registerWithFacebook = () => {
  toast.info({
    title: t("common.comingSoon"),
    description: t("auth.socialLoginComingSoon"),
  })
  // TODO: Implement Facebook OAuth
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4">
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

    <div class="w-full max-w-6xl  grid  gap-8 items-center">
      <!-- Form Section -->
      <div class="w-full max-w-md mx-auto bg-white lg:mx-0 p-8 lg:p-12 rounded-3xl shadow-xl">
        <!-- Header -->
        <div class="mb-8">
          <h2 class="text-2xl lg:text-3xl font-bold text-gray-700 dark:text-gray-200 mb-2">
            {{ $t('auth.createAccount') }}
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ $t('auth.alreadyHaveAccount') }} 
            <NuxtLink
              to="/auth/login"
              class="text-teal-600 dark:text-teal-400 hover:underline font-medium"
            >
              {{ $t('auth.signIn') }}
            </NuxtLink>
          </p>
        </div>

        <!-- Social Register Buttons -->
          <div class="grid grid-cols-2 gap-3 mb-6">
          <GoogleLoginButton class="h-11" />

          <Button
            type="button"
            variant="outline"
            class="h-11 border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            @click="registerWithFacebook"
          >
            <Facebook class="w-5 h-5 text-blue-600" />
            Facebook
          </Button>
        </div>

        <!-- Divider -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-200 dark:border-gray-700"></div>
          </div>
          <div class="relative flex justify-center text-xs">
            <span class="px-3 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              {{ $t('auth.orSignUpWithEmail') }}
            </span>
          </div>
        </div>

        <!-- Register Form -->
        <form class="space-y-4" @submit="onSubmit">
          <FormField v-slot="{ componentField }" name="name" :validate-on-blur="!isFieldDirty">
            <FormItem>
              <FormLabel class="text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ $t('auth.fullName') }}
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  :placeholder="$t('auth.fullNamePlaceholder')"
                  class="h-11 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage class="text-red-500 text-xs" />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="email" :validate-on-blur="!isFieldDirty">
            <FormItem>
              <FormLabel class="text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ $t('auth.email') }}
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  :placeholder="$t('auth.emailPlaceholder')"
                  class="h-11 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage class="text-red-500 text-xs" />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="mobile" :validate-on-blur="!isFieldDirty">
            <FormItem>
              <FormLabel class="text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ $t('auth.mobile') }}
              </FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  :placeholder="$t('auth.mobile')"
                  class="h-11 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage class="text-red-500 text-xs" />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="password" :validate-on-blur="!isFieldDirty">
            <FormItem>
              <FormLabel class="text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ $t('auth.password') }}
              </FormLabel>
              <FormControl>
                <div class="relative">
                  <Input
                    :type="showPassword ? 'text' : 'password'"
                    :placeholder="$t('auth.passwordPlaceholder')"
                    class="h-11 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 pr-10"
                    v-bind="componentField"
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <Eye v-if="!showPassword" class="w-4 h-4" />
                    <EyeOff v-else class="w-4 h-4" />
                  </button>
                </div>
              </FormControl>
              <FormMessage class="text-red-500 text-xs" />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="confirmPassword" :validate-on-blur="!isFieldDirty">
            <FormItem>
              <FormLabel class="text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ $t('auth.confirmPassword') }}
              </FormLabel>
              <FormControl>
                <div class="relative">
                  <Input
                    :type="showConfirmPassword ? 'text' : 'password'"
                    :placeholder="$t('auth.confirmPasswordPlaceholder')"
                    class="h-11 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 pr-10"
                    v-bind="componentField"
                  />
                  <button
                    type="button"
                    @click="showConfirmPassword = !showConfirmPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <Eye v-if="!showConfirmPassword" class="w-4 h-4" />
                    <EyeOff v-else class="w-4 h-4" />
                  </button>
                </div>
              </FormControl>
              <FormMessage class="text-red-500 text-xs" />
            </FormItem>
          </FormField>

          <Button
            type="submit"
            class="w-full h-12 bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-semibold mt-6"
            :disabled="isLoading"
          >
            <Loader2 v-if="isLoading" class="w-5 h-5 mr-2 animate-spin" />
            {{ isLoading ? $t('auth.creatingAccount') : $t('auth.createAccount') }}
          </Button>
        </form>
      </div>
    </div>
  </div>
</template>
