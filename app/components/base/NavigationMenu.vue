<script setup lang="ts">
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import type { DropdownMenuItem } from '~/types/menu';
 const porops= defineProps<{
    items: DropdownMenuItem[]
  }>()
</script>

<template>
  <NavigationMenu>
    <NavigationMenuList >
      <NavigationMenuItem class="rounded-none" v-for="item in items">
        <NavigationMenuTrigger class="text-(--color-navbarText) hover:text-(--color-menuHoverColor)">{{ item?.title }}</NavigationMenuTrigger>
        <NavigationMenuContent class="p-0 ">
          <NavigationMenuLink class="min-w-50  cursor-pointer rounded-none p-0"  v-for="value in item?.dropdown_menus.data"><NuxtLink class=" p-3" :to="value?.link" >{{ value?.title }}</NuxtLink></NavigationMenuLink>
        </NavigationMenuContent>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
</template>