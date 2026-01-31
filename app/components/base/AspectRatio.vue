<script setup lang="ts">
import { AspectRatio } from "@/components/ui/aspect-ratio"

interface Props {
  image?: string
  ratio?: number
}

const props = withDefaults(defineProps<Props>(), {
  image: "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80",
  ratio: 16 / 6
})
</script>

<template>
  <AspectRatio :ratio="ratio" class="bg-muted">
    <img
      :src="image"
      alt="Carousel Image"
      loading="lazy"
      decoding="async"
      class="rounded-md object-cover w-full h-full"
    >
  </AspectRatio>
</template>