<template>
  <nav
    class="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 mb-6"
    aria-label="Breadcrumb"
  >
    <div class="container mx-auto px-4 py-3 md:py-4">
      <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <slot>
          <NuxtLink
            to="/"
            class="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
          >
            {{ $t("nav.home") }}
          </NuxtLink>
          <span class="text-gray-400">/</span>
          <span class="text-primary dark:text-white font-medium">
            {{ $route.params.slug }}
          </span>
        </slot>
      </div>
    </div>
  </nav>
</template>
