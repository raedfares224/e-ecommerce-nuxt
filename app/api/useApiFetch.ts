// SSR-compatible API composable for Nuxt 4
// Uses useFetch for SSR hydration and $fetch for client-only calls

import type { UseFetchOptions } from 'nuxt/app'
import type { FetchError } from 'ofetch'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

interface ApiOptions<T> {
  method?: HttpMethod
  params?: Record<string, any>
  body?: any
  lang?: 'en' | 'ar'
  key?: string
  lazy?: boolean
  immediate?: boolean
  watch?: any[]
  transform?: (data: any) => T
}

interface ApiResponse<T> {
  data: Ref<T | null>
  error: Ref<FetchError | null>
  pending: Ref<boolean>
  refresh: () => Promise<void>
  execute: () => Promise<void>
}

/**
 * SSR-compatible API composable using useFetch
 * Supports server-side rendering with proper hydration
 */
export function useApiFetch<T>(
  endpoint: string | Ref<string> | (() => string),
  options: ApiOptions<T> = {}
): ApiResponse<T> {
  const config = useRuntimeConfig()
  const localeCookie = useCookie<'en' | 'ar'>('locale')
  const tokenCookie = useCookie('token')

  const url = computed(() => {
    const path = typeof endpoint === 'function' 
      ? endpoint() 
      : unref(endpoint)
    return `${config.public.apiBaseUrl}${path}`
  })

  const fetchOptions: UseFetchOptions<T> = {
    method: options.method ?? 'GET',
    lazy: options.lazy ?? false,
    immediate: options.immediate ?? true,
    watch: options.watch,
    key: options.key,
    transform: options.transform,

    // Dynamic headers computed on each request
    onRequest({ options: reqOptions }) {
      const lang = options.lang ?? localeCookie.value ?? 'en'
      const token = tokenCookie.value
      const isFormData = options.body instanceof FormData

      const headers: HeadersInit = {
        Accept: 'application/json',
        'Accept-Language': lang,
      }

      if (reqOptions.method !== 'GET' && !isFormData) {
        headers['Content-Type'] = 'application/json'
      }

      if (token) {
        headers.Authorization = `Bearer ${token}`
      }

      reqOptions.headers = headers
    },

    onResponseError({ response }) {
      console.error('🔴 API Error:', response.status, response._data)
    },
  }

  // Add params for GET, body for other methods
  if (options.method === 'GET' || !options.method) {
    fetchOptions.params = options.params
  } else {
    fetchOptions.body = options.body
  }

  const { data, error, pending, refresh, execute } = useFetch<T>(url, fetchOptions)

  return {
    data: data as Ref<T | null>,
    error: error as Ref<FetchError | null>,
    pending,
    refresh,
    execute,
  }
}

/**
 * Client-side only API fetch using $fetch
 * Use for user-triggered actions (form submissions, button clicks)
 * Does NOT support SSR - use useApiFetch for SSR needs
 */
export async function apiFetch<T>(
  endpoint: string,
  options: Omit<ApiOptions<T>, 'key' | 'lazy' | 'immediate' | 'watch'> = {}
): Promise<{ data: T | null; error: { message: string; data?: any; statusCode?: number } | null }> {
  const config = useRuntimeConfig()
  const localeCookie = useCookie<'en' | 'ar'>('locale')
  const tokenCookie = useCookie('token')

  const lang = options.lang ?? localeCookie.value ?? 'en'
  const token = tokenCookie.value
  const isFormData = options.body instanceof FormData

  const headers: HeadersInit = {
    Accept: 'application/json',
    'Accept-Language': lang,
  }

  if (options.method && options.method !== 'GET' && !isFormData) {
    headers['Content-Type'] = 'application/json'
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  try {
    const response = await $fetch<T>(`${config.public.apiBaseUrl}${endpoint}`, {
      method: options.method ?? 'GET',
      headers,
      params: options.method === 'GET' ? options.params : undefined,
      body: options.method !== 'GET' ? options.body : undefined,
    })

    return { data: response, error: null }
  } catch (err: any) {
    console.error('🔴 $fetch Error:', err)

    let errorMessage = 'An error occurred'
    if (err.data?.message) {
      errorMessage = err.data.message
    } else if (err.message) {
      errorMessage = err.message
    }

    return {
      data: null,
      error: {
        message: errorMessage,
        data: err.data,
        statusCode: err.statusCode,
      },
    }
  }
}
