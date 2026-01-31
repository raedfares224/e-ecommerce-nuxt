import { ref } from "vue";
import { apiFetch } from "~/api/useApiFetch";

interface Address {
  id: number;
  label: string | null;
  address: string | null;
  ship_to_location: string | null;
  bill_to_location: string | null;
  long: string | null;
  lat: string | null;
  is_default: boolean;
  branch_type?: string | null;
  country_db_id: string | null;
  country_id: string | null;
  country_name: string | null;
  governorate_id: number;
  governorate_name: string | null;
  city_id: number;
  city_name: string | null;
  nighbourhood_id: number;
  nighbourhood_name: string | null;
  postal_code: string | null;
  last_update: string;
}

interface AddressesResponseMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  links?: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
}

interface AddressesResponse {
  data: Address[];
  meta: AddressesResponseMeta;
  status: string;
  message: string;
}

const addresses = ref<Address[]>([]);
const addressesLoading = ref(false);
const creatingAddress = ref(false);
const addressesPage = ref(1);
const addressesTotalPages = ref(1);
const addressesLinks = ref<AddressesResponseMeta["links"] | undefined>([]);
const confirmAddressId = ref<number | null>(null);
const settingDefaultId = ref<number | null>(null);
const confirmDeleteId = ref<number | null>(null);
const deletingAddressId = ref<number | null>(null);

const fetchAddresses = async (page = 1) => {
  try {
    addressesLoading.value = true;

    const { data, error } = await apiFetch<AddressesResponse>("/addresses", {
      method: "GET",
      params: { page },
    });

    if (error) {
      throw error;
    }

    addresses.value = data?.data || [];
    addressesPage.value = data?.meta?.current_page || page;
    addressesTotalPages.value = data?.meta?.last_page || 1;
    addressesLinks.value = data?.meta?.links || [];
  } catch (error) {
    addresses.value = [];
  } finally {
    addressesLoading.value = false;
  }
};

const changeAddressesPage = (page: number) => {
  if (page < 1 || page > addressesTotalPages.value) return;
  fetchAddresses(page);
};

const setDefaultAddress = async (id: number) => {
  confirmAddressId.value = id;
  settingDefaultId.value = id;

  try {
    const { error } = await apiFetch(`/addresses/${id}/default`, {
      method: "POST",
    });

    if (!error) {
      confirmAddressId.value = null;
      await fetchAddresses(addressesPage.value);
    }
  } catch (error) {
  } finally {
    settingDefaultId.value = null;
  }
};

const createAddress = async (payload: Record<string, any>) => {
  creatingAddress.value = true;

  try {
    const { data, error } = await apiFetch<any>("/addresses", {
      method: "POST",
      body: payload,
    });

    if (error) {
      throw error;
    }

    await fetchAddresses(1);

    return { success: true, data };
  } catch (error) {
    return { success: false, error } as { success: false; error: any };
  } finally {
    creatingAddress.value = false;
  }
};

const deleteAddress = async (id: number) => {
  confirmDeleteId.value = id;
  deletingAddressId.value = id;

  try {
    const { error } = await apiFetch(`/addresses/${id}/delete`, {
      method: "DELETE",
    });

    if (error) {
      throw error;
    }

    await fetchAddresses(addressesPage.value);

    return { success: true } as { success: true };
  } catch (error) {
    return { success: false, error } as { success: false; error: any };
  } finally {
    deletingAddressId.value = null;
    confirmDeleteId.value = null;
  }
};

export const useProfileAddresses = () => {
  return {
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
    creatingAddress,
    createAddress,
    deleteAddress,
  };
};
