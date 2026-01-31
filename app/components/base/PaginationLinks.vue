<script setup lang="ts">
import { computed } from 'vue'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination'

interface ApiLink {
  url: string | null
  label: string
  active: boolean
}

const props = defineProps<{
  links: ApiLink[]
  /** Optional: aria-label for the nav */
  ariaLabel?: string
}>()

const emit = defineEmits<{
  (e: 'page-change', page: number): void
}>()

const hasMultiplePages = computed(() => {
  if (!props.links || props.links.length === 0) return false
  // Laravel-style links always have prev + next + at least one page
  return props.links.length > 3
})

const parsePageFromUrl = (url: string | null): number | null => {
  if (!url) return null
  try {
    // يدعم الروابط المطلقة من API والروابط النسبية مثل "/wishlist?page=2"
    const base = typeof window !== 'undefined' ? window.location.origin : 'http://localhost'
    const parsed = new URL(url, base)
    const pageParam = parsed.searchParams.get('page')
    if (!pageParam) return null
    const n = parseInt(pageParam, 10)
    return Number.isNaN(n) || n <= 0 ? null : n
  } catch {
    return null
  }
}

const handleClick = (link: ApiLink) => {
  const page = parsePageFromUrl(link.url)
  if (!page) return
  emit('page-change', page)
}

const isPrevious = (index: number) => index === 0
const isNext = (index: number) => index === props.links.length - 1
</script>

<template>
  <Pagination
    v-if="hasMultiplePages"
    :aria-label="ariaLabel || 'Pagination'"
    class="mt-4"
  >
    <PaginationContent class="gap-2">
      <PaginationItem
        v-for="(link, index) in links"
        :key="index + link.label"
        :is-active="link.active && !isPrevious(index) && !isNext(index) && !link.label.includes('...')"
      >
        <!-- Previous -->
        <PaginationPrevious
          v-if="isPrevious(index)"
          :disabled="!link.url"
          @click="handleClick(link)"
        />

        <!-- Next -->
        <PaginationNext
          v-else-if="isNext(index)"
          :disabled="!link.url"
          @click="handleClick(link)"
        />

        <!-- Ellipsis -->
        <PaginationEllipsis
          v-else-if="link.label.includes('...')"
        />

        <!-- Numbered page -->
        <button
          v-else
          type="button"
          class="px-3 h-9 text-xs rounded-md border min-w-9"
          :class="[
            link.active
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-background text-foreground border-border hover:bg-accent',
          ]"
          :disabled="!link.url && !link.active"
          @click="handleClick(link)"
        >
          {{ link.label }}
        </button>
      </PaginationItem>
    </PaginationContent>
  </Pagination>
</template>
