<template>
    <section class="py-12 bg-gray-50">
        <div class="container mx-auto px-4">
            <!-- Section Header -->
            <div class="text-center mb-12">
                <h2 class="text-3xl font-bold text-gray-900 mb-2">
                    Our Happy Customers
                </h2>
                <p class="text-gray-600">
                    See what our customers are saying about us
                </p>
            </div>

            <!-- Testimonials Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div 
                    v-for="testimonial in testimonials" 
                    :key="testimonial.id"
                    class="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                    <!-- Rating -->
                    <div class="flex mb-4">
                        <Star 
                            v-for="i in 5" 
                            :key="i"
                            :class="i <= testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'"
                            class="w-5 h-5"
                        />
                    </div>

                    <!-- Review Text -->
                    <p class="text-gray-700 mb-6 line-clamp-4">
                        {{ testimonial.review }}
                    </p>

                    <!-- Customer Info -->
                    <div class="flex items-center gap-3">
                        <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <User class="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h4 class="font-semibold text-gray-900">
                                {{ testimonial.name }}
                            </h4>
                            <p class="text-sm text-gray-500">
                                {{ testimonial.role || 'Customer' }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { Star, User } from 'lucide-vue-next'

interface Testimonial {
    id: number
    name: string
    role?: string
    review: string
    rating: number
}

interface Props {
    testimonials: Testimonial[]
}

defineProps<Props>()
</script>
