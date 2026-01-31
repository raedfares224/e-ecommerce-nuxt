<script setup lang="ts">
import type { PaginationPrevProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import type { ButtonVariants } from '@/components/ui/button'
import { reactiveOmit } from "@vueuse/core"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-vue-next"
import { PaginationPrev, useForwardProps } from "reka-ui"
import { cn } from "@/lib/utils"
import { buttonVariants } from '@/components/ui/button'
import { useI18n } from 'vue-i18n'

const props = withDefaults(defineProps<PaginationPrevProps & {
  size?: ButtonVariants["size"]
  class?: HTMLAttributes["class"]
}>(), {
  size: "default",
})

const delegatedProps = reactiveOmit(props, "class", "size")
const forwarded = useForwardProps(delegatedProps)

const { t, locale } = useI18n()
const isRtl = computed(() => locale.value === 'ar')
</script>

<template>
  <PaginationPrev
    data-slot="pagination-previous"
    :class="cn(
      buttonVariants({ variant: 'ghost', size }),
      'gap-1 px-2.5',
      isRtl ? 'flex-row-reverse' : '',
      props.class,
    )"
    v-bind="forwarded"
  >
    <slot>
      <component :is="isRtl ? ChevronRightIcon : ChevronLeftIcon" />
      <span class="hidden sm:block">{{ t('pagination.previous') }}</span>
    </slot>
  </PaginationPrev>
</template>
