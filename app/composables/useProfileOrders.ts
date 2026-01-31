import { ref } from "vue";
import { apiFetch } from "~/api/useApiFetch";

interface OrderAddress {
  id: number;
  ar_address_details: string | null;
  en_address_details: string | null;
  address_details: string | null;
}

interface OrderAccessoryOption {
  id: number;
  name: string;
  ar_name?: string;
  en_name?: string;
  qty?: number;
  price?: string;
  discount?: string;
  group_id?: number;
  group?: string;
}

interface OrderAccessoryGroup {
  id: number | string;
  name: string;
  ar_name?: string;
  en_name?: string;
  is_required?: string | number;
  accessories?: {
    data: OrderAccessoryOption[];
  };
}

interface OrderAccessorySelection {
  group?: OrderAccessoryGroup;
  accessory?: OrderAccessoryOption;
}

interface OrderProductVariant {
  id: string;
  name: string;
  ar_name?: string;
  en_name?: string;
  slug?: string;
  price?: string;
  calculated_price?: string;
  discount?: number;
  label?: string;
  brand?: string;
  brand_id?: number;
  quantity?: number;
  rating?: string;
  imageUrl?: string;
  different?: string;
  ar_different?: string;
  en_different?: string;
  description?: string;
  seo_description?: string;
  categories?: {
    data: any[];
  };
  differents?: {
    data: OrderProductVariant[];
  };
  accessories?: {
    data: OrderAccessoryOption[];
  };
  related?: {
    data: OrderProductVariant[];
  };
  images?: {
    data: string[];
  };
}

interface OrderItem {
  id: number;
  price: string;
  quantity: number;
  differents?: OrderProductVariant | null;
  accessories?: OrderAccessorySelection[];
}

interface OrderFee {
  id: number;
  name: string;
  value: number;
  is_default: number;
}

interface Order {
  id: number;
  status: string;
  note: string | null;
  date: string;
  total: number;
  subtotal: string;
  items: OrderItem[];
  userAddress?: OrderAddress | null;
  fee?: OrderFee | null;
  has_invoice?: boolean;
}

interface OrdersMeta {
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

interface OrdersResponse {
  data: Order[];
  meta: OrdersMeta;
}

const orders = ref<Order[]>([]);
const ordersLoading = ref(false);
const ordersPage = ref(1);
const ordersTotalPages = ref(1);
const ordersTotalItems = ref(0);
const ordersLinks = ref<OrdersMeta["links"] | undefined>([]);

const fetchOrders = async (page = 1) => {
  try {
    ordersLoading.value = true;

    const { data, error } = await apiFetch<OrdersResponse>("/orders", {
      method: "GET",
      params: { page, per_page: 15 },
    });

    if (error) {
      throw error;
    }

    orders.value = data?.data || [];
    ordersPage.value = data?.meta?.current_page || page;
    ordersTotalPages.value = data?.meta?.last_page || 1;
    ordersTotalItems.value = data?.meta?.total || 0;
    ordersLinks.value = data?.meta?.links || [];
  } catch (error) {
    orders.value = [];
  } finally {
    ordersLoading.value = false;
  }
};

const changeOrdersPage = (page: number) => {
  if (page < 1 || page > ordersTotalPages.value) return;
  fetchOrders(page);
};

export const useProfileOrders = () => {
  return {
    orders,
    ordersLoading,
    ordersPage,
    ordersTotalPages,
    ordersTotalItems,
    ordersLinks,
    fetchOrders,
    changeOrdersPage,
  };
};
