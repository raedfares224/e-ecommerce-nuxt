<template>
    <section class="py-12">
        <div class="container mx-auto px-4">
            <div 
                class="relative rounded-3xl overflow-hidden bg-linear-to-r from-green-400 to-green-600 p-8 md:p-12"
                :style="{ backgroundColor: bgColor }"
            >
                <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <!-- Content -->
                    <div class="flex-1 text-white">
                        <h2 class="text-3xl md:text-4xl font-bold mb-4">
                            {{ title }}
                        </h2>
                        <p v-if="description" class="text-lg mb-6 opacity-90">
                            {{ description }}
                        </p>
                        <Button 
                            size="lg"
                            class="bg-white text-green-600 hover:bg-gray-100"
                            @click="handleClick"
                        >
                            {{ buttonText }}
                            <ArrowRight class="w-5 h-5 ml-2" />
                        </Button>
                    </div>

                    <!-- Image -->
                    <div v-if="image" class="shrink-0">
                        <img 
                            loading="lazy"
                            decoding="async"
                            :src="image" 
                            :alt="title"
                            class="w-64 h-64 object-contain"
                        />
                    </div>
                </div>

                <!-- Decorative Elements -->
                <div class="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
                <div class="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'

interface Props {
    title: string
    description?: string
    buttonText?: string
    image?: string
    bgColor?: string
    link?: string
}

const props = withDefaults(defineProps<Props>(), {
    buttonText: 'Shop Now',
    bgColor: '#10b981'
})

const router = useRouter()

const handleClick = () => {
    if (props.link) {
        router.push(props.link)
    }
}
</script>
