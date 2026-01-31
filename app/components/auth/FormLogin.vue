<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod"
import { useForm } from "vee-validate"
import * as z from "zod"
import { Loader2, Eye, EyeOff,Facebook } from "lucide-vue-next"
import { ref } from "vue"
import { useRouter } from "#app"
import { toast } from "vue-sonner"
import { useI18n } from "vue-i18n"
import { useAuthStore } from "~/stores/auth"
import { useFacebookAuth } from "~/composables/useFacebookAuth"

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
import { Checkbox } from "@/components/ui/checkbox"

const authStore = useAuthStore()
const router = useRouter()
const { getFacebookLoginUrl } = useFacebookAuth()
const rememberMe = ref(false)
const showPassword = ref(false)
const { t } = useI18n()

const formSchema = toTypedSchema(z.object({
  username: z.string().min(1, t("validation.required")),
  password: z.string().min(1, t("validation.required")),
}))

const { isFieldDirty, handleSubmit } = useForm({
  validationSchema: formSchema,
})

const onSubmit = handleSubmit(async (values) => {
  try {
    const result = await authStore.login({
      username: values.username,
      password: values.password,
    })
    
    if (result.success) {
      toast.success(t("messages.loginSuccess"), {
        description: t("auth.welcomeBack", { name: result.data.name }),
      })
      
      // Redirect to home or dashboard
      await router.push("/")
    }
  } catch (error: any) {
    toast.error(t("auth.loginFailed"), {
      description: error.message || t("auth.loginFailedDescription"),
    })
  }
})

const loginWithFacebook = async () => {
  try {
    const url = await getFacebookLoginUrl()

    if (!url) {
      throw new Error("Facebook login URL not available")
    }

    if (typeof window !== "undefined") {
      window.location.href = url
    }
  } catch (error: any) {
    console.error("Facebook login error:", error)
    toast.error(t("auth.loginFailed"), {
      description: error.message || t("auth.socialLoginComingSoon"),
    })
  }
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

    <div class="w-full max-w-6xl grid items-center">
      <!-- Form Section -->
      <div class="w-full max-w-md mx-auto lg:mx-0 p-8 lg:p-12 bg-white dark:bg-gray-800 rounded-3xl shadow-xl">
        <!-- Header -->
        <div class="mb-8">
          <h2 class="text-2xl lg:text-3xl font-bold text-gray-700 dark:text-gray-200 mb-2">
            {{ $t('auth.loginToStore') }}
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ $t('auth.dontHaveAccount') }} 
            <NuxtLink
              to="/auth/register"
              class="text-teal-600 dark:text-teal-400 hover:underline font-medium"
            >
              {{ $t('auth.createFreeAccount') }}
            </NuxtLink>
          </p>
        </div>

        <!-- Social Login Buttons -->
        <div class="grid grid-cols-2 gap-3 mb-6">
          <GoogleLoginButton class="h-11" />

          <Button
            type="button"
            variant="outline"
            class="h-11 border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            @click="loginWithFacebook"
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
              {{ $t('auth.orSignInWithUsername') }}
            </span>
          </div>
        </div>

        <!-- Login Form -->
        <form class="space-y-4" @submit="onSubmit">
          <FormField v-slot="{ componentField }" name="username" :validate-on-blur="!isFieldDirty">
            <FormItem>
              <FormLabel class="text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ $t('auth.username') }}
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  :placeholder="$t('auth.usernamePlaceholder')"
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

          <!-- Remember me & Forgot password -->
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <Checkbox id="remember" v-model:checked="rememberMe" />
              <label
                for="remember"
                class="text-sm text-gray-600 dark:text-gray-400 cursor-pointer"
              >
                {{ $t('auth.rememberMe') }}
              </label>
            </div>
            <NuxtLink
              to="/auth/forgot-password"
              class="text-sm text-teal-600 dark:text-teal-400 hover:underline"
            >
              {{ $t('auth.forgotPassword') }}
            </NuxtLink>
          </div>

          <Button
            type="submit"
            class="w-full h-12 bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-semibold"
            :disabled="authStore.loading"
          >
            <Loader2 v-if="authStore.loading" class="w-5 h-5 mr-2 animate-spin" />
            {{ authStore.loading ? $t('auth.signingIn') : $t('auth.login') }}
          </Button>
        </form>
      </div>
    </div>
  </div>
</template>