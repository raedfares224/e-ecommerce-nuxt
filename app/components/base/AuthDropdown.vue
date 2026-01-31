<script setup lang="ts">
import { CircleUserRound, LogIn, UserPlus, User, LogOut, MapPin, ShoppingBag } from "lucide-vue-next"
import { useAuthStore } from "~/stores/auth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
const props = defineProps({
  class:String
})
const authStore = useAuthStore()
const router = useRouter()

const handleLogout = async () => {
  await authStore.logout()
}

const navigateToLogin = () => {
  router.push("/auth/login")
}

const navigateToRegister = () => {
  router.push("/auth/register")
}

const navigateToProfile = () => {
  router.push("/profile")
}

const navigateToAddresses = () => {
	router.push("/profile/addresses")
}

const navigateToOrders = () => {
	router.push("/profile/orders")
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <button
        class="inline-flex items-center justify-center w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none overflow-hidden"
        :style="{ color: 'var(--color-navbarText)' }"
      >
        <CircleUserRound v-if="!authStore.user?.photo" class="w-[18px] h-[18px] lg:w-5 lg:h-5" />
        <img v-else :src="authStore.user?.photo" alt="user" class="w-full h-full object-cover block" />
      </button>
    </DropdownMenuTrigger>

    <DropdownMenuContent class="w-56 z-[100]" align="end">
      <!-- Authenticated User Menu -->
      <template v-if="authStore.isAuthenticated">
        <DropdownMenuLabel :class="props.class">
          <div class="flex flex-col space-y-1 max-w-[200px] ">
            <p class="text-sm font-medium leading-none truncate">{{ authStore.user?.name }}</p>
            <p class="text-xs leading-none text-muted-foreground">
              {{ authStore.user?.email }}
            </p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem @click="navigateToProfile" class="cursor-pointer">
          <User class="mr-2 h-4 w-4" />
          <span>{{ $t('auth.profile') }}</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem @click="navigateToOrders" class="cursor-pointer">
          <ShoppingBag class="mr-2 h-4 w-4" />
          <span>{{ $t('auth.myOrders') }}</span>
        </DropdownMenuItem>

        <DropdownMenuItem @click="navigateToAddresses" class="cursor-pointer">
          <MapPin class="mr-2 h-4 w-4" />
          <span>{{ $t('profile.addresses') }}</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem @click="handleLogout" class="cursor-pointer text-red-600 focus:text-red-600">
          <LogOut class="mr-2 h-4 w-4" />
          <span>{{ $t('auth.logout') }}</span>
        </DropdownMenuItem>
      </template>

      <!-- Guest Menu -->
      <template v-else>
        <DropdownMenuLabel>{{ $t('auth.account') }}</DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem @click="navigateToLogin" class="cursor-pointer">
          <LogIn class="mr-2 h-4 w-4" />
          <span>{{ $t('auth.login') }}</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem @click="navigateToRegister" class="cursor-pointer">
          <UserPlus class="mr-2 h-4 w-4" />
          <span>{{ $t('auth.register') }}</span>
        </DropdownMenuItem>
      </template>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
