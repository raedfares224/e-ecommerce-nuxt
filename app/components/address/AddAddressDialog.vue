<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="sm:max-w-lg max-h-[80vh] overflow-y-auto sm:max-h-none">
      <DialogHeader>
        <DialogTitle class="text-base font-semibold">
          {{ $t('profile.addAddress') }}
        </DialogTitle>
        <DialogDescription class="text-sm text-gray-500 dark:text-gray-400">
          {{ $t('profile.addAddressDescription') }}
        </DialogDescription>
      </DialogHeader>

      <form class="space-y-4 mt-4" @submit.prevent="handleCreateAddress">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="text-xs font-medium text-gray-600 dark:text-gray-300">{{ $t('profile.label') }}</label>
            <Input
              v-model="form.label"
              type="text"
              class="h-9"
              :class="{ 'border-red-500 focus-visible:ring-red-500': errors.label }"
              :placeholder="$t('profile.labelPlaceholder', 'e.g. Home, Office')"
            />
            <p v-if="errors.label" class="text-xs text-red-500">{{ errors.label }}</p>
          </div>

          <div class="space-y-1">
            <div class="flex items-center justify-between text-xs text-gray-600 dark:text-gray-300">
              <span class="font-medium">{{ $t('profile.addressType') }}</span>
              <span class="text-[11px] text-gray-500 dark:text-gray-400">{{ $t('profile.addressTypeDescription') }}</span>
            </div>
            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="type in addressTypes"
                :key="type.value"
                type="button"
                :class="[
                  'h-9 rounded-md border text-xs font-medium transition-colors flex items-center justify-center gap-1',
                  form.address_type === type.value
                    ? 'border-gray-900 bg-gray-900 text-white dark:border-white dark:bg-white dark:text-gray-900'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800'
                ]"
                @click="form.address_type = type.value"
              >
                <component :is="type.icon" class="w-3.5 h-3.5" />
                <span>{{ $t(type.labelKey) }}</span>
              </button>
            </div>
          </div>

          <div class="space-y-1">
            <label class="text-xs font-medium text-gray-600 dark:text-gray-300">{{ $t('profile.shipTo') }}</label>
            <Input
              v-model="form.ship_to_location"
              type="text"
              class="h-9"
              :class="{ 'border-red-500 focus-visible:ring-red-500': errors.ship_to_location }"
            />
            <p v-if="errors.ship_to_location" class="text-xs text-red-500">{{ errors.ship_to_location }}</p>
          </div>

          <div class="space-y-1">
            <label class="text-xs font-medium text-gray-600 dark:text-gray-300">{{ $t('profile.billTo') }}</label>
            <Input
              v-model="form.bill_to_location"
              type="text"
              class="h-9"
              :class="{ 'border-red-500 focus-visible:ring-red-500': errors.bill_to_location }"
            />
            <p v-if="errors.bill_to_location" class="text-xs text-red-500">{{ errors.bill_to_location }}</p>
          </div>

          <div class="space-y-1">
            <label class="text-xs font-medium text-gray-600 dark:text-gray-300">{{ $t('profile.country') }}</label>
            <Select
              :model-value="selectedCountryId"
              @update:model-value="handleCountryChange"
            >
              <SelectTrigger
                class="h-9 w-full"
                :class="{ 'border-red-500 focus:ring-red-500': errors.country_id }"
              >
                <SelectValue :placeholder="$t('common.selectCountry') || 'Select country'" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="country in countries"
                  :key="country.value"
                  :value="country.value"
                >
                  {{ country.text }}
                </SelectItem>
              </SelectContent>
            </Select>
            <p v-if="errors.country_id" class="text-xs text-red-500">{{ errors.country_id }}</p>
          </div>

          <div class="space-y-1">
            <label class="text-xs font-medium text-gray-600 dark:text-gray-300">{{ $t('profile.governorate') }}</label>
            <Select
              :model-value="selectedGovernorateId"
              :disabled="!selectedCountryId"
              @update:model-value="handleGovernorateChange"
            >
              <SelectTrigger
                class="h-9 w-full"
                :class="{ 'border-red-500 focus:ring-red-500': errors.governorate_id && selectedCountryId }"
              >
                <SelectValue :placeholder="$t('common.selectGovernorate') || 'Select governorate'" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="gov in filteredGovernorates"
                  :key="gov.value"
                  :value="gov.value"
                >
                  {{ gov.text }}
                </SelectItem>
              </SelectContent>
            </Select>
            <p v-if="errors.governorate_id" class="text-xs text-red-500">{{ errors.governorate_id }}</p>
          </div>

          <div class="space-y-1">
            <label class="text-xs font-medium text-gray-600 dark:text-gray-300">{{ $t('profile.city') }}</label>
            <Select
              :model-value="selectedCityId"
              :disabled="!selectedGovernorateId"
              @update:model-value="handleCityChange"
            >
              <SelectTrigger
                class="h-9 w-full"
                :class="{ 'border-red-500 focus:ring-red-500': errors.city_id && selectedGovernorateId }"
              >
                <SelectValue :placeholder="$t('common.selectCity') || 'Select city'" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="city in filteredCities"
                  :key="city.value"
                  :value="city.value"
                >
                  {{ city.text }}
                </SelectItem>
              </SelectContent>
            </Select>
            <p v-if="errors.city_id" class="text-xs text-red-500">{{ errors.city_id }}</p>
          </div>

          <div class="space-y-1">
            <label class="text-xs font-medium text-gray-600 dark:text-gray-300">{{ $t('profile.neighbourhood') }}</label>
            <Select
              :model-value="selectedNeighbourhoodId"
              :disabled="!selectedCityId"
              @update:model-value="handleNeighbourhoodChange"
            >
              <SelectTrigger
                class="h-9 w-full"
              >
                <SelectValue :placeholder="$t('common.selectNeighbourhood') || $t('profile.neighbourhood') || 'Select neighbourhood'" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="neighbourhood in filteredNeighbourhoods"
                  :key="neighbourhood.value"
                  :value="neighbourhood.value"
                >
                  {{ neighbourhood.text }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="space-y-1">
            <label class="text-xs font-medium text-gray-600 dark:text-gray-300">{{ $t('profile.postalCode') }}</label>
            <Input
              v-model="form.postal_code"
              type="text"
              class="h-9"
              :class="{ 'border-red-500 focus-visible:ring-red-500': errors.postal_code }"
            />
            <p v-if="errors.postal_code" class="text-xs text-red-500">{{ errors.postal_code }}</p>
          </div>
        </div>

        <div class="mt-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p class="text-xs text-gray-500 dark:text-gray-400">
            {{ $t('profile.locationHint') }}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            class="shrink-0 w-full sm:w-auto"
            @click="setCurrentLocation"
          >
            {{ $t('profile.useCurrentLocation') }}
          </Button>
        </div>

        <div
          v-if="googleMapEmbedUrl"
          class="mt-2 rounded-md overflow-hidden border border-gray-200 dark:border-gray-800 h-56"
        >
          <iframe
            :src="googleMapEmbedUrl"
            width="100%"
            height="100%"
            style="border:0;"
            loading="lazy"
            allowfullscreen
            referrerpolicy="no-referrer-when-downgrade"
          />
        </div>

        <div class="space-y-1">
          <label class="text-xs font-medium text-gray-600 dark:text-gray-300">{{ $t('profile.addressDetails') }}</label>
          <textarea
            v-model="form.address_details"
            rows="2"
            class="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100"
          />
        </div>

        <div class="flex items-center gap-2 pt-2">
          <input
            id="is_default"
            v-model="form.is_default"
            type="checkbox"
            class="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
          />
          <label for="is_default" class="text-xs text-gray-600 dark:text-gray-300">
            {{ $t('profile.setAsDefault') }}
          </label>
        </div>

        <DialogFooter class="flex-col sm:flex-row gap-2 pt-4">
          <DialogClose as-child>
            <Button
              type="button"
              variant="outline"
              class="w-full sm:w-auto"
              :disabled="creatingAddress"
            >
              {{ $t('common.cancel') }}
            </Button>
          </DialogClose>
          <Button
            type="submit"
            class="w-full sm:w-auto"
            :disabled="creatingAddress"
          >
            <span v-if="creatingAddress">{{ $t('messages.loading') }}</span>
            <span v-else>{{ $t('common.save') }}</span>
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Briefcase, Home, Tag } from 'lucide-vue-next'
import { apiFetch } from '~/api/useApiFetch'
import { api } from '~/api/useApi'

const props = defineProps<{
  open: boolean
  defaultIsDefault?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'success', data: any): void
}>()

const { t } = useI18n()

interface AddressFormErrors {
  label: string
  ship_to_location: string
  bill_to_location: string
  country_id: string
  governorate_id: string
  city_id: string
  postal_code: string
}

interface AddressForm {
  label: string
  address_type: 'home' | 'work' | 'other'
  ship_to_location: string
  bill_to_location: string
  country_id: string | null
  governorate_id: string | null
  city_id: string | null
  nighbourhood_id: number | null
  postal_code: string
  address_details: string
  latitude: string
  longitude: string
  is_default: boolean
}

const creatingAddress = ref(false)

const form = reactive<AddressForm>({
  label: '',
  address_type: 'home',
  ship_to_location: '',
  bill_to_location: '',
  country_id: null,
  governorate_id: null,
  city_id: null,
  nighbourhood_id: null,
  postal_code: '',
  address_details: '',
  latitude: '',
  longitude: '',
  is_default: props.defaultIsDefault ?? false,
})

const errors = reactive<AddressFormErrors>({
  label: '',
  ship_to_location: '',
  bill_to_location: '',
  country_id: '',
  governorate_id: '',
  city_id: '',
  postal_code: '',
})

const countries = ref<any[]>([])
const governorates = ref<any[]>([])
const cities = ref<any[]>([])
const neighbourhoods = ref<any[]>([])

const addressTypes = [
  {
    value: 'home',
    labelKey: 'profile.home',
    icon: Home,
  },
  {
    value: 'work',
    labelKey: 'profile.work',
    icon: Briefcase,
  },
  {
    value: 'other',
    labelKey: 'profile.other',
    icon: Tag,
  },
] as const satisfies { value: AddressForm['address_type']; labelKey: string; icon: any }[]

const selectedCountryId = ref<string>('')
const selectedGovernorateId = ref<string>('')
const selectedCityId = ref<string>('')
const selectedNeighbourhoodId = ref<string>('')

const filteredGovernorates = computed(() => governorates.value)
const filteredCities = computed(() => cities.value)
const filteredNeighbourhoods = computed(() => neighbourhoods.value)

const googleMapEmbedUrl = computed(() => {
  if (!form.latitude || !form.longitude) return null
  const lat = encodeURIComponent(form.latitude.trim())
  const lng = encodeURIComponent(form.longitude.trim())
  return `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`
})

const setCurrentLocation = () => {
  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    toast.error(t('messages.somethingWentWrong') || 'Geolocation is not supported')
    return
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      form.latitude = String(position.coords.latitude)
      form.longitude = String(position.coords.longitude)
    },
    () => {
      toast.error(t('messages.somethingWentWrong') || 'Failed to get current location')
    }
  )
}

const fetchCountries = async () => {
  const { data } = await api<any>('/countries', { method: 'GET' })
  if (data && Array.isArray(data.data)) {
    countries.value = data.data

    // Default select
    if (!selectedCountryId.value && data.default) {
      const def = String(data.default)
      selectedCountryId.value = def
      form.country_id = def
      await fetchGovernorates(def)
    }
  }
}

const fetchGovernorates = async (countryCode: string | null) => {
  governorates.value = []
  cities.value = []
  if (!countryCode) return

  const { data } = await api<any>(`/governorates/${countryCode}`, { method: 'GET' })
  if (data && Array.isArray(data.data)) {
    governorates.value = data.data
  }
}

const fetchCities = async (governorateCode: string | null) => {
  cities.value = []
  neighbourhoods.value = []
  if (!governorateCode) return

  const { data } = await api<any>(`/cities/${governorateCode}`, { method: 'GET' })
  if (data && Array.isArray(data.data)) {
    cities.value = data.data
  }
}

const fetchNeighbourhoods = async (cityCode: string | null) => {
  neighbourhoods.value = []
  if (!cityCode) return

  const { data } = await api<any>(`/nighbourhoods/${cityCode}`, { method: 'GET' })
  if (data && Array.isArray(data.data)) {
    neighbourhoods.value = data.data
  }
}

const handleCountryChange = (value: any) => {
  const val = value == null ? '' : String(value)
  selectedCountryId.value = val
  form.country_id = val || null
  selectedGovernorateId.value = ''
  selectedCityId.value = ''
  selectedNeighbourhoodId.value = ''
  form.governorate_id = null
  form.city_id = null
  form.nighbourhood_id = null
  fetchGovernorates(form.country_id)
}

const handleGovernorateChange = (value: any) => {
  const val = value == null ? '' : String(value)
  selectedGovernorateId.value = val
  form.governorate_id = val || null
  selectedCityId.value = ''
  selectedNeighbourhoodId.value = ''
  form.city_id = null
  form.nighbourhood_id = null
  fetchCities(form.governorate_id)
}

const handleCityChange = (value: any) => {
  const val = value == null ? '' : String(value)
  selectedCityId.value = val
  form.city_id = val || null
  selectedNeighbourhoodId.value = ''
  form.nighbourhood_id = null
  fetchNeighbourhoods(form.city_id)
}

const handleNeighbourhoodChange = (value: any) => {
  const val = value == null ? '' : String(value)
  selectedNeighbourhoodId.value = val
  form.nighbourhood_id = val ? Number(val) : null
}

const resetForm = () => {
  form.label = ''
  form.address_type = 'home'
  form.ship_to_location = ''
  form.bill_to_location = ''
  // form.country_id = null // Keep country if desired, or reset
  form.governorate_id = null
  form.city_id = null
  form.nighbourhood_id = null
  form.postal_code = ''
  form.address_details = ''
  form.latitude = ''
  form.longitude = ''
  form.is_default = props.defaultIsDefault ?? false
  
  // selectedCountryId.value = ''
  selectedGovernorateId.value = ''
  selectedCityId.value = ''
  selectedNeighbourhoodId.value = ''

  Object.keys(errors).forEach((key) => {
    errors[key as keyof AddressFormErrors] = ''
  })
}

const validateForm = () => {
  const requiredMessage = t('validation.required') || 'This field is required'
  let isValid = true

  const checkStringField = (value: string | null | undefined, field: keyof AddressFormErrors) => {
    if (!value || value.toString().trim().length === 0) {
      errors[field] = requiredMessage
      isValid = false
    } else {
      errors[field] = ''
    }
  }

  checkStringField(form.label, 'label')
  checkStringField(form.ship_to_location, 'ship_to_location')
  checkStringField(form.bill_to_location, 'bill_to_location')
  checkStringField(form.country_id, 'country_id')
  checkStringField(form.governorate_id, 'governorate_id')
  checkStringField(form.city_id, 'city_id')
  checkStringField(form.postal_code, 'postal_code')

  return isValid
}

const handleCreateAddress = async () => {
  if (!validateForm()) {
    toast.error(t('validation.required') || 'Please fill the required fields')
    return
  }

  creatingAddress.value = true
  
  const payload = {
    label: form.label || null,
    ship_to_location: form.ship_to_location || null,
    bill_to_location: form.bill_to_location || null,
    country_id: form.country_id,
    governorate_id: form.governorate_id,
    city_id: form.city_id,
    nighbourhood_id: form.nighbourhood_id,
    postal_code: form.postal_code || null,
    address: form.address_type || null,
    lat_long: form.latitude && form.longitude ? `${form.latitude},${form.longitude}` : null,
    lat: form.latitude || null,
    long: form.longitude || null,
    is_default: form.is_default ? 1 : 0,
  }

  try {
    const { data, error } = await apiFetch<any>("/addresses", {
      method: "POST",
      body: payload,
    });

    if (error) {
      throw error
    }
    
    toast.success(t('messages.savedSuccessfully', 'Saved successfully'))
    
    // Close dialog
    emit('update:open', false)
    
    // Reset form
    resetForm()
    
    // Emit success event
    emit('success', data?.data)
    
  } catch (error: any) {
    console.error(error)
    const message = error.message || error.data?.message || t('messages.somethingWentWrong')
    toast.error(message)
  } finally {
    creatingAddress.value = false
  }
}

onMounted(() => {
  fetchCountries()
})
</script>
