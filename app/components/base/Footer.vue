<template>
    <footer 
        class="relative text-(--color-footerText) bg-(--color-footer) overflow-hidden" 
    >
        <!-- Decorative background elements -->
        <div class="absolute inset-0 pointer-events-none opacity-10">
            <div class="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div class="absolute bottom-0 right-0 w-80 h-80 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <!-- Newsletter Section -->
        <div class="relative border-b border-white/10">
            <div class="container mx-auto px-4 py-12 md:py-16">
                <div class="max-w-4xl mx-auto text-center">
                    <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-4">
                        <Mail class="w-4 h-4" />
                        <span class="text-sm font-medium">{{ $t('footer.newsletter') || 'Newsletter' }}</span>
                    </div>
                    <h3 class="text-2xl md:text-3xl font-bold mb-3">
                        {{ $t('footer.subscribeTitle') || 'Subscribe to our Newsletter' }}
                    </h3>
                    <p class="text-white/70 mb-6 max-w-xl mx-auto">
                        {{ $t('footer.subscribeDescription') || 'Get the latest updates on new products and upcoming sales' }}
                    </p>
                    <form @submit.prevent="handleSubscribe" class="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                        <input 
                            v-model="email"
                            type="email" 
                            :placeholder="$t('footer.emailPlaceholder') || 'Enter your email'"
                            class="flex-1 px-5 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all"
                        />
                        <Button 
                            type="submit"
                            class="px-8 py-3 rounded-full bg-white text-gray-900 hover:bg-white/90 font-semibold transition-all"
                            :disabled="isSubscribing"
                        >
                            <Loader2 v-if="isSubscribing" class="w-4 h-4 animate-spin mr-2" />
                            {{ $t('footer.subscribe') || 'Subscribe' }}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
        
        <div class="container mx-auto px-4 py-12 md:py-16 relative">
            <!-- Main Footer Content -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
                <!-- Company Info -->
                <div class="space-y-4">
                    <!-- Logo -->
                    <NuxtLink to="/" class="inline-block mb-4">
                        <img 
                            :src="siteSettings.settings?.logo" 
                            :alt="siteSettings.siteTitle"
                            loading="lazy"
                            decoding="async"
                            class="h-10 w-auto object-contain invert"
                        />
                    </NuxtLink>
                    
                    <!-- Description -->
                    <p 
                        class="text-sm leading-relaxed opacity-90"
                        :style="{ color: siteSettings.colors.footerText || '#ffffff' }"
                    >
                        {{ siteSettings.settings?.description }}
                    </p>
                    
                    <!-- Social Media -->
                    <div class="flex items-center gap-3 pt-2">
                        <a 
                            v-if="siteSettings?.socialMedia?.facebook"
                            :href="siteSettings?.socialMedia?.facebook"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="w-9 h-9 rounded-full bg-white text-black hover:bg-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110"
                            aria-label="Facebook"
                        >
                            <Facebook class="w-4 h-4" />
                        </a>
                        <a 
                            v-if="siteSettings?.socialMedia?.twitter"
                            :href="siteSettings?.socialMedia?.twitter"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="w-9 h-9 rounded-full bg-white text-black hover:bg-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110"
                            aria-label="Twitter"
                        >
                            <Twitter class="w-4 h-4" />
                        </a>
                        <a 
                            v-if="siteSettings?.socialMedia?.instagram"
                            :href="siteSettings?.socialMedia?.instagram"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="w-9 h-9 rounded-full bg-white text-black hover:bg-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110"
                            aria-label="Instagram"
                        >
                            <Instagram class="w-4 h-4" />
                        </a>
                        <a 
                            v-if="siteSettings?.communication?.whatsapp"
                            :href="`https://wa.me/${siteSettings?.communication?.whatsapp}`"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="w-9 h-9 rounded-full bg-white text-black hover:bg-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110"
                            aria-label="WhatsApp"
                        >
                            <MessageCircle class="w-4 h-4" />
                        </a>
                    </div>
                </div>

                <!-- My Account -->
                <div>
                    <h3 
                        class="text-lg font-semibold mb-4"
                        :style="{ color: siteSettings.colors.footerText || '#ffffff' }"
                    >
                        {{ $t('footer.myAccount') }}
                    </h3>
                    <ul class="space-y-2">
                        <li>
                            <NuxtLink 
                                to="/profile/orders"
                                class="text-sm opacity-80 hover:opacity-100 transition-opacity inline-flex items-center gap-2"
                                :style="{ color: siteSettings.colors.footerText || '#ffffff' }"
                            >
                                {{ $t('footer.trackOrders') }}
                            </NuxtLink>
                        </li>
                        <li>
                            <NuxtLink 
                                to="/cart"
                                class="text-sm opacity-80 hover:opacity-100 transition-opacity inline-flex items-center gap-2"
                                :style="{ color: siteSettings.colors.footerText || '#ffffff' }"
                            >
                                {{ $t('footer.shipping') }}
                            </NuxtLink>
                        </li>
                        <li>
                            <NuxtLink 
                                to="/wishlist"
                                class="text-sm opacity-80 hover:opacity-100 transition-opacity inline-flex items-center gap-2"
                                :style="{ color: siteSettings.colors.footerText || '#ffffff' }"
                            >
                                {{ $t('footer.wishlist') }}
                            </NuxtLink>
                        </li>
                        <li>
                            <NuxtLink 
                                to="/profile"
                                class="text-sm opacity-80 hover:opacity-100 transition-opacity inline-flex items-center gap-2"
                                :style="{ color: siteSettings.colors.footerText || '#ffffff' }"
                            >
                                {{ $t('auth.myAccount') }}
                            </NuxtLink>
                        </li>
                        <li>
                            <NuxtLink 
                                to="/profile/orders"
                                class="text-sm opacity-80 hover:opacity-100 transition-opacity inline-flex items-center gap-2"
                                :style="{ color: siteSettings.colors.footerText || '#ffffff' }"
                            >
                                {{ $t('footer.orderHistory') }}
                            </NuxtLink>
                        </li>
                        <li>
                            <NuxtLink 
                                to="/cart"
                                class="text-sm opacity-80 hover:opacity-100 transition-opacity inline-flex items-center gap-2"
                                :style="{ color: siteSettings.colors.footerText || '#ffffff' }"
                            >
                                {{ $t('footer.returns') }}
                            </NuxtLink>
                        </li>
                    </ul>
                </div>

                <!-- Information -->
                <div>
                    <h3 
                        class="text-lg font-semibold mb-4"
                        :style="{ color: siteSettings.colors.footerText || '#ffffff' }"
                    >
                        {{ $t('footer.information') }}
                    </h3>
                    <ul class="space-y-2">
                        <li>
                            <NuxtLink 
                                to="/"
                                class="text-sm opacity-80 hover:opacity-100 transition-opacity inline-flex items-center gap-2"
                                :style="{ color: siteSettings.colors.footerText || '#ffffff' }"
                            >
                                {{ $t('footer.ourStory') }}
                            </NuxtLink>
                        </li>
                        <li>
                            <NuxtLink 
                                to="/"
                                class="text-sm opacity-80 hover:opacity-100 transition-opacity inline-flex items-center gap-2"
                                :style="{ color: siteSettings.colors.footerText || '#ffffff' }"
                            >
                                {{ $t('footer.careers') }}
                            </NuxtLink>
                        </li>
                        <li>
                            <NuxtLink 
                                to="/privacy-policy"
                                class="text-sm opacity-80 hover:opacity-100 transition-opacity inline-flex items-center gap-2"
                                :style="{ color: siteSettings.colors.footerText || '#ffffff' }"
                            >
                                {{ $t('footer.privacyPolicy') }}
                            </NuxtLink>
                        </li>
                        <li>
                            <NuxtLink 
                                to="/terms-and-conditions"
                                class="text-sm opacity-80 hover:opacity-100 transition-opacity inline-flex items-center gap-2"
                                :style="{ color: siteSettings.colors.footerText || '#ffffff' }"
                            >
                                {{ $t('footer.termsConditions') }}
                            </NuxtLink>
                        </li>
                        <li>
                            <NuxtLink 
                                to="/"
                                class="text-sm opacity-80 hover:opacity-100 transition-opacity inline-flex items-center gap-2"
                                :style="{ color: siteSettings.colors.footerText || '#ffffff' }"
                            >
                                {{ $t('footer.latestNews') }}
                            </NuxtLink>
                        </li>
                        <li>
                            <NuxtLink 
                                to="/"
                                class="text-sm opacity-80 hover:opacity-100 transition-opacity inline-flex items-center gap-2"
                                :style="{ color: siteSettings.colors.footerText || '#ffffff' }"
                            >
                                {{ $t('footer.contactUs') }}
                            </NuxtLink>
                        </li>
                    </ul>
                </div>

                <!-- Talk To Us -->
                <div>
                    <h3 
                        class="text-lg font-semibold mb-4"
                        :style="{ color: siteSettings.colors.footerText || '#ffffff' }"
                    >
                        {{ $t('footer.talkToUs') }}
                    </h3>
                    <div class="space-y-3">
                        <!-- Phone -->
                        <div v-if="siteSettings.communication.phone">
                            <p 
                                class="text-xs opacity-70 mb-1"
                                :style="{ color: siteSettings.colors.footerText || '#ffffff' }"
                            >
                                {{ $t('footer.getQuestions') }}
                            </p>
                            <a 
                                :href="`tel:${siteSettings.communication.phone}`"
                                class="text-lg font-semibold hover:opacity-80 transition-opacity"
                                :style="{ color: siteSettings.colors.footerText || '#ffffff' }"
                            >
                                {{ siteSettings.communication.phone }}
                            </a>
                        </div>

                        <!-- Email -->
                        <div v-if="siteSettings.communication.email" class="flex items-center gap-2">
                            <Mail class="w-4 h-4 opacity-70 invert text-foreground" />
                            <a 
                                :href="`mailto:${siteSettings.communication.email}`"
                                class="text-sm opacity-80 hover:opacity-100 transition-opacity"
                                :style="{ color: siteSettings.colors.footerText || '#ffffff' }"
                            >
                                {{ siteSettings.communication.email }}
                            </a>
                        </div>

                        <!-- Address -->
                        <div v-if="siteSettings.communication.address" class="flex items-start gap-2">
                            <MapPin class="w-4 h-4 opacity-70 mt-0.5 shrink-0" />
                            <p 
                                class="text-sm opacity-80"
                                :style="{ color: siteSettings.colors.footerText || '#ffffff' }"
                            >
                                {{ siteSettings.communication.address }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Bottom Bar -->
            <div 
                class="pt-8 border-t border-white/10"
            >
                <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <!-- Download App Button
                    <div class="w-full md:w-auto flex justify-center md:justify-start">
                        <button
                            type="button"
                            class="inline-flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 text-sm font-medium px-4 py-2 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                            :style="{ color: siteSettings.colors.footerText || '#ffffff' }"
                            :disabled="isInstalling"
                            @click="handleDownloadClick"
                        >
                            <Download class="w-4 h-4" />
                            <span>{{ $t('footer.downloadApp') }}</span>
                        </button>
                    </div>
 -->
                    <div class="flex flex-col md:flex-row md:items-center md:justify-end gap-4">
                        <!-- Copyright -->
                        <p 
                            class="text-sm opacity-80 text-center md:text-left"
                            :style="{ color: siteSettings.colors.footerText || '#ffffff' }"
                        >
                            © {{ currentYear }} {{ siteSettings.settings?.copy_right || `${siteSettings.siteTitle}. ${$t('footer.allRightsReserved')}` }}
                        </p>

                        <!-- Payment Methods -->
                        <div class="flex items-center justify-center gap-3">
                            <span 
                                class="text-xs opacity-70"
                                :style="{ color: siteSettings.colors.footerText || '#ffffff' }"
                            >
                                {{ $t('footer.paymentMethods') }}:
                            </span>
                            <div class="flex items-center gap-2">
                                <!-- <div class="h-8 px-3 bg-white rounded flex items-center justify-center">
                                    <span class="text-blue-600 font-bold text-sm">PayPal</span>
                                </div>
                                <div class="h-8 px-3 bg-white rounded flex items-center justify-center">
                                    <span class="text-blue-900 font-bold text-sm">VISA</span>
                                </div>
                                <div class="h-8 px-3 bg-white rounded flex items-center justify-center">
                                    <span class="text-orange-600 font-bold text-sm">MC</span>
                                </div> -->
                                <div class="h-8 px-3 bg-white rounded flex items-center justify-center">
                                    <span class="text-blue-500 font-bold text-sm">Stripe</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </footer>
</template>

<script setup lang="ts">
import { Facebook, Twitter, Instagram, MessageCircle, Mail, MapPin, Download, Loader2 } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'

const siteSettings = useSiteSettingsStore()
const currentYear = new Date().getFullYear()
const toast = useToast()

const { canInstall, isInstalling, install } = useAppInstall()

// Newsletter state
const email = ref('')
const isSubscribing = ref(false)

const handleSubscribe = async () => {
  if (!email.value) return
  
  isSubscribing.value = true
  try {
    // Simulate API call - replace with actual newsletter subscription
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast.success('Subscribed!', 'Thank you for subscribing to our newsletter')
    email.value = ''
  } catch (error) {
    toast.error('Error', 'Failed to subscribe. Please try again.')
  } finally {
    isSubscribing.value = false
  }
}

const handleDownloadClick = async () => {
  const result = await install()

  if (!result.ok) {
    if (!canInstall.value || result.reason === 'no_prompt') {
      alert('To install the app on Android, open this site in Chrome, tap the menu, then choose "Install app" or "Add to Home screen".')
    }
  }
}
</script>
