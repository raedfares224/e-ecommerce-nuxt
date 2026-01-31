<template>
  <div class="min-h-[90vh] py-10 px-4 md:px-8 lg:px-12 bg-gray-50 dark:bg-gray-900">
    <div class="max-w-4xl mx-auto">
      <!-- Title -->
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">
          {{ t('auth.profile') }}
        </h1>

        <button
          v-if="isAuthenticated"
          type="button"
          class="inline-flex items-center gap-2 rounded-md bg-gray-900 text-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 dark:focus:ring-white"
          @click="handleRefresh"
        >
          <RefreshCcw class="w-4 h-4" />
          <span>{{ t('common.refresh') || 'Refresh' }}</span>
        </button>
      </div>

      <!-- Not authenticated -->
      <div
        v-if="!isAuthenticated && !loading"
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 text-center"
      >
        <p class="text-gray-700 dark:text-gray-200 mb-4">
          {{ t('auth.loginToContinue') || 'You need to login to view your profile.' }}
        </p>
        <button
          type="button"
          class="inline-flex items-center justify-center rounded-md bg-gray-900 text-white px-6 py-2.5 text-sm font-medium shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 dark:focus:ring-white"
          @click="goToLogin"
        >
          {{ t('auth.login') }}
        </button>
      </div>

      <!-- Loading state -->
      <div
        v-else-if="loading && !user"
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 flex items-center justify-center"
      >
        <div class="flex items-center gap-3 text-gray-600 dark:text-gray-200">
          <span class="i-lucide-loader-2 w-5 h-5 animate-spin" />
          <span>{{ t('messages.loading') || 'Loading profile...' }}</span>
        </div>
      </div>

      <!-- Profile content -->
      <div
        v-else-if="user"
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8"
      >
        <div class="flex flex-col md:flex-row gap-8">
          <!-- Avatar + main info -->
          <div class="flex flex-col items-center md:items-start gap-4 md:w-1/3">
            <div class="relative flex flex-col items-center gap-3">
              <div
                class="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-3xl font-semibold text-gray-900 dark:text-white overflow-hidden"
              >
                <img
                  v-if="previewPhoto || user.photo"
                  :src="previewPhoto || user.photo"
                  :alt="user.name"
                  class="w-full h-full object-cover"
                />
                <span v-else>
                  {{ user.name?.charAt(0) || user.username?.charAt(0) || 'U' }}
                </span>
              </div>

              <div class="flex flex-col items-center gap-2">
                <input
                  ref="fileInputRef"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="onPhotoSelected"
                />
                <Button
                  type="button"
                  variant="outline"
                  class="h-9 px-3 text-xs"
                  :disabled="authStore.loading"
                  @click="triggerFileInput"
                >
                  {{ t('auth.changePhoto') || 'Change photo' }}
                </Button>

                <!-- <Button
                  v-if="selectedPhoto"
                  type="button"
                  class="h-9 px-3 text-xs bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                  :disabled="authStore.loading || isUploadingPhoto"
                  @click="handleUploadPhoto"
                >
                  <Loader2
                    v-if="authStore.loading || isUploadingPhoto"
                    class="w-3 h-3 mr-1.5 animate-spin"
                  />
                  <span>{{ t('common.save') || 'Save' }}</span>
                </Button> -->
              </div>
            </div>

            <div class="text-center md:text-left">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                {{ user.name || user.username }}
              </h2>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ user.email }}
              </p>
              <p v-if="user.mobile" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {{ user.mobile }}
              </p>
            </div>

            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-sm font-medium dark:bg-amber-900/20 dark:text-amber-300">
              <span class="i-lucide-star w-4 h-4" />
              <span>{{ t('auth.points') || 'Points' }}: {{ user.points }}</span>
            </div>
          </div>

          <!-- Details editable form -->
          <div class="flex-1">
            <form class="grid grid-cols-1 md:grid-cols-2 gap-6" @submit="onSubmit">
              <FormField v-slot="{ componentField }" name="name" :validate-on-blur="!isFieldDirty">
                <FormItem class="col-span-1">
                  <FormLabel class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    {{ t('auth.fullName') || 'Full Name' }}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      class="h-11 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                      v-bind="componentField"
                    />
                  </FormControl>
                  <FormMessage class="text-red-500 text-xs" />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="username" :validate-on-blur="!isFieldDirty">
                <FormItem class="col-span-1">
                  <FormLabel class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    {{ t('auth.username') || 'Username' }}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      class="h-11 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                      v-bind="componentField"
                    />
                  </FormControl>
                  <FormMessage class="text-red-500 text-xs" />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="email" :validate-on-blur="!isFieldDirty">
                <FormItem class="col-span-1">
                  <FormLabel class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    {{ t('auth.email') || 'Email' }}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      class="h-11 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                      v-bind="componentField"
                    />
                  </FormControl>
                  <FormMessage class="text-red-500 text-xs" />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="mobile" :validate-on-blur="!isFieldDirty">
                <FormItem class="col-span-1">
                  <FormLabel class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    {{ t('auth.mobile') || 'Mobile' }}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      class="h-11 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                      v-bind="componentField"
                    />
                  </FormControl>
                  <FormMessage class="text-red-500 text-xs" />
                </FormItem>
              </FormField>

              <div class="col-span-1 md:col-span-2 flex items-center justify-between mt-2">
                <p class="text-xs text-gray-400 dark:text-gray-500">
                  {{ t('auth.id') || 'User ID' }}: #{{ user.id }}
                </p>
                <Button
                  type="submit"
                  class="inline-flex items-center justify-center rounded-md bg-gray-900 text-white px-5 py-2.5 text-sm font-medium shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 dark:focus:ring-white"
                  :disabled="authStore.loading || isSubmitting"
                >
                  <Loader2 v-if="authStore.loading || isSubmitting" class="w-4 h-4 mr-2 animate-spin" />
                  <span>{{ t('common.saveChanges') || 'Save changes' }}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>

        <!-- Actions -->
        <div class="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div class="flex flex-wrap gap-3">
            <Button
              type="button"
              class="inline-flex items-center justify-center gap-2 rounded-md bg-gray-900 text-white px-5 py-2.5 text-sm font-medium shadow-sm hover:bg-gray-800 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-900 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 dark:focus-visible:ring-white"
              @click="goToOrders"
            >
              <ShoppingBag class="w-4 h-4" />
              <span>{{ t('auth.myOrders') }}</span>
            </Button>

            <!-- <Button
              type="button"
              variant="outline"
              class="inline-flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-5 py-2.5 text-sm font-medium shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-900 dark:focus-visible:ring-white"
              @click="goToSettings"
            >
              <Settings2 class="w-4 h-4" />
              <span>{{ t('auth.settings') }}</span>
            </Button> -->
          </div>

          <Button
            type="button"
            variant="outline"
            class="inline-flex items-center justify-center gap-2 rounded-md border border-red-200 bg-red-50 text-red-700 px-4 py-2.5 text-sm font-medium shadow-sm hover:bg-red-100 hover:border-red-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800 dark:hover:bg-red-900/40"
            @click="handleLogout"
          >
            <LogOut class="w-4 h-4" />
            <span>{{ t('auth.logout') }}</span>
          </Button>
        </div>
      </div>

      <!-- Fallback if something went wrong -->
      <div
        v-else
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 text-center text-gray-700 dark:text-gray-200"
      >
        {{ t('messages.somethingWentWrong') || 'Unable to load profile data.' }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import * as z from "zod";
import { Loader2, ShoppingBag, Settings2, LogOut,RefreshCcw } from "lucide-vue-next";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import { useAuthStore } from "~/stores/auth";
import { useI18n } from "vue-i18n";
import { toast } from "vue-sonner";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const authStore = useAuthStore();
const { user, loading, isAuthenticated } = storeToRefs(authStore);
const { t } = useI18n();

const selectedPhoto = ref<File | null>(null);
const previewPhoto = ref<string | null>(null);
const isUploadingPhoto = ref(false);
const fileInputRef = ref<HTMLInputElement | null>(null);

const formSchema = toTypedSchema(z.object({
  name: z.string().min(1, t("validation.required")),
  email: z.string().min(1, t("validation.required")).email(t("validation.email")),
  mobile: z.string().min(1, t("validation.required")),
  username: z.string().min(1, t("validation.required")),
}));

const { isFieldDirty, handleSubmit, setValues, isSubmitting } = useForm({
  validationSchema: formSchema,
  initialValues: {
    name: "",
    email: "",
    mobile: "",
    username: "",
  },
});

watch(user, (val) => {
  if (val) {
    setValues({
      name: val.name,
      email: val.email,
      mobile: val.mobile,
      username: val.username,
    });
  }
}, { immediate: true });

const onSubmit = handleSubmit(async (values) => {
  try {
    const result = await authStore.updateProfile({
      name: values.name,
      email: values.email,
      mobile: values.mobile,
      username: values.username,
      ...(selectedPhoto.value ? { photo: selectedPhoto.value } : {}),
    });

    if (result.success) {
      toast.success(t("messages.updatedSuccessfully") || "Profile updated");
    }
  } catch (error: any) {
    toast.error(error.message || t("messages.somethingWentWrong") || "Failed to update profile");
  }
});

const triggerFileInput = () => {
  fileInputRef.value?.click();
};

const onPhotoSelected = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) {
    selectedPhoto.value = null;
    previewPhoto.value = null;
    return;
  }

  selectedPhoto.value = file;

  const reader = new FileReader();
  reader.onload = (e) => {
    previewPhoto.value = e.target?.result as string;
  };
  reader.readAsDataURL(file);
};

const handleUploadPhoto = async () => {
  if (!selectedPhoto.value) return;

  try {
    isUploadingPhoto.value = true;
    const result = await authStore.updateProfilePhoto(selectedPhoto.value);

    if (result.success) {
      toast.success(t("messages.updatedSuccessfully") || "Profile photo updated");
      selectedPhoto.value = null;
    }
  } catch (error: any) {
    toast.error(error.message || t("messages.somethingWentWrong") || "Failed to update profile photo");
  } finally {
    isUploadingPhoto.value = false;
  }
};

const handleRefresh = async () => {
  try {
    await authStore.fetchProfile();
    toast.success(t("messages.updatedSuccessfully") || "Profile updated");
  } catch (error) {
    toast.error(t("messages.somethingWentWrong") || "Failed to refresh profile");
  }
};

const handleLogout = async () => {
  await authStore.logout();
};

const goToLogin = () => {
  navigateTo("/auth/login");
};

const goToOrders = () => {
  navigateTo("profile/orders");
};

// const goToSettings = () => {
//   navigateTo("/settings");
// };

onMounted(async () => {
  if (!isAuthenticated.value) {
    return;
  }

  if (!user.value) {
    try {
      await authStore.fetchProfile();
    } catch (error) {
      // Already handled by api helper / toast
    }
  }
});
</script>
