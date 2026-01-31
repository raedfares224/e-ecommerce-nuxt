<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "#imports"
import { Search } from "lucide-vue-next"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const router = useRouter()
const searchTerm = ref<string>("")

const submitSearch = () => {
  const value = searchTerm.value.trim()

  router.push({
    path: "/products",
    query: {
      page: "1",
      search: value,
    },
  })
}
</script>

<template>
  <div class="relative w-full max-w-lg items-center">
    <form class="flex w-full" @submit.prevent="submitSearch">
      <Input
        v-model="searchTerm"
        id="search"
        type="text"
        :placeholder="$t('nav.searchs')"
        class="rounded-full ps-10 bg-white h-11 w-full"
        @keyup.enter.prevent="submitSearch"
      />
      <Button
        type="submit"
        class="bg-black hover:bg-black/80 absolute end-0 top-0 rounded-e-full h-full w-[25%] text-white cursor-pointer"
      >
        {{ $t('nav.search') }}
      </Button>
    </form>

    <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
      <Search class="size-6 text-muted-foreground" />
    </span>
  </div>
</template>