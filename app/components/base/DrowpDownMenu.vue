<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Featured } from "~/types/shop";
const props = defineProps<{ fet: Featured[] }>();
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <slot></slot>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      class="mt-2 w-72 p-0 rounded-lg shadow-lg border border-black/5 bg-white/95 backdrop-blur-sm overflow-hidden"
    >
      <DropdownMenuGroup>
        <DropdownMenuSub v-for="value in fet" :key="value.id">
          <DropdownMenuSubTrigger
            :img="value.imageUrl"
            class="flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <span class="truncate font-medium text-gray-900">{{
              value?.name
            }}</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent
              class="p-2 bg-white rounded-lg shadow-lg border border-black/5 min-w-[260px] max-h-96 overflow-y-auto ml-3"
            >
              <DropdownMenuItem
                v-for="product in value?.products?.data"
                :key="product.id"
              >
                <NuxtLink
                  class="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-gray-50 cursor-pointer transition-colors text-right"
                  :to="`/categories/${product?.slug}`"
                >
                  <img
                    :src="product?.imageUrl"
                    class="w-10 h-10 rounded-full object-cover border border-gray-100 shrink-0"
                    loading="lazy"
                    decoding="async"
                  />
                  <span class="flex-1 text-sm text-gray-900 truncate">{{
                    product?.name
                  }}</span></NuxtLink
                >
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
