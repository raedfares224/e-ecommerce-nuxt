<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 md:px-8">
    <div class="max-w-6xl mx-auto space-y-6">
      <header class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div class="space-y-1">
          <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {{ $t('profile.addresses') }}
          </h1>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ $t('profile.overview') }}
          </p>
        </div>

        <Button
          type="button"
          class="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 text-sm px-4 py-2 rounded-md shadow-sm"
          @click="createDialogOpen = true"
        >
          <span>{{ $t('profile.addAddress') }}</span>
        </Button>

        <AddAddressDialog 
          v-model:open="createDialogOpen" 
          @success="handleAddressCreated" 
        />
      </header>

      <section class="space-y-4">
        <!-- Addresses list -->
        <div
          v-if="addressesLoading"
          class="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div
            v-for="i in 4"
            :key="i"
            class="animate-pulse rounded-xl border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/40 p-4"
          >
            <div class="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
            <div class="h-3 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div class="h-3 w-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>

        <div
          v-else-if="addresses.length === 0"
          class="border border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 text-center text-sm text-gray-500 dark:text-gray-400"
        >
          {{ $t('profile.noAddresses') }}
        </div>

        <div
          v-else
          class="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div
            v-for="address in addresses"
            :key="address.id"
            class="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/90 p-5 space-y-3 shadow-sm hover:shadow-md transition-shadow"
          >
            <div class="flex items-center justify-between gap-2">
              <div>
                <div class="flex flex-wrap items-center gap-2">
                  <p class="text-sm font-semibold text-gray-900 dark:text-white">
                    {{ address.label || address.country_name || '' }}
                  </p>
                  <span
                    class="inline-flex items-center gap-1 rounded-full border border-gray-200 dark:border-gray-700 px-2 py-0.5 text-[11px] uppercase tracking-wide text-gray-600 dark:text-gray-300"
                  >
                    <component :is="getBranchTypeIcon(address.branch_type)" class="w-3 h-3" />
                    <span>{{ $t(getBranchTypeLabelKey(address.branch_type)) }}</span>
                  </span>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  #{{ address.id }}
                </p>
              </div>

              <div class="flex items-center gap-2">
                <span
                  v-if="address.is_default"
                  class="inline-flex items-center rounded-full bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 px-2 py-0.5 text-xs font-medium"
                >
                  {{ $t('profile.defaultAddress') }}
                </span>

                <Dialog
                  v-else
                  :open="confirmAddressId === address.id"
                  @update:open="(open) => { confirmAddressId = open ? address.id : null }"
                >
                  <button
                    type="button"
                    class="text-xs px-3 py-1 rounded-full border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    @click="confirmAddressId = address.id"
                  >
                    {{ $t('profile.setAsDefault') }}
                  </button>

                  <DialogContent class="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle class="text-base font-semibold">
                        {{ $t('profile.confirmSetDefaultTitle') }}
                      </DialogTitle>
                      <DialogDescription class="text-sm text-gray-500 dark:text-gray-400">
                        {{ $t('profile.confirmSetDefaultMessage') }}
                      </DialogDescription>
                    </DialogHeader>

                    <DialogFooter class="flex-col sm:flex-row gap-2 pt-4">
                      <DialogClose as-child>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          class="w-full sm:w-auto"
                        >
                          {{ $t('common.cancel') }}
                        </Button>
                      </DialogClose>
                      <Button
                        type="button"
                        size="sm"
                        class="w-full sm:w-auto"
                        :disabled="settingDefaultId === address.id"
                        @click="setDefaultAddress(address.id)"
                      >
                        {{ $t('profile.confirm') }}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog
                  :open="confirmDeleteId === address.id"
                  @update:open="(open) => { confirmDeleteId = open ? address.id : null }"
                >
                  <button
                    type="button"
                    class="text-xs px-3 py-1 rounded-full border border-red-300 dark:border-red-700 text-red-600 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/40 transition-colors"
                    @click="confirmDeleteId = address.id"
                  >
                    {{ $t('common.delete') }}
                  </button>

                  <DialogContent class="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle class="text-base font-semibold">
                        {{ $t('profile.confirmDeleteTitle') }}
                      </DialogTitle>
                      <DialogDescription class="text-sm text-gray-500 dark:text-gray-400">
                        {{ $t('profile.confirmDeleteMessage') }}
                      </DialogDescription>
                    </DialogHeader>

                    <DialogFooter class="flex-col sm:flex-row gap-2 pt-4">
                      <DialogClose as-child>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          class="w-full sm:w-auto"
                          :disabled="deletingAddressId === address.id"
                        >
                          {{ $t('common.cancel') }}
                        </Button>
                      </DialogClose>
                      <Button
                        type="button"
                        size="sm"
                        class="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
                        :disabled="deletingAddressId === address.id"
                        @click="handleDeleteAddress(address.id)"
                      >
                        <span v-if="deletingAddressId === address.id">
                          {{ $t('messages.loading') }}
                        </span>
                        <span v-else>
                          {{ $t('common.delete') }}
                        </span>
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <p class="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                 <component :is="getBranchTypeIcon(address.branch_type)" class="w-3 h-3" />
              {{ formatAddressDetails(address.address, address.branch_type) }}
            </p>

            <div class="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-800/50 p-3 space-y-3">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  v-if="address.ship_to_location"
                  class="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300"
                >
                  <Package class="w-4 h-4 text-gray-400" />
                  <div>
                    <p class="font-semibold text-gray-700 dark:text-gray-200">{{ $t('profile.shipTo') }}</p>
                    <p class="text-gray-500 dark:text-gray-400">{{ address.ship_to_location }}</p>
                  </div>
                </div>

                <div
                  v-if="address.bill_to_location"
                  class="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300"
                >
                  <Landmark class="w-4 h-4 text-gray-400" />
                  <div>
                    <p class="font-semibold text-gray-700 dark:text-gray-200">{{ $t('profile.billTo') }}</p>
                    <p class="text-gray-500 dark:text-gray-400">{{ address.bill_to_location }}</p>
                  </div>
                </div>

                <div
                  v-if="address.country_name || address.governorate_name || address.city_name"
                  class="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300"
                >
                  <MapPin class="w-4 h-4 text-gray-400" />
                  <div>
                    <p class="font-semibold text-gray-700 dark:text-gray-200">{{ $t('profile.country') }}</p>
                    <p class="text-gray-500 dark:text-gray-400">
                      {{ address.country_name }}
                      <span v-if="address.governorate_name"> · {{ address.governorate_name }}</span>
                      <span v-if="address.city_name"> · {{ address.city_name }}</span>
                    </p>
                  </div>
                </div>

                <div
                  v-if="address.postal_code"
                  class="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300"
                >
                  <Mail class="w-4 h-4 text-gray-400" />
                  <div>
                    <p class="font-semibold text-gray-700 dark:text-gray-200">{{ $t('profile.postalCode') }}</p>
                    <p class="text-gray-500 dark:text-gray-400">{{ address.postal_code }}</p>
                  </div>
                </div>

                <div
                  v-if="address.nighbourhood_name || address.nighbourhood_id"
                  class="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300"
                >
                  <Tag class="w-4 h-4 text-gray-400" />
                  <div>
                    <p class="font-semibold text-gray-700 dark:text-gray-200">{{ $t('profile.neighbourhoodId') }}</p>
                    <p class="text-gray-500 dark:text-gray-400">
                      {{ address.nighbourhood_name || address.nighbourhood_id }}
                    </p>
                  </div>
                </div>

                <div
                  v-if="address.lat && address.long"
                  class="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300"
                >
                  <Navigation class="w-4 h-4 text-gray-400" />
                  <div>
                    <p class="font-semibold text-gray-700 dark:text-gray-200">{{ $t('profile.locationHint') }}</p>
                    <p class="text-gray-500 dark:text-gray-400">
                      {{ address.lat }}, {{ address.long }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <p class="text-xs text-gray-400 mt-1">
              {{ $t('profile.lastUpdate') }}:
              {{ address.last_update }}
            </p>
          </div>
        </div>

        <!-- Pagination -->
        <BasePaginationLinks
          v-if="addressesLinks && addressesLinks.length > 0 && addressesTotalPages > 1"
          :links="addressesLinks"
          :aria-label="t('profile.addresses')"
          @page-change="changeAddressesPage"
        />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Briefcase, Home, MapPin, Mail, Navigation, Package, Landmark, Tag } from 'lucide-vue-next'
import { useProfileAddresses } from '~/composables/useProfileAddresses'
import { api } from '~/api/useApi'
import AddAddressDialog from '~/components/address/AddAddressDialog.vue'

const { t } = useI18n()

const {
  addresses,
  addressesLoading,
  addressesPage,
  addressesTotalPages,
  addressesLinks,
  confirmAddressId,
  settingDefaultId,
  confirmDeleteId,
  deletingAddressId,
  fetchAddresses,
  changeAddressesPage,
  setDefaultAddress,
  deleteAddress,
} = useProfileAddresses()

const createDialogOpen = ref(false)

const handleAddressCreated = () => {
  fetchAddresses(1)
}

const branchIconMap: Record<string, any> = {
  home: Home,
  work: Briefcase,
  other: Tag,
}

const getBranchTypeIcon = (type?: string | null) => {
  if (!type) return branchIconMap.other
  return branchIconMap[type] || branchIconMap.other
}

const getBranchTypeLabelKey = (type?: string | null) => {
  if (type === 'home' || type === 'work' || type === 'other') {
    return `profile.${type}`
  }
  return 'profile.other'
}

const formatAddressDetails = (address?: string | null, branchType?: string | null) => {
  if (address && address.trim().length > 0) {
    const trimmed = address.trim()
    const normalized = trimmed.toLowerCase()
    if (normalized === 'home' || normalized === 'work' || normalized === 'other') {
      return t(`profile.${normalized}`)
    }
    return trimmed
  }
  const labelKey = getBranchTypeLabelKey(branchType)
  return t(labelKey)
}

const handleDeleteAddress = async (id: number) => {
  const result = await deleteAddress(id)

  if (!result || !result.success) {
    const err: any = (result as any).error
    const message = (err && (err.message || err.data?.message)) || t('messages.somethingWentWrong') || 'Failed to delete address'
    toast.error(message)
    return
  }

  toast.success(t('messages.deletedSuccessfully') || 'Address deleted successfully')
}

onMounted(() => {
  fetchAddresses(1)
})

useHead({
  title: t('profile.addresses'),
})
</script>
