<script setup lang="ts">
import { Languages, Check } from 'lucide-vue-next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const { $setLocale } = useNuxtApp();
const localeCookie = useCookie<'en' | 'ar'>('locale');

const currentLocale = computed(() => localeCookie.value || 'en');

const setLanguage = (locale: 'en' | 'ar') => {
  $setLocale(locale);
};

const currentLanguageName = computed(() => {
  return currentLocale.value === 'en' ? 'English' : 'العربية';
});
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <button
        class="inline-flex items-center justify-center gap-1.5 w-10 h-10 lg:w-auto lg:px-3 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none"
        :style="{ color: 'var(--color-navbarText)' }"
      >
        <Languages class="w-[18px] h-[18px]" />
        <span class="hidden lg:inline text-sm font-medium">
          {{ currentLocale === 'en' ? 'EN' : 'ع' }}
        </span>
      </button>
    </DropdownMenuTrigger>

    <DropdownMenuContent class="w-48 !z-[1000]" align="end">
      <DropdownMenuLabel>Language / اللغة</DropdownMenuLabel>
      
      <DropdownMenuSeparator />
      
      <DropdownMenuItem 
        @click="setLanguage('en')" 
        class="cursor-pointer"
        :class="{ 'bg-accent': currentLocale === 'en' }"
      >
        <Check 
          class="mr-2 h-4 w-4" 
          :class="{ 'opacity-100': currentLocale === 'en', 'opacity-0': currentLocale !== 'en' }"
        />
        <span>English</span>
      </DropdownMenuItem>
      
      <DropdownMenuItem 
        @click="setLanguage('ar')" 
        class="cursor-pointer"
        :class="{ 'bg-accent': currentLocale === 'ar' }"
      >
        <Check 
          class="mr-2 h-4 w-4" 
          :class="{ 'opacity-100': currentLocale === 'ar', 'opacity-0': currentLocale !== 'ar' }"
        />
        <span>العربية</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

