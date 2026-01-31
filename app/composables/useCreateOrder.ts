import { apiFetch } from '~/api/useApiFetch'

interface CreateOrderItem {
  name: string
  price: number | string
  quantity: number | string
}

interface CreateOrderAddress {
  id: number | string
  name: string
  line1: string
  line2?: string | null
  city: string
  state: string
  postalCode: string
  country: string
}

export interface CreateOrderParams {
  items: CreateOrderItem[]
  shipCostValue: number | string
  shipCostName: string
  orderNote?: string
  userAddress: CreateOrderAddress
  feeId: number | string
  paymentMethodId: number | string
  cityId: number | string
  shippingCompanyId: number | string
  currency?: string
  locale?: string
  coupon?: string
  points?: number
}

export interface CreateOrderResponse {
  order?: {
    id: number
    user_id: number
    fee_id: number
    subtotal: string
    total: number
    status: string
    note: string | null
    user_address_id: string
    currency: string
    created_at: string
    updated_at: string
  }
  payment_method?: {
    id: number
    ar_name: string
    en_name: string
    payment_type: number
    payment_img: string
    payment_id?: string
    payment_secret?: string
  }
  url?: string  // Payment gateway redirect URL (e.g., Moyasar, Stripe)
  // Legacy fields for backward compatibility
  status?: string
  order_id?: number | string
  id?: number | string
  data?: {
    id?: number | string
    bank_details?: any
  }
  bank_details?: any
  bank_transfer_details?: any
  payment_info?: any
  message?: string
}

// Composable to call external Mobark create-order API
export const useCreateOrder = () => {
  const createOrder = async (
    params: CreateOrderParams
  ): Promise<CreateOrderResponse> => {
    const formData = new FormData()

    params.items.forEach((item, index) => {
      formData.append(`items[${index}][name]`, String(item.name))
      formData.append(`items[${index}][price]`, String(item.price))
      formData.append(`items[${index}][quantity]`, String(item.quantity))
    })

    formData.append('ship_cost[value]', String(params.shipCostValue))
    formData.append('ship_cost[name]', params.shipCostName)

    if (params.orderNote) {
      formData.append('order_note', params.orderNote)
    }

    if (params.coupon) {
      formData.append('coupon', params.coupon)
    }

    if (params.points) {
      formData.append('points', String(params.points))
    }

    formData.append('user_address[name]', String(params.userAddress.name))
    formData.append('user_address[line1]', params.userAddress.line1)
    formData.append('user_address[line2]', params.userAddress.line2 || '')
    formData.append('user_address[city]', params.userAddress.city)
    formData.append('user_address[state]', params.userAddress.state)
    formData.append('user_address[postal_code]', params.userAddress.postalCode)
    formData.append('user_address[country]', params.userAddress.country)

    formData.append('fee_id', String(params.feeId))
    formData.append('payment_method_id', String(params.paymentMethodId))
    formData.append('user_address_id', String(params.userAddress.id))
    formData.append('city_id', String(params.cityId))
    formData.append('shipping_company_id', String(params.shippingCompanyId))

    const { data, error } = await apiFetch<CreateOrderResponse>('/create_order', {
      method: 'POST',
      body: formData,
    })

    if (error) {
      console.error('Create order error:', error)
      throw new Error(error.message || 'Failed to create order')
    }

    return data || { status: 'error' }
  }

  return { createOrder }
}
