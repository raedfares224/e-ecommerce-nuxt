<script setup lang="ts">
import { computed } from 'vue'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

const props = withDefaults(defineProps<{
  total: number
  perPage?: number
  initialPage?: number
  pageCount?: number
}>(), {
  perPage: 15,
  initialPage: 1,
})

const emit = defineEmits<{
  (e: 'page-change', page: number): void
}>()

const totalPages = computed(() => {
  if (props.pageCount && props.pageCount > 0) {
    return Math.max(1, props.pageCount)
  }

  if (!props.total || !props.perPage) return 1
  return Math.max(1, Math.ceil(props.total / props.perPage))
})

const itemsPerPageForRoot = computed(() => (props.pageCount ? 1 : props.perPage))
const totalForRoot = computed(() => (props.pageCount ? totalPages.value : props.total))

const handlePrev = (currentPage: number) => {
  if (currentPage <= 1) return
  emit('page-change', currentPage - 1)
}

const handleNext = (currentPage: number) => {
  if (currentPage >= totalPages.value) return
  emit('page-change', currentPage + 1)
}

const handlePageClick = (page: number) => {
  if (page < 1 || page > totalPages.value) return
  emit('page-change', page)
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <Pagination
      v-slot="{ page }"
      :items-per-page="itemsPerPageForRoot"
      :total="totalForRoot"
      :default-page="initialPage"
    >
      <PaginationContent v-slot="{ items }">
        <PaginationPrevious
          :disabled="page <= 1"
          @click="handlePrev(page)"
        />

        <template
          v-for="(item, index) in items"
          :key="index"
        >
          <PaginationItem
            v-if="item.type === 'page'"
            :value="item.value"
            :is-active="item.value === page"
            @click="handlePageClick(item.value)"
          >
            {{ item.value }}
          </PaginationItem>

          <PaginationEllipsis
            v-else-if="item.type === 'ellipsis'"
            :index="index"
          />
        </template>

        <PaginationNext
          :disabled="page >= totalPages"
          @click="handleNext(page)"
        />
      </PaginationContent>
    </Pagination>
  </div>
</template>
